<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useSupabase } from "~/composables/useSupabase";
import FormatDate from "~/utils/FormatDate.vue";

const supabase = useSupabase();

const rsvps = ref<any[]>([]);
const wishes = ref<any[]>([]);
const isLoading = ref(true);

const fetchAllData = async () => {
  isLoading.value = true;

  const [rsvpRes, wishesRes] = await Promise.all([
    supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("wishes").select("*").order("id", { ascending: false }),
  ]);

  if (rsvpRes.data) rsvps.value = rsvpRes.data;
  if (wishesRes.data) wishes.value = wishesRes.data;

  isLoading.value = false;
};

onMounted(() => {
  fetchAllData();
});

const deleteRsvp = async (id: number) => {
  if (confirm("Hapus rsvp ini?")) {
    const { error } = await supabase.from("rsvps").delete().eq("id", id);
    if (!error) fetchAllData();
  }
};

const deleteWish = async (id: number) => {
  if (confirm("Hapus ucapan ini?")) {
    const { error } = await supabase.from("wishes").delete().eq("id", id);
    if (!error) fetchAllData();
  }
};

const totalRsvps = computed(() => rsvps.value.length);
const attendingRsvps = computed(
  () => rsvps.value.filter((r) => r.attendance === "hadir").length,
);
const notAttendingRsvps = computed(
  () => rsvps.value.filter((r) => r.attendance === "tidak").length,
);
const totalIndividualGuests = computed(() => {
  return rsvps.value
    .filter((r) => r.attendance === "hadir")
    .reduce((sum, current) => sum + (current.num_guests || 0), 0);
});
</script>

<template>
  <div class="space-y-8">
    <!-- Statistik Ringkas -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="card border border-sky-100 p-6 flex flex-col justify-center items-center text-center bg-white/95">
        <dt class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
          Total RSVP Masuk
        </dt>
        <dd class="text-4xl font-heading font-bold text-primary-dark">
          {{ totalRsvps }}
        </dd>
      </div>
      <div class="card border border-green-200 p-6 flex flex-col justify-center items-center text-center bg-green-50/50">
        <dt class="text-sm font-medium text-green-700 uppercase tracking-wider mb-2">
          Total Keluarga Hadir
        </dt>
        <dd class="text-4xl font-heading font-bold text-green-600">
          {{ attendingRsvps }}
        </dd>
      </div>
      <div class="card border border-sky-200 p-6 flex flex-col justify-center items-center text-center bg-sky-50/50">
        <dt class="text-sm font-medium text-sky-700 uppercase tracking-wider mb-2">
          Estimasi Kepala Hadir
        </dt>
        <dd class="text-4xl font-heading font-bold text-sky-600">
          {{ totalIndividualGuests }}
          <span class="text-sm font-medium text-sky-600/70 ml-1">orang</span>
        </dd>
      </div>
      <div class="card border border-red-200 p-6 flex flex-col justify-center items-center text-center bg-red-50/50">
        <dt class="text-sm font-medium text-red-700 uppercase tracking-wider mb-2">
          Tidak Hadir
        </dt>
        <dd class="text-4xl font-heading font-bold text-red-600">
          {{ notAttendingRsvps }}
        </dd>
      </div>
    </div>

    <!-- Data Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>

    <div v-else class="space-y-8">
      <!-- Tabel RSVP -->
      <div class="card overflow-hidden border border-sky-100 bg-white/95 p-0 flex flex-col max-h-[600px]">
        <div class="flex items-center justify-between border-b border-sky-100 bg-sky-50/50 px-6 py-5">
          <h3 class="font-heading text-lg md:text-xl font-semibold text-primary-dark">
            Daftar Kehadiran (RSVP)
          </h3>
          <span class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {{ rsvps.length }} Tamu
          </span>
        </div>
        <div class="flex-1 overflow-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="sticky top-0 z-10 bg-white shadow-sm">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Nama & Tanggal
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Kehadiran
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Informasi/Alasan
                </th>
                <th scope="col" class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="rsvp in rsvps" :key="rsvp.id" class="transition-colors hover:bg-sky-50/30">
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="text-sm font-semibold text-primary-dark">
                    {{ rsvp.name }}
                  </div>
                  <div class="mt-1 text-xs text-gray-500">
                    <FormatDate :date="rsvp.created_at" :withDate="true" :withTime="true" />
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    :class="rsvp.attendance === 'hadir' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'"
                    class="inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border"
                  >
                    {{ rsvp.attendance }}
                  </span>
                </td>
                <td class="max-w-xs whitespace-normal break-words px-6 py-4">
                  <div v-if="rsvp.attendance === 'hadir' && rsvp.num_guests > 0" class="text-sm text-gray-700">
                    <span class="font-medium bg-sky-100 text-sky-800 px-2 py-0.5 rounded text-xs">{{ rsvp.num_guests }} Orang</span>
                    <div v-if="rsvp.additional_guest_names?.length" class="mt-2 text-xs text-gray-600">
                      Bersama: <span class="font-medium">{{ rsvp.additional_guest_names.join(", ") }}</span>
                    </div>
                  </div>
                  <div v-if="rsvp.attendance === 'tidak' && rsvp.reason" class="text-sm italic text-gray-500">
                    "{{ rsvp.reason }}"
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button @click="deleteRsvp(rsvp.id)" class="rounded-lg px-3 py-1.5 font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-700">
                    Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="rsvps.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-300"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Belum ada tamu yang mengisi RSVP.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tabel Wishes -->
      <div class="card overflow-hidden border border-sky-100 bg-white/95 p-0 flex flex-col max-h-[600px]">
        <div class="flex items-center justify-between border-b border-sky-100 bg-sky-50/50 px-6 py-5">
          <h3 class="font-heading text-lg md:text-xl font-semibold text-primary-dark">
            Buku Tamu (Ucapan & Doa)
          </h3>
          <span class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {{ wishes.length }} Pesan
          </span>
        </div>
        <div class="flex-1 overflow-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="sticky top-0 z-10 bg-white shadow-sm">
              <tr>
                <th scope="col" class="w-1/4 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Dari
                </th>
                <th scope="col" class="w-2/4 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Ucapan
                </th>
                <th scope="col" class="w-1/4 px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="wish in wishes" :key="wish.id" class="transition-colors hover:bg-sky-50/30">
                <td class="whitespace-nowrap px-6 py-4 align-top">
                  <div class="text-sm font-semibold text-primary-dark">
                    {{ wish.name }}
                  </div>
                  <div class="mt-1 text-xs text-gray-500">
                    <FormatDate :date="wish.created_at" :withDate="true" :withTime="true" />
                  </div>
                </td>
                <td class="min-w-[250px] whitespace-normal break-words px-6 py-4 text-sm leading-relaxed text-gray-700 font-serif italic">
                  "{{ wish.message }}"
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right align-top text-sm font-medium">
                  <button @click="deleteWish(wish.id)" class="rounded-lg px-3 py-1.5 font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-700">
                    Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="wishes.length === 0">
                <td colspan="3" class="px-6 py-12 text-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-300"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  Belum ada ucapan yang masuk di Buku Tamu.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
