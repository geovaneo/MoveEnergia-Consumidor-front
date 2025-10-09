<template>
  <div class="flex space-x-3">
    <input
      v-for="(digit, index) in code"
      :key="index"
      v-model="code[index]"
      type="text"
      inputmode="numeric"
      maxlength="1"
      class="w-[50px] h-[50px] text-center text-[18px] font-bold border rounded-lg focus:outline-none focus:ring-2 bg-grey-background"
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
import { ref, nextTick } from 'vue'

const props = defineProps({
  length: {
    type: Number,
    default: 6,
  },
  hasError: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['complete', 'update:code'])

const code = ref(Array(props.length).fill(''))
const inputs = ref([])

function handleInput(event, index) {
  const val = event.target.value.replace(/\D/g, '')
  code.value[index] = val

  if (val && index < props.length - 1) {
    nextTick(() => inputs.value[index + 1].focus())
  }

  if (code.value.every((codeInput) => codeInput !== '')) {
    emit('complete', code.value.join(''))
  }
  emit('update:code', code.value.join(''))
}

function handleBackspace(event, index) {
  if (!code.value[index] && index > 0) {
    nextTick(() => inputs.value[index - 1].focus())
  }
}
</script>