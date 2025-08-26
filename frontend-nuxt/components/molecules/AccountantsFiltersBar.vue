<template>
  <div class="stack" style="gap:8px; align-items:center;">
    <input class="input" type="text" :value="search" @input="onSearch($event)" placeholder="Buscar contador..." style="max-width:280px;" />
    <button ref="filterBtn" class="btn secondary" @click="onOpenFilters">Filtrar</button>
    <button class="btn secondary" @click="onClear">Limpiar</button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
const emit = defineEmits(['open-filters'])
const store = useStore()
const search = computed(() => store.state.filters.search)
const filterBtn = ref<HTMLElement | null>(null)

function onSearch(e: Event) {
  const v = (e.target as HTMLInputElement).value
  store.dispatch('setSearch', v)
}
function onOpenFilters() {
  const el = filterBtn.value
  if (el) {
    const r = el.getBoundingClientRect()
    emit('open-filters', { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height })
  } else {
    emit('open-filters')
  }
}
function onClear() {
  store.dispatch('setSearch', '')
  store.dispatch('setSortBy', 'name')
  store.dispatch('setSortDir', 'asc')
  store.dispatch('setValueFilter', { mode: 'all', value: 0 })
}
</script>


