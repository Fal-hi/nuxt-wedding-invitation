<script setup lang="ts">
import { MapPin, Clock, Calendar } from "lucide-vue-next";
import FormatDate from "~/utils/FormatDate.vue";

import type { WeddingInfo, Event } from "~/types";

import { computed } from "vue";

defineProps<{
  id?: string;
}>();

const weddingInfo = useState<WeddingInfo>("weddingInfo");

const akadNikah = computed<Event>(() => ({
  title: "Akad Nikah",
  date: weddingInfo.value?.wedding_date || "-",
  time: weddingInfo.value?.akad_time || "-",
  location: weddingInfo.value?.akad_location || "-",
  address: weddingInfo.value?.akad_address || "-",
  mapsUrl: weddingInfo.value?.akad_maps_url || "-",
}));

const resepsi = computed<Event>(() => ({
  title: "Resepsi",
  date: weddingInfo.value?.wedding_date || "-",
  time: weddingInfo.value?.resepsi_time || "-",
  location: weddingInfo.value?.resepsi_location || "-",
  address: weddingInfo.value?.resepsi_address || "-",
  mapsUrl: weddingInfo.value?.resepsi_maps_url || "-",
}));

const events = computed(() => [akadNikah.value, resepsi.value]);

const openMaps = (url: string) => {
  window.open(url, "_blank");
};
</script>

<template>
  <section :id="id" class="section relative overflow-hidden">
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
    <div class="container-custom relative z-10">
      <div class="mb-12 text-center" data-aos="fade-up">
        <h2 class="font-heading text-accent mb-2 text-2xl md:text-3xl">
          Waktu &amp; Tempat
        </h2>
        <div class="divider"></div>
        <p class="text-primary-light mt-4 text-sm">
          Berikut adalah jadwal &amp; tempat acara pernikahan kami
        </p>
      </div>

      <div class="grid gap-8 md:grid-cols-2">
        <div
          v-for="(event, index) in events"
          :key="event.title"
          class="card"
          :data-aos="index === 0 ? 'fade-right' : 'fade-left'"
          :data-aos-delay="index * 200"
        >
          <h3
            class="font-heading text-accent mb-6 text-center text-xl md:text-2xl"
          >
            {{ event.title }}
          </h3>

          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <Calendar class="text-muted mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <p class="text-muted text-sm font-medium">Tanggal</p>
                <FormatDate
                  :date="event.date"
                  :with-day="true"
                  class="text-accent"
                />
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Clock class="text-muted mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <p class="text-muted text-sm font-medium">Waktu</p>
                <p class="text-accent">{{ event.time }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <MapPin class="text-muted mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <p class="text-muted text-sm font-medium">Tempat</p>
                <p class="text-accent">{{ event.location }}</p>
                <p class="text-primary-light text-sm">{{ event.address }}</p>
              </div>
            </div>
          </div>

          <button
            class="btn-secondary mt-6 flex w-full items-center justify-center gap-2"
            @click="openMaps(event.mapsUrl)"
          >
            <MapPin class="h-4 w-4" />
            Buka Maps
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
