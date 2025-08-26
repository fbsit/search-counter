<template>
  <div class="layout-root">
    <NuxtRouteAnnouncer />
    <CountersHeader />
    <main>
      <slot />
    </main>
    <CountersFooter />
    <div v-if="toast" class="toast" role="status" aria-live="polite">
      {{ toast }}
      <button v-if="toastAction" type="button" class="btn secondary" style="margin-left:8px;" @click="onToastAction">{{ toastAction.label }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import CountersHeader from '../components/organisms/CountersHeader.vue'
import CountersFooter from '../components/organisms/CountersFooter.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const toast = computed(() => (store.state as any).ui?.toast)
const toastAction = computed(() => (store.state as any).ui?.toastAction)
function onToastAction() { store.dispatch('performToastAction') }
</script>

<style scoped>
.layout-root { min-height: 100vh; display: flex; flex-direction: column; }
main { flex: 1 0 auto; padding: 24px 16px 96px; }
</style>


