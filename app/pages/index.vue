<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Heart } from "lucide-vue-next";
import AOS from "aos";

import HeroSection from "~/components/HeroSection.vue";
import CountdownTimer from "~/components/CountdownTimer.vue";
import CoupleProfile from "~/components/CoupleProfile.vue";
import Gallery from "~/components/Gallery.vue";
import EventDetails from "~/components/EventDetails.vue";
import RSVPForm from "~/components/RSVPForm.vue";
import GiftSection from "~/components/GiftSection.vue";
import Guestbook from "~/components/Guestbook.vue";
import CloudParallax from "~/components/CloudParallax.vue";

const showContent = ref(false);
const galleryRef = ref<any>(null);
const guestbookRef = ref<any>(null);

const weddingInfo = useState<any>("weddingInfo", () => null);
const galleryImages = useState<any[]>("galleryImages", () => []);
const isAppLoading = ref(true);
const supabase = useSupabase();

onMounted(async () => {
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: "ease-out-cubic",
  });

  try {
    const [infoRes, galleryRes] = await Promise.all([
      supabase.from("wedding_info").select("*").maybeSingle(),
      supabase
        .from("gallery")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);

    if (!infoRes.error && infoRes.data) {
      weddingInfo.value = infoRes.data;
    }
    if (!galleryRes.error && galleryRes.data) {
      galleryImages.value = galleryRes.data;
    }
  } catch (err) {
    console.error("Error loading application data:", err);
  } finally {
    setTimeout(() => {
      isAppLoading.value = false;
    }, 1000);
  }
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
  <CloudParallax />

  <div
    v-if="isAppLoading"
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
  >
    <div class="absolute inset-0 z-0 opacity-30">
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

    <div class="relative z-10 flex flex-col items-center">
      <div class="mb-8">
        <div class="relative">
          <div class="absolute inset-0 animate-ping opacity-30">
            <Heart class="h-16 w-16 fill-white text-white" />
          </div>
          <Heart
            class="relative h-16 w-16 animate-bounce fill-white text-white"
          />
        </div>
      </div>

      <div class="mb-2">
        <h1
          class="font-heading text-4xl font-semibold text-white drop-shadow-md"
        >
          Undangan Pernikahan
        </h1>
      </div>

      <p class="mb-8 text-white/90">Mohon tunggu sebentar...</p>

      <div class="flex gap-2">
        <div
          class="h-2 w-2 animate-bounce rounded-full bg-white shadow-sm"
          style="animation-delay: 0ms"
        ></div>
        <div
          class="h-2 w-2 animate-bounce rounded-full bg-white shadow-sm"
          style="animation-delay: 150ms"
        ></div>
        <div
          class="h-2 w-2 animate-bounce rounded-full bg-white shadow-sm"
          style="animation-delay: 300ms"
        ></div>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen">
    <HeroSection
      :is-opened="showContent"
      @open-invitation="handleOpenInvitation"
    />

    <div v-show="showContent" id="content">
      <CountdownTimer />
      <CoupleProfile />
      <Gallery ref="galleryRef" />
      <EventDetails id="event-details" />
      <RSVPForm :guestbook-ref="guestbookRef" />
      <GiftSection />
      <Guestbook ref="guestbookRef" />

      <footer class="section relative overflow-hidden text-center">
        <div class="absolute inset-0 opacity-30">
          <div
            class="absolute right-10 top-8 h-28 w-28 rounded-full bg-white blur-3xl"
          ></div>
          <div
            class="absolute bottom-8 left-16 h-32 w-32 rounded-full bg-white blur-3xl"
          ></div>
        </div>
        <div class="container-custom relative z-10">
          <h3 class="font-heading text-accent mb-2 text-xl">
            {{ weddingInfo?.bride_name?.split(" ")[0] || "Rina" }} &amp;
            {{ weddingInfo?.groom_name?.split(" ")[0] || "Budi" }}
          </h3>
          <p class="text-primary mb-4 text-sm">
            Terima kasih atas doa dan kehadiran Anda
          </p>
          <div class="divider border-primary-dark mb-4"></div>
          <p class="text-primary text-xs">
            &copy; {{ new Date().getFullYear() }} Undangan Pernikahan oleh
            <NuxtLink
              href="https://fal-portfolio.vercel.app/"
              target="_blank"
              class="text-primary hover:text-primary-light underline transition-colors"
              >Syaifal Illahi</NuxtLink
            >. Dibuat dengan Hati.
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>
