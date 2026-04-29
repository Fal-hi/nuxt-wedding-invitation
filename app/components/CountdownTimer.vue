<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import FormatNumber from "~/utils/FormatNumber.vue";
import type { TimeLeft, WeddingInfo } from "~/types";

const weddingInfo = useState<WeddingInfo>("weddingInfo");
const targetDateStr = weddingInfo.value?.wedding_date;
const targetDate = new Date(targetDateStr).getTime();
const timeLeft = ref<TimeLeft>({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

let intervalId: ReturnType<typeof setInterval> | null = null;

const calculateTimeLeft = () => {
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference > 0) {
    timeLeft.value = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      ),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }
};

onMounted(() => {
  calculateTimeLeft();
  intervalId = setInterval(calculateTimeLeft, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <section class="section relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute left-10 top-10 h-32 w-32 rounded-full bg-white/30 blur-3xl transform-gpu"></div>
      <div class="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-white/30 blur-3xl transform-gpu"></div>
      <div class="absolute left-1/4 top-1/2 h-24 w-24 rounded-full bg-white/30 blur-2xl transform-gpu"></div>
    </div>
    <div class="container-custom relative z-10 text-center">
      <h2
        class="font-heading text-accent mb-2 text-2xl md:text-3xl"
        data-aos="fade-up"
      >
        Menuju Hari Bahagia
      </h2>
      <div class="divider mb-8"></div>

      <div
        class="flex flex-wrap justify-center gap-4 md:gap-8"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div class="card min-w-[100px] text-center md:min-w-[120px]">
          <div class="font-heading text-primary text-3xl font-bold md:text-5xl">
            <FormatNumber :value="timeLeft.days" />
          </div>
          <div
            class="text-muted mt-1 text-xs uppercase tracking-wide md:text-sm"
          >
            Hari
          </div>
        </div>

        <div class="card min-w-[100px] text-center md:min-w-[120px]">
          <div class="font-heading text-primary text-3xl font-bold md:text-5xl">
            <FormatNumber :value="timeLeft.hours" />
          </div>
          <div
            class="text-muted mt-1 text-xs uppercase tracking-wide md:text-sm"
          >
            Jam
          </div>
        </div>

        <div class="card min-w-[100px] text-center md:min-w-[120px]">
          <div class="font-heading text-primary text-3xl font-bold md:text-5xl">
            <FormatNumber :value="timeLeft.minutes" />
          </div>
          <div
            class="text-muted mt-1 text-xs uppercase tracking-wide md:text-sm"
          >
            Menit
          </div>
        </div>

        <div class="card min-w-[100px] text-center md:min-w-[120px]">
          <div class="font-heading text-primary text-3xl font-bold md:text-5xl">
            <FormatNumber :value="timeLeft.seconds" />
          </div>
          <div
            class="text-muted mt-1 text-xs uppercase tracking-wide md:text-sm"
          >
            Detik
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
