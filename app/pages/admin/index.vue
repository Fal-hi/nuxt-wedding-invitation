<script setup lang="ts">
import { ref } from "vue";
import WeddingInfoForm from "~/components/admin/WeddingInfoForm.vue";
import GalleryManager from "~/components/admin/GalleryManager.vue";
import GuestDataManager from "~/components/admin/GuestDataManager.vue";
import GuestManager from "~/components/admin/GuestManager.vue";
import BankAccountManager from "~/components/admin/BankAccountManager.vue";
import { useSupabase } from "~/composables/useSupabase";

const supabase = useSupabase();

const activeTab = ref("info");
const isAuthenticated = useCookie("admin_auth", {
  default: () => false,
  maxAge: 60 * 60 * 24, // 1 day
});

const isLoggingIn = ref(false);
const loginError = ref(false);
const username = ref("");
const password = ref("");

const handleLogin = async () => {
  if (!username.value || !password.value) return;
  isLoggingIn.value = true;
  loginError.value = false;

  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("username", username.value)
    .eq("password", password.value)
    .single();

  isLoggingIn.value = false;

  if (data && !error) {
    isAuthenticated.value = true;
  } else {
    loginError.value = true;
  }
};

const handleLogout = () => {
  isAuthenticated.value = false;
};
</script>

<template>
  <div
    v-if="!isAuthenticated"
    class="bg-sky-gradient relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8"
  >
    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute left-10 top-10 h-32 w-32 transform-gpu rounded-full bg-white/30 blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 right-20 h-48 w-48 transform-gpu rounded-full bg-white/30 blur-3xl"
      ></div>
    </div>

    <div
      class="card relative z-10 w-full max-w-md space-y-8 border border-white/50 bg-white/90 p-8 backdrop-blur-sm"
    >
      <div>
        <h2
          class="font-heading text-primary-dark mt-2 text-center text-4xl font-bold tracking-tight"
        >
          Administrator
        </h2>
        <p class="text-primary mt-2 text-center text-sm">
          Masuk untuk mengubah data undangan pernikahan
        </p>
        <div class="divider mt-4"></div>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              class="input-field"
              placeholder="Username"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="input-field"
              placeholder="Password"
            />
          </div>
        </div>

        <div
          v-if="loginError"
          class="rounded-xl border border-red-100 bg-red-50 p-3 text-center text-sm font-medium text-red-600"
        >
          Username atau password salah!
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoggingIn"
            class="btn-primary flex w-full justify-center py-3"
          >
            <span v-if="!isLoggingIn">Masuk Ke Pengaturan</span>
            <span v-else class="animate-pulse">Memverifikasi...</span>
          </button>
        </div>
      </form>
      <div class="mt-6 border-t border-sky-100 pt-6 text-center">
        <NuxtLink
          to="/"
          class="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
        >
          &larr; Kembali ke Undangan
        </NuxtLink>
      </div>
    </div>
  </div>

  <div v-else class="bg-background min-h-screen pb-12 font-sans text-gray-900">
    <header
      class="sticky top-0 z-40 border-b border-sky-100 bg-white/80 shadow-sm backdrop-blur-md"
    >
      <div
        class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
      >
        <h1
          class="font-heading text-primary-dark text-2xl font-bold tracking-tight sm:text-3xl"
        >
          Admin Dashboard
        </h1>
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/"
            class="text-primary hover:text-primary-dark flex text-sm font-medium hover:underline"
          >
            Lihat Undangan &rarr;
          </NuxtLink>
          <button
            @click="handleLogout"
            class="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <main>
      <div class="mx-auto max-w-7xl py-8 sm:px-6 lg:px-8">
        <div
          class="hide-scrollbar mb-8 flex space-x-2 overflow-x-auto px-4 py-2 sm:px-0"
        >
          <button
            @click="activeTab = 'info'"
            :class="[
              activeTab === 'info'
                ? 'bg-primary text-white shadow-md'
                : 'border border-sky-100 bg-white text-gray-600 hover:bg-sky-50',
              'whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all',
            ]"
          >
            Info Undangan
          </button>
          <button
            @click="activeTab = 'gallery'"
            :class="[
              activeTab === 'gallery'
                ? 'bg-primary text-white shadow-md'
                : 'border border-sky-100 bg-white text-gray-600 hover:bg-sky-50',
              'whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all',
            ]"
          >
            Galeri Foto
          </button>
          <button
            @click="activeTab = 'guests'"
            :class="[
              activeTab === 'guests'
                ? 'bg-primary text-white shadow-md'
                : 'border border-sky-100 bg-white text-gray-600 hover:bg-sky-50',
              'whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all',
            ]"
          >
            Data Tamu & Ucapan
          </button>
          <button
            @click="activeTab = 'guestlist'"
            :class="[
              activeTab === 'guestlist'
                ? 'bg-primary text-white shadow-md'
                : 'border border-sky-100 bg-white text-gray-600 hover:bg-sky-50',
              'whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all',
            ]"
          >
            Daftar Tamu
          </button>
          <button
            @click="activeTab = 'bank'"
            :class="[
              activeTab === 'bank'
                ? 'bg-primary text-white shadow-md'
                : 'border border-sky-100 bg-white text-gray-600 hover:bg-sky-50',
              'whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all',
            ]"
          >
            Rekening
          </button>
        </div>

        <div class="px-4 sm:px-0">
          <WeddingInfoForm v-if="activeTab === 'info'" />
          <GalleryManager v-if="activeTab === 'gallery'" />
          <GuestDataManager v-if="activeTab === 'guests'" />
          <GuestManager v-if="activeTab === 'guestlist'" />
          <BankAccountManager v-if="activeTab === 'bank'" />
        </div>
      </div>
    </main>
  </div>
</template>
<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
