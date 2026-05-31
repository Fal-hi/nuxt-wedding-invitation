<script setup lang="ts">
import { Heart } from "lucide-vue-next";

const props = defineProps<{
  isOpened?: boolean;
  guestName?: string;
  guestTitle?: string;
}>();

const emit = defineEmits<{
  openInvitation: [];
}>();

import { nextTick } from "vue";
import type { WeddingInfo } from "~/types";
import FormatDate from "~/utils/FormatDate.vue";

const weddingInfo = useState<WeddingInfo>("weddingInfo");

const scrollToEventDetails = async () => {
  emit("openInvitation");
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 100));
  const eventDetails = document.getElementById("event-details");
  if (eventDetails) {
    eventDetails.scrollIntoView({ behavior: "smooth" });
  }
};

const scrollToContent = async () => {
  emit("openInvitation");
};
</script>

<template>
  <section
    class="relative flex min-h-screen items-center justify-center overflow-hidden"
  >
    <div class="bg-sky-gradient absolute"></div>

    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute left-10 top-10 h-32 w-32 transform-gpu rounded-full bg-white/30 blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 right-20 h-48 w-48 transform-gpu rounded-full bg-white/30 blur-3xl"
      ></div>
      <div
        class="absolute left-1/4 top-1/2 h-24 w-24 transform-gpu rounded-full bg-white/30 blur-2xl"
      ></div>
    </div>

    <div
      class="relative z-10 px-4 text-center"
      data-aos="fade-in"
      data-aos-duration="1500"
    >
      <Transition name="cover">
        <div v-if="!isOpened && guestName" class="mb-4 flex flex-col gap-2">
          <p
            class="text-primary-light text-xs font-medium uppercase tracking-[0.2em]"
          >
            Kepada Yth. {{ guestTitle }}
          </p>
          <p
            class="font-heading text-primary my-6 text-5xl font-semibold md:text-4xl lg:text-5xl"
          >
            {{ guestName }}
          </p>
          <div class="flex items-center justify-center gap-4 pt-2">
            <div class="divider"></div>
            <Heart class="heart-beat" />
            <div class="divider"></div>
          </div>
        </div>
      </Transition>

      <p
        class="text-primary-light mb-4 text-sm font-medium uppercase tracking-widest md:text-base"
      >
        Undangan Pernikahan
      </p>

      <Transition name="hero">
        <div v-if="isOpened">
          <div class="mb-2 flex items-center justify-center gap-4">
            <div class="divider"></div>
            <Heart class="heart-beat" />
            <div class="divider"></div>
          </div>

          <div class="mb-4">
            <h1
              class="font-heading text-primary mr-32 text-6xl font-semibold md:mr-40 md:text-6xl lg:text-7xl"
            >
              {{ weddingInfo?.bride_nickname }}
            </h1>
            <span class="text-primary-light text-3xl font-light md:text-6xl"
              >&amp;</span
            >
            <h1
              class="font-heading text-primary ml-32 text-6xl font-semibold md:ml-40 md:text-6xl lg:text-7xl"
            >
              {{ weddingInfo?.groom_nickname }}
            </h1>
          </div>

          <p class="text-primary-light mb-12 text-sm md:text-base">
            <FormatDate :date="weddingInfo?.wedding_date" :with-day="true" />
          </p>
        </div>
      </Transition>

      <button
        @click="isOpened ? scrollToEventDetails() : scrollToContent()"
        class="btn-primary mt-10 text-lg shadow-2xl hover:shadow-sky-400/50 md:text-xl"
      >
        {{ isOpened ? "Lihat Acara" : "Buka Undangan" }}
      </button>
    </div>

    <div
      v-if="isOpened"
      class="absolute bottom-8 -translate-x-1/2 animate-bounce"
    >
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

.cover-leave-active {
  transition:
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}
.cover-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}

.hero-enter-active {
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;
  transition-delay: 0.15s;
}
.hero-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
</style>
