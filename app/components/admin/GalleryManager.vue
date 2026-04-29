<script setup lang="ts">
import { ref, onMounted } from "vue";
import { X } from "lucide-vue-next";

const supabase = useSupabase();
const images = ref<any[]>([]);
const isLoading = ref(true);
const isAdding = ref(false);
const newImageUrl = ref("");
const newImageAlt = ref("");

const selectedImage = ref<any>(null);
const isPreviewOpen = ref(false);

const fetchImages = async () => {
  isLoading.value = true;
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true });
  if (data) {
    images.value = data;
  }
  isLoading.value = false;
};

onMounted(async () => {
  await fetchImages();
});

const addImage = async () => {
  if (!newImageUrl.value) return;
  isAdding.value = true;

  const sort_order =
    images.value.length > 0
      ? Math.max(...images.value.map((i) => i.sort_order || 0)) + 1
      : 1;
  const { error } = await supabase.from("gallery").insert({
    image_url: newImageUrl.value,
    alt_text: newImageAlt.value || "Gallery Image",
    sort_order,
  });

  isAdding.value = false;
  if (!error) {
    newImageUrl.value = "";
    newImageAlt.value = "";
    await fetchImages();
  } else {
    alert("Gagal menambah gambar: " + error.message);
  }
};

const removeImage = async (id: string) => {
  if (confirm("Yakin ingin menghapus gambar ini?")) {
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (!error) {
      await fetchImages();
    } else {
      alert("Gagal menghapus gambar: " + error.message);
    }
  }
};

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
</script>

<template>
  <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"
      ></div>
    </div>

    <div v-else class="space-y-8">
      <!-- Tambah Baru -->
      <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 class="text-md mb-4 font-medium text-gray-900">
          Tambahkan Gambar Baru
        </h3>
        <form
          @submit.prevent="addImage"
          class="grid grid-cols-1 items-end gap-4 sm:grid-cols-12"
        >
          <div class="sm:col-span-6">
            <label class="block text-sm font-medium text-gray-700"
              >URL Gambar (Link)</label
            >
            <input
              type="url"
              required
              v-model="newImageUrl"
              class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              placeholder="https://..."
            />
          </div>
          <div class="sm:col-span-4">
            <label class="block text-sm font-medium text-gray-700"
              >Teks Alternatif (Alt)</label
            >
            <input
              type="text"
              v-model="newImageAlt"
              class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              placeholder="Pre-wedding 1"
            />
          </div>
          <div class="sm:col-span-2">
            <button
              type="submit"
              :disabled="isAdding"
              class="inline-flex w-full justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <span v-if="!isAdding">Tambah</span>
              <span v-else>Memuat...</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Grid Gambar -->
      <div>
        <h3 class="text-md mb-4 font-medium text-gray-900">
          Daftar Foto Galeri ({{ images.length }})
        </h3>
        <div
          v-if="images.length === 0"
          class="rounded-lg border-2 border-dashed py-6 text-center text-gray-500"
        >
          Belum ada foto galeri.
        </div>
        <div
          v-else
          class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          <div
            v-for="image in images"
            :key="image.id"
            class="group relative cursor-pointer overflow-hidden rounded-lg border bg-gray-100"
            @click="openPreview(image)"
          >
            <img
              :src="image.image_url"
              :alt="image.alt_text"
              class="h-40 w-full object-cover transition-transform group-hover:scale-105"
            />
            <div
              class="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-2 pt-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <span class="max-w-[70%] truncate text-xs text-white">{{
                image.alt_text
              }}</span>
              <button
                @click.stop="removeImage(image.id)"
                class="rounded bg-black/50 p-1 p-1.5 text-red-400 hover:bg-black/70 hover:text-red-300"
                title="Hapus foto"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <Teleport to="body">
      <div
        v-if="isPreviewOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        @click.self="closePreview"
      >
        <div class="relative w-full max-w-4xl">
          <button
            @click="closePreview"
            class="absolute -top-10 right-0 text-white hover:text-gray-300"
          >
            <X class="h-8 w-8" />
          </button>
          <img
            :src="selectedImage?.image_url"
            :alt="selectedImage?.alt_text"
            class="max-h-[80vh] w-full rounded-lg object-contain"
          />
          <p v-if="selectedImage?.alt_text" class="mt-4 text-center text-white">
            {{ selectedImage.alt_text }}
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>
