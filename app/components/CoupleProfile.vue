<script setup lang="ts">
import { Heart } from "lucide-vue-next";

interface CoupleMember {
  name: string;
  parents: string;
  photo?: string;
}

const bride: CoupleMember = {
  name: "Rina Susilowati",
  parents: "Putri dari Bpk. H. Suharto & Ibu Hj. Siti Aminah",
  photo:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
};

const groom: CoupleMember = {
  name: "Budi Santoso",
  parents: "Putra dari Bpk. H. Marzuki & Ibu Hj. Hartati",
  photo:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
};
</script>

<template>
  <section class="section bg-surface">
    <div class="container-custom">
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
            {{ bride.parents }}
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
            {{ groom.parents }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
