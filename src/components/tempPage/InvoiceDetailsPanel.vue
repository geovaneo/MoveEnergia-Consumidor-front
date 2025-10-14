<template>
  <div class="h-full w-[450px] overflow-y-auto px-6">
    <div class="justify-end flex cursor-pointer pt-4">
      <mdicon
        @click="$emit('close')"
        name="window-close"
        size="24"
        class="text-black hover:text-red cursor-pointer transition-all hover:scale-110 active:scale-90"
      ></mdicon>
    </div>
    <div class="flex flex-col px-[58px] lg:px-4 pt-[20px] lg:pt-4">
      <div class="justify-center items-center flex flex-col pb-2">
        <p class="text-[0.875rem]">Mês referente</p>
        <p class="text-[0.875rem] font-bold uppercase">{{ invoice.referenceMonth }}</p>
      </div>
      <div class="w-full text-center">
        <p class="font-semibold lg:text-[2rem] 2xl:text-[3.125rem]">
          {{ formatCurrency(invoice.totalValue) }}
        </p>
      </div>
      <div class="flex flex-col justify-center items-center pt-1">
        <p class="text-[0.875rem]">Vencimento em {{ invoice.dueDate }}</p>
        <div class="justify-center items-end pt-2">
          <StatusBadge :status="invoice.status" />
        </div>
      </div>
    </div>

    <div class="h-[1px] bg-[#D2D2D2] w-full 2xl:mb-6 2xl:mt-6 lg:mb-2 lg:mt-2"></div>

    <div v-if="invoice.status !== 'PAID'" class="flex flex-row w-full justify-between">
      <div class="flex flex-col w-full">
        <div class="flex flex-row justify-between items-center mb-2">
          <p class="font-bold text-[1rem] max-[1400px]:text-[0.875rem]">Linha Digitavel</p>
          <div class="flex items-center">
            <button
              @click="copyBarcode"
              class="cursor-pointer flex items-center gap-1 font-semibold hover:brightness-80 transition-all hover:scale-105 active:scale-90 max-[1400px]:text-[0.875rem]"
              :class="`${copied ? 'text-green' : 'text-primary-orange'}`"
            >
              {{ copied ? 'Copiado' : 'Copiar' }}
              <mdicon
                :name="`${copied ? 'check' : 'content-copy'}`"
                size="20"
                class="cursor-pointer"
              ></mdicon>
            </button>
          </div>
        </div>
        <p
          class="w-full font-bold text-[1rem] text-[#57799A] text-wrap max-[1400px]:text-[0.938rem]"
        >
          {{ formatBarcodePTBR(invoice.details.barcode) }}
        </p>
      </div>
    </div>

    <div
      v-if="invoice.status !== 'PAID'"
      class="pt-[40px] max-[1400px]:pt-[24px] flex flex-col gap-2 lg:pb-2 2xl:pb-6"
    >
      <div class="flex flex-row justify-between">
        <p class="text-[1rem] font-bold max-[1400px]:text-[0.875rem]">Código de Barras</p>
        <button
          @click="toggleFullscreen"
          class="text-primary-orange cursor-pointer flex items-center gap-1 font-semibold hover:brightness-80 transition-all hover:scale-105 active:scale-90 max-[1400px]:text-[0.875rem]"
        >
          Ver em tela cheia
          <mdicon name="magnify-plus-outline" size="24"></mdicon>
        </button>
      </div>
      <div @click="toggleFullscreen" class="justify-center items-center cursor-pointer">
        <BarcodeTemp
          :barCodeData="formatLineToBarCode(invoice.details.barcode)"
          format="ITF"
          :fontSize="14"
        />
      </div>
    </div>

    <div
      v-if="invoice.status !== 'PAID'"
      class="h-[1px] bg-[#D2D2D2] w-full lg:mb-2 2xl:mb-6"
    ></div>

    <div
      class="flex flex-col gap-2 max-[1400px]:gap-1 text-[0.875rem] font-bold text-[#57799A] lg:pb-2 2xl:pb-6"
    >
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
        <span class="text-[0.875rem] font-medium">{{ invoice.issuedDate || '—' }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-[0.875rem] font-bold">Valor</span>
        <span class="text-[0.875rem] font-medium">{{ formatCurrency(invoice.totalValue) }}</span>
      </div>
    </div>

    <div class="flex justify-between items-center py-[24px] border-y border-[#D2D2D2]">
      <span class="text-[1rem] font-bold">Valor Total</span>
      <span class="text-[1rem] font-bold">{{ formatCurrency(invoice.totalValue) }}</span>
    </div>

    <div
      v-if="invoice.status !== 'PAID' && invoice.showDownloadLink"
      class="w-full mt-[32px] flex justify-center"
    >
      <button
        class="h-[56px] px-[40px] bg-primary-orange rounded-full text-white font-semibold text-[1.125rem] flex justify-center items-center hover:brightness-90 transition-all hover:scale-110 active:scale-90 max-[1400px]:max-h-[40px] max-[1400px]:text-[1rem]"
      >
        <mdicon name="download" size="24" class="text-white mr-2" />
        Baixar fatura
      </button>
    </div>

    <div v-else-if="invoice.status === 'PAID'" class="flex items-center justify-center">
      <div
        class="h-[56px] px-[40px] bg-green text-white rounded-full inline-flex items-center justify-center text-center font-semibold text-[1.125rem] mt-[24px]"
      >
        <mdicon name="check-circle-outline" size="24" class="text-white mr-2" />
        Fatura paga!
      </div>
    </div>
  </div>

  <div
    v-if="showFullscreen"
    class="fixed inset-0 bg-gray-900/50 transition-opacity"
    :class="{ 'opacity-0': !showFullscreen }"
  ></div>

  <transition name="scale" mode="out-in">
    <div
      ref="dialogRef"
      v-if="showFullscreen"
      class="fixed inset-0 m-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent p-0"
    >
      <div
        v-if="showFullscreen"
        class="fixed inset-0 bg-transparent transition-opacity"
        @click="toggleFullscreen"
      ></div>
      <div class="flex min-h-full items-center justify-center p-4 text-center z-[99999]">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-[90%] sm:max-w-4xl max-h-[90vh]"
          :class="{ 'translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95': !showFullscreen }"
        >
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6">
            <div class="flex items-start justify-between">
              <h3 class="text-lg font-semibold leading-6 text-gray-900">Código de Barras</h3>
              <button
                @click="toggleFullscreen"
                class="rounded-md bg-white text-gray-400 hover:text-red focus:outline-none cursor-pointer transition-all hover:scale-110 active:scale-90"
              >
                <mdicon name="window-close" size="24"></mdicon>
              </button>
            </div>
            <div class="mt-4 flex justify-center p-[50px]">
              <BarcodeTemp
                :barCodeData="formatLineToBarCode(invoice.details.barcode)"
                :barCodeTextLine="formatBarcodePTBR(invoice.details.barcode)"
                :displayValue="true"
                format="ITF"
                :fontSize="18"
                width="2"
                height="120"
                textColor="#000000"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
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

function formatBarcodePTBR(barcode) {
  const numbers = barcode.replace(/\D/g, '')

  if (numbers.length !== 47 && numbers.length !== 48) {
    throw new Error('Linha digitável deve ter 47 ou 48 dígitos')
  }

  if (numbers.length === 47) {
    return `${numbers.substring(0, 5)}.${numbers.substring(5, 10)} ${numbers.substring(
      10,
      15
    )}.${numbers.substring(15, 21)} ${numbers.substring(21, 26)}.${numbers.substring(
      26,
      32
    )} ${numbers.substring(32, 33)} ${numbers.substring(33, 47)}`
  }

  if (numbers.length === 48) {
    return `${numbers.substring(0, 12)} ${numbers.substring(12, 24)} ${numbers.substring(
      24,
      36
    )} ${numbers.substring(36, 48)}`
  }
}

function formatLineToBarCode(typingLine) {
  const digits = typingLine.replace(/\D/g, '')

  if (digits.length !== 47) {
    throw new Error('Linha digitável deve ter 47 dígitos')
  }

  // Monta o código de barras de 44 dígitos conforme padrão FEBRABAN:
  return (
    digits.substring(0, 3) + // Banco (3 dígitos)
    digits.substring(3, 4) + // Moeda (1 dígito)
    digits.substring(32, 33) + // DV do código de barras (1 dígito)
    digits.substring(33, 37) + // Fator vencimento (4 dígitos)
    digits.substring(37, 47) + // Valor (10 dígitos)
    digits.substring(4, 9) + // Campo livre p1 (5 dígitos)
    digits.substring(10, 20) + // Campo livre p2 (10 dígitos)
    digits.substring(21, 31)
  ) // Campo livre p3 (10 dígitos)
}
</script>


<style scoped>
dialog {
  transition: opacity 0.3s ease;
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.scale-enter-to,
.scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>