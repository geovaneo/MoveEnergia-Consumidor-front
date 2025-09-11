<template>
  <div class="h-full max-w-[450px] overflow-y-auto px-6">
    <div class="justify-end flex cursor-pointer pt-4">
      <mdicon @click="$emit('close')" name="window-close" size="24" class="text-black"></mdicon>
    </div>
    <div class="flex flex-col px-[58px] lg:px-4 pt-[20px] lg:pt-4">
      <div class="justify-center items-center flex flex-col pb-2">
        <p class="text-[0.75rem]">Mês referente</p>
        <p class="text-[0.875rem] font-bold uppercase">{{ invoice.referenceMonth }}</p>
      </div>
      <div class="w-full text-center">
        <p class="font-semibold lg:text-[2rem] 2xl:text-[3.125rem]">
          {{ formatCurrency(invoice.totalValue) }}
        </p>
      </div>
      <div class="flex flex-col justify-center items-center pt-1">
        <p class="text-[0.75rem]">Vencimento em {{ invoice.dueDate }}</p>
        <div class="justify-center items-end pt-2">
          <StatusBadge :status="invoice.status" />
        </div>
      </div>
    </div>

    <div class="h-[1px] bg-[#D2D2D2] w-full 2xl:mb-6 2xl:mt-6 lg:mb-2 lg:mt-2"></div>

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
    <div class="pt-[40px] flex flex-col gap-2 lg:pb-2 2xl:pb-6">
      <div class="flex flex-row justify-between">
        <p class="text-[1rem] font-bold">Código de Barras</p>
        <mdicon
          name="fullscreen"
          size="24"
          class="text-primary-orange cursor-pointer"
          @click="toggleFullscreen"
        />
      </div>
      <div class="justify-center items-center">
        <BarcodeTemp
        v-if="!showFullscreen"
          :value="invoice.details.barcode"
          :options="{
            format: 'ITF14',
            width: 1,
            height: 25,
            displayValue: true,
            flat: true,
          }"
          class="barcode-container"
        ></BarcodeTemp>
      </div>
    </div>

    <div class="h-[1px] bg-[#D2D2D2] w-full lg:mb-2 2xl:mb-6"></div>

    <div class="flex flex-col gap-2 text-[0.875rem] font-bold text-[#57799A] lg:pb-2 2xl:pb-6">
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

    <div class="h-[1px] bg-[#D2D2D2] w-full lg:mb-2 2xl:mb-6"></div>

    <div class="flex justify-between items-center">
      <span class="text-[1rem] font-bold">Valor Total</span>
      <span class="text-[1rem] font-bold">{{ formatCurrency(invoice.totalValue) }}</span>
    </div>
  </div>

    <Teleport to="body">
    <dialog 
      ref="dialogRef" 
      :open="showFullscreen"
      class="fixed inset-0 m-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent p-0 z-[99999]"
    >
      <div 
        class="fixed inset-0 bg-gray-900/50 transition-opacity" 
        :class="{'opacity-0': !showFullscreen}"
        @click="toggleFullscreen"
      ></div>

      <div class="flex min-h-full items-center justify-center p-4 text-center z-[99999]">
        <div 
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-[90%] sm:max-w-4xl max-h-[90vh] overflow-auto"
          :class="{'translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95': !showFullscreen}"
        >
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6">
            <div class="flex items-start justify-between">
              <h3 class="text-lg font-semibold leading-6 text-gray-900">Código de Barras</h3>
              <button 
                @click="toggleFullscreen" 
                class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <mdicon name="window-close" size="24"></mdicon>
              </button>
            </div>
            <div class="mt-4 flex justify-center">
              <BarcodeTemp
              v-if="showFullscreen"
                :value="invoice.details.barcode"
                :options="{
                  format: 'ITF14',
                  width: 3,
                  height: 100,
                  displayValue: true,
                  flat: true,
                }"
                class="fullscreen-barcode"
              ></BarcodeTemp>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </Teleport>

</template>


<script setup>
import { ref } from 'vue'
import BarcodeTemp from './BarcodeTemp.vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  invoice: {
    type: Object,
    required: true,
  },
})

defineEmits(['close'])

const copied = ref(false)

const showFullscreen = ref(false)
const dialogRef = ref(null)

function toggleFullscreen() {
  showFullscreen.value = !showFullscreen.value
}

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

/* .barcode-container :deep(svg rect:first-child) {
  fill: #faf7f5 !important;
} */

.barcode-container :deep(text) {
  font-size: 12px !important;
  fill: #ffffff !important;
}

.fullscreen-barcode {
  width: 100vw;
  height: auto;
  max-width: 1000px;
  margin: 0 auto;
}

.fullscreen-barcode :deep(svg) {
  width: 100% !important;
  height: auto !important;
  max-height: 80vh !important;
}

dialog {
  transition: opacity 0.3s ease;
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>