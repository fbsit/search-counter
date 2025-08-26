# Contadores – Nuxt 3 + Vuex

Aplicación SPA para administrar una lista de contadores.

## Características
- Gestión de estado con Vuex (contadores y filtros)
- Persistencia: `localStorage` (contadores) y `sessionStorage` (filtros)
- Ordenar por nombre/valor, asc/desc
- Filtrar “mayores a / menores a n” + buscador con debounce (200ms)
- Límite de 20 contadores (0..20 cada uno)
- Modal fijo para crear contador (autofocus, Esc)
- Confirmación al eliminar + toast con “Deshacer” por 3s
- UI responsive, sin frameworks de estilos (solo CSS/Sass)

## Requisitos
- Node 18+
- Yarn

## Instalación
1) Instalar dependencias
```bash
yarn
```
2) Ejecutar en desarrollo
```bash
yarn dev
```
3) Build y preview
```bash
yarn build
yarn preview
```

## Estructura relevante
- `layouts/default.vue`: header/footer y toast accesible (aria-live)
- `plugins/vuex.ts`: store Vuex (acciones, mutaciones, getters)
- `components/`
  - `atoms/CounterItem.vue`
  - `molecules/CountersList.vue`, `CountersFiltersBar.vue`, `AddCounterModal.vue`, `ConfirmDeleteModal.vue`
  - `organisms/CountersHeader.vue`, `CountersFooter.vue`
- `pages/index.vue`: página principal (estado vacío con CTA)
- `assets/styles/main.scss`: estilos globales y ajustes móviles

## Accesibilidad y rendimiento
- `aria-live="polite"` en toast, labels asociados, `type="button"`
- En móviles: sin blur pesado, sin sombras ni transiciones costosas

## Notas de uso
- Botón “Filtrar”: indicador cuando hay filtros activos; botón de limpiar búsqueda integrado.
- Estado vacío: botón central “Crear contador”; el botón superior se oculta cuando la lista está vacía.

## Licencia
MIT
