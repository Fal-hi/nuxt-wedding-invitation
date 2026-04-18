<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { MessageSquare, Send, X, Heart, User } from "lucide-vue-next";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import type { SwiperSlideProps } from "swiper/react";
import FormatDate from "~/utils/FormatDate.vue";
import type { Wish } from "~/types";

const emit = defineEmits<{
  wishAdded: [name: string, message: string];
}>();

const supabase = useSupabase();

const swiperInstance = ref<SwiperSlideProps | null>(null);
const isAutoPlayStarted = ref(false);

const selectedWish = ref<Wish | null>(null);
const isModalOpen = ref(false);
const showSuccessPopup = ref(false);
const successPopupData = ref({ name: "", message: "" });

const canSubmit = computed(() => wishName.value && newWish.value);

const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper;
};

const startAutoScroll = () => {
  if (swiperInstance.value && !isAutoPlayStarted.value) {
    isAutoPlayStarted.value = true;
    swiperInstance.value.autoplay.start();
  }
};

const scrollToLatest = () => {
  if (swiperInstance.value) {
    const el = document.querySelector(".swiper-wishes");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
};

defineExpose({ startAutoScroll, scrollToLatest });

const openModal = (wish: Wish) => {
  selectedWish.value = wish;
  isModalOpen.value = true;
  document.body.style.overflow = "hidden";
  window.addEventListener("keydown", handleKeydown);
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = "";
  window.removeEventListener("keydown", handleKeydown);
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    closeModal();
  }
};

const wishes = ref<Wish[]>([]);
const isLoadingInitial = ref(true);
let realtimeChannel: any = null;

const fetchWishes = async () => {
  isLoadingInitial.value = true;
  const { data, error } = await supabase
    .from("wishes")
    .select("*")
    .order("created_at", { ascending: false });

  if (!error && data) {
    wishes.value = data.map((wish: any) => ({
      id: wish.id,
      name: wish.name,
      message: wish.message,
      created_at: wish.created_at,
    }));
  } else {
    console.error("Error fetching wishes:", error);
  }
  isLoadingInitial.value = false;
};

const subscribeToWishes = () => {
  realtimeChannel = supabase
    .channel("wishes-realtime")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "wishes",
      },
      (payload: any) => {
        const newWish = payload.new;
        const exists = wishes.value.some((w) => w.id === newWish.id);
        if (!exists) {
          wishes.value.unshift({
            id: newWish.id,
            name: newWish.name,
            message: newWish.message,
            created_at: newWish.created_at,
          });
        }
      },
    )
    .subscribe();
};

onMounted(() => {
  fetchWishes();
  subscribeToWishes();
});

onUnmounted(() => {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
  }
});

const newWish = ref("");
const wishName = ref("");
const isSubmitting = ref(false);

const addWish = async () => {
  if (wishName.value && newWish.value) {
    isSubmitting.value = true;

    const { data, error } = await supabase
      .from("wishes")
      .insert({
        name: wishName.value,
        message: newWish.value,
      })
      .select()
      .single();

    isSubmitting.value = false;

    if (error) {
      console.error("Error submitting wish:", error);
      alert("Gagal mengirim ucapan. Silakan coba lagi.");
      return;
    }

    if (data) {
      const newEntry = {
        id: data.id,
        name: data.name,
        message: data.message,
        created_at: data.created_at,
      };

      const exists = wishes.value.some((w) => w.id === newEntry.id);
      if (!exists) {
        wishes.value.unshift(newEntry);
      }

      successPopupData.value = {
        name: data.name,
        message: data.message,
      };
      showSuccessPopup.value = true;
    }

    newWish.value = "";
    wishName.value = "";
    emit(
      "wishAdded",
      data?.name || wishName.value,
      data?.message || newWish.value,
    );
  }
};

const showSwiper = computed(() => wishes.value.length > 0);

const closeSuccessPopup = () => {
  showSuccessPopup.value = false;
  successPopupData.value = { name: "", message: "" };
};
</script>

<style scoped>
:deep(.swiper-wrapper) {
  transition-timing-function: linear;
}

:deep(.swiper-slide) {
  height: auto;
}
</style>

