<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Send, X, User, Heart } from "lucide-vue-next";
import type { WeddingInfo } from "~/types";
import FormatDate from "~/utils/FormatDate.vue";

const props = defineProps<{
  guestbookRef?: {
    scrollToLatest: () => void;
    startAutoScroll: () => void;
  } | null;
}>();

const supabase = useSupabase();

const weddingInfo = useState<WeddingInfo>("weddingInfo");
const name = ref("");
const attendance = ref<"hadir" | "tidak" | "">("");
const numGuests = ref(1);
const isSubmitted = ref(false);
const isLoading = ref(false);
const showPopup = ref(false);
const showConfirmNotComing = ref(false);
const additionalGuestNames = ref<string[]>([]);
const reason = ref("");

const canSelectAttendance = computed(() => name.value.trim().length > 0);

const additionalGuestsCount = computed(() => numGuests.value - 1);

const allGuestNamesFilled = computed(() => {
  if (numGuests.value === 1) return true;
  return additionalGuestNames.value.every((n) => n.trim().length > 0);
});

const canSubmit = computed(
  () =>
    name.value.trim().length > 0 &&
    attendance.value !== "" &&
    allGuestNamesFilled.value,
);

const showGuestDetails = computed(() => {
  return attendance.value === "hadir";
});

watch(numGuests, (newVal) => {
  additionalGuestNames.value = Array(newVal - 1).fill("");
});

const updateAdditionalGuestName = (index: number, value: string) => {
  additionalGuestNames.value[index] = value;
};

const confirmNotComing = async () => {
  attendance.value = "tidak";
  numGuests.value = 1;
  additionalGuestNames.value = [];

  isLoading.value = true;
  const { error } = await supabase.from("rsvps").insert({
    name: name.value,
    attendance: "tidak",
    num_guests: 1,
    additional_guest_names: [],
    reason: reason.value,
  });
  isLoading.value = false;

  if (error) {
    console.error("Error submitting RSVP:", error);
    alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
    return;
  }

  showConfirmNotComing.value = false;
  isSubmitted.value = true;
  showPopup.value = true;

  setTimeout(() => {
    if (props.guestbookRef) {
      props.guestbookRef.scrollToLatest();
      props.guestbookRef.startAutoScroll();
    }
  }, 1500);
};

const handleNotComingClick = () => {
  if (canSelectAttendance.value && attendance.value !== "tidak") {
    showConfirmNotComing.value = true;
  }
};

const cancelNotComing = () => {
  showConfirmNotComing.value = false;
};

const handleSubmit = async () => {
  if (canSubmit.value) {
    isLoading.value = true;
    const { error } = await supabase.from("rsvps").insert({
      name: name.value,
      attendance: attendance.value,
      num_guests: numGuests.value,
      additional_guest_names: additionalGuestNames.value.filter((n) =>
        n.trim(),
      ),
      reason: reason.value,
    });
    isLoading.value = false;

    if (error) {
      console.error("Error submitting RSVP:", error);
      alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
      return;
    }

    isSubmitted.value = true;
    showPopup.value = true;
    setTimeout(() => {
      if (props.guestbookRef) {
        props.guestbookRef.scrollToLatest();
        props.guestbookRef.startAutoScroll();
      }
    }, 1500);
  }
};

const closePopup = () => {
  showPopup.value = false;
};

const resetForm = () => {
  name.value = "";
  attendance.value = "";
  numGuests.value = 1;
  isSubmitted.value = false;
};
</script>

