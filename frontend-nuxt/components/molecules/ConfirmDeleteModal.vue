<template>
  <div class="modal-backdrop">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="confirmTitle">
      <h2 id="confirmTitle" class="section-title">Eliminar contador</h2>
      <p class="confirm-text">¿Seguro que deseas eliminar "{{ name }}"?</p>
      <div class="stack" style="justify-content:flex-end; gap:8px; margin-top:12px;">
        <button type="button" class="btn secondary" @click="$emit('close')">Cancelar</button>
        <button type="button" class="btn danger" @click="onConfirm">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick } from 'vue'
defineProps<{ name: string }>()
const emit = defineEmits(['confirm','close'])
function onKey(e: KeyboardEvent) { if (e.key === 'Escape') emit('close') }
function onConfirm() { emit('confirm') }
onMounted(async () => {
  window.addEventListener('keydown', onKey)
  await nextTick()
  const el = document.getElementById('confirmTitle')
  el?.focus?.()
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.modal-backdrop { position: fixed; inset:0; background: rgba(0,0,0,.4); display:flex; align-items:center; justify-content:center; z-index: 2100; }
.modal { width: 100%; max-width: 420px; border:1px solid #223; border-radius: 14px; padding: 16px; background:#0f131b; box-shadow: 0 16px 32px rgba(0,0,0,.45); }
.confirm-text { margin: 8px 0 0 0; color:#e6e6e6; }
</style>


