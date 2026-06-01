<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { Send, X, Heart, User, CheckCircle } from "lucide-vue-next";
import type { WeddingInfo, RSVP } from "~/types";
import FormatDate from "~/utils/FormatDate.vue";

const props = defineProps<{
  guestbookRef?: {
    scrollToLatest: () => void;
    startAutoScroll: () => void;
  } | null;
  guestId?: string | null;
  guestName?: string;
}>();

const supabase = useSupabase();

const weddingInfo = useState<WeddingInfo>("weddingInfo");
const name = ref(props.guestName ?? "");
const attendance = ref<"hadir" | "tidak_hadir" | "">("");
const selectedGuestCount = ref<"1" | "2" | "3" | "4" | "more">("1");
const customGuestCount = ref<number>(5);
const isSubmitted = ref(false);
const isLoading = ref(false);
const showPopup = ref(false);

const existingRsvp = ref<RSVP | null>(null);
const isEditingRsvp = ref(false);
const isLoadingCheck = ref(true);

watch(() => props.guestName, (val) => {
  if (val) name.value = val;
});

const loadExistingRsvp = async (guestId: string) => {
  isLoadingCheck.value = true;

  let { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("guest_id", guestId)
    .maybeSingle();

  if (!data && props.guestName) {
    const { data: nameData, error: nameError } = await supabase
      .from("rsvps")
      .select("*")
      .eq("name", props.guestName)
      .maybeSingle();

    if (nameData && !nameError) {
      data = nameData;
      error = nameError;
      await supabase.from("rsvps").update({ guest_id: guestId }).eq("id", data.id);
    }
  }

  if (data && !error) {
    existingRsvp.value = data as RSVP;
    attendance.value = data.attendance as "hadir" | "tidak_hadir";
    if (data.num_guests >= 1 && data.num_guests <= 4) {
      selectedGuestCount.value = String(data.num_guests) as "1" | "2" | "3" | "4";
    } else if (data.num_guests > 4) {
      selectedGuestCount.value = "more";
      customGuestCount.value = data.num_guests;
    }
  }
  isLoadingCheck.value = false;
};

watch(() => props.guestId, (val) => {
  if (val) loadExistingRsvp(val);
});

onMounted(() => {
  if (props.guestId) loadExistingRsvp(props.guestId);
  else isLoadingCheck.value = false;
});

const canSelectAttendance = computed(() => name.value.trim().length > 0);

const showGuestCount = computed(() => attendance.value === "hadir");

const showCustomCount = computed(
  () => attendance.value === "hadir" && selectedGuestCount.value === "more",
);

const finalGuestCount = computed(() => {
  if (attendance.value !== "hadir") return 0;
  if (selectedGuestCount.value === "more") {
    return Math.max(5, Math.min(100, customGuestCount.value));
  }
  return parseInt(selectedGuestCount.value);
});

const customCountValid = computed(
  () =>
    !showCustomCount.value ||
    (customGuestCount.value >= 5 && customGuestCount.value <= 100),
);

const canSubmit = computed(
  () =>
    name.value.trim().length > 0 &&
    attendance.value !== "" &&
    (attendance.value !== "hadir" ||
      (showCustomCount.value ? customCountValid.value : true)),
);

const showForm = computed(
  () => isLoadingCheck.value || !existingRsvp.value || isEditingRsvp.value,
);

const startEdit = () => {
  isEditingRsvp.value = true;
};

const handleSubmit = async () => {
  if (!canSubmit.value) return;

  isLoading.value = true;

  const payload = {
    name: name.value,
    attendance: attendance.value,
    num_guests: finalGuestCount.value,
    additional_guest_names: null,
    guest_id: props.guestId || null,
  };

  let result;

  if (existingRsvp.value) {
    result = await supabase
      .from("rsvps")
      .update(payload)
      .eq("id", existingRsvp.value.id)
      .select()
      .single();
  } else {
    result = await supabase.from("rsvps").insert(payload).select().single();
  }

  const { data, error } = result;
  isLoading.value = false;

  if (error) {
    console.error("Error submitting RSVP:", error);
    alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
    return;
  }

  if (data) {
    existingRsvp.value = data as RSVP;
    isEditingRsvp.value = false;
  }

  isSubmitted.value = true;
  showPopup.value = true;

  setTimeout(() => {
    if (props.guestbookRef) {
      props.guestbookRef.scrollToLatest();
      props.guestbookRef.startAutoScroll();
    }
  }, 1500);
};

const closePopup = () => {
  showPopup.value = false;
};

const guestCountLabel = computed(() => {
  if (!existingRsvp.value) return "";
  const n = existingRsvp.value.num_guests;
  if (n === 0) return "";
  return `${n} Orang`;
});
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

      <div v-if="isLoadingCheck" class="mx-auto max-w-lg text-center">
        <div class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>

      <div
        v-else-if="existingRsvp && !isEditingRsvp"
        class="mx-auto max-w-lg"
        data-aos="fade-up"
      >
        <div class="rounded-2xl border border-sky-200 bg-sky-50/80 p-6 text-center shadow-sm">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-100">
            <CheckCircle class="h-7 w-7 text-sky-600" />
          </div>
          <h3 class="font-heading mb-4 text-lg font-semibold text-sky-800">
            Konfirmasi Kehadiran Sudah Terkirim
          </h3>
          <div class="space-y-2 text-sm text-sky-700">
            <p><span class="font-medium">Nama:</span> {{ existingRsvp.name }}</p>
            <p>
              <span class="font-medium">Status:</span>
              {{ existingRsvp.attendance === "hadir" ? "Hadir" : "Tidak Hadir" }}
            </p>
            <p v-if="existingRsvp.attendance === 'hadir'">
              <span class="font-medium">Jumlah Tamu:</span>
              {{ guestCountLabel }}
            </p>
          </div>
          <p class="mt-3 text-xs text-sky-600">
            Jika ada perubahan rencana, Anda dapat mengirim ulang konfirmasi.
          </p>
          <button
            @click="startEdit"
            class="mt-3 rounded-full border-2 border-sky-300 bg-white px-6 py-2 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-50"
          >
            Kirim Konfirmasi Lain
          </button>
        </div>
      </div>

      <div
        v-else
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
              :readonly="!!props.guestName"
              :class="{ 'cursor-not-allowed opacity-70': !!props.guestName }"
              required
            />
            <p v-if="props.guestName" class="text-primary mt-1.5 text-xs">
              <User class="mr-1 inline h-3 w-3" />
              Nama di bawah ini merupakan perwakilan tamu yang menerima undangan.
            </p>
          </div>

          <div>
            <label class="text-primary mb-2 block text-sm font-medium">
              Kehadiran
            </label>
            <div class="grid grid-cols-2 gap-4">
              <button
                type="button"
                @click="canSelectAttendance && (attendance = 'hadir')"
                class="flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 transition-all duration-200"
                :class="
                  attendance === 'hadir'
                    ? 'bg-primary border-primary text-white'
                    : canSelectAttendance
                      ? 'border-primary text-primary hover:bg-primary hover:text-white'
                      : 'border-primary text-primary cursor-not-allowed opacity-50'
                "
                :disabled="!canSelectAttendance"
              >
                <Heart class="h-5 w-5" />
                Hadir
              </button>
              <button
                type="button"
                @click="canSelectAttendance && (attendance = 'tidak_hadir')"
                class="flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 transition-all duration-200"
                :class="
                  attendance === 'tidak_hadir'
                    ? 'bg-primary border-primary text-white'
                    : canSelectAttendance
                      ? 'border-primary text-primary hover:bg-primary hover:text-white'
                      : 'border-primary text-primary cursor-not-allowed opacity-50'
                "
                :disabled="!canSelectAttendance"
              >
                <X class="h-5 w-5" />
                Tidak Hadir
              </button>
            </div>
            <p v-if="!canSelectAttendance" class="text-primary mt-2 text-xs">
              <User class="mr-1 inline h-3 w-3" />
              Mohon isi nama terlebih dahulu
            </p>
          </div>

          <div v-if="showGuestCount">
            <label class="text-primary mb-2 block text-sm font-medium">
              Jumlah Tamu yang Hadir
            </label>
            <select v-model="selectedGuestCount" class="input-field">
              <option value="1">1 Orang</option>
              <option value="2">2 Orang</option>
              <option value="3">3 Orang</option>
              <option value="4">4 Orang</option>
              <option value="more">Lebih dari 4 Orang</option>
            </select>
          </div>

          <div v-if="showCustomCount">
            <label class="text-primary mb-2 block text-sm font-medium">
              Jumlah Tamu yang Akan Hadir
            </label>
            <input
              v-model.number="customGuestCount"
              type="number"
              min="5"
              max="100"
              class="input-field"
            />
            <p
              v-if="customGuestCount < 5 || customGuestCount > 100"
              class="mt-1 text-xs text-red-500"
            >
              Minimal 5, maksimal 100 orang
            </p>
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
  </section>
</template>
