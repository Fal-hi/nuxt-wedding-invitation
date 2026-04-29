<script setup lang="ts">
import { ref, onMounted } from "vue";

const supabase = useSupabase();
const isLoading = ref(true);
const isSaving = ref(false);
const saveSuccess = ref(false);

const formData = ref({
  bride_nickname: "",
  bride_name: "",
  bride_father: "",
  bride_mother: "",
  bride_photo: "",
  groom_nickname: "",
  groom_name: "",
  groom_father: "",
  groom_mother: "",
  groom_photo: "",
  wedding_date: "",
  akad_time: "",
  akad_location: "",
  akad_address: "",
  akad_maps_url: "",
  resepsi_time: "",
  resepsi_location: "",
  resepsi_address: "",
  resepsi_maps_url: "",
});

onMounted(async () => {
  const { data, error } = await supabase
    .from("wedding_info")
    .select("*")
    .eq("id", 1)
    .single();
  if (data) {
    formData.value = { ...data };
    if (formData.value.wedding_date) {
      // slice to get YYYY-MM-DDTHH:mm expected by datetime-local input
      formData.value.wedding_date = new Date(formData.value.wedding_date)
        .toISOString()
        .slice(0, 16);
    }
  }
  if (error) {
    console.error("Error fetching wedding info:", error);
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
    .from("wedding_info")
    .update(payload)
    .eq("id", 1);

  isSaving.value = false;
  if (!error) {
    saveSuccess.value = true;
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
  } else {
    alert("Gagal menyimpan data: " + error.message);
  }
};
</script>

<template>
  <div class="card p-6 md:p-8 border border-sky-100 bg-white/95">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>

    <form v-else @submit.prevent="saveInfo">
      <div class="space-y-10">
        <!-- General Info -->
        <div class="relative">
          <div class="absolute -left-4 md:-left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-light to-transparent rounded-r-md"></div>
          <h3 class="font-heading text-xl md:text-2xl font-semibold text-primary-dark mb-4">
            Informasi Utama
          </h3>
          <div class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Pernikahan Utama</label>
              <input type="datetime-local" v-model="formData.wedding_date" class="input-field bg-sky-50/30" />
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Bride Info -->
        <div class="relative">
          <div class="absolute -left-4 md:-left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-300 to-transparent rounded-r-md"></div>
          <h3 class="font-heading text-xl md:text-2xl font-semibold text-primary-dark mb-4">
            Data Mempelai Wanita
          </h3>
          <div class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div class="sm:col-span-6 flex flex-col md:flex-row gap-6 items-start">
              <div class="w-full md:w-3/4">
                <label class="block text-sm font-medium text-gray-700 mb-2">URL Foto (Link Gambar)</label>
                <input type="url" v-model="formData.bride_photo" class="input-field bg-sky-50/30" placeholder="https://..." />
              </div>
              <div v-if="formData.bride_photo" class="w-full md:w-1/4 flex justify-center">
                <img :src="formData.bride_photo" class="h-24 w-24 rounded-full object-cover shadow-md border-2 border-pink-200" alt="Preview Foto Mempelai Wanita" />
              </div>
            </div>
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              <input type="text" v-model="formData.bride_name" class="input-field bg-sky-50/30" />
            </div>
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Panggilan</label>
              <input type="text" v-model="formData.bride_nickname" class="input-field bg-sky-50/30" />
            </div>
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Ayah</label>
              <input type="text" v-model="formData.bride_father" class="input-field bg-sky-50/30" />
            </div>
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Ibu</label>
              <input type="text" v-model="formData.bride_mother" class="input-field bg-sky-50/30" />
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Groom Info -->
        <div class="relative">
          <div class="absolute -left-4 md:-left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 to-transparent rounded-r-md"></div>
          <h3 class="font-heading text-xl md:text-2xl font-semibold text-primary-dark mb-4">
            Data Mempelai Pria
          </h3>
          <div class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div class="sm:col-span-6 flex flex-col md:flex-row gap-6 items-start">
              <div class="w-full md:w-3/4">
                <label class="block text-sm font-medium text-gray-700 mb-2">URL Foto (Link Gambar)</label>
                <input type="url" v-model="formData.groom_photo" class="input-field bg-sky-50/30" placeholder="https://..." />
              </div>
              <div v-if="formData.groom_photo" class="w-full md:w-1/4 flex justify-center">
                <img :src="formData.groom_photo" class="h-24 w-24 rounded-full object-cover shadow-md border-2 border-blue-200" alt="Preview Foto Mempelai Pria" />
              </div>
            </div>
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              <input type="text" v-model="formData.groom_name" class="input-field bg-sky-50/30" />
            </div>
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Panggilan</label>
              <input type="text" v-model="formData.groom_nickname" class="input-field bg-sky-50/30" />
            </div>
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Ayah</label>
              <input type="text" v-model="formData.groom_father" class="input-field bg-sky-50/30" />
            </div>
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Ibu</label>
              <input type="text" v-model="formData.groom_mother" class="input-field bg-sky-50/30" />
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Akad Details -->
        <div class="relative bg-sky-50/50 p-6 rounded-2xl border border-sky-100">
          <h3 class="font-heading text-xl md:text-2xl font-semibold text-primary-dark mb-4">
            Rincian Akad Nikah
          </h3>
          <div class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Waktu (Contoh: 10:00 - 12:00 WIB)</label>
              <input type="text" v-model="formData.akad_time" class="input-field bg-white" />
            </div>
            <div class="sm:col-span-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Tempat (Contoh: Masjid Al-Hidayah)</label>
              <input type="text" v-model="formData.akad_location" class="input-field bg-white" />
            </div>
            <div class="sm:col-span-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
              <textarea v-model="formData.akad_address" rows="2" class="input-field bg-white resize-none"></textarea>
            </div>
            <div class="sm:col-span-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">URL Google Maps</label>
              <input type="url" v-model="formData.akad_maps_url" class="input-field bg-white" placeholder="https://maps.google.com/..." />
              <div v-if="formData.akad_maps_url" class="mt-2 flex items-start gap-2">
                <a :href="formData.akad_maps_url" target="_blank" class="text-sm font-medium text-primary hover:text-primary-dark underline">
                  Buka Google Maps
                </a>
                <p v-if="formData.akad_maps_url.includes('goo.gl')" class="text-xs text-secondary-dark bg-yellow-50 px-2 py-1 rounded">
                  ⚠️ Link singkat tidak bisa di-embed. Gunakan link panjang.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Resepsi Details -->
        <div class="relative bg-sky-50/50 p-6 rounded-2xl border border-sky-100">
          <h3 class="font-heading text-xl md:text-2xl font-semibold text-primary-dark mb-4">
            Rincian Resepsi
          </h3>
          <div class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Waktu (Contoh: 12:00 - 17:00 WIB)</label>
              <input type="text" v-model="formData.resepsi_time" class="input-field bg-white" />
            </div>
            <div class="sm:col-span-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Tempat (Contoh: Gedung Serbaguna)</label>
              <input type="text" v-model="formData.resepsi_location" class="input-field bg-white" />
            </div>
            <div class="sm:col-span-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
              <textarea v-model="formData.resepsi_address" rows="2" class="input-field bg-white resize-none"></textarea>
            </div>
            <div class="sm:col-span-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">URL Google Maps</label>
              <input type="url" v-model="formData.resepsi_maps_url" class="input-field bg-white" placeholder="https://maps.google.com/..." />
              <div v-if="formData.resepsi_maps_url" class="mt-2 flex items-start gap-2">
                <a :href="formData.resepsi_maps_url" target="_blank" class="text-sm font-medium text-primary hover:text-primary-dark underline">
                  Buka Google Maps
                </a>
                <p v-if="formData.resepsi_maps_url.includes('goo.gl')" class="text-xs text-secondary-dark bg-yellow-50 px-2 py-1 rounded">
                  ⚠️ Link singkat tidak bisa di-embed. Gunakan link panjang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10 pt-6 border-t border-sky-100 flex items-center justify-between">
        <span v-if="saveSuccess" class="text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
          ✓ Berhasil disimpan!
        </span>
        <span v-else></span>
        
        <button type="submit" :disabled="isSaving" class="btn-primary flex items-center gap-2">
          <span v-if="!isSaving">Simpan Pengaturan</span>
          <span v-else class="flex items-center gap-2">
            <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Menyimpan...
          </span>
        </button>
      </div>
    </form>
  </div>
</template>
