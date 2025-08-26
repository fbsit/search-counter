<template>
  <div class="base-select" ref="root" @keydown.stop.prevent="onKeydown">
    <button class="trigger input" :class="{ open }" type="button" @click="toggle" :aria-expanded="open.toString()">
      <span class="value">{{ currentLabel }}</span>
      <span class="chev" aria-hidden="true">▾</span>
    </button>
    <transition name="fade-scale">
      <ul v-if="open" class="menu" role="listbox">
        <li v-for="opt in options" :key="String(opt.value)" class="item" :class="{ active: opt.value === modelValue }" @click="onSelect(opt.value)">
          {{ opt.label }}
        </li>
      </ul>
    </transition>
  </div>
  
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'

export type Option = { label: string; value: string | number }
const props = defineProps<{ modelValue: string | number; options: Option[] }>()
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const currentLabel = computed(() => props.options.find(o => o.value === props.modelValue)?.label ?? '')

function toggle() { open.value = !open.value }
function onSelect(v: string | number) { emit('update:modelValue', v); open.value = false }

function onClickOutside(e: MouseEvent) {
  const el = root.value
  if (!el) return
  if (!el.contains(e.target as Node)) open.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') { open.value = false; return }
  if (e.key === 'Enter' || e.key === ' ') { toggle(); return }
}

onMounted(() => { document.addEventListener('mousedown', onClickOutside) })
onBeforeUnmount(() => { document.removeEventListener('mousedown', onClickOutside) })
</script>

<style scoped>
.base-select { position: relative; width: 100%; }
.trigger { display:flex; justify-content:space-between; align-items:center; width:100%; }
.trigger.open { border-color: rgba(124,92,255,.6); box-shadow: 0 0 0 3px rgba(124,92,255,.18); }
.chev { opacity: .7; margin-left: 8px; }

.menu {
  position: absolute; left: 0; right: 0; top: calc(100% + 6px);
  background: #0f131b; color: #e6e6e6; border: 1px solid #1c2230; border-radius: 10px;
  padding: 6px; z-index: 1100; box-shadow: 0 18px 34px rgba(0,0,0,.45);
  max-height: 240px; overflow: auto;
}
.item { padding: 10px 10px; border-radius: 8px; cursor: pointer; }
.item:hover { background: #141a24; }
.item.active { background: #1b2130; color: #cbd5e1; }

.fade-scale-enter-active, .fade-scale-leave-active { transition: all .12s ease; }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: translateY(-4px) scale(.98); }
</style>



