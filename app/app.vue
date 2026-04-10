<script setup lang="ts">
import { ref, onMounted } from "vue";
import AOS from "aos";

import HeroSection from "~/components/HeroSection.vue";
import CountdownTimer from "~/components/CountdownTimer.vue";
import CoupleProfile from "~/components/CoupleProfile.vue";
import Gallery from "~/components/Gallery.vue";
import EventDetails from "~/components/EventDetails.vue";
import RSVPForm from "~/components/RSVPForm.vue";
import Guestbook from "~/components/Guestbook.vue";

const showContent = ref(false);
const galleryRef = ref<any>(null);
const guestbookRef = ref<any>(null);

onMounted(() => {
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: "ease-out-cubic",
  });
});

const handleOpenInvitation = () => {
  showContent.value = true;
  setTimeout(() => {
    if (galleryRef.value) {
      galleryRef.value.startAutoScroll();
    }
    if (guestbookRef.value) {
      guestbookRef.value.startAutoScroll();
    }
  }, 500);
};
</script>

<template>
  <div class="min-h-screen">
    <HeroSection @open-invitation="handleOpenInvitation" />

    <div v-show="showContent" id="content">
      <CountdownTimer />
      <CoupleProfile />
      <Gallery ref="galleryRef" />
      <EventDetails />
      <RSVPForm :guestbook-ref="guestbookRef" />
      <Guestbook ref="guestbookRef" />

      <footer class="section bg-accent text-center text-white">
        <div class="container-custom">
          <h3 class="font-heading mb-2 text-xl">Rina &amp; Budi</h3>
          <p class="text-primary-light mb-4 text-sm">
            Terima kasih atas doa dan kehadiran Anda
          </p>
          <div class="divider border-primary-dark mb-4"></div>
          <p class="text-muted text-xs">
            &copy; {{ new Date().getFullYear() }} Undangan Pernikahan oleh
            <NuxtLink
              href="https://fal-portfolio.vercel.app/"
              target="_blank"
              class="text-muted hover:text-primary-light underline transition-colors"
              >Syaifal Illahi</NuxtLink
            >. Dibuat dengan Hati.
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>
