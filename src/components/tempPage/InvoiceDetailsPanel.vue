<template>
  <div class="h-full max-[950px]:w-[100dvw] w-[450px] overflow-y-auto max-[500px]:px-[16px] px-6">
    <div class="justify-end flex cursor-pointer pt-4">
      <mdicon
        @click="$emit('close')"
        name="window-close"
        size="24"
        class="text-black hover:text-red cursor-pointer transition-all hover:scale-110 active:scale-90"
      ></mdicon>
    </div>
    <div class="flex flex-col pt-[20px] lg:pt-4 items-center">
      <div class="justify-center items-center flex flex-col pb-2">
        <p class="text-[0.875rem]">Mês referente</p>
        <p class="text-[0.875rem] font-bold uppercase">{{ invoice.referenceMonth }}</p>
      </div>
      <div class="w-full text-center">
        <p
          class="font-semibold max-[1500px]:text-[2rem] max-[1700px]:text-[2.5rem] text-[3.125rem]"
        >
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

    <div class="h-[1px] bg-[#D2D2D2] w-full mt-[24px] mb-[8px]"></div>

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
      class="pt-[40px] max-[1400px]:pt-[24px] flex flex-col gap-2 pb-2 2xl:pb-6"
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
      <div @click="toggleFullscreen" class="flex justify-center items-center cursor-pointer">
        <BarcodeTemp
          :barCodeData="formatLineToBarCode(invoice.details.barcode)"
          format="ITF"
          :fontSize="14"
          :width="barcodeResponsiveWidth"
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
      class="w-full max-[500px]:mt-[16px] mt-[32px] flex justify-center"
    >
      <a
        class="h-[56px] px-[40px] bg-primary-orange rounded-full text-white font-semibold text-[1.125rem] flex justify-center items-center hover:brightness-90 transition-all hover:scale-110 active:scale-90 max-[1400px]:max-h-[40px] max-[1400px]:text-[1rem]"
        :href="invoice.linkUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <mdicon name="download" size="24" class="text-white mr-2" />
        Baixar fatura
      </a>
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
      <div
        class="flex min-h-full items-center justify-center min-[950px]:p-4 text-center z-[99999]"
      >
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-[90%] sm:max-w-4xl max-h-[90vh] landscape-fullscreen"
          :class="{ 'translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95': !showFullscreen }"
        >
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 landscape-content">
            <div class="flex items-start justify-between">
              <h3 class="text-lg font-semibold leading-6 text-gray-900">Código de Barras</h3>
              <button
                @click="toggleFullscreen"
                class="rounded-md bg-white text-gray-400 hover:text-red focus:outline-none cursor-pointer transition-all hover:scale-110 active:scale-90"
              >
                <mdicon name="window-close" size="24"></mdicon>
              </button>
            </div>
            <div class="mt-4 flex justify-center p-[50px] landscape-barcode max-[820px]:scale-90">
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
import { computed, ref } from 'vue'
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

const barcodeResponsiveWidth = computed(() => {
  if (window.innerWidth < 360) {
    return 0.75
  } else if (window.innerWidth < 380) {
    return 0.8
  } else if (window.innerWidth < 405) {
    return 0.85
  } else if (window.innerWidth < 450) {
    return 0.9
  } else if (window.innerWidth < 480) {
    return 1
  } else if (window.innerWidth < 500) {
    return 1.1
  } else if (window.innerWidth < 700) {
    return 1.3
  } else if (window.innerWidth < 950) {
    return 1.5
  } else if (window.innerWidth > 949) {
    return 1
  } else {
    return 1
  }
})

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

async function copyBarcode() {
  const text = props.invoice?.details?.barcode
  if (!text) return

  try {
    // Tenta API moderna (requer contexto seguro)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      // Fallback: cria um textarea oculto e usa execCommand('copy')
      const textarea = document.createElement('textarea')
      textarea.value = text
      // Evita abrir o teclado em iOS
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)

      // Seleciona o conteúdo (compat com iOS)
      textarea.select()
      textarea.setSelectionRange(0, textarea.value.length)

      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    // Tentativa extra (em caso de erro) usando input como fallback
    try {
      const input = document.createElement('input')
      input.value = text
      input.setAttribute('readonly', '')
      input.style.position = 'absolute'
      input.style.left = '-9999px'
      document.body.appendChild(input)

      input.select()
      input.setSelectionRange(0, input.value.length)
      document.execCommand('copy')
      document.body.removeChild(input)

      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (err2) {
      console.error('Erro ao copiar texto: ', err2)
    }
  }
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
@media screen and (max-width: 949px) and (orientation: landscape) {
  .landscape-fullscreen {
    width: 100vw !important;
    height: 100vh !important;
    max-height: 100vh !important;
    max-width: 100vw !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }

  .landscape-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .landscape-barcode {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px !important;
  }
}

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