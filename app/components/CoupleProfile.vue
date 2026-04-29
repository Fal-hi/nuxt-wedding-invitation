<script setup lang="ts">
import { Heart } from "lucide-vue-next";
import { computed } from "vue";
import type { CoupleMember, WeddingInfo } from "~/types";

const weddingInfo = useState<WeddingInfo>("weddingInfo");

const bride = computed<CoupleMember>(() => ({
  name: weddingInfo.value?.bride_name || "-",
  photo: weddingInfo.value?.bride_photo || "-",
  bride_mother: weddingInfo.value?.bride_mother || "-",
  bride_father: weddingInfo.value?.bride_father || "-",
}));

const groom = computed<CoupleMember>(() => ({
  name: weddingInfo.value?.groom_name || "-",
  photo: weddingInfo.value?.groom_photo || "-",
  groom_mother: weddingInfo.value?.groom_mother || "-",
  groom_father: weddingInfo.value?.groom_father || "-",
}));
</script>

<template>
  <section class="section relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute right-10 top-16 h-36 w-36 rounded-full bg-white/30 blur-3xl transform-gpu"
      ></div>
      <div
        class="absolute bottom-10 left-20 h-40 w-40 rounded-full bg-white/30 blur-3xl transform-gpu"
      ></div>
      <div
        class="absolute right-1/3 top-1/2 h-28 w-28 rounded-full bg-white/30 blur-2xl transform-gpu"
      ></div>
    </div>
    <div class="container-custom relative z-10">
      <div class="mb-12 text-center" data-aos="fade-up">
        <h2 class="font-heading text-accent mb-2 text-2xl md:text-3xl">
          Mempelai
        </h2>
        <div class="divider"></div>
      </div>

      <div
        class="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-16"
      >
        <div class="text-center" data-aos="fade-right" data-aos-delay="200">
          <div
            class="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full shadow-lg md:h-40 md:w-40"
          >
            <img
              :src="bride.photo"
              :alt="bride.name"
              class="h-full w-full object-cover"
            />
          </div>
          <h3 class="font-heading text-accent mb-2 text-xl md:text-2xl">
            {{ bride.name }}
          </h3>
          <p
            class="text-primary-light mx-auto max-w-[250px] text-sm leading-relaxed"
          >
            Putri dari Bpk. {{ bride.bride_father }} & Ibu
            {{ bride.bride_mother }}
          </p>
        </div>

        <div class="hidden md:block" data-aos="fade-up" data-aos-delay="400">
          <Heart class="text-muted fill-muted-light h-12 w-12" />
        </div>

        <div class="text-center" data-aos="fade-left" data-aos-delay="200">
          <div
            class="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full shadow-lg md:h-40 md:w-40"
          >
            <img
              :src="groom.photo"
              :alt="groom.name"
              class="h-full w-full object-cover"
            />
          </div>
          <h3 class="font-heading text-accent mb-2 text-xl md:text-2xl">
            {{ groom.name }}
          </h3>
          <p
            class="text-primary-light mx-auto max-w-[250px] text-sm leading-relaxed"
          >
            Putra dari Bpk. {{ groom.groom_father }} & Ibu
            {{ groom.groom_mother }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
