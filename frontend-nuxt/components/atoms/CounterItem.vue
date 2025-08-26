<template>
  <div class="card counter-item">
    <div class="row top">
      <div class="info">
        <div class="label" aria-hidden="true">Nombre</div>
        <div class="name" :title="item.name">{{ item.name }}</div>
      </div>
      <div class="info value-box">
        <div class="label" aria-hidden="true">Valor</div>
        <div class="value">{{ item.value }}</div>
      </div>
    </div>
    <div class="row actions">
      <button type="button" class="btn minus icon" @click="dec(item.id)" :disabled="item.value <= 0" aria-label="Decrementar">-</button>
      <button type="button" class="btn icon" @click="inc(item.id)" :disabled="item.value >= 20" aria-label="Incrementar">+</button>
      <button type="button" class="btn danger" @click="openConfirm(item.id, item.name)" aria-label="Eliminar">Eliminar</button>
    </div>
    <teleport to="body">
      <ConfirmDeleteModal v-if="showConfirm" :name="selName" @close="showConfirm=false" @confirm="doRemove" />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { ref } from 'vue'
import ConfirmDeleteModal from '../molecules/ConfirmDeleteModal.vue'

interface Item { id: string; name: string; value: number }
defineProps<{ item: Item }>()
const store = useStore()
function inc(id: string) { store.dispatch('increment', id) }
function dec(id: string) { store.dispatch('decrement', id) }
const showConfirm = ref(false)
const selId = ref<string>('')
const selName = ref<string>('')
function openConfirm(id: string, name: string) { selId.value = id; selName.value = name; showConfirm.value = true }
function doRemove() { showConfirm.value = false; if (selId.value) store.dispatch('removeCounter', selId.value) }
</script>

<style scoped>
.counter-item { display:flex; flex-direction: column; gap:12px; padding: 12px; }
.row { display:flex; align-items:flex-start; justify-content: space-between; gap: 12px; }
.row.top { align-items:flex-start; }
.info { display:flex; flex-direction:column; gap:6px; min-width: 0; }
.label { font-size: 11px; text-transform: uppercase; letter-spacing:.4px; color:#9aa4b2; }
.name { font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; letter-spacing:.2px; }
.value { font-weight:800; min-width: 40px; text-align:center; background:#1b2130; border:1px solid #293140; color:#e6e6e6; padding:4px 10px; border-radius:999px; }
.actions { justify-content: flex-end; gap:10px; }
.actions .btn { min-width: 44px; height: 36px; border-radius: 12px; }
.actions .btn.icon { width: 42px; padding:0; }
</style>


