<script setup lang="ts">
import { ref } from "vue";
import WeddingInfoForm from "~/components/admin/WeddingInfoForm.vue";
import GalleryManager from "~/components/admin/GalleryManager.vue";
import GuestDataManager from "~/components/admin/GuestDataManager.vue";
import BankAccountManager from "~/components/admin/BankAccountManager.vue";
import { useSupabase } from "~/composables/useSupabase";

const supabase = useSupabase();

const activeTab = ref("info");
const isAuthenticated = useCookie("admin_auth", {
  default: () => false,
  maxAge: 60 * 60 * 24 // 1 day
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
  <div v-if="!isAuthenticated" class="relative flex min-h-screen items-center justify-center overflow-hidden bg-sky-gradient px-4 py-12 sm:px-6 lg:px-8">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute left-10 top-10 h-32 w-32 rounded-full bg-white/30 blur-3xl transform-gpu"></div>
      <div class="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-white/30 blur-3xl transform-gpu"></div>
    </div>
    
    <div class="card relative z-10 w-full max-w-md space-y-8 p-8 border border-white/50 bg-white/90 backdrop-blur-sm">
      <div>
        <h2 class="mt-2 text-center font-heading text-4xl font-bold tracking-tight text-primary-dark">
          Administrator
        </h2>
        <p class="mt-2 text-center text-sm text-primary">
          Masuk untuk mengubah data undangan pernikahan
        </p>
        <div class="divider mt-4"></div>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input id="username" v-model="username" type="text" required class="input-field" placeholder="Username">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" v-model="password" type="password" required class="input-field" placeholder="Password">
          </div>
        </div>

        <div v-if="loginError" class="text-sm text-red-600 text-center font-medium bg-red-50 border border-red-100 p-3 rounded-xl">
          Username atau password salah!
        </div>

        <div>
           <button type="submit" :disabled="isLoggingIn" class="btn-primary w-full flex justify-center py-3">
            <span v-if="!isLoggingIn">Masuk Ke Pengaturan</span>
            <span v-else class="animate-pulse">Memverifikasi...</span>
          </button>
        </div>
      </form>
      <div class="text-center mt-6 pt-6 border-t border-sky-100">
         <NuxtLink to="/" class="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
          &larr; Kembali ke Undangan
        </NuxtLink>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen bg-background font-sans text-gray-900 pb-12">
    <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-sky-100">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-primary-dark">
          Admin Dashboard
        </h1>
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="hidden md:block text-sm font-medium text-primary hover:text-primary-dark hover:underline">
            Lihat Undangan &rarr;
          </NuxtLink>
          <button @click="handleLogout" class="text-sm font-medium text-red-600 hover:text-white bg-red-50 hover:bg-red-500 px-4 py-2 rounded-full transition-colors border border-red-200 hover:border-red-500">
            Logout
          </button>
        </div>
      </div>
    </header>
    
    <main>
      <div class="mx-auto max-w-7xl py-8 sm:px-6 lg:px-8">
        <div class="mb-8 flex overflow-x-auto hide-scrollbar space-x-2 px-4 sm:px-0 py-2">
          <button
            @click="activeTab = 'info'"
            :class="[
              activeTab === 'info' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-sky-50 border border-sky-100',
              'whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all'
            ]"
          >
            Info Undangan
          </button>
          <button
            @click="activeTab = 'gallery'"
            :class="[
              activeTab === 'gallery' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-sky-50 border border-sky-100',
              'whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all'
            ]"
          >
            Galeri Foto
          </button>
          <button
            @click="activeTab = 'guests'"
            :class="[
              activeTab === 'guests' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-sky-50 border border-sky-100',
              'whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all'
            ]"
          >
            Data Tamu & Ucapan
          </button>
          <button
            @click="activeTab = 'bank'"
            :class="[
              activeTab === 'bank' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-sky-50 border border-sky-100',
              'whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all'
            ]"
          >
            Rekening
          </button>
        </div>

        <div class="px-4 sm:px-0">
          <WeddingInfoForm v-if="activeTab === 'info'" />
          <GalleryManager v-if="activeTab === 'gallery'" />
          <GuestDataManager v-if="activeTab === 'guests'" />
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
