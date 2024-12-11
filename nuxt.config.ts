// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/color-mode"],
  ssr: false,
  runtimeConfig: {
    public: {
      GROQ_API_KEY: process.env.GROQ_API_KEY,
    },
  },
  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {
        cssPath: ["~/assets/css/tailwind.css", { injectPosition: "first" }],
        configPath: "tailwind.config",
        exposeConfig: {
          level: 2,
        },
        config: {},
        viewer: true,
      },
      autoprefixer: {},
    },
  },

  colorMode: {
    classSuffix: "",
  },

  compatibilityDate: "2024-12-11",
});
