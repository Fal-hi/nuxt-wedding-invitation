<script setup lang="ts">
import { ref, watch } from "vue";
import { RefreshCcw, X } from "lucide-vue-next";
import {
  useWeddingInfoQuery,
  useWeddingInfoMutation,
} from "~/composables/queries/useWeddingInfoQuery";

const isSaving = ref(false);
const saveSuccess = ref(false);
const isDataReady = ref(false);

const isPreviewOpen = ref(false);
const selectedImageUrl = ref("");

const {
  data: weddingData,
  isLoading,
  isFetching,
  refetch,
} = useWeddingInfoQuery();
const updateMutation = useWeddingInfoMutation();

const openPreview = (url: string) => {
  if (!url) return;
  selectedImageUrl.value = url;
  isPreviewOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closePreview = () => {
  isPreviewOpen.value = false;
  selectedImageUrl.value = "";
  document.body.style.overflow = "";
};

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

watch(weddingData, (data) => {
  if (data) {
    formData.value = { ...data };
    if (formData.value.wedding_date) {
      const d = new Date(formData.value.wedding_date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      formData.value.wedding_date = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    isDataReady.value = true;
  }
});

const saveInfo = async () => {
  isSaving.value = true;
  saveSuccess.value = false;

  const payload = { ...formData.value };

  updateMutation.mutate(payload, {
    onSuccess: () => {
      saveSuccess.value = true;
      setTimeout(() => {
        saveSuccess.value = false;
      }, 3000);
    },
    onError: (err: any) => {
      alert("Gagal menyimpan data: " + err.message);
    },
    onSettled: () => {
      isSaving.value = false;
    },
  });
};
</script>

<template>
  <div class="card border border-sky-100 bg-white/95 p-6 md:p-8">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div
        class="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
      ></div>
    </div>

    <form v-else @submit.prevent="saveInfo" class="relative">
      <div class="space-y-10">
        <!-- General Info -->
        <div class="relative">
          <div
            class="from-primary-light absolute -left-4 bottom-0 top-0 w-1 rounded-r-md bg-gradient-to-b to-transparent md:-left-8"
          ></div>
          <div class="flex items-center justify-between">
            <h3
              class="font-heading text-primary-dark mb-4 text-xl font-semibold md:text-2xl"
            >
              Informasi Utama
            </h3>
            <button
              type="button"
              @click="() => refetch()"
              :disabled="isFetching"
              class="flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-600 transition-colors hover:border-sky-500 hover:bg-blue-500 hover:text-white"
            >
              <span class="hidden md:block">Refresh</span>
              <RefreshCcw
                class="h-4 w-4"
                :class="{ 'animate-spin': isFetching }"
              />
            </button>
          </div>
          <div class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Tanggal Pernikahan Utama</label
              >
              <input
                type="datetime-local"
                v-model="formData.wedding_date"
                class="input-field bg-sky-50/30"
              />
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Bride Info -->
        <div class="relative">
          <div
            class="absolute -left-4 bottom-0 top-0 w-1 rounded-r-md bg-gradient-to-b from-pink-300 to-transparent md:-left-8"
          ></div>
          <h3
            class="font-heading text-primary-dark mb-4 text-xl font-semibold md:text-2xl"
          >
            Data Mempelai Wanita
          </h3>
          <div class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div
              class="flex flex-col items-start gap-6 sm:col-span-6 md:flex-row"
            >
              <div class="w-full md:w-3/4">
                <label class="mb-2 block text-sm font-medium text-gray-700"
                  >URL Foto (Link Gambar)</label
                >
                <input
                  type="url"
                  v-model="formData.bride_photo"
                  class="input-field bg-sky-50/30"
                  placeholder="https://..."
                />
              </div>
              <div
                v-if="formData.bride_photo"
                class="flex w-full justify-center md:w-1/4"
              >
                <img
                  @click="openPreview(formData.bride_photo)"
                  :src="formData.bride_photo"
                  class="h-24 w-24 cursor-pointer rounded-full border-2 border-pink-200 object-cover shadow-md transition-opacity hover:opacity-80"
                  alt="Preview Foto Mempelai Wanita"
                />
              </div>
            </div>
            <div class="sm:col-span-3">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Nama Lengkap</label
              >
              <input
                type="text"
                v-model="formData.bride_name"
                class="input-field bg-sky-50/30"
              />
            </div>
            <div class="sm:col-span-3">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Nama Panggilan</label
              >
              <input
                type="text"
                v-model="formData.bride_nickname"
                class="input-field bg-sky-50/30"
              />
            </div>
            <div class="sm:col-span-3">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Nama Ayah</label
              >
              <input
                type="text"
                v-model="formData.bride_father"
                class="input-field bg-sky-50/30"
              />
            </div>
            <div class="sm:col-span-3">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Nama Ibu</label
              >
              <input
                type="text"
                v-model="formData.bride_mother"
                class="input-field bg-sky-50/30"
              />
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Groom Info -->
        <div class="relative">
          <div
            class="absolute -left-4 bottom-0 top-0 w-1 rounded-r-md bg-gradient-to-b from-blue-300 to-transparent md:-left-8"
          ></div>
          <h3
            class="font-heading text-primary-dark mb-4 text-xl font-semibold md:text-2xl"
          >
            Data Mempelai Pria
          </h3>
          <div class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div
              class="flex flex-col items-start gap-6 sm:col-span-6 md:flex-row"
            >
              <div class="w-full md:w-3/4">
                <label class="mb-2 block text-sm font-medium text-gray-700"
                  >URL Foto (Link Gambar)</label
                >
                <input
                  type="url"
                  v-model="formData.groom_photo"
                  class="input-field bg-sky-50/30"
                  placeholder="https://..."
                />
              </div>
              <div
                v-if="formData.groom_photo"
                class="flex w-full justify-center md:w-1/4"
              >
                <img
                  @click="openPreview(formData.groom_photo)"
                  :src="formData.groom_photo"
                  class="h-24 w-24 cursor-pointer rounded-full border-2 border-blue-200 object-cover shadow-md transition-opacity hover:opacity-80"
                  alt="Preview Foto Mempelai Pria"
                />
              </div>
            </div>
            <div class="sm:col-span-3">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Nama Lengkap</label
              >
              <input
                type="text"
                v-model="formData.groom_name"
                class="input-field bg-sky-50/30"
              />
            </div>
            <div class="sm:col-span-3">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Nama Panggilan</label
              >
              <input
                type="text"
                v-model="formData.groom_nickname"
                class="input-field bg-sky-50/30"
              />
            </div>
            <div class="sm:col-span-3">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Nama Ayah</label
              >
              <input
                type="text"
                v-model="formData.groom_father"
                class="input-field bg-sky-50/30"
              />
            </div>
            <div class="sm:col-span-3">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Nama Ibu</label
              >
              <input
                type="text"
                v-model="formData.groom_mother"
                class="input-field bg-sky-50/30"
              />
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Akad Details -->
        <div
          class="relative rounded-2xl border border-sky-100 bg-sky-50/50 p-6"
        >
          <h3
            class="font-heading text-primary-dark mb-4 text-xl font-semibold md:text-2xl"
          >
            Rincian Akad Nikah
          </h3>
          <div class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div class="sm:col-span-2">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Waktu (Contoh: 10:00 - 12:00 WIB)</label
              >
              <input
                type="text"
                v-model="formData.akad_time"
                class="input-field bg-white"
              />
            </div>
            <div class="sm:col-span-4">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Nama Tempat (Contoh: Masjid Al-Hidayah)</label
              >
              <input
                type="text"
                v-model="formData.akad_location"
                class="input-field bg-white"
              />
            </div>
            <div class="sm:col-span-6">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Alamat Lengkap</label
              >
              <textarea
                v-model="formData.akad_address"
                rows="2"
                class="input-field resize-none bg-white"
              ></textarea>
            </div>
            <div class="sm:col-span-6">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >URL Google Maps</label
              >
              <input
                type="url"
                v-model="formData.akad_maps_url"
                class="input-field bg-white"
                placeholder="https://maps.google.com/..."
              />
              <div
                v-if="formData.akad_maps_url"
                class="mt-2 flex items-start gap-2"
              >
                <a
                  :href="formData.akad_maps_url"
                  target="_blank"
                  class="text-primary hover:text-primary-dark text-sm font-medium underline"
                >
                  Buka Google Maps
                </a>
                <p
                  v-if="formData.akad_maps_url.includes('goo.gl')"
                  class="text-secondary-dark rounded bg-yellow-50 px-2 py-1 text-xs"
                >
                  ⚠️ Link singkat tidak bisa di-embed. Gunakan link panjang.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Resepsi Details -->
        <div
          class="relative rounded-2xl border border-sky-100 bg-sky-50/50 p-6"
        >
          <h3
            class="font-heading text-primary-dark mb-4 text-xl font-semibold md:text-2xl"
          >
            Rincian Resepsi
          </h3>
          <div class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div class="sm:col-span-2">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Waktu (Contoh: 12:00 - 17:00 WIB)</label
              >
              <input
                type="text"
                v-model="formData.resepsi_time"
                class="input-field bg-white"
              />
            </div>
            <div class="sm:col-span-4">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Nama Tempat (Contoh: Gedung Serbaguna)</label
              >
              <input
                type="text"
                v-model="formData.resepsi_location"
                class="input-field bg-white"
              />
            </div>
            <div class="sm:col-span-6">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Alamat Lengkap</label
              >
              <textarea
                v-model="formData.resepsi_address"
                rows="2"
                class="input-field resize-none bg-white"
              ></textarea>
            </div>
            <div class="sm:col-span-6">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >URL Google Maps</label
              >
              <input
                type="url"
                v-model="formData.resepsi_maps_url"
                class="input-field bg-white"
                placeholder="https://maps.google.com/..."
              />
              <div
                v-if="formData.resepsi_maps_url"
                class="mt-2 flex items-start gap-2"
              >
                <a
                  :href="formData.resepsi_maps_url"
                  target="_blank"
                  class="text-primary hover:text-primary-dark text-sm font-medium underline"
                >
                  Buka Google Maps
                </a>
                <p
                  v-if="formData.resepsi_maps_url.includes('goo.gl')"
                  class="text-secondary-dark rounded bg-yellow-50 px-2 py-1 text-xs"
                >
                  ⚠️ Link singkat tidak bisa di-embed. Gunakan link panjang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="mt-10 flex items-center justify-between border-t border-sky-100 pt-6"
      >
        <span
          v-if="saveSuccess"
          class="rounded-lg border border-green-100 bg-green-50 px-4 py-2 text-sm font-medium text-green-600"
        >
          ✓ Berhasil disimpan!
        </span>

        <button
          type="submit"
          :disabled="isSaving"
          class="btn-primary flex w-full items-center justify-center gap-2 text-center md:ml-auto md:w-auto"
        >
          <span v-if="!isSaving">Simpan Pengaturan</span>
          <span v-else class="flex items-center gap-2">
            <div
              class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></div>
            Menyimpan...
          </span>
        </button>
      </div>

      <!-- Loading overlay -->
      <div
        v-if="isFetching && !isLoading"
        class="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-[1px]"
      >
        <div class="flex flex-col items-center gap-2">
          <div
            class="border-primary h-6 w-6 animate-spin rounded-full border-[3px] border-t-transparent"
          ></div>
          <span class="text-primary text-xs font-medium">Memperbarui...</span>
        </div>
      </div>
    </form>

    <Teleport to="body">
      <div
        v-if="isPreviewOpen"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-all duration-300"
        @click.self="closePreview"
      >
        <div
          class="animate-in fade-in zoom-in-95 relative flex w-full max-w-4xl justify-center duration-300"
        >
          <button
            @click="closePreview"
            class="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20 md:-right-12"
          >
            <X class="h-6 w-6" />
          </button>
          <img
            :src="selectedImageUrl"
            alt="Preview Foto Mempelai"
            class="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>
