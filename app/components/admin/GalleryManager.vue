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
  <div class="card p-6 md:p-8 border border-sky-100 bg-white/95">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>

    <div v-else class="space-y-10">
      <!-- Header -->
      <div class="relative">
        <div class="absolute -left-4 md:-left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-light to-transparent rounded-r-md"></div>
        <h3 class="font-heading text-xl md:text-2xl font-semibold text-primary-dark mb-2">
          Galeri Foto
        </h3>
        <p class="text-sm text-primary">Kelola foto pre-wedding dan momen kebersamaan Anda.</p>
      </div>

      <!-- Tambah Baru -->
      <div class="bg-sky-50/50 p-6 rounded-2xl border border-sky-100">
        <h3 class="font-heading text-lg font-semibold text-primary-dark mb-4">
          Tambahkan Gambar Baru
        </h3>
        <form @submit.prevent="addImage" class="flex flex-col md:flex-row items-end gap-4">
          <div class="w-full md:flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">URL Gambar (Link)</label>
            <input type="url" required v-model="newImageUrl" class="input-field bg-white" placeholder="https://..." />
          </div>
          <div class="w-full md:w-1/3">
            <label class="block text-sm font-medium text-gray-700 mb-2">Teks Alternatif (Alt)</label>
            <input type="text" v-model="newImageAlt" class="input-field bg-white" placeholder="Pre-wedding 1" />
          </div>
          <div class="w-full md:w-auto">
            <button type="submit" :disabled="isAdding" class="btn-primary w-full md:w-auto flex justify-center py-3">
              <span v-if="!isAdding" class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Tambah
              </span>
              <span v-else class="flex items-center gap-2">
                <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Memuat...
              </span>
            </button>
          </div>
        </form>
      </div>

      <div class="divider"></div>

      <!-- Grid Gambar -->
      <div>
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-lg font-semibold text-primary-dark">
            Daftar Foto Galeri ({{ images.length }})
          </h3>
        </div>
        
        <div v-if="images.length === 0" class="rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/30 py-12 text-center text-primary flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mb-4 text-sky-300"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          <p>Belum ada foto galeri.</p>
        </div>
        
        <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <div
            v-for="image in images"
            :key="image.id"
            class="group relative cursor-pointer overflow-hidden rounded-xl border border-sky-100 bg-gray-100 shadow-sm hover:shadow-md transition-all"
            @click="openPreview(image)"
          >
            <img :src="image.image_url" :alt="image.alt_text" class="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div class="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span class="max-w-[70%] truncate text-xs font-medium text-white shadow-sm">{{ image.alt_text }}</span>
              <button
                @click.stop="removeImage(image.id)"
                class="rounded-lg bg-red-500/80 p-1.5 text-white hover:bg-red-600 transition-colors backdrop-blur-sm"
                title="Hapus foto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <Teleport to="body">
      <div v-if="isPreviewOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" @click.self="closePreview">
        <div class="relative w-full max-w-4xl animate-in fade-in zoom-in-95 duration-300">
          <button @click="closePreview" class="absolute -top-12 right-0 md:-right-12 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors">
            <X class="h-6 w-6" />
          </button>
          <img :src="selectedImage?.image_url" :alt="selectedImage?.alt_text" class="max-h-[80vh] w-full rounded-xl object-contain shadow-2xl" />
          <p v-if="selectedImage?.alt_text" class="mt-4 text-center font-medium text-white/90">
            {{ selectedImage.alt_text }}
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>
