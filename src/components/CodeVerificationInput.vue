<template>
  <div class="flex space-x-3">
    <input
      v-for="(digit, index) in codeComputed"
      :key="index"
      v-model="codeComputed[index]"
      type="text"
      inputmode="numeric"
      maxlength="1"
      class="w-[50px] max-[550px]:w-[40px] max-[550px]:h-[40px] h-[50px] text-center text-[18px] font-bold border rounded-lg focus:outline-none focus:ring-2 bg-grey-background"
      :class="
        hasError
          ? 'border-red-500 focus:ring-red-500 text-red bg-red-50'
          : 'border-[#D2D2D2] focus:ring-primary-orange bg-grey-background'
      "
      @input="handleInput($event, index)"
      @keydown.backspace="handleBackspace($event, index)"
      ref="inputs"
    />
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'

const props = defineProps({
  length: {
    type: Number,
    default: 6,
  },
  code: {
    type: String,
    default: '',
  },
  hasError: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:code'])

const inputs = ref([])

const codeComputed = computed({
  get() {
    const chars = props.code.split('')
    return Array.from({ length: props.length }, (_, i) => chars[i] || '')
  },
  set(newVal) {
    emit('update:code', newVal.join(''))
  },
})

function handleInput(event, index) {
  const val = event.target.value.replace(/\D/g, '')
  const updated = [...codeComputed.value]
  updated[index] = val
  codeComputed.value = updated

  if (val && index < props.length - 1) {
    nextTick(() => inputs.value[index + 1].focus())
  }
}

function handleBackspace(event, index) {
  if (!codeComputed.value[index] && index > 0) {
    nextTick(() => inputs.value[index - 1].focus())
  }
}
</script>