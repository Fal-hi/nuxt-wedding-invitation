<script setup lang="ts">
import { Heart } from "lucide-vue-next";

const emit = defineEmits<{
  openInvitation: [];
}>();

import { nextTick } from "vue";
import FormatDate from "~/utils/FormatDate.vue";

const scrollToContent = async () => {
  emit("openInvitation");
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 100));
  const content = document.getElementById("content");
  if (content) {
    content.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<template>
  <section
    class="relative flex min-h-screen items-center justify-center overflow-hidden"
  >
    <div class="bg-sky-gradient absolute inset-0"></div>

    <div class="absolute inset-0 opacity-30">
      <div
        class="absolute left-10 top-10 h-32 w-32 rounded-full bg-white blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-white blur-3xl"
      ></div>
      <div
        class="absolute left-1/4 top-1/2 h-24 w-24 rounded-full bg-white blur-2xl"
      ></div>
    </div>

    <div
      class="relative z-10 px-4 text-center"
      data-aos="fade-in"
      data-aos-duration="1500"
    >
      <p
        class="mb-4 text-sm font-medium uppercase tracking-widest text-white/90 md:text-base"
      >
        Undangan Pernikahan
      </p>

      <div class="mb-2 flex items-center justify-center gap-4">
        <div class="divider"></div>
        <Heart class="heart-beat" />
        <div class="divider"></div>
      </div>

      <div class="mb-4">
        <h1
          class="font-heading mr-40 text-4xl font-semibold text-white md:text-6xl lg:text-7xl"
        >
          RINA
        </h1>
        <span class="text-2xl font-light text-white md:text-6xl">&amp;</span>
        <h1
          class="font-heading ml-40 text-4xl font-semibold text-white md:text-6xl lg:text-7xl"
        >
          BUDI
        </h1>
      </div>

      <p class="mb-12 text-sm text-white/80 md:text-base">
        <FormatDate date="2026-06-28" :with-day="true" />
      </p>

      <button
        @click="scrollToContent"
        class="btn-primary text-lg shadow-2xl hover:shadow-sky-400/50 md:text-xl"
      >
        Buka Undangan
      </button>
    </div>

    <div class="absolute bottom-8 -translate-x-1/2 animate-bounce">
      <div
        class="flex h-10 w-6 justify-center rounded-full border-2 border-white/60 pt-2"
      >
        <div class="h-2 w-1 rounded-full bg-white/60"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.heart-beat {
  width: 20px;
  height: 20px;
  color: white;
  fill: currentColor;
  animation: heartBeat 1.8s ease-in-out infinite;
}

@keyframes heartBeat {
  0% {
    transform: scale(0.8);
    color: #f0f9ff;
  }
  25% {
    transform: scale(1.1);
    color: #0ea5e9;
  }
  50% {
    transform: scale(1.3);
    color: #0284c7;
  }
  75% {
    transform: scale(1.1);
    color: #0ea5e9;
  }
  100% {
    transform: scale(0.8);
    color: #f0f9ff;
  }
}
</style>