<template>
  <section class="section relative overflow-hidden">
    <div class="absolute inset-0 opacity-30">
      <div
        class="absolute left-10 top-20 h-32 w-32 rounded-full bg-white blur-3xl"
      ></div>
      <div
        class="absolute bottom-16 right-12 h-40 w-40 rounded-full bg-white blur-3xl"
      ></div>
      <div
        class="absolute left-1/2 top-1/4 h-24 w-24 rounded-full bg-white blur-2xl"
      ></div>
    </div>
    <div class="container-custom relative z-10">
      <div class="mb-12 text-center" data-aos="fade-up">
        <h2 class="font-heading text-accent mb-2 text-2xl md:text-3xl">
          Ucapan &amp; Doa
        </h2>
        <div class="divider"></div>
        <p class="text-primary-light mt-4 text-sm">
          Tuliskan ucapan dan doa terbaik untuk kami
        </p>
      </div>

      <div
        class="mx-auto mb-12 max-w-lg"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <form @submit.prevent="addWish" class="space-y-4">
          <input
            v-model="wishName"
            type="text"
            class="input-field"
            placeholder="Nama Anda"
            required
          />
          <div class="relative">
            <textarea
              v-model="newWish"
              class="input-field min-h-[100px] resize-none"
              placeholder="Tuliskan ucapan atau doa..."
              required
            ></textarea>
            <p v-if="!canSubmit" class="text-primary text-xs">
              <User class="mr-1 inline h-3 w-3" />
              Mohon isi nama dan ucapan/doa terlebih dahulu
            </p>
          </div>
          <button
            type="submit"
            class="btn-primary flex w-full items-center justify-center gap-2"
            :class="{
              'cursor-not-allowed opacity-50': !canSubmit || isSubmitting,
            }"
            :disabled="!canSubmit || isSubmitting"
          >
            <Send v-if="!isSubmitting" class="h-5 w-5" />
            <span
              v-if="isSubmitting"
              class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></span>
            {{ isSubmitting ? "Mengirim..." : "Kirim Ucapan" }}
          </button>
        </form>
      </div>

      <div
        v-if="isLoadingInitial"
        class="text-primary-light mx-auto max-w-2xl py-8 text-center"
      >
        Memuat ucapan...
      </div>
      <Swiper
        v-else-if="showSwiper"
        :modules="[Autoplay]"
        :autoplay="{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }"
        direction="vertical"
        :slides-per-view="3"
        :space-between="40"
        :speed="4000"
        :loop="true"
        @swiper="onSwiper"
        class="swiper-wishes mx-auto max-h-[300px] max-w-2xl"
      >
        <SwiperSlide v-for="wish in wishes" :key="wish.id">
          <div
            class="card max-h-[130px] cursor-pointer overflow-hidden"
            @click="openModal(wish)"
          >
            <div class="flex items-start gap-3">
              <div
                class="bg-muted-light flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
              >
                <MessageSquare class="text-muted h-5 w-5" />
              </div>
              <div class="flex-1 overflow-hidden">
                <div class="mb-1 flex items-center justify-between">
                  <h4 class="text-accent truncate font-medium">
                    {{ wish.name }}
                  </h4>
                  <FormatDate
                    :date="wish.created_at"
                    :with-day="true"
                    class="text-muted flex-shrink-0 text-xs"
                  />
                </div>
                <p class="text-primary-light line-clamp-1 text-sm">
                  {{ wish.message }}
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <div v-else class="mx-auto max-w-2xl space-y-4">
        <div
          v-for="wish in wishes"
          :key="wish.id"
          class="card cursor-pointer"
          data-aos="fade-up"
          :data-aos-delay="100"
          @click="openModal(wish)"
        >
          <div class="flex items-start gap-3">
            <div
              class="bg-muted-light flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
            >
              <MessageSquare class="text-muted h-5 w-5" />
            </div>
            <div class="flex-1 overflow-hidden">
              <div class="mb-1 flex items-center justify-between">
                <h4 class="text-accent truncate font-medium">
                  {{ wish.name }}
                </h4>
                <FormatDate
                  :date="wish.created_at"
                  :with-day="true"
                  class="text-muted flex-shrink-0 text-xs"
                />
              </div>
              <p class="text-primary-light line-clamp-2 text-sm">
                {{ wish.message }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Teleport to="body">
        <div
          v-if="isModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          @click.self="closeModal"
        >
          <div class="card relative w-full max-w-lg rounded-2xl bg-white p-6">
            <button
              class="bg-muted-light text-muted hover:bg-muted absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:text-white"
              @click="closeModal"
            >
              <X class="h-5 w-5" />
            </button>
            <div class="flex items-start gap-4">
              <div
                class="bg-muted-light flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full"
              >
                <MessageSquare class="text-muted h-7 w-7" />
              </div>
              <div class="flex-1">
                <h3 class="text-accent font-heading mb-1 text-xl font-medium">
                  {{ selectedWish?.name }}
                </h3>
                <FormatDate
                  :date="String(selectedWish?.created_at)"
                  :with-day="true"
                  class="text-muted flex-shrink-0 text-xs"
                />
                <p class="text-primary-light whitespace-pre-wrap">
                  {{ selectedWish?.message }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Teleport>

      <Teleport to="body">
        <div
          v-if="showSuccessPopup"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          @click.self="closeSuccessPopup"
        >
          <div
            class="card relative w-full max-w-lg rounded-2xl bg-white p-6 text-center"
          >
            <div
              class="bg-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            >
              <Heart class="h-8 w-8 fill-white text-white" />
            </div>
            <h3 class="font-heading text-primary mb-2 text-xl">
              Terima Kasih!
            </h3>
            <p class="text-primary-light mb-4">
              Ucapan dan Doa Anda telah kami terima.
            </p>
            <div
              class="bg-muted-light text-accent mb-4 rounded-lg p-3 text-center font-medium"
            >
              "{{ successPopupData.name }}"
            </div>
            <p class="text-primary line-clamp-3 text-sm">
              "{{ successPopupData.message }}"
            </p>
            <p class="text-muted mt-4 text-sm">
              Klik di mana saja untuk menutup
            </p>
          </div>
        </div>
      </Teleport>
    </div>
  </section>
</template>
