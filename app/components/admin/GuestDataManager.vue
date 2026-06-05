<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useSupabase } from "~/composables/useSupabase";
import FormatDate from "~/utils/FormatDate.vue";

const supabase = useSupabase();

const rsvps = ref<any[]>([]);
const wishes = ref<any[]>([]);
const isLoading = ref(true);

const rsvpSearch = ref("");
const wishSearch = ref("");

const filteredRsvps = computed(() => {
  if (!rsvpSearch.value.trim()) return rsvps.value;
  const q = rsvpSearch.value.toLowerCase().trim();
  return rsvps.value.filter((r) => r.name?.toLowerCase().includes(q));
});

const filteredWishes = computed(() => {
  if (!wishSearch.value.trim()) return wishes.value;
  const q = wishSearch.value.toLowerCase().trim();
  return wishes.value.filter((w) => w.name?.toLowerCase().includes(q));
});

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
      <div
        class="card flex flex-col items-center justify-center border border-sky-100 bg-white/95 p-6 text-center"
      >
        <dt
          class="mb-2 text-sm font-medium uppercase tracking-wider text-gray-500"
        >
          Total RSVP Masuk
        </dt>
        <dd class="font-heading text-primary-dark text-4xl font-bold">
          {{ totalRsvps }}
        </dd>
      </div>
      <div
        class="card flex flex-col items-center justify-center border border-green-200 bg-green-50/50 p-6 text-center"
      >
        <dt
          class="mb-2 text-sm font-medium uppercase tracking-wider text-green-700"
        >
          Total Keluarga Hadir
        </dt>
        <dd class="font-heading text-4xl font-bold text-green-600">
          {{ attendingRsvps }}
        </dd>
      </div>
      <div
        class="card flex flex-col items-center justify-center border border-sky-200 bg-sky-50/50 p-6 text-center"
      >
        <dt
          class="mb-2 text-sm font-medium uppercase tracking-wider text-sky-700"
        >
          Estimasi Kepala Hadir
        </dt>
        <dd class="font-heading text-4xl font-bold text-sky-600">
          {{ totalIndividualGuests }}
          <span class="ml-1 text-sm font-medium text-sky-600/70">orang</span>
        </dd>
      </div>
      <div
        class="card flex flex-col items-center justify-center border border-red-200 bg-red-50/50 p-6 text-center"
      >
        <dt
          class="mb-2 text-sm font-medium uppercase tracking-wider text-red-700"
        >
          Tidak Hadir
        </dt>
        <dd class="font-heading text-4xl font-bold text-red-600">
          {{ notAttendingRsvps }}
        </dd>
      </div>
    </div>

    <!-- Data Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div
        class="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
      ></div>
    </div>

    <div v-else class="flex flex-col gap-4 lg:flex-row">
      <!-- Tabel RSVP -->
      <div
        class="card flex max-h-[600px] w-full flex-col overflow-hidden border border-sky-100 bg-white/95 p-0 xl:w-1/2"
      >
        <div
          class="flex flex-col gap-3 border-b border-sky-100 bg-sky-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-3">
            <h3
              class="font-heading text-primary-dark text-lg font-semibold md:text-xl"
            >
              Daftar Kehadiran (RSVP)
            </h3>
            <span
              class="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
            >
              {{ rsvps.length }} Tamu
            </span>
          </div>
          <div class="w-full sm:w-1/4">
            <input
              v-model="rsvpSearch"
              type="text"
              class="input-field bg-white"
              placeholder="Cari nama..."
            />
          </div>
        </div>
        <div class="max-h-[500px] flex-1 overflow-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="sticky top-0 z-10 bg-white shadow-sm">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Nama & Tanggal
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Kehadiran
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Informasi/Alasan
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr
                v-for="rsvp in filteredRsvps"
                :key="rsvp.id"
                class="transition-colors hover:bg-sky-50/30"
              >
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="text-primary-dark text-sm font-semibold">
                    {{ rsvp.name }}
                  </div>
                  <div class="mt-1 text-xs text-gray-500">
                    <FormatDate
                      :date="rsvp.created_at"
                      :withDate="true"
                      :withTime="true"
                    />
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    :class="
                      rsvp.attendance === 'hadir'
                        ? 'border-green-200 bg-green-100 text-green-800'
                        : 'border-red-200 bg-red-100 text-red-800'
                    "
                    class="inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider"
                  >
                    {{ rsvp.attendance }}
                  </span>
                </td>
                <td class="max-w-xs whitespace-normal break-words px-6 py-4">
                  <div
                    v-if="rsvp.attendance === 'hadir' && rsvp.num_guests > 0"
                    class="text-sm text-gray-700"
                  >
                    <span
                      class="rounded bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800"
                      >{{ rsvp.num_guests }} Orang</span
                    >
                    <div
                      v-if="rsvp.additional_guest_names?.length"
                      class="mt-2 text-xs text-gray-600"
                    >
                      Bersama:
                      <span class="font-medium">{{
                        rsvp.additional_guest_names.join(", ")
                      }}</span>
                    </div>
                  </div>
                  <div
                    v-if="rsvp.attendance === 'tidak' && rsvp.reason"
                    class="text-sm italic text-gray-500"
                  >
                    "{{ rsvp.reason }}"
                  </div>
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium"
                >
                  <button
                    @click="deleteRsvp(rsvp.id)"
                    class="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 font-semibold text-red-500 transition-colors hover:bg-red-100"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="filteredRsvps.length === 0">
                <td
                  colspan="4"
                  class="px-6 py-12 text-center text-sm text-gray-500"
                >
                  <template v-if="rsvpSearch && rsvps.length > 0">
                    <p>Tamu tidak ditemukan.</p>
                    <p class="mt-1 text-xs text-gray-400">
                      Coba kata kunci lain.
                    </p>
                  </template>
                  <template v-else>
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
                      class="mx-auto mb-4 text-gray-300"
                    >
                      <path
                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      ></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Belum ada tamu yang mengisi RSVP.
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tabel Wishes -->
      <div
        class="card flex max-h-[600px] w-full flex-col overflow-hidden border border-sky-100 bg-white/95 p-0 xl:w-1/2"
      >
        <div
          class="flex flex-col gap-3 border-b border-sky-100 bg-sky-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-3">
            <h3
              class="font-heading text-primary-dark text-lg font-semibold md:text-xl"
            >
              Buku Tamu (Ucapan & Doa)
            </h3>
            <span
              class="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
            >
              {{ wishes.length }} Pesan
            </span>
          </div>
          <div class="w-full sm:w-1/4">
            <input
              v-model="wishSearch"
              type="text"
              class="input-field bg-white"
              placeholder="Cari nama..."
            />
          </div>
        </div>
        <div class="max-h-[500px] flex-1 overflow-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="sticky top-0 z-10 bg-white shadow-sm">
              <tr>
                <th
                  scope="col"
                  class="w-1/4 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Dari
                </th>
                <th
                  scope="col"
                  class="w-2/4 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Ucapan
                </th>
                <th
                  scope="col"
                  class="w-1/4 px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr
                v-for="wish in filteredWishes"
                :key="wish.id"
                class="transition-colors hover:bg-sky-50/30"
              >
                <td class="whitespace-nowrap px-6 py-4 align-top">
                  <div class="text-primary-dark text-sm font-semibold">
                    {{ wish.name }}
                  </div>
                  <div class="mt-1 text-xs text-gray-500">
                    <FormatDate
                      :date="wish.created_at"
                      :withDate="true"
                      :withTime="true"
                    />
                  </div>
                </td>
                <td
                  class="min-w-[250px] whitespace-normal break-words px-6 py-4 font-serif text-sm italic leading-relaxed text-gray-700"
                >
                  "{{ wish.message }}"
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 text-right align-top text-sm font-medium"
                >
                  <button
                    @click="deleteWish(wish.id)"
                    class="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 font-semibold text-red-500 transition-colors hover:bg-red-100"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="filteredWishes.length === 0">
                <td
                  colspan="3"
                  class="px-6 py-12 text-center text-sm text-gray-500"
                >
                  <template v-if="wishSearch && wishes.length > 0">
                    <p>Tamu tidak ditemukan.</p>
                    <p class="mt-1 text-xs text-gray-400">
                      Coba kata kunci lain.
                    </p>
                  </template>
                  <template v-else>
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
                      class="mx-auto mb-4 text-gray-300"
                    >
                      <path
                        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                      ></path>
                    </svg>
                    Belum ada ucapan yang masuk di Buku Tamu.
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
