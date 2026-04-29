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
  <div class="card p-6 md:p-8 border border-sky-100 bg-white/95">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>

    <div v-else class="space-y-10">
      <!-- Header -->
      <div class="relative">
        <div class="absolute -left-4 md:-left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-light to-transparent rounded-r-md"></div>
        <h3 class="font-heading text-xl md:text-2xl font-semibold text-primary-dark mb-2">
          Rekening & Hadiah
        </h3>
        <p class="text-sm text-primary">Kelola opsi rekening untuk fitur amplop digital.</p>
      </div>

      <!-- Tambah Baru -->
      <div class="bg-sky-50/50 p-6 rounded-2xl border border-sky-100">
        <h3 class="font-heading text-lg font-semibold text-primary-dark mb-4">
          Tambahkan Rekening Baru
        </h3>
        <form @submit.prevent="addAccount" class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Bank</label>
            <select required v-model="newBankName" class="input-field bg-white">
              <option value="" disabled>Pilih Bank</option>
              <option v-for="bank in bankOptions" :key="bank.id" :value="bank.name">
                {{ bank.name }}
              </option>
            </select>
          </div>
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nomor Rekening</label>
            <input type="text" required v-model="newAccountNumber" class="input-field bg-white" placeholder="1234567890" />
          </div>
          <div class="md:col-span-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Pemilik Rekening</label>
            <input type="text" required v-model="newAccountHolder" class="input-field bg-white" placeholder="Rina Susilowati" />
          </div>
          <div class="md:col-span-2">
            <button type="submit" :disabled="isAdding" class="btn-primary w-full flex justify-center py-3">
              <span v-if="!isAdding" class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Tambah
              </span>
              <span v-else class="flex items-center gap-2">
                <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </span>
            </button>
          </div>
        </form>
      </div>

      <div class="divider"></div>

      <!-- Daftar Rekening -->
      <div>
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-lg font-semibold text-primary-dark">
            Daftar Rekening ({{ accounts.length }})
          </h3>
        </div>
        
        <div v-if="accounts.length === 0" class="rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/30 py-12 text-center text-primary flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mb-4 text-sky-300"><rect x="20" y="4" width="4" height="16" rx="2" ry="2"></rect><rect x="4" y="4" width="12" height="16" rx="2" ry="2"></rect><path d="M12 12h.01"></path></svg>
          <p>Belum ada rekening yang ditambahkan.</p>
        </div>
        
        <div v-else class="overflow-hidden rounded-xl border border-sky-100 shadow-sm bg-white">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
              <thead class="bg-sky-50/50">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Bank</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">No. Rekening</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Atas Nama</th>
                  <th scope="col" class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
                <tr v-for="account in accounts" :key="account.id" class="transition-colors hover:bg-sky-50/30">
                  <td class="whitespace-nowrap px-6 py-4">
                    <template v-if="editingId === account.id">
                      <select v-model="editBankName" class="input-field py-2 text-sm bg-white">
                        <option v-for="bank in bankOptions" :key="bank.id" :value="bank.name">{{ bank.name }}</option>
                      </select>
                    </template>
                    <template v-else>
                      <span class="inline-flex items-center rounded-lg bg-sky-100 px-3 py-1.5 text-sm font-bold text-sky-800">
                        {{ account.bank_name }}
                      </span>
                    </template>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <template v-if="editingId === account.id">
                      <input v-model="editAccountNumber" class="input-field py-2 font-mono text-sm bg-white" />
                    </template>
                    <template v-else>
                      <span class="font-mono text-sm font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                        {{ account.account_number }}
                      </span>
                    </template>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <template v-if="editingId === account.id">
                      <input v-model="editAccountHolder" class="input-field py-2 text-sm bg-white" />
                    </template>
                    <template v-else>
                      <span class="text-sm font-medium text-gray-700">
                        {{ account.account_holder }}
                      </span>
                    </template>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div class="flex items-center justify-end gap-2">
                      <template v-if="editingId === account.id">
                        <button @click="saveEdit" :disabled="isSaving" class="rounded-lg bg-green-50 px-3 py-1.5 font-semibold text-green-600 transition-colors hover:bg-green-100 border border-green-200">
                          {{ isSaving ? "..." : "Simpan" }}
                        </button>
                        <button @click="cancelEdit" class="rounded-lg bg-gray-50 px-3 py-1.5 font-semibold text-gray-600 transition-colors hover:bg-gray-100 border border-gray-200">
                          Batal
                        </button>
                      </template>
                      <template v-else>
                        <button @click="startEdit(account)" class="rounded-lg bg-sky-50 px-3 py-1.5 font-semibold text-sky-600 transition-colors hover:bg-sky-100 border border-sky-200">
                          Edit
                        </button>
                        <button @click="deleteAccount(account.id)" class="rounded-lg bg-red-50 px-3 py-1.5 font-semibold text-red-500 transition-colors hover:bg-red-100 border border-red-200">
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
