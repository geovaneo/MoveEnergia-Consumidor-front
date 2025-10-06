<template>
  <div
    v-if="overlay"
    class="fixed inset-0 z-50 grid place-items-center bg-black/5 backdrop-blur-sm"
  >
    <div class="flex flex-col items-center gap-3">
      <div
        class="rounded-full animate-spin"
        :style="spinnerStyle"
        role="status"
        :aria-label="ariaLabel"
        :aria-live="ariaLive"
      />
      <div v-if="showLabel || $slots.default" class="text-sm font-medium text-gray-700">
        <slot>{{ label }}</slot>
      </div>
    </div>
  </div>

  <div
    v-else
    class="inline-flex items-center gap-2"
    role="status"
    :aria-label="ariaLabel"
    :aria-live="ariaLive"
  >
    <div class="rounded-full animate-spin" :style="spinnerStyle" />
    <span v-if="showLabel || $slots.default" class="text-sm font-medium">
      <slot>{{ label }}</slot>
    </span>
    <span v-if="!(showLabel || $slots.default)" class="sr-only">{{ label }}</span>
  </div>
</template>


<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: { type: [Number, String], default: 40 },
  thickness: { type: [Number, String], default: 4 },
  color: { type: String, default: '#F07F3A' },
  trackColor: { type: String, default: 'rgba(0,0,0,0.1)' },
  speed: { type: Number, default: 0.9 },
  showLabel: { type: Boolean, default: false },
  label: { type: String, default: 'Carregando…' },
  overlay: { type: Boolean, default: false },
  ariaLive: { type: String, default: 'polite' },
  ariaLabel: { type: String, default: 'Carregando conteúdo' },
})

const spinnerStyle = computed(() => {
  const sizePx = typeof props.size === 'number' ? `${props.size}px` : String(props.size)
  const thickPx =
    typeof props.thickness === 'number' ? `${props.thickness}px` : String(props.thickness)

  return {
    width: sizePx,
    height: sizePx,
    borderWidth: thickPx,
    borderStyle: 'solid',
    borderColor: props.trackColor,
    borderTopColor: props.color,
    animation: `spin linear infinite`,
    animationDuration: `${props.speed}s`,
  }
})
</script>