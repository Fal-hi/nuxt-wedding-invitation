// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      "Playfair Display": [400, 500, 600, 700],
      Inter: [300, 400, 500, 600],
      "Cormorant Garamond": [400, 500, 600],
    },
    display: "swap",
  },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      title: "Undangan Pernikahan - Biru Langit",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Undangan Pernikahan - Biru Langit" },
      ],
    },
  },
  nitro: {
    preset: "vercel",
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
});
