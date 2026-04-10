<script setup lang="ts">
import { ref, computed } from "vue";
import { MessageSquare, Send, X, Heart } from "lucide-vue-next";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import type { SwiperSlideProps } from "swiper/react";
import FormatDate from "~/utils/FormatDate.vue";

const emit = defineEmits<{
  wishAdded: [name: string, message: string];
}>();

const swiperInstance = ref<SwiperSlideProps | null>(null);
const isAutoPlayStarted = ref(false);

const selectedWish = ref<Wish | null>(null);
const isModalOpen = ref(false);

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

interface Wish {
  id: number;
  name: string;
  message: string;
  date: string;
}

const wishes = ref<Wish[]>([
  {
    id: 1,
    name: "Bpk. H. Ahmad",
    message:
      "Selamat menempuh hidup baru. Semoga menjadi keluarga sakinah mawaddah warahmah dan menjadi contoh bagi sesama umat manusia yang baik dan benar.",
    date: "2026-06-10",
  },
  {
    id: 2,
    name: "Ibu Siti",
    message:
      "Selamat ya! Wish you all the best dalam perjalanan hidup kalian. Dan semoga selalu dalam lindungan Allah SWT.",
    date: "2026-06-11",
  },
  {
    id: 3,
    name: "Keluarga Besar Jakarta",
    message: "Selamat menikah! Happy wedding!",
    date: "2026-06-12",
  },
  {
    id: 4,
    name: "Keluarga Ganesha Operation",
    message:
      "Selamat menempuh hidup baru. Semoga menjadi keluarga sakinah mawaddah warahmah dan menjadi contoh bagi sesama umat manusia yang baik dan benar.",
    date: "2026-06-13",
  },
  {
    id: 5,
    name: "Mamank Racing",
    message: "Happy Racing!",
    date: "2026-06-14",
  },
]);

const newWish = ref("");
const wishName = ref("");

const addWish = () => {
  if (wishName.value && newWish.value) {
    wishes.value.unshift({
      id: Date.now(),
      name: wishName.value,
      message: newWish.value,
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    });
    newWish.value = "";
    wishName.value = "";
  }
};

const showSwiper = computed(() => wishes.value.length > 0);
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
  <section class="section bg-background">
    <div class="container-custom">
      <div class="mb-12 text-center" data-aos="fade-up">
        <h2 class="font-heading text-accent mb-2 text-2xl md:text-3xl">
          Ucapan &amp; Doa
        </h2>
        <div class="divider"></div>
        <p class="text-primary-light mt-4">
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
          <textarea
            v-model="newWish"
            class="input-field min-h-[100px] resize-none"
            placeholder="Tuliskan ucapan atau doa..."
            required
          ></textarea>
          <button
            type="submit"
            class="btn-primary flex w-full items-center justify-center gap-2"
            :class="{ 'cursor-not-allowed opacity-50': !canSubmit }"
            :disabled="!canSubmit"
          >
            <Send class="h-5 w-5" />
            Kirim Ucapan
          </button>
        </form>
      </div>

      <Swiper
        v-if="showSwiper"
        :modules="[Autoplay]"
        :autoplay="{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }"
        direction="vertical"
        :slides-per-view="4"
        :space-between="60"
        :speed="3000"
        :loop="true"
        @swiper="onSwiper"
        class="swiper-wishes mx-auto max-h-[400px] max-w-2xl"
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
                    :date="wish.date"
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
                <span class="text-muted flex-shrink-0 text-xs">{{
                  wish.date
                }}</span>
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
                <span class="text-muted mb-4 block text-xs">{{
                  selectedWish?.date
                }}</span>
                <p class="text-primary-light whitespace-pre-wrap">
                  {{ selectedWish?.message }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </section>
</template>
