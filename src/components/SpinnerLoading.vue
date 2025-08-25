<template>
  <!-- Overlay wrapper (optional) -->
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

  <!-- Inline wrapper (default) -->
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
    <!-- Always keep an sr-only label for a11y when visual label is hidden -->
    <span v-if="!(showLabel || $slots.default)" class="sr-only">{{ label }}</span>
  </div>
</template>


<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** Spinner size in pixels */
  size: { type: [Number, String], default: 40 },
  /** Border thickness in pixels */
  thickness: { type: [Number, String], default: 4 },
  /** Main color (uses border-top-color). Accepts HEX — e.g.: #00B37E */
  color: { type: String, default: '#0EA5E9' }, // sky-500
  /** Track color (ring border-color) */
  trackColor: { type: String, default: 'rgba(0,0,0,0.1)' },
  /** Duration of a full rotation (seconds) */
  speed: { type: Number, default: 0.9 },
  /** Show visible label below/next to the spinner */
  showLabel: { type: Boolean, default: false },
  /** Label text (also used as sr-only when showLabel=false) */
  label: { type: String, default: 'Carregando…' },
  /** Enable fullscreen overlay mode */
  overlay: { type: Boolean, default: false },
  /** Accessibility: aria-live (polite | assertive | off) */
  ariaLive: { type: String, default: 'polite' },
  /** Accessibility: custom aria-label */
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