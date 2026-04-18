<script setup lang="ts">
import { ref } from "vue";
import { Music } from "lucide-vue-next";

const config = useRuntimeConfig();
const isPlaying = ref(false);
const audioRef = ref<HTMLAudioElement | null>(null);

const musicUrl = `${config.public.supabaseUrl}/storage/v1/object/public/music/music.mp3`;

const togglePlay = () => {
  if (audioRef.value) {
    if (isPlaying.value) {
      audioRef.value.pause();
    } else {
      audioRef.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
};

const startMusic = () => {
  if (audioRef.value && !isPlaying.value) {
    audioRef.value.play();
    isPlaying.value = true;
  }
};

const stopMusic = () => {
  if (audioRef.value && isPlaying.value) {
    audioRef.value.pause();
    isPlaying.value = false;
  }
};

const handleEnded = () => {
  if (audioRef.value) {
    audioRef.value.currentTime = 0;
    audioRef.value.play();
  }
};

defineExpose({ startMusic, stopMusic, isPlaying });
</script>

<template>
  <div class="fixed bottom-6 right-8 z-40">
    <audio ref="audioRef" :src="musicUrl" @ended="handleEnded" loop></audio>
    <button @click="togglePlay" :class="isPlaying ? 'animate-pulse' : ''">
      <Music
        class="h-5 w-5"
        :class="{ 'fill-primary text-primary': isPlaying }"
      />
    </button>
  </div>
</template>
