<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Copy, Check } from "lucide-vue-next";
import type { Bank, BankAccount } from "~/types";
import { useSupabase } from "~/composables/useSupabase";

const supabase = useSupabase();
const accounts = ref<BankAccount[]>([]);
const isLoading = ref(true);
const copiedId = ref<string | null>(null);

const bankOptions = ref<Record<string, string>>({});

onMounted(async () => {
  const [accountsRes, banksRes] = await Promise.all([
    supabase
      .from("bank_accounts")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase.from("bank").select("*"),
  ]);

  if (accountsRes.data && !accountsRes.error) {
    accounts.value = accountsRes.data;
  }

  if (banksRes.data && !banksRes.error) {
    const optionsMap: Record<string, string> = {};
    banksRes.data.forEach((bank: Bank) => {
      optionsMap[bank.name] = bank.color;
    });
    bankOptions.value = optionsMap;
  }

  isLoading.value = false;
});

const copyToClipboard = async (accountNumber: string, id: string) => {
  try {
    await navigator.clipboard.writeText(accountNumber);
    copiedId.value = id;
    setTimeout(() => {
      copiedId.value = null;
    }, 2000);
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = accountNumber;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    copiedId.value = id;
    setTimeout(() => {
      copiedId.value = null;
    }, 2000);
  }
};

const getBankColor = (bankName: string): string => {
  for (const [key, color] of Object.entries(bankOptions.value)) {
    if (bankName.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }
  return "#0284c7";
};
</script>

<template>
  <section class="section relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute left-16 top-14 h-28 w-28 rounded-full bg-white/30 blur-3xl transform-gpu"
      ></div>
      <div
        class="absolute bottom-10 right-16 h-36 w-36 rounded-full bg-white/30 blur-3xl transform-gpu"
      ></div>
      <div
        class="absolute right-1/4 top-1/3 h-24 w-24 rounded-full bg-white/30 blur-2xl transform-gpu"
      ></div>
    </div>
    <div class="container-custom relative z-10">
      <div class="mb-12 text-center" data-aos="fade-up">
        <h2 class="font-heading text-accent mb-2 text-2xl md:text-3xl">
          Amplop Digital
        </h2>
        <div class="divider"></div>
        <p class="text-primary-light mt-4 text-sm leading-relaxed">
          Untuk mengirim amplop digital, Anda bisa melalui rekening di bawah
          ini.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-8" data-aos="fade-up">
        <div
          class="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
        ></div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="accounts.length === 0"
        class="py-8 text-center text-sm text-gray-400"
        data-aos="fade-up"
      >
        Belum ada rekening yang ditambahkan.
      </div>

      <!-- Account Cards -->
      <div
        v-else
        class="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <div
          v-for="(account, index) in accounts"
          :key="account.id"
          class="group relative overflow-hidden rounded-2xl border border-sky-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <!-- Colored top strip -->
          <div
            class="absolute inset-x-0 top-0 h-1.5 transition-all duration-300 group-hover:h-2"
            :style="{ backgroundColor: getBankColor(account.bank_name) }"
          ></div>

          <div class="flex items-start gap-4">
            <!-- Bank Icon -->
            <img
              :src="account.bank_logo"
              :alt="account.bank_name"
              class="h-20 w-20 rounded object-contain"
            />

            <div class="min-w-0 flex-1">
              <p
                class="text-sm font-bold uppercase tracking-wider"
                :style="{ color: getBankColor(account.bank_name) }"
              >
                {{ account.bank_name }}
              </p>
              <p
                class="text-primary-dark mt-1 font-mono text-lg font-semibold tracking-wide"
              >
                {{ account.account_number }}
              </p>
              <p class="text-primary-light mt-0.5 text-sm">
                a.n {{ account.account_holder }}
              </p>
            </div>
          </div>

          <!-- Copy Button -->
          <button
            @click="copyToClipboard(account.account_number, account.id)"
            class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all duration-200"
            :class="
              copiedId === account.id
                ? 'border-primary text-primary'
                : 'border-primary-light hover:bg-primary text-primary hover:border-primary hover:text-white'
            "
          >
            <Check v-if="copiedId === account.id" class="h-4 w-4" />
            <Copy v-else class="h-4 w-4" />
            {{ copiedId === account.id ? "Tersalin!" : "Salin No. Rekening" }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
