<template>
  <main class="container">
    <section class="stack col" style="gap:16px; max-width:800px; margin:0 auto;">
      <div class="stack" style="justify-content: space-between; align-items:center;">
        <h1>Gestor de Contadores</h1>
        <button v-if="count > 0" class="btn" :class="{ disabled: isAtLimit }" @click="onOpenAdd">Agregar contador</button>
      </div>
      <div class="text-muted" v-if="isAtLimit">Has alcanzado el máximo de 20 contadores.</div>
      <div class="text-muted" v-else>Contadores: <span class="badge">{{ count }}</span> / 20</div>
      <CountersFiltersBar v-if="count > 0" @open-filters="onToggleFilters" />
      <div v-if="showPanel" class="overlay">
        <div v-if="!isMobile" class="floating-panel" :style="floatingStyle">
          <FiltersPanel @close="showPanel=false" />
        </div>
        <div v-else class="drawer-panel">
          <FiltersPanel @close="showPanel=false" />
        </div>
      </div>
      <CountersList @create="onOpenAdd" />
    </section>
    <AddCounterModal v-if="openModal" @close="openModal=false" />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, type CSSProperties } from 'vue'
import { useStore } from 'vuex'
import CountersList from '../components/molecules/CountersList.vue'
import CountersFiltersBar from '../components/molecules/CountersFiltersBar.vue'
import FiltersPanel from '../components/molecules/FiltersPanel.vue'
import AddCounterModal from '../components/molecules/AddCounterModal.vue'

const store = useStore()
const openModal = ref(false)
const showPanel = ref(false)
const anchorRect = ref<{ left:number; right:number; top:number; bottom:number; width:number; height:number } | null>(null)
const isMobile = ref(false)
const isAtLimit = computed(() => store.state.counters.length >= 20)
const count = computed(() => store.state.counters.length)

function onOpenAdd() {
  if (isAtLimit.value) {
    store.dispatch('showToast', 'Límite de 20 contadores alcanzado')
    return
  }
  openModal.value = true
}
function onToggleFilters(payload?: any) {
  if (!showPanel.value) {
    anchorRect.value = payload || null
    showPanel.value = true
  } else {
    showPanel.value = false
  }
}

const floatingStyle = computed<CSSProperties>(() => {
  const r = anchorRect.value
  const padding = 8
  if (!r) return {}
  const top = r.bottom + padding
  // Ensure it stays in viewport horizontally
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const panelWidth = Math.min(860, vw - 24)
  const center = r.left + (r.width / 2)
  let left = Math.round(center - (panelWidth / 2))
  if (left < 12) left = 12
  if (left + panelWidth > vw - 12) left = Math.max(12, vw - panelWidth - 12)
  return { position: 'absolute', top: `${top}px`, left: `${left}px`, right: 'auto', width: `${panelWidth}px` }
})

function updateIsMobile() {
  if (typeof window === 'undefined') { isMobile.value = false; return }
  isMobile.value = window.innerWidth <= 760
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
})
</script>

<style scoped>
.btn.disabled { opacity: .6; cursor: not-allowed; }
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: none;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 16px;
  z-index: 1000;
}
.floating-panel {
  width: 100%;
  max-width: 860px;
  left: auto !important;
  animation: none;
  pointer-events: auto;
}
.drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: min(80vw, 420px);
  padding: 0;
  display: flex;
  flex-direction: column;
  animation: none;
  z-index: 1001;
  box-shadow: -10px 0 28px rgba(0,0,0,.35);
}
/* Make the FiltersPanel behave as a true sidebar body */
.drawer-panel :deep(.filters-panel) {
  height: 100%;
  margin: 0;
  border-radius: 0;
  border-left: 1px solid #1c2230;
}
@keyframes slideIn { from { transform: none; opacity: 1; } to { transform: none; opacity: 1; } }
@keyframes floatIn { from { transform: none; opacity: 1; } to { transform: none; opacity: 1; } }

/* Mobile: remove heavy effects for instant interactions */
@media (max-width: 760px) {
  .overlay { background: transparent; backdrop-filter: none; padding: 12px; }
  .floating-panel { animation: none !important; }
  .drawer-panel { animation: none !important; box-shadow: none; }
}
</style>


