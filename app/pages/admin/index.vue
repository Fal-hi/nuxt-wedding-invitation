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
  <div v-if="!isAuthenticated" class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div>
        <h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
          Administrator
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Masuk untuk mengubah data undangan pernikahan
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4 rounded-md shadow-sm">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input id="username" v-model="username" type="text" required class="relative block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" placeholder="Username">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" v-model="password" type="password" required class="relative block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" placeholder="Password">
          </div>
        </div>

        <div v-if="loginError" class="text-sm text-red-600 text-center font-medium bg-red-50 p-2 rounded">
          Username atau password salah!
        </div>

        <div>
           <button type="submit" :disabled="isLoggingIn" class="group relative flex w-full justify-center rounded-md bg-sky-600 px-3 py-3 text-sm font-semibold text-white hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50 transition-colors">
            <span v-if="!isLoggingIn">Masuk Ke Pengaturan</span>
            <span v-else>Memverifikasi...</span>
          </button>
        </div>
      </form>
      <div class="text-center mt-6 pt-4 border-t border-gray-100">
         <NuxtLink to="/" class="text-sm font-medium text-gray-500 hover:text-sky-600 transition-colors">
          &larr; Kembali ke Undangan
        </NuxtLink>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen bg-gray-50 font-sans text-gray-900">
    <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Admin Dashboard
        </h1>
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="hidden md:block text-sm font-medium text-sky-600 hover:text-sky-500 hover:underline">
            Lihat Undangan &rarr;
          </NuxtLink>
          <button @click="handleLogout" class="text-sm font-medium text-red-600 hover:text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors">
            Logout
          </button>
        </div>
      </div>
    </header>
    
    <main>
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div class="mb-6 flex space-x-4 border-b border-gray-200 px-4 sm:px-0">
          <button
            @click="activeTab = 'info'"
            :class="[
              activeTab === 'info' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors'
            ]"
          >
            Info Undangan
          </button>
          <button
            @click="activeTab = 'gallery'"
            :class="[
              activeTab === 'gallery' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors'
            ]"
          >
            Galeri Foto
          </button>
          <button
            @click="activeTab = 'guests'"
            :class="[
              activeTab === 'guests' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors'
            ]"
          >
            Data Tamu & Ucapan
          </button>
          <button
            @click="activeTab = 'bank'"
            :class="[
              activeTab === 'bank' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors'
            ]"
          >
            Rekening
          </button>
        </div>

        <div class="px-4 pb-12 sm:px-0">
          <WeddingInfoForm v-if="activeTab === 'info'" />
          <GalleryManager v-if="activeTab === 'gallery'" />
          <GuestDataManager v-if="activeTab === 'guests'" />
          <BankAccountManager v-if="activeTab === 'bank'" />
        </div>
      </div>
    </main>
  </div>
</template>
