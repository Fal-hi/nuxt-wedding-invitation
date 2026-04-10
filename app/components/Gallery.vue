<script setup lang="ts">
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import type { Swiper as SwiperType } from "swiper/types";

interface GalleryImage {
  src: string;
  alt: string;
}

const modules = [Autoplay];

const galleryImages: GalleryImage[] = [
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop",
    alt: "Pre-wedding 1",
  },
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=600&fit=crop",
    alt: "Pre-wedding 2",
  },
  {
    src: "https://images.unsplash.com/photo-1522673607200-1645062cd958?w=400&h=600&fit=crop",
    alt: "Pre-wedding 3",
  },
  {
    src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=600&fit=crop",
    alt: "Pre-wedding 4",
  },
  {
    src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=600&fit=crop",
    alt: "Pre-wedding 5",
  },
  {
    src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=600&fit=crop",
    alt: "Pre-wedding 6",
  },
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=600&fit=crop",
    alt: "Pre-wedding 7",
  },
  {
    src: "https://images.unsplash.com/photo-1522673607200-1645062cd958?w=400&h=600&fit=crop",
    alt: "Pre-wedding 8",
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop",
    alt: "Pre-wedding 9",
  },
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=600&fit=crop",
    alt: "Pre-wedding 10",
  },
  {
    src: "https://images.unsplash.com/photo-1522673607200-1645062cd958?w=400&h=600&fit=crop",
    alt: "Pre-wedding 11",
  },
  {
    src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=600&fit=crop",
    alt: "Pre-wedding 12",
  },
];

const isOpen = ref(false);
const currentImage = ref("");
const currentIndex = ref(0);
const swiperInstance = ref<SwiperType | null>(null);
const isAutoPlayStarted = ref(false);

const openLightbox = (index: number) => {
  currentIndex.value = index;
  currentImage.value = galleryImages[index]?.src || "";
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
      ? galleryImages.length - 1
      : currentIndex.value - 1;
  currentImage.value = galleryImages[currentIndex.value]?.src || "";
};

const nextImage = () => {
  currentIndex.value =
    currentIndex.value === galleryImages.length - 1
      ? 0
      : currentIndex.value + 1;
  currentImage.value = galleryImages[currentIndex.value]?.src || "";
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
  <section class="section bg-background">
    <div class="container-custom">
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
