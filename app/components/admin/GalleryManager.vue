<script setup lang="ts">
import { ref, onMounted } from 'vue';

const supabase = useSupabase();
const images = ref<any[]>([]);
const isLoading = ref(true);
const isAdding = ref(false);
const newImageUrl = ref('');
const newImageAlt = ref('');

const fetchImages = async () => {
  isLoading.value = true;
  const { data, error } = await supabase.from('gallery').select('*').order('sort_order', { ascending: true });
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
  
  const sort_order = images.value.length > 0 ? Math.max(...images.value.map(i => i.sort_order || 0)) + 1 : 1;
  const { error } = await supabase.from('gallery').insert({
    image_url: newImageUrl.value,
    alt_text: newImageAlt.value || 'Gallery Image',
    sort_order
  });
  
  isAdding.value = false;
  if (!error) {
    newImageUrl.value = '';
    newImageAlt.value = '';
    await fetchImages();
  } else {
    alert("Gagal menambah gambar: " + error.message);
  }
};

const removeImage = async (id: string) => {
  if (confirm("Yakin ingin menghapus gambar ini?")) {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (!error) {
      await fetchImages();
    } else {
      alert("Gagal menghapus gambar: " + error.message);
    }
  }
};
</script>

<template>
  <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
    </div>
    
    <div v-else class="space-y-8">
      
      <!-- Tambah Baru -->
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 class="text-md font-medium text-gray-900 mb-4">Tambahkan Gambar Baru</h3>
        <form @submit.prevent="addImage" class="grid grid-cols-1 gap-4 sm:grid-cols-12 items-end">
          <div class="sm:col-span-6">
            <label class="block text-sm font-medium text-gray-700">URL Gambar (Link)</label>
            <input type="url" required v-model="newImageUrl" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" placeholder="https://..." />
          </div>
          <div class="sm:col-span-4">
            <label class="block text-sm font-medium text-gray-700">Teks Alternatif (Alt)</label>
            <input type="text" v-model="newImageAlt" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" placeholder="Pre-wedding 1" />
          </div>
          <div class="sm:col-span-2">
            <button type="submit" :disabled="isAdding" class="w-full inline-flex justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50">
              <span v-if="!isAdding">Tambah</span>
              <span v-else>Memuat...</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Grid Gambar -->
      <div>
        <h3 class="text-md font-medium text-gray-900 mb-4">Daftar Foto Galeri ({{ images.length }})</h3>
        <div v-if="images.length === 0" class="text-center py-6 text-gray-500 border-2 border-dashed rounded-lg">
          Belum ada foto galeri.
        </div>
        <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <div v-for="image in images" :key="image.id" class="relative group rounded-lg overflow-hidden border bg-gray-100">
            <img :src="image.image_url" :alt="image.alt_text" class="h-40 w-full object-cover transition-transform group-hover:scale-105" />
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
              <span class="text-white text-xs truncate max-w-[70%]">{{ image.alt_text }}</span>
              <button @click="removeImage(image.id)" class="text-red-400 hover:text-red-300 bg-black/50 hover:bg-black/70 p-1.5 rounded p-1" title="Hapus foto">
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>
