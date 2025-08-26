<template>
  <div class="filters-panel">
    <div class="row" style="margin-bottom:8px;">
      <div class="field">
        <label for="sortBySel">Ordenar por</label>
        <BaseSelect id="sortBySel" v-model="local.sortBy" :options="sortByOptions" />
      </div>
      <div class="field">
        <label for="sortDirSel">Dirección</label>
        <BaseSelect id="sortDirSel" v-model="local.sortDir" :options="sortDirOptions" />
      </div>
      <div class="field grow">
        <label>Valor</label>
        <div class="stack" style="gap:8px; align-items:center;">
          <BaseSelect :options="valueModeOptions" v-model="local.valueFilter.mode" style="max-width:170px;" aria-label="Modo de filtro" />
          <input class="input" type="number" min="0" max="20" v-model.number="local.valueFilter.value" placeholder="n" style="width:100px;" aria-label="Valor del filtro" />
        </div>
      </div>
    </div>
    <div class="actions">
      <button type="button" class="btn secondary" @click="onCancel">Cancelar</button>
      <button type="button" class="btn" @click="onApply">Aplicar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseSelect from '../atoms/BaseSelect.vue'
import { useStore } from 'vuex'

const emit = defineEmits(['close'])
const store = useStore()

type SortBy = 'name' | 'value'
type SortDir = 'asc' | 'desc'
type VF = { mode: 'all' | 'gt' | 'lt'; value: number }

const local = reactive({
  sortBy: store.state.filters.sortBy as SortBy,
  sortDir: store.state.filters.sortDir as SortDir,
  valueFilter: { ...store.state.filters.valueFilter } as VF,
})

const sortByOptions = [
  { label: 'Nombre', value: 'name' },
  { label: 'Valor', value: 'value' },
] as Array<{ label: string; value: SortBy }>
const sortDirOptions = [
  { label: 'Ascendente', value: 'asc' },
  { label: 'Descendente', value: 'desc' },
] as Array<{ label: string; value: SortDir }>
const valueModeOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Mayores a', value: 'gt' },
  { label: 'Menores a', value: 'lt' },
] as Array<{ label: string; value: VF['mode'] }>

function onApply() {
  store.dispatch('setSortBy', local.sortBy)
  store.dispatch('setSortDir', local.sortDir)
  const safe = Math.max(0, Math.min(20, Number(local.valueFilter.value) || 0))
  store.dispatch('setValueFilter', { mode: local.valueFilter.mode, value: safe })
  emit('close')
}
function onCancel() { emit('close') }
</script>

<style scoped>
.filters-panel {
  width: 100%; 
  border: 1px solid #1c2230; 
  background: radial-gradient(1200px 400px at 0% 0%, rgba(124,92,255,0.08), transparent 40%), #0f131b;
  border-radius: 14px; 
  padding: 14px; 
  box-shadow: 0 14px 28px rgba(0,0,0,.35);
  margin-bottom: 12px;
}
.row { display:flex; gap:12px; align-items:flex-end; flex-wrap: wrap; }
.field { display:flex; flex-direction:column; gap:6px; }
.field.grow { flex: 1 1 auto; }
.actions { display:flex; justify-content:flex-end; gap:8px; margin-top: 10px; }
@media (max-width: 760px) {
  .row { flex-direction: column; align-items: stretch; }
  .actions { position: sticky; bottom: 0; background: #0f131b; padding-top: 10px; }
  /* Lighter visuals on mobile */
  .filters-panel { box-shadow: none; background: #0f131b; }
}
</style>


