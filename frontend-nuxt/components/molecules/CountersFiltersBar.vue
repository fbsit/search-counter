<template>
  <div class="stack" style="gap:8px; align-items:center;">
    <div style="position:relative;">
      <input class="input" type="text" :value="search" @input="onSearch($event)" placeholder="Buscar contador..." style="max-width:280px; padding-right:32px;" />
      <button v-if="search" type="button" class="btn ghost" @click="store.dispatch('setSearch','')" aria-label="Limpiar búsqueda" style="position:absolute; right:4px; top:50%; transform: translateY(-50%); height:28px; padding:0 8px;">×</button>
    </div>
    <button type="button" ref="filterBtn" class="btn filter-btn" :class="active ? 'attention' : 'ghost'" @click="onOpenFilters">
      Filtrar
      <span v-if="activeCount > 0" class="dot" aria-hidden="true"></span>
    </button>
    <button type="button" class="btn secondary" @click="onClear">Limpiar</button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
const emit = defineEmits(['open-filters'])
const store = useStore()
const search = computed(() => store.state.filters.search)
const filterBtn = ref<HTMLElement | null>(null)
const active = computed(() => {
  const f = store.state.filters
  const isDefaultSort = f.sortBy === 'name' && f.sortDir === 'asc'
  const isDefaultValue = f.valueFilter.mode === 'all' && Number(f.valueFilter.value) === 0
  return !(isDefaultSort && isDefaultValue)
})
const activeCount = computed(() => {
  const f = store.state.filters
  let n = 0
  if (!(f.sortBy === 'name' && f.sortDir === 'asc')) n++
  if (!(f.valueFilter.mode === 'all' && Number(f.valueFilter.value) === 0)) n++
  return n
})

let searchTimer: any
function onSearch(e: Event) {
  const v = (e.target as HTMLInputElement).value
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => store.dispatch('setSearch', v), 200)
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


