<script setup lang="ts">
import { MapPin, Clock, Calendar } from "lucide-vue-next";

interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  mapsUrl: string;
}

const akadNikah: Event = {
  title: "Akad Nikah",
  date: "Minggu, 15 Juni 2025",
  time: "10:00 - 12:00 WIB",
  location: "Masjid Al-Hidayah",
  address: "Jl. Masjid No. 45, Jakarta Selatan",
  mapsUrl: "https://maps.google.com/?q=Masjid+Al-Hidayah+Jakarta",
};

const resepsi: Event = {
  title: "Resepsi",
  date: "Minggu, 15 Juni 2025",
  time: "12:00 - 16:00 WIB",
  location: "Gedung Serba Guna",
  address: "Jl. Raya Bogor Km. 25, Jakarta Timur",
  mapsUrl: "https://maps.google.com/?q=Gedung+Serba+Guna+Jakarta+Timur",
};

const events = [akadNikah, resepsi];

const openMaps = (url: string) => {
  window.open(url, "_blank");
};
</script>

<template>
  <section class="section bg-background">
    <div class="container-custom">
      <div class="mb-12 text-center" data-aos="fade-up">
        <h2 class="font-heading text-accent mb-2 text-2xl md:text-3xl">
          Waktu &amp; Tempat
        </h2>
        <div class="divider"></div>
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
                <p class="text-accent">{{ event.date }}</p>
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
