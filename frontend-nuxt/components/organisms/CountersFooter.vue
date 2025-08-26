<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="brand-block">
        <div class="brand">Contadores</div>
        <div class="muted">Suma de valores</div>
      </div>
      <div class="total-box">Suma: <strong>{{ total }}</strong></div>
      <div class="copy muted">© {{ year }} · Nuxt 3 + Vuex</div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
const year = new Date().getFullYear()
const store = useStore()
const total = computed(() => store.getters.total)
</script>

<style scoped>
.site-footer { margin-top: 48px; padding: 28px 0; border-top: 3px solid #7c5cff; background: radial-gradient(800px 300px at 100% 0%, rgba(124,92,255,0.08), transparent 40%), #0f131b; }
.footer-grid { display: grid; gap: 16px; grid-template-columns: 1fr auto auto; align-items: center; }
.brand { font-weight: 700; margin-bottom: 6px; font-size: 18px; }
.brand-block .muted { color:#9aa4b2; }
.total-box { justify-self: center; background:#1b2130; border:1px solid #293140; padding: 8px 12px; border-radius:10px; }
.copy { justify-self: end; }
@media (max-width: 900px) {
  .footer-grid { grid-template-columns: 1fr; text-align: center; }
  .total-box { justify-self: center; }
  .copy { justify-self: center; }
}
</style>


