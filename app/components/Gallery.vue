<script setup lang="ts">
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import type { Swiper as SwiperType } from "swiper/types";
import type { GalleryImage, Image } from "~/types";

import { computed } from "vue";

const modules = [Autoplay];

const serverImages = useState<GalleryImage[]>("galleryImages");

const galleryImages = computed<Image[]>(() => {
  if (serverImages.value && serverImages.value.length > 0) {
    return serverImages.value.map((img: GalleryImage) => ({
      src: img.image_url,
      alt: img.alt_text || "Gallery Image",
    }));
  }
  return [];
});

const isOpen = ref(false);
const currentImage = ref("");
const currentIndex = ref(0);
const swiperInstance = ref<SwiperType | null>(null);
const isAutoPlayStarted = ref(false);

const openLightbox = (index: number) => {
  currentIndex.value = index;
  currentImage.value = galleryImages.value[index]?.src || "";
  isOpen.value = true;
  document.body.style.overflow = "hidden";
  window.addEventListener("keydown", handleKeydown);
};

const closeLightbox = () => {
  isOpen.value = false;
  document.body.style.overflow = "";
  window.removeEventListener("keydown", handleKeydown);
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "ArrowLeft") {
    prevImage();
  } else if (e.key === "ArrowRight") {
    nextImage();
  } else if (e.key === "Escape") {
    closeLightbox();
  }
};

const prevImage = () => {
  currentIndex.value =
    currentIndex.value === 0
      ? galleryImages.value.length - 1
      : currentIndex.value - 1;
  currentImage.value = galleryImages.value[currentIndex.value]?.src || "";
};

const nextImage = () => {
  currentIndex.value =
    currentIndex.value === galleryImages.value.length - 1
      ? 0
      : currentIndex.value + 1;
  currentImage.value = galleryImages.value[currentIndex.value]?.src || "";
};

const onSwiper = (swiper: SwiperType) => {
  swiperInstance.value = swiper;
};

const startAutoScroll = () => {
  if (swiperInstance.value && !isAutoPlayStarted.value) {
    isAutoPlayStarted.value = true;
    swiperInstance.value.autoplay?.start();
  }
};

defineExpose({ startAutoScroll });
</script>

<style scoped>
.mySwiper {
  width: 100%;
  padding: 1rem 0;
}

:deep(.swiper-wrapper) {
  transition-timing-function: linear;
}

:deep(.swiper-slide) {
  height: 250px;
}
</style>

<template>
  <section class="section relative overflow-hidden">
    <div class="absolute inset-0 opacity-30">
      <div class="absolute left-20 top-12 h-40 w-40 rounded-full bg-white blur-3xl"></div>
      <div class="absolute bottom-16 right-10 h-32 w-32 rounded-full bg-white blur-3xl"></div>
      <div class="absolute left-1/2 top-1/3 h-24 w-24 rounded-full bg-white blur-2xl"></div>
    </div>
    <div class="container-custom relative z-10">
      <div class="mb-12 text-center" data-aos="fade-up">
        <h2 class="font-heading text-accent mb-2 text-2xl md:text-3xl">
          Gallery
        </h2>
        <div class="divider"></div>
      </div>

      <swiper
        :modules="modules"
        :slides-per-view="4"
        :space-between="20"
        :loop="true"
        :autoplay="{
          delay: 0,
          disableOnInteraction: false,
        }"
        :speed="4000"
        @swiper="onSwiper"
        :breakpoints="{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }"
        class="mySwiper"
      >
        <swiper-slide
          v-for="(image, index) in galleryImages"
          :key="index"
          class="cursor-pointer"
        >
          <div
            class="overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            @click="openLightbox(index)"
          >
            <img
              :src="image.src"
              :alt="image.alt"
              class="h-[250px] w-full object-cover"
              loading="lazy"
            />
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <Teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        @click.self="closeLightbox"
      >
        <div
          class="relative flex max-h-[90vh] w-full max-w-4xl items-center justify-center"
        >
          <!-- Previous Button -->
          <button
            class="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 md:left-8"
            @click="prevImage"
          >
            ←
          </button>

          <!-- Image -->
          <img
            :src="currentImage"
            alt="Gallery preview"
            class="max-h-[80vh] max-w-full rounded-lg object-contain"
          />

          <!-- Next Button -->
          <button
            class="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 md:right-8"
            @click="nextImage"
          >
            →
          </button>

          <!-- Close Button -->
          <button
            class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
            @click="closeLightbox"
          >
            ✕
          </button>
        </div>
      </div>
    </Teleport>
  </section>
</template>
