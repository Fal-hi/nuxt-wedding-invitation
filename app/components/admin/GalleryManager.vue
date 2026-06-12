<script setup lang="ts">
import { ref } from "vue";
import { RefreshCcw, X } from "lucide-vue-next";
import {
  useGalleryQuery,
  useAddGalleryMutation,
  useDeleteGalleryMutation,
} from "~/composables/queries/useGalleryQuery";

const isAdding = ref(false);
const newImageUrl = ref("");
const newImageAlt = ref("");

const selectedImage = ref<any>(null);
const isPreviewOpen = ref(false);

const { data: images, isLoading, isFetching, refetch } = useGalleryQuery();
const addMutation = useAddGalleryMutation();
const deleteMutation = useDeleteGalleryMutation();

const openPreview = (image: any) => {
  selectedImage.value = image;
  isPreviewOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closePreview = () => {
  isPreviewOpen.value = false;
  selectedImage.value = null;
  document.body.style.overflow = "";
};

const addImage = async () => {
  if (!newImageUrl.value) return;
  isAdding.value = true;

  const sort_order =
    images.value && images.value.length > 0
      ? Math.max(...images.value.map((i: any) => i.sort_order || 0)) + 1
      : 1;

  addMutation.mutate(
    {
      image_url: newImageUrl.value,
      alt_text: newImageAlt.value || "Gallery Image",
      sort_order,
    },
    {
      onSuccess: () => {
        newImageUrl.value = "";
        newImageAlt.value = "";
      },
      onError: (err: any) => {
        alert("Gagal menambah gambar: " + err.message);
      },
      onSettled: () => {
        isAdding.value = false;
      },
    },
  );
};

const removeImage = async (id: string) => {
  if (confirm("Yakin ingin menghapus gambar ini?")) {
    deleteMutation.mutate(id, {
      onError: (err: any) => {
        alert("Gagal menghapus gambar: " + err.message);
      },
    });
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
        <div>
          <h3
            class="font-heading text-primary-dark mb-2 text-xl font-semibold md:text-2xl"
          >
            Galeri Foto
          </h3>
          <p class="text-primary text-sm">
            Kelola foto pre-wedding dan momen kebersamaan Anda.
          </p>
        </div>
      </div>

      <!-- Tambah Baru -->
      <div class="rounded-2xl border border-sky-100 bg-sky-50/50 p-6">
        <h3 class="font-heading text-primary-dark mb-4 text-lg font-semibold">
          Tambahkan Gambar Baru
        </h3>
        <form
          @submit.prevent="addImage"
          class="flex flex-col items-end gap-4 md:flex-row"
        >
          <div class="w-full md:flex-1">
            <label class="mb-2 block text-sm font-medium text-gray-700"
              >URL Gambar (Link)</label
            >
            <input
              type="url"
              required
              v-model="newImageUrl"
              class="input-field bg-white"
              placeholder="https://..."
            />
          </div>
          <div class="w-full md:w-1/3">
            <label class="mb-2 block text-sm font-medium text-gray-700"
              >Teks Alternatif (Alt)</label
            >
            <input
              type="text"
              v-model="newImageAlt"
              class="input-field bg-white"
              placeholder="Pre-wedding 1"
            />
          </div>
          <div class="w-full md:w-auto">
            <button
              type="submit"
              :disabled="isAdding"
              class="btn-primary flex w-full justify-center py-3 md:w-auto"
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
                Memuat...
              </span>
            </button>
          </div>
        </form>
      </div>

      <div class="divider"></div>

      <!-- Grid Gambar -->
      <div class="relative">
        <div class="mb-6 flex items-center justify-between">
          <h3 class="font-heading text-primary-dark text-lg font-semibold">
            Daftar Foto Galeri ({{ images?.length || 0 }})
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

        <div
          v-if="!images || images.length === 0"
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
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <p>Belum ada foto galeri.</p>
        </div>

        <div
          v-else
          class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          <div
            v-for="image in images"
            :key="image.id"
            class="group relative cursor-pointer overflow-hidden rounded-xl border border-sky-100 bg-gray-100 shadow-sm transition-all hover:shadow-md"
            @click="openPreview(image)"
          >
            <img
              :src="image.image_url"
              :alt="image.alt_text"
              class="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              class="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <span
                class="max-w-[70%] truncate text-xs font-medium text-white shadow-sm"
                >{{ image.alt_text }}</span
              >
              <button
                @click.stop="removeImage(image.id)"
                class="rounded-lg bg-red-500/80 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-red-600"
                title="Hapus foto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  ></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
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
      </div>
    </div>

    <!-- Preview Modal -->
    <Teleport to="body">
      <div
        v-if="isPreviewOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        @click.self="closePreview"
      >
        <div
          class="animate-in fade-in zoom-in-95 relative w-full max-w-4xl duration-300"
        >
          <button
            @click="closePreview"
            class="absolute -top-12 right-0 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 md:-right-12"
          >
            <X class="h-6 w-6" />
          </button>
          <img
            :src="selectedImage?.image_url"
            :alt="selectedImage?.alt_text"
            class="max-h-[80vh] w-full rounded-xl object-contain shadow-2xl"
          />
          <p
            v-if="selectedImage?.alt_text"
            class="mt-4 text-center font-medium text-white/90"
          >
            {{ selectedImage.alt_text }}
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>
