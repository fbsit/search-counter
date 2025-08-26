<template>
  <div class="stack col" style="gap:12px;">
    <div v-if="list.length === 0" class="empty dots-bg">
      <div class="empty-title">Aún no tienes contadores</div>
      <div class="empty-sub">Crea tu primer contador para comenzar</div>
      <NuxtLink to="#" class="btn" @click.prevent="$emit('create')">Crear contador</NuxtLink>
    </div>
    <transition-group name="list" tag="div" class="stack col" style="gap:12px;">
      <CounterItem v-for="c in list" :key="c.id" :item="c" />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import CounterItem from '../atoms/CounterItem.vue'
const store = useStore()
const list = computed(() => store.getters.filteredCounters)
</script>

<style scoped>
.list-enter-active, .list-leave-active { transition: all .18s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(-6px); }
@media (max-width: 760px) {
  .list-enter-active, .list-leave-active { transition: none; }
  .list-enter-from, .list-leave-to { opacity: 1; transform: none; }
}
.empty { text-align:center; padding: 24px 12px; border: 1px dashed #293140; border-radius: 14px; color: #9aa4b2; }
.empty-title { font-weight: 700; margin-bottom: 6px; color:#e6e6e6; }
.empty-sub { margin-bottom: 18px; }
.empty .btn { margin-top: 4px; }
.dots-bg { background-image: radial-gradient(#293140 1px, transparent 1px); background-size: 14px 14px; background-position: center; }
</style>


