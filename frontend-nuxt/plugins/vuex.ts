import { createStore } from 'vuex'
import { defineNuxtPlugin } from '#app'

export type Counter = { id: string; name: string; value: number }
export type SortBy = 'name' | 'value'
export type SortDir = 'asc' | 'desc'
export type ValueFilter = { mode: 'all' | 'gt' | 'lt'; value: number }

export type FiltersState = { search: string; sortBy: SortBy; sortDir: SortDir; valueFilter: ValueFilter }
export interface RootState { counters: Counter[]; filters: FiltersState; ui: { toast: string; toastAction?: { label: string; action: string } | null }; lastRemoved?: Counter | null }

function generateId(): string { return Math.random().toString(36).slice(2, 10) }
function isClient(): boolean { return typeof window !== 'undefined' }

const store = createStore({
  state: (): RootState => ({
    counters: [],
    filters: { search: '', sortBy: 'name', sortDir: 'asc', valueFilter: { mode: 'all', value: 0 } },
    ui: { toast: '', toastAction: null },
    lastRemoved: null,
  }),
  getters: {
    total(state: RootState): number { return state.counters.reduce((a: number, c: Counter) => a + c.value, 0) },
    filteredCounters(state: RootState): Counter[] {
      const q = state.filters.search.trim().toLowerCase()
      const vf = state.filters.valueFilter
      const sortBy = state.filters.sortBy
      const sortDir = state.filters.sortDir
      const list = state.counters.filter((c: Counter) => {
        const matches = q ? c.name.toLowerCase().includes(q) : true
        let pass = true
        if (vf.mode === 'gt') pass = c.value > vf.value
        else if (vf.mode === 'lt') pass = c.value < vf.value
        else pass = true
        return matches && pass
      })
      list.sort((a: Counter, b: Counter) => {
        const dir = sortDir === 'asc' ? 1 : -1
        if (sortBy === 'name') return a.name.localeCompare(b.name) * dir
        return (a.value - b.value) * dir
      })
      return list
    },
  },
  mutations: {
    SET_COUNTERS(state: RootState, list: Counter[]) { state.counters = list },
    ADD_COUNTER(state: RootState, c: Counter) { state.counters.push(c) },
    REMOVE_COUNTER(state: RootState, id: string) { const c = state.counters.find((x: Counter) => x.id === id); state.counters = state.counters.filter((x: Counter) => x.id !== id); (state as RootState).lastRemoved = c || null },
    INCREMENT(state: RootState, id: string) { const c = state.counters.find((x: Counter) => x.id === id); if (c && c.value < 20) c.value += 1 },
    DECREMENT(state: RootState, id: string) { const c = state.counters.find((x: Counter) => x.id === id); if (c && c.value > 0) c.value -= 1 },
    RESET_ALL(state: RootState) { state.counters.forEach((c: Counter) => { c.value = 0 }) },
    SET_SEARCH(state: RootState, v: string) { state.filters.search = v },
    SET_SORT_BY(state: RootState, v: SortBy) { state.filters.sortBy = v },
    SET_SORT_DIR(state: RootState, v: SortDir) { state.filters.sortDir = v },
    SET_VALUE_FILTER(state: RootState, v: ValueFilter) { state.filters.valueFilter = v },
    SET_TOAST(state: RootState, msg: string, action?: { label: string; action: string } | null) { state.ui.toast = msg; state.ui.toastAction = action || null },
    CLEAR_TOAST(state: RootState) { state.ui.toast = ''; state.ui.toastAction = null },
    RESTORE_LAST(state: RootState) { if (state.lastRemoved) { state.counters.push(state.lastRemoved); state.lastRemoved = null } },
  },
  actions: {
    hydrateCounters({ commit }: any): void {
      if (!isClient()) return
      try {
        const raw = localStorage.getItem('counters:list')
        if (raw) commit('SET_COUNTERS', JSON.parse(raw) as Counter[])
      } catch {}
    },
    persistCounters({ state }: any): void {
      if (!isClient()) return
      localStorage.setItem('counters:list', JSON.stringify(state.counters))
    },
    async addCounter({ state, commit, dispatch }: any, name: string): Promise<boolean> {
      const trimmed = (name || '').trim()
      if (!trimmed || trimmed.length > 20) return false
      if (state.counters.length >= 20) { dispatch('showToast', 'Límite de 20 contadores alcanzado'); return false }
      commit('ADD_COUNTER', { id: generateId(), name: trimmed, value: 0 } as Counter)
      dispatch('persistCounters')
      if (state.counters.length === 20) dispatch('showToast', 'Has alcanzado el límite de 20 contadores')
      return true
    },
    removeCounter({ commit, dispatch }: any, id: string): void { commit('REMOVE_COUNTER', id); dispatch('persistCounters'); dispatch('showToast', { msg: 'Contador eliminado', action: { label: 'Deshacer', action: 'undo' } }) },
    increment({ commit, dispatch }: any, id: string): void { commit('INCREMENT', id); dispatch('persistCounters') },
    decrement({ commit, dispatch }: any, id: string): void { commit('DECREMENT', id); dispatch('persistCounters') },
    resetAll({ commit, dispatch }: any): void { commit('RESET_ALL'); dispatch('persistCounters') },

    hydrateFilters({ commit }: any): void {
      if (!isClient()) return
      try {
        const raw = sessionStorage.getItem('counters:filters')
        if (raw) {
          const s = JSON.parse(raw) as FiltersState
          commit('SET_SEARCH', s.search)
          commit('SET_SORT_BY', s.sortBy)
          commit('SET_SORT_DIR', s.sortDir)
          commit('SET_VALUE_FILTER', s.valueFilter)
        }
      } catch {}
    },
    persistFilters({ state }: any): void {
      if (!isClient()) return
      sessionStorage.setItem('counters:filters', JSON.stringify(state.filters))
    },
    setSearch({ commit, dispatch }: any, v: string): void { commit('SET_SEARCH', v); dispatch('persistFilters') },
    setSortBy({ commit, dispatch }: any, v: SortBy): void { commit('SET_SORT_BY', v); dispatch('persistFilters') },
    setSortDir({ commit, dispatch }: any, v: SortDir): void { commit('SET_SORT_DIR', v); dispatch('persistFilters') },
    setValueFilter({ commit, dispatch }: any, v: ValueFilter): void { commit('SET_VALUE_FILTER', v); dispatch('persistFilters') },
    showToast({ commit, dispatch }: any, payload: { msg: string; action?: { label: string; action: string } }): void {
      commit('SET_TOAST', payload.msg, payload.action || null)
      setTimeout(() => commit('CLEAR_TOAST'), 3000)
    },
    performToastAction({ commit, dispatch, state }: any): void {
      const act = state.ui.toastAction?.action
      if (act === 'undo') { commit('RESTORE_LAST'); dispatch('persistCounters') }
      commit('CLEAR_TOAST')
    },
  },
})

export default defineNuxtPlugin((nuxtApp: any) => {
  nuxtApp.vueApp.use(store)
})


