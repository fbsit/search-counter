// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nuxt-vitest'],
  css: ['~/assets/styles/main.scss'],
  alias: {
    '@': process.cwd(),
  },
  runtimeConfig: {
    public: { }
  }
})
