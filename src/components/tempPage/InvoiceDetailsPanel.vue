<template>
  <div class="h-full max-w-[400px] overflow-y-auto px-6">
    <div class="justify-end flex cursor-pointer pt-4" @click="$emit('close')">
      <mdicon name="window-close" size="24" class="text-black"></mdicon>
    </div>
    <div class="flex flex-col px-[58px] pt-[20px]">
      <div class="justify-center items-center flex flex-col pb-4">
        <p class="text-[0.875rem]">Mês referente</p>
        <p class="text-[1rem] font-bold uppercase">{{ invoice.referenceMonth }}</p>
      </div>
      <div class="w-full">
        <p class="font-semibold text-[3.125rem]">{{ formatCurrency(invoice.totalValue) }}</p>
      </div>
      <div class="flex flex-col justify-center items-center pt-2">
        <p class="text-[0.875rem]">Vencimento em {{ invoice.dueDate }}</p>
        <div class="justify-center items-end pt-4">
          <StatusBadge :status="invoice.status" />
        </div>
      </div>
    </div>

    <div class="h-[1px] bg-[#D2D2D2] w-full mb-6 mt-6"></div>

    <div class="flex flex-row w-full justify-between">
      <div class="flex flex-col">
        <p class="font-bold text-[1rem]">Linha Digitavel</p>
        <p class="font-bold text-[1rem] text-[#57799A]">{{ invoice.details.barcode }}</p>
      </div>
      <div class="justify-end">
        <mdicon
          name="content-copy"
          size="24"
          class="text-primary-orange cursor-pointer"
            :class="`${copied ? 'text-green-500' : ''}`"
          @click="copyBarcode"
        ></mdicon>
      </div>
    </div>
    <div class="pt-[40px] flex flex-col gap-2 pb-6">
      <p class="text-[1rem] font-bold">Código de Barras</p>
      <div class="justify-center items-center">
        <Vue3Barcode
          :value="invoice.details.barcode"
          :options="{
            format: 'EAN13',
            width: 1,
            height: 25,
            displayValue: true,
            flat: true,
          }"
          class="barcode-container"
        ></Vue3Barcode>
      </div>
    </div>

    <div class="h-[1px] bg-[#D2D2D2] w-full mb-6"></div>

    <div class="flex flex-col gap-2 text-[0.875rem] font-bold text-[#57799A] pb-6">
      <div class="flex justify-between items-center">
        <span class="text-[0.875rem] font-bold">Mês Referente</span>
        <span class="text-[0.875rem] font-medium">{{ invoice.referenceMonth }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-[0.875rem] font-bold">Vencimento</span>
        <span class="text-[0.875rem] font-medium">{{ invoice.dueDate }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-[0.875rem] font-bold">Emissão</span>
        <span class="text-[0.875rem] font-medium">{{ invoice.details?.emissionDate || '—' }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-[0.875rem] font-bold">Valor</span>
        <span class="text-[0.875rem] font-medium">{{ formatCurrency(invoice.totalValue) }}</span>
      </div>
    </div>

    <div class="h-[1px] bg-[#D2D2D2] w-full mb-6"></div>

    <div class="flex justify-between items-center">
      <span class="text-[1rem] font-bold">Valor Total</span>
      <span class="text-[1rem] font-bold">{{ formatCurrency(invoice.totalValue) }}</span>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import Vue3Barcode from 'vue3-barcode'
import StatusBadge from './StatusBadge.vue'


const props = defineProps({
  invoice: {
    type: Object,
    required: true,
  },
})

defineEmits(['close'])

const copied = ref(false)

function formatCurrency(value) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value

  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

function copyBarcode() {
  if (!navigator.clipboard) {

    return
  }

  navigator.clipboard
    .writeText(props.invoice.details.barcode)
    .then(() => {
      copied.value = true

      setTimeout(() => {
        copied.value = false
      }, 2000)
    })
    .catch((err) => {
      console.error('Erro ao copiar texto: ', err)
    })
}
</script>
<style scoped>
.barcode-wrapper {
  width: 100%;
  max-width: 300px;
  height: 80px;
  margin: 0 auto;
  overflow: hidden;
}

.barcode-container {
  width: 100%;
  height: 100%;
  display: block;
}

/* Acessa o SVG interno */
.barcode-container :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
}

.barcode-container :deep(svg rect:first-child) {
  fill: #faf7f5 !important;
}

.barcode-container :deep(text) {
  font-size: 12px !important;
  fill: #faf7f5 !important;
}
</style>