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
  <div class="space-y-6">
    <!-- Statistik Ringkas -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="overflow-hidden rounded-lg bg-white shadow">
        <div class="p-5">
          <dt class="truncate text-sm font-medium text-gray-500">
            Total RSVP Masuk
          </dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {{ totalRsvps }}
          </dd>
        </div>
      </div>
      <div
        class="overflow-hidden rounded-lg border-l-4 border-green-500 bg-white shadow"
      >
        <div class="p-5">
          <dt class="truncate text-sm font-medium text-gray-500">
            Total Keluarga Hadir
          </dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {{ attendingRsvps }}
          </dd>
        </div>
      </div>
      <div
        class="overflow-hidden rounded-lg border-l-4 border-sky-500 bg-white shadow"
      >
        <div class="p-5">
          <dt class="truncate text-sm font-medium text-gray-500">
            Estimasi Kepala Hadir
          </dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {{ totalIndividualGuests }}
            <span class="text-sm font-normal text-gray-500">orang</span>
          </dd>
        </div>
      </div>
      <div
        class="overflow-hidden rounded-lg border-l-4 border-red-500 bg-white shadow"
      >
        <div class="p-5">
          <dt class="truncate text-sm font-medium text-gray-500">
            Tidak Hadir
          </dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {{ notAttendingRsvps }}
          </dd>
        </div>
      </div>
    </div>

    <!-- Data Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"
      ></div>
    </div>

    <div v-else class="space-y-8">
      <!-- Tabel RSVP -->
      <div
        class="flex max-h-[600px] flex-col overflow-hidden bg-white shadow sm:rounded-lg"
      >
        <div
          class="flex items-center justify-between border-b bg-gray-50 px-4 py-5 sm:px-6"
        >
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            Daftar Kehadiran (RSVP)
          </h3>
        </div>
        <div class="max-h-[600px] overflow-x-auto overflow-y-auto p-0">
          <table class="relative min-w-full divide-y divide-gray-200">
            <thead class="sticky top-0 z-10 bg-gray-50 shadow-sm">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Nama & Tanggal
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Kehadiran
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Informasi/Alasan
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="rsvp in rsvps"
                :key="rsvp.id"
                class="transition-colors hover:bg-gray-50"
              >
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="text-sm font-medium text-sky-600">
                    {{ rsvp.name }}
                  </div>
                  <div class="mt-1 text-xs text-gray-400">
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
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase leading-5 tracking-wider"
                  >
                    {{ rsvp.attendance }}
                  </span>
                </td>
                <td class="max-w-xs whitespace-normal break-words px-6 py-4">
                  <div
                    v-if="rsvp.attendance === 'hadir' && rsvp.num_guests > 0"
                    class="text-sm text-gray-900"
                  >
                    <span class="font-medium">{{ rsvp.num_guests }} Orang</span>
                    <div
                      v-if="rsvp.additional_guest_names?.length"
                      class="mt-1 text-xs text-gray-500"
                    >
                      Bersama: {{ rsvp.additional_guest_names.join(", ") }}
                    </div>
                  </div>
                  <div
                    v-if="rsvp.attendance === 'tidak' && rsvp.reason"
                    class="text-sm italic text-gray-600"
                  >
                    "{{ rsvp.reason }}"
                  </div>
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium"
                >
                  <button
                    @click="deleteRsvp(rsvp.id)"
                    class="rounded px-2 py-1 font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="rsvps.length === 0">
                <td
                  colspan="4"
                  class="px-6 py-12 text-center text-sm text-gray-500"
                >
                  Belum ada tamu yang mengisi RSVP.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tabel Wishes -->
      <div
        class="flex max-h-[600px] flex-col overflow-hidden bg-white shadow sm:rounded-lg"
      >
        <div
          class="flex items-center justify-between border-b bg-gray-50 px-4 py-5 sm:px-6"
        >
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            Buku Tamu (Ucapan & Doa)
          </h3>
          <span
            class="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800"
          >
            {{ wishes.length }} Pesan
          </span>
        </div>
        <div class="overflow-x-auto overflow-y-auto bg-white p-0">
          <table class="relative min-w-full divide-y divide-gray-200">
            <thead class="sticky top-0 z-10 bg-gray-50 shadow-sm">
              <tr>
                <th
                  scope="col"
                  class="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Dari
                </th>
                <th
                  scope="col"
                  class="w-2/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Ucapan
                </th>
                <th
                  scope="col"
                  class="w-1/4 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="wish in wishes"
                :key="wish.id"
                class="transition-colors hover:bg-gray-50"
              >
                <td class="whitespace-nowrap px-6 py-4 align-top">
                  <div class="text-sm font-semibold text-gray-900">
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
                  class="min-w-[250px] whitespace-normal break-words px-6 py-4 text-sm leading-relaxed text-gray-700"
                >
                  "{{ wish.message }}"
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 text-right align-top text-sm font-medium"
                >
                  <button
                    @click="deleteWish(wish.id)"
                    class="rounded px-2 py-1 font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="wishes.length === 0">
                <td
                  colspan="3"
                  class="px-6 py-12 text-center text-sm text-gray-500"
                >
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
