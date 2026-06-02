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

  const { error } = await supabase.from("bank_accounts").insert({
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
  <div class="card border border-sky-100 bg-white/95 p-6 md:p-8">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div
        class="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
      ></div>
    </div>

    <div v-else class="space-y-10">
      <!-- Header -->
      <div class="relative">
        <div
          class="from-primary-light absolute -left-4 bottom-0 top-0 w-1 rounded-r-md bg-gradient-to-b to-transparent md:-left-8"
        ></div>
        <h3
          class="font-heading text-primary-dark mb-2 text-xl font-semibold md:text-2xl"
        >
          Rekening & Hadiah
        </h3>
        <p class="text-primary text-sm">
          Kelola opsi rekening untuk fitur amplop digital.
        </p>
      </div>

      <!-- Tambah Baru -->
      <div class="rounded-2xl border border-sky-100 bg-sky-50/50 p-6">
        <h3 class="font-heading text-primary-dark mb-4 text-lg font-semibold">
          Tambahkan Rekening Baru
        </h3>
        <form
          @submit.prevent="addAccount"
          class="grid grid-cols-1 items-end gap-4 md:grid-cols-12"
        >
          <div class="md:col-span-3">
            <label class="mb-2 block text-sm font-medium text-gray-700"
              >Nama Bank</label
            >
            <select required v-model="newBankName" class="input-field bg-white">
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
          <div class="md:col-span-3">
            <label class="mb-2 block text-sm font-medium text-gray-700"
              >Nomor Rekening</label
            >
            <input
              type="text"
              required
              v-model="newAccountNumber"
              class="input-field bg-white"
              placeholder="1234567890"
            />
          </div>
          <div class="md:col-span-4">
            <label class="mb-2 block text-sm font-medium text-gray-700"
              >Nama Pemilik Rekening</label
            >
            <input
              type="text"
              required
              v-model="newAccountHolder"
              class="input-field bg-white"
              placeholder="Rina Susilowati"
            />
          </div>
          <div class="md:col-span-2">
            <button
              type="submit"
              :disabled="isAdding"
              class="btn-primary flex w-full justify-center py-3"
            >
              <span v-if="!isAdding" class="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Tambah
              </span>
              <span v-else class="flex items-center gap-2">
                <div
                  class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                ></div>
              </span>
            </button>
          </div>
        </form>
      </div>

      <div class="divider"></div>

      <!-- Daftar Rekening -->
      <div>
        <div class="mb-6 flex items-center justify-between">
          <h3 class="font-heading text-primary-dark text-lg font-semibold">
            Daftar Rekening ({{ accounts.length }})
          </h3>
        </div>

        <div
          v-if="accounts.length === 0"
          class="text-primary flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/30 py-12 text-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mb-4 text-sky-300"
          >
            <rect x="20" y="4" width="4" height="16" rx="2" ry="2"></rect>
            <rect x="4" y="4" width="12" height="16" rx="2" ry="2"></rect>
            <path d="M12 12h.01"></path>
          </svg>
          <p>Belum ada rekening yang ditambahkan.</p>
        </div>

        <div
          v-else
          class="overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm"
        >
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
              <thead class="bg-sky-50/50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    Bank
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    No. Rekening
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    Atas Nama
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
                <tr
                  v-for="account in accounts"
                  :key="account.id"
                  class="transition-colors hover:bg-sky-50/30"
                >
                  <td class="whitespace-nowrap px-6 py-4">
                    <template v-if="editingId === account.id">
                      <select
                        v-model="editBankName"
                        class="input-field bg-white py-2 text-sm"
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
                        class="inline-flex items-center rounded-lg bg-sky-100 px-3 py-1.5 text-sm font-bold text-sky-800"
                      >
                        {{ account.bank_name }}
                      </span>
                    </template>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <template v-if="editingId === account.id">
                      <input
                        v-model="editAccountNumber"
                        class="input-field bg-white py-2 font-mono text-sm"
                      />
                    </template>
                    <template v-else>
                      <span
                        class="rounded border border-gray-100 bg-gray-50 px-2 py-1 font-mono text-sm font-medium text-gray-900"
                      >
                        {{ account.account_number }}
                      </span>
                    </template>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <template v-if="editingId === account.id">
                      <input
                        v-model="editAccountHolder"
                        class="input-field bg-white py-2 text-sm"
                      />
                    </template>
                    <template v-else>
                      <span class="text-sm font-medium text-gray-700">
                        {{ account.account_holder }}
                      </span>
                    </template>
                  </td>
                  <td
                    class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium"
                  >
                    <div class="flex items-center justify-end gap-2">
                      <template v-if="editingId === account.id">
                        <button
                          @click="saveEdit"
                          :disabled="isSaving"
                          class="rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 font-semibold text-green-600 transition-colors hover:bg-green-100"
                        >
                          {{ isSaving ? "..." : "Simpan" }}
                        </button>
                        <button
                          @click="cancelEdit"
                          class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                        >
                          Batal
                        </button>
                      </template>
                      <template v-else>
                        <button
                          @click="startEdit(account)"
                          class="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 font-semibold text-sky-600 transition-colors hover:bg-sky-100"
                        >
                          Edit
                        </button>
                        <button
                          @click="deleteAccount(account.id)"
                          class="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 font-semibold text-red-500 transition-colors hover:bg-red-100"
                        >
                          Hapus
                        </button>
                      </template>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