<template>
  <section class="section relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute right-16 top-8 h-36 w-36 transform-gpu rounded-full bg-white/30 blur-3xl"
      ></div>
      <div
        class="absolute bottom-12 left-10 h-44 w-44 transform-gpu rounded-full bg-white/30 blur-3xl"
      ></div>
      <div
        class="absolute left-1/3 top-1/2 h-20 w-20 transform-gpu rounded-full bg-white/30 blur-2xl"
      ></div>
    </div>
    <div class="container-custom relative z-10">
      <div class="mb-12 text-center" data-aos="fade-up">
        <h2 class="font-heading text-accent mb-2 text-2xl md:text-3xl">
          Konfirmasi Kehadiran
        </h2>
        <div class="divider"></div>
        <p class="text-primary-light mt-4 text-sm">
          Mohon konfirmasi kehadiran Anda sebelum
          <FormatDate :date="weddingInfo?.wedding_date" :with-day="true" />
        </p>
      </div>

      <div
        v-if="!isSubmitted"
        class="mx-auto max-w-lg"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="text-primary mb-2 block text-sm font-medium">
              Nama Tamu
            </label>
            <input
              v-model="name"
              type="text"
              class="input-field border-primary border-2"
              placeholder="Masukkan nama Anda"
              required
            />
          </div>

          <div>
            <label class="text-primary mb-2 block text-sm font-medium">
              Kehadiran
            </label>
            <div class="grid grid-cols-2 gap-4">
              <button
                type="button"
                @click="canSelectAttendance && (attendance = 'hadir')"
                class="border-primary flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 transition-all duration-200"
                :class="
                  attendance === 'hadir'
                    ? 'bg-primary text-white'
                    : canSelectAttendance
                      ? 'bg-primary hover:bg-primary text-white'
                      : 'bg-bg-alt text-primary cursor-not-allowed opacity-50'
                "
                :disabled="!canSelectAttendance"
              >
                <Heart class="h-5 w-5" />
                Hadir
              </button>
              <button
                type="button"
                @click="handleNotComingClick"
                class="border-primary flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 transition-all duration-200"
                :class="
                  attendance === 'tidak'
                    ? 'border-primary text-white'
                    : canSelectAttendance
                      ? 'border-primary text-primary hover:border-primary'
                      : 'border-primary text-primary cursor-not-allowed opacity-50'
                "
                :disabled="!canSelectAttendance"
              >
                <X class="h-5 w-5" />
                Tidak
              </button>
            </div>
            <p v-if="!canSelectAttendance" class="text-primary mt-2 text-xs">
              <User class="mr-1 inline h-3 w-3" />
              Mohon isi nama terlebih dahulu
            </p>
          </div>

          <div v-if="attendance === 'hadir'">
            <label class="text-primary mb-2 block text-sm font-medium">
              Jumlah Tamu
            </label>
            <select v-model="numGuests" class="input-field">
              <option :value="1">1 Orang</option>
              <option :value="2">2 Orang</option>
              <option :value="3">3 Orang</option>
              <option :value="4">4 Orang</option>
            </select>
          </div>

          <div v-if="additionalGuestsCount > 0" class="space-y-4">
            <label class="text-primary mb-2 block text-sm font-medium">
              Nama Tamu Lainnya
            </label>
            <input
              v-for="(guest, index) in additionalGuestsCount"
              :key="index"
              :value="additionalGuestNames[index]"
              @input="
                updateAdditionalGuestName(
                  index,
                  ($event.target as HTMLInputElement).value,
                )
              "
              type="text"
              class="input-field"
              :placeholder="`Nama Tamu ${index + 2}`"
            />
          </div>

          <button
            type="submit"
            class="btn-primary flex w-full items-center justify-center gap-2"
            :class="{
              'cursor-not-allowed opacity-50': !canSubmit || isLoading,
            }"
            :disabled="!canSubmit || isLoading"
          >
            <Send v-if="!isLoading" class="h-5 w-5" />
            <span
              v-if="isLoading"
              class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></span>
            {{ isLoading ? "Sedang Mengirim..." : "Kirim Konfirmasi" }}
          </button>
        </form>
      </div>

      <div v-else class="mx-auto max-w-lg text-center" data-aos="fade-up">
        <div class="card bg-bg border-bg-alt border-2">
          <div
            class="bg-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          >
            <Heart class="h-8 w-8 text-white" />
          </div>
          <h3 class="font-heading text-primary mb-2 text-xl">Terima Kasih!</h3>
          <p class="text-text-muted mb-4">
            Konfirmasi kehadiran Anda telah kami terima.
          </p>
          <button @click="resetForm" class="btn-primary">
            Kirim Konfirmasi Lain
          </button>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <div
        v-if="showPopup"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md transition-all duration-300"
        @click.self="closePopup"
      >
        <div
          class="card animate-in fade-in zoom-in-95 relative w-full max-w-lg rounded-3xl border border-white bg-white/95 p-8 text-center shadow-2xl duration-300"
        >
          <div
            class="from-primary to-primary-light mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-lg"
          >
            <Heart class="h-10 w-10 text-white" />
          </div>
          <h3 class="font-heading text-primary-dark mb-3 text-2xl font-bold">
            Terima Kasih!
          </h3>
          <p class="mb-6 leading-relaxed text-gray-600">
            Konfirmasi RSVP Anda telah kami terima.
          </p>
          <p
            class="text-primary-dark rounded-xl border border-sky-100 bg-sky-50 p-4 text-center font-medium shadow-sm"
          >
            "{{ name }}"
          </p>
          <button
            @click="closePopup"
            class="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X class="h-5 w-5" />
          </button>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="showConfirmNotComing"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md transition-all duration-300"
        @click.self="cancelNotComing"
      >
        <div
          class="card animate-in fade-in zoom-in-95 relative w-full max-w-lg rounded-3xl border border-white bg-white/95 p-8 text-center shadow-2xl duration-300"
        >
          <div
            class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 shadow-md"
          >
            <X class="h-10 w-10 text-gray-500" />
          </div>
          <h3 class="font-heading mb-3 text-2xl font-bold text-gray-800">
            Konfirmasi
          </h3>
          <p class="mb-6 text-sm leading-relaxed text-gray-600">
            Apakah Anda yakin tidak dapat menghadiri acara pernikahan kami?<br />
            Mohon berikan alasan Anda tidak dapat menghadiri pernikahan kami.
          </p>
          <textarea
            v-model="reason"
            class="input-field mb-6 min-h-32 resize-none border-gray-200 bg-gray-50 focus:bg-white"
            placeholder="Masukkan alasan Anda..."
            autofocus
          ></textarea>
          <div class="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              @click="cancelNotComing"
              class="w-full rounded-full border-2 border-gray-200 bg-white px-6 py-3 font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 sm:w-1/2"
              :disabled="isLoading"
            >
              Batal
            </button>
            <button
              type="button"
              @click="confirmNotComing"
              class="btn-primary flex w-full items-center justify-center gap-2 py-3 sm:w-1/2"
              :disabled="isLoading"
            >
              <span
                v-if="isLoading"
                class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
              ></span>
              {{ isLoading ? "Menyimpan..." : "Kirim Konfirmasi" }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
