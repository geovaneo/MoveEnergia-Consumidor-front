<template>
  <div class="flex space-x-3">
    <input
      v-for="(digit, index) in code"
      :key="index"
      v-model="code[index]"
      type="text"
      inputmode="numeric"
      maxlength="1"
      class="w-[50px] h-[50px] text-center text-[18px] font-bold border border-[#D2D2D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange bg-grey-background"
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
    default: 6, // quantidade de dígitos
  },
})
const emit = defineEmits(['complete'])

const code = ref(Array(props.length).fill(''))
const inputs = ref([])

/**
 * Avança para o próximo input automaticamente
 */
function handleInput(event, index) {
  const val = event.target.value.replace(/\D/g, '') // apenas números
  code.value[index] = val

  if (val && index < props.length - 1) {
    nextTick(() => inputs.value[index + 1].focus())
  }

  // emite o código completo quando todos preenchidos
  if (code.value.every((codeInput) => codeInput !== '')) {
    emit('complete', code.value.join(''))
  }
}

/**
 * Volta o foco para o input anterior ao apagar
 */
function handleBackspace(event, index) {
  if (!code.value[index] && index > 0) {
    nextTick(() => inputs.value[index - 1].focus())
  }
}
</script>