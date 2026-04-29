<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSupabase } from "~/composables/useSupabase";
import type { Bank, BankAccount } from "~/types";

const supabase = useSupabase();
const accounts = ref<BankAccount[]>([]);
const isLoading = ref(true);
const isAdding = ref(false);

const bankOptions = ref<Bank[]>([]);

const newBankName = ref("");
const newAccountNumber = ref("");
const newAccountHolder = ref("");
const newBankLogo = ref("");

const editingId = ref<string | null>(null);
const editBankName = ref("");
const editAccountNumber = ref("");
const editAccountHolder = ref("");
const isSaving = ref(false);

const fetchAccounts = async () => {
  isLoading.value = true;
  const { data, error } = await supabase
    .from("bank_accounts")
    .select("*")
    .order("sort_order", { ascending: true });
  if (data) accounts.value = data;
  isLoading.value = false;
};

const fetchBankOptions = async () => {
  const { data, error } = await supabase
    .from("bank")
    .select("*")
    .order("name", { ascending: true });
  if (data) bankOptions.value = data;
};

onMounted(() => {
  fetchAccounts();
  fetchBankOptions();
});

const addAccount = async () => {
  if (!newBankName.value || !newAccountNumber.value || !newAccountHolder.value)
    return;
  isAdding.value = true;

  const sort_order =
    accounts.value.length > 0
      ? Math.max(...accounts.value.map((a) => a.sort_order || 0)) + 1
      : 1;

  const { error } = await supabase.from("bank").insert({
    bank_name: newBankName.value,
    account_number: newAccountNumber.value,
    account_holder: newAccountHolder.value,
    bank_logo: newBankLogo.value || null,
    sort_order,
  });

  isAdding.value = false;

  if (!error) {
    newBankName.value = "";
    newAccountNumber.value = "";
    newAccountHolder.value = "";
    newBankLogo.value = "";
    await fetchAccounts();
  } else {
    alert("Gagal menambah rekening: " + error.message);
  }
};

const startEdit = (account: BankAccount) => {
  editingId.value = account.id;
  editBankName.value = account.bank_name;
  editAccountNumber.value = account.account_number;
  editAccountHolder.value = account.account_holder;
};

const cancelEdit = () => {
  editingId.value = null;
  editBankName.value = "";
  editAccountNumber.value = "";
  editAccountHolder.value = "";
};

const saveEdit = async () => {
  if (
    !editingId.value ||
    !editBankName.value ||
    !editAccountNumber.value ||
    !editAccountHolder.value
  )
    return;

  isSaving.value = true;
  const { error } = await supabase
    .from("bank_accounts")
    .update({
      bank_name: editBankName.value,
      account_number: editAccountNumber.value,
      account_holder: editAccountHolder.value,
    })
    .eq("id", editingId.value);

  isSaving.value = false;

  if (!error) {
    await fetchAccounts();
    cancelEdit();
  } else {
    alert("Gagal mengubah rekening: " + error.message);
  }
};

const deleteAccount = async (id: string) => {
  if (confirm("Yakin ingin menghapus rekening ini?")) {
    const { error } = await supabase
      .from("bank_accounts")
      .delete()
      .eq("id", id);
    if (!error) await fetchAccounts();
    else alert("Gagal menghapus: " + error.message);
  }
};
</script>

<template>
  <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"
      ></div>
    </div>

    <div v-else class="space-y-8">
      <!-- Tambah Baru -->
      <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 class="text-md mb-4 font-medium text-gray-900">
          Tambahkan Rekening Baru
        </h3>
        <form
          @submit.prevent="addAccount"
          class="grid grid-cols-1 items-end gap-4 sm:grid-cols-12"
        >
          <div class="sm:col-span-3">
            <label class="block text-sm font-medium text-gray-700"
              >Nama Bank</label
            >
            <select
              required
              v-model="newBankName"
              class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            >
              <option value="" disabled>Pilih Bank</option>
              <option
                v-for="bank in bankOptions"
                :key="bank.id"
                :value="bank.name"
              >
                {{ bank.name }}
              </option>
            </select>
          </div>
          <div class="sm:col-span-3">
            <label class="block text-sm font-medium text-gray-700"
              >Nomor Rekening</label
            >
            <input
              type="text"
              required
              v-model="newAccountNumber"
              class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              placeholder="1234567890"
            />
          </div>
          <div class="sm:col-span-3">
            <label class="block text-sm font-medium text-gray-700"
              >Nama Pemilik Rekening</label
            >
            <input
              type="text"
              required
              v-model="newAccountHolder"
              class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              placeholder="Rina Susilowati"
            />
          </div>
          <div class="sm:col-span-3">
            <button
              type="submit"
              :disabled="isAdding"
              class="inline-flex w-full justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <span v-if="!isAdding">Tambah</span>
              <span v-else>Memuat...</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Daftar Rekening -->
      <div>
        <h3 class="text-md mb-4 font-medium text-gray-900">
          Daftar Rekening ({{ accounts.length }})
        </h3>
        <div
          v-if="accounts.length === 0"
          class="rounded-lg border-2 border-dashed py-6 text-center text-gray-500"
        >
          Belum ada rekening yang ditambahkan.
        </div>
        <div v-else class="overflow-hidden rounded-lg border shadow-sm">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Bank
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  No. Rekening
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Atas Nama
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="account in accounts"
                :key="account.id"
                class="transition-colors hover:bg-gray-50"
              >
                <td class="whitespace-nowrap px-6 py-4">
                  <template v-if="editingId === account.id">
                    <select
                      v-model="editBankName"
                      class="w-full rounded border border-gray-300 p-1 text-sm"
                    >
                      <option
                        v-for="bank in bankOptions"
                        :key="bank.id"
                        :value="bank.name"
                      >
                        {{ bank.name }}
                      </option>
                    </select>
                  </template>
                  <template v-else>
                    <span
                      class="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-sm font-semibold text-sky-700"
                    >
                      {{ account.bank_name }}
                    </span>
                  </template>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <template v-if="editingId === account.id">
                    <input
                      v-model="editAccountNumber"
                      class="w-full rounded border border-gray-300 p-1 font-mono text-sm"
                    />
                  </template>
                  <template v-else>
                    <span class="font-mono text-sm text-gray-900">
                      {{ account.account_number }}
                    </span>
                  </template>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <template v-if="editingId === account.id">
                    <input
                      v-model="editAccountHolder"
                      class="w-full rounded border border-gray-300 p-1 text-sm"
                    />
                  </template>
                  <template v-else>
                    <span class="text-sm text-gray-600">
                      {{ account.account_holder }}
                    </span>
                  </template>
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium"
                >
                  <template v-if="editingId === account.id">
                    <button
                      @click="saveEdit"
                      :disabled="isSaving"
                      class="mr-2 rounded px-2 py-1 font-semibold text-green-600 transition-colors hover:bg-green-50"
                    >
                      {{ isSaving ? "Menyimpan..." : "Simpan" }}
                    </button>
                    <button
                      @click="cancelEdit"
                      class="rounded px-2 py-1 font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                    >
                      Batal
                    </button>
                  </template>
                  <template v-else>
                    <button
                      @click="startEdit(account)"
                      class="mr-2 rounded px-2 py-1 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteAccount(account.id)"
                      class="rounded px-2 py-1 font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
