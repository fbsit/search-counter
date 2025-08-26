<template>
  <header class="site-header">
    <div class="header-wrap">
      <NuxtLink to="/" class="stack brand-row" style="gap:8px; align-items:center;">
        <span style="font-weight:700; font-size:18px;">Contadores</span>
      </NuxtLink>
    </div>
  </header>
  <div style="height:1px; background:#1f2430;" />
  <div class="spacer" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

onMounted(() => {
  store.dispatch('hydrateCounters')
  store.dispatch('hydrateFilters')
})
</script>

<style scoped>
.site-header { padding: 14px 0; position: sticky; top:0; backdrop-filter: saturate(140%) blur(8px); background: rgba(11,14,20,.75); z-index: 300; border-bottom: 1px solid rgba(124,92,255,.18); }
.header-wrap { display:flex; align-items:center; justify-content: space-between; width:100%; max-width:1100px; margin:0 auto; padding: 0 24px; }
.brand-row { flex: 1 1 auto; }
</style>


