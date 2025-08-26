<template>
  <div class="modal-backdrop">
    <div class="modal" role="dialog" aria-modal="true">
      <h2 class="section-title">Agregar contador</h2>
      <div class="stack col" style="gap:10px;">
        <div class="field">
          <label for="counterName" class="label">Nombre</label>
          <input id="counterName" class="input" type="text" v-model="name" maxlength="20" placeholder="Nombre del contador" @keydown.enter.prevent="onAdd" />
          <div class="text-muted small" v-if="name.length > 0">{{ name.length }}/20</div>
        </div>
        <div class="text-muted" v-if="isAtLimit">Máximo de 20 contadores alcanzado.</div>
        <div class="text-muted" v-if="error">{{ error }}</div>
        <div class="stack" style="justify-content:flex-end; gap:8px;">
          <button type="button" class="btn secondary" @click="close()">Cancelar</button>
          <button type="button" class="btn" :disabled="disabled" @click="onAdd">Agregar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useStore } from 'vuex'

const emit = defineEmits(['close'])
const store = useStore()
const name = ref('')
const error = ref('')
const isAtLimit = computed(() => store.state.counters.length >= 20)
const disabled = computed(() => isAtLimit.value || name.value.trim().length === 0)
const enableEscClose = true

function close() { emit('close') }

async function onAdd() {
  error.value = ''
  const ok = await store.dispatch('addCounter', name.value)
  if (!ok) {
    if (isAtLimit.value) {
      error.value = 'Límite de 20 contadores alcanzado'
      store.dispatch('showToast', 'Límite de 20 contadores alcanzado')
    }
    else if (name.value.trim().length === 0) error.value = 'El nombre no puede estar vacío'
    else if (name.value.trim().length > 20) error.value = 'El nombre no puede superar 20 caracteres'
    return
  }
  name.value = ''
  close()
}

function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && enableEscClose) close() }
onMounted(async () => {
  window.addEventListener('keydown', onKey)
  await nextTick()
  const el = document.getElementById('counterName') as HTMLInputElement | null
  el?.focus()
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.modal-backdrop { position: fixed; inset:0; background: rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index: 2000; }
.modal { width: 100%; max-width: 480px; border:1px solid #223; border-radius: 14px; padding: 14px; background:#0f131b; box-shadow: 0 18px 40px rgba(0,0,0,.55); animation: modal-in .18s ease-out; }
@keyframes modal-in { from { transform: translateY(10px); opacity:0; } to { transform: translateY(0); opacity:1; } }
.field { display:flex; flex-direction:column; gap:6px; }
.label { font-size: 11px; text-transform: uppercase; letter-spacing:.4px; color:#9aa4b2; }
.small { font-size: 12px; }
</style>


