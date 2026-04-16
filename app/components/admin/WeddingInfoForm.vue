<script setup lang="ts">
import { ref, onMounted } from 'vue';

const supabase = useSupabase();
const isLoading = ref(true);
const isSaving = ref(false);
const saveSuccess = ref(false);

const formData = ref({
  bride_name: '',
  bride_parents: '',
  bride_photo: '',
  groom_name: '',
  groom_parents: '',
  groom_photo: '',
  wedding_date: '',
  akad_time: '',
  akad_location: '',
  akad_address: '',
  akad_maps_url: '',
  resepsi_time: '',
  resepsi_location: '',
  resepsi_address: '',
  resepsi_maps_url: ''
});

onMounted(async () => {
  const { data, error } = await supabase.from('wedding_info').select('*').eq('id', 1).single();
  if (data) {
    formData.value = { ...data };
    if (formData.value.wedding_date) {
      // slice to get YYYY-MM-DDTHH:mm expected by datetime-local input
      formData.value.wedding_date = new Date(formData.value.wedding_date).toISOString().slice(0, 16);
    }
  }
  isLoading.value = false;
});

const saveInfo = async () => {
  isSaving.value = true;
  saveSuccess.value = false;
  
  const payload = { ...formData.value };
  if (payload.wedding_date) {
    // Convert back to UTC for Supabase
    payload.wedding_date = new Date(payload.wedding_date).toISOString();
  }
  
  const { error } = await supabase
    .from('wedding_info')
    .update(payload)
    .eq('id', 1);
    
  isSaving.value = false;
  if (!error) {
    saveSuccess.value = true;
    setTimeout(() => { saveSuccess.value = false }, 3000);
  } else {
    alert("Gagal menyimpan data: " + error.message);
  }
};
</script>

<template>
  <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
    </div>
    
    <form v-else @submit.prevent="saveInfo">
      <div class="space-y-8">
      
        <!-- General Info -->
        <div>
          <h3 class="text-lg font-medium leading-6 text-gray-900 border-b pb-2">Informasi Utama</h3>
          <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">Tanggal Pernikahan Utama</label>
              <div class="mt-1">
                <input type="datetime-local" v-model="formData.wedding_date" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" />
              </div>
            </div>
          </div>
        </div>

        <!-- Bride Info -->
        <div>
          <h3 class="text-lg font-medium leading-6 text-gray-900 border-b pb-2">Mempelai Wanita</h3>
          <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">Nama Panggilan</label>
              <input type="text" v-model="formData.bride_name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" />
            </div>
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">Nama Orang Tua (Misal: Putri dari...)</label>
              <input type="text" v-model="formData.bride_parents" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" />
            </div>
            <div class="sm:col-span-6">
              <label class="block text-sm font-medium text-gray-700">URL Foto (Link Gambar)</label>
              <input type="url" v-model="formData.bride_photo" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" />
              <img v-if="formData.bride_photo" :src="formData.bride_photo" class="mt-2 h-16 w-16 object-cover rounded-full shadow" />
            </div>
          </div>
        </div>

        <!-- Groom Info -->
        <div>
          <h3 class="text-lg font-medium leading-6 text-gray-900 border-b pb-2">Mempelai Pria</h3>
          <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">Nama Panggilan</label>
              <input type="text" v-model="formData.groom_name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" />
            </div>
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">Nama Orang Tua (Misal: Putra dari...)</label>
              <input type="text" v-model="formData.groom_parents" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" />
            </div>
            <div class="sm:col-span-6">
              <label class="block text-sm font-medium text-gray-700">URL Foto (Link Gambar)</label>
              <input type="url" v-model="formData.groom_photo" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" />
              <img v-if="formData.groom_photo" :src="formData.groom_photo" class="mt-2 h-16 w-16 object-cover rounded-full shadow" />
            </div>
          </div>
        </div>

        <!-- Akad Details -->
        <div>
          <h3 class="text-lg font-medium leading-6 text-gray-900 border-b pb-2">Rincian Akad Nikah</h3>
          <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Waktu (Misal: 10:00 - 12:00 WIB)</label>
              <input type="text" v-model="formData.akad_time" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" />
            </div>
            <div class="sm:col-span-4">
              <label class="block text-sm font-medium text-gray-700">Nama Tempat (Misal: Masjid Al-Hidayah)</label>
              <input type="text" v-model="formData.akad_location" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" />
            </div>
            <div class="sm:col-span-6">
              <label class="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
              <textarea v-model="formData.akad_address" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border"></textarea>
            </div>
            <div class="sm:col-span-6">
              <label class="block text-sm font-medium text-gray-700">URL Google Maps</label>
              <input type="url" v-model="formData.akad_maps_url" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" />
            </div>
          </div>
        </div>

        <!-- Resepsi Details -->
        <div>
          <h3 class="text-lg font-medium leading-6 text-gray-900 border-b pb-2">Rincian Resepsi</h3>
          <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Waktu</label>
              <input type="text" v-model="formData.resepsi_time" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" />
            </div>
            <div class="sm:col-span-4">
              <label class="block text-sm font-medium text-gray-700">Nama Tempat</label>
              <input type="text" v-model="formData.resepsi_location" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" />
            </div>
            <div class="sm:col-span-6">
              <label class="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
              <textarea v-model="formData.resepsi_address" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border"></textarea>
            </div>
            <div class="sm:col-span-6">
              <label class="block text-sm font-medium text-gray-700">URL Google Maps</label>
              <input type="url" v-model="formData.resepsi_maps_url" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" />
            </div>
          </div>
        </div>

      </div>

      <div class="mt-8 flex items-center gap-4">
        <button type="submit" :disabled="isSaving" class="inline-flex justify-center rounded-md border border-transparent bg-sky-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50">
          <span v-if="!isSaving">Simpan Pengaturan</span>
          <span v-else class="flex items-center gap-2">
            <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Menyimpan...
          </span>
        </button>
        <span v-if="saveSuccess" class="text-sm font-medium text-green-600">Berhasil disimpan! Refresh halaman depan untuk melihat perubahan.</span>
      </div>
    </form>
  </div>
</template>
