// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: false,
  app: {
    cdnURL: "/yuipapa-learn/",
  },
  $production: {
    vite: {
      define: {
        __debug__: "false",
      },
    },
  },
  $development: {
    vite: {
      define: {
        __debug__: "true",
      },
    },
  },
});
