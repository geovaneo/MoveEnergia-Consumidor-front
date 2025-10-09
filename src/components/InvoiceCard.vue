<template>
  <div
    class="flex bg-white hover:bg-gray-50 focus:bg-[#D2D2D2] transition-all cursor-pointer justify-between items-center border-b border-[#D2D2D2] py-4"
    @click="$emit('view-details', invoice.id)"
  >
    <div class="flex flex-col w-full max-w-[395px]">
      <!-- MONTH -->
      <div class="mb-2">
        <h3 class="text-[1.125rem] font-bold">{{ displayMonth }}</h3>
      </div>

      <!-- CONSUMPTION -->
      <div class="flex flex-row items-center">
        <mdicon name="lightning-bolt" size="18" class="inline text-primary" />
        <p class="font-medium text-[0.875rem] ml-[4px]">{{ invoice.consumption || 'N/A' }} kWh</p>
      </div>

      <!-- ADDRESS -->
      <div class="flex flex-row items-center w-full">
        <mdicon name="map-marker-radius" size="18" />
        <p
          class="font-medium text-[0.875rem] truncate w-full max-w-[395px] ml-[4px]"
          :title="invoiceAddress"
        >
          {{ invoiceAddress }}
        </p>
      </div>
    </div>

    <div class="flex flex-row items-center justify-end w-full gap-[8px] max-w-[30%]">
      <!-- STATUS -->
      <div
        class="rounded-[10px] p-[5px] gap-[10px] text-[0.75rem] font-semibold items-center uppercase"
        :class="statusClass"
      >
        {{ statusText }}
      </div>

      <!-- VALUE -->
      <div class="flex flex-row items-center">
        <p class="font-bold text-[1.5rem] text-primary">
          {{ formatCurrency(invoice.totalValue) }}
        </p>
        <mdicon name="chevron-right" size="24" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  invoice: {
    type: Object,
    required: true,
  },
  current: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['view-details'])

const statusClass = computed(() => {
  const statusMap = {
    OK: 'bg-[#CEFFD0] text-[#007A25]',
    PENDING: 'bg-[#FDF8E2] text-[#C5A100]',
    OVERDUE: 'bg-[#FFD6D6] text-[#D10000]',
  }
  return statusMap[props.invoice.invoicesStatus] || 'bg-gray-100 text-gray-700'
})

const statusText = computed(() => {
  const statusTextMap = {
    OK: 'Fatura Paga',
    PENDING: 'A vencer',
    OVERDUE: 'Vencida',
  }
  return statusTextMap[props.invoice.invoicesStatus] || 'Não informado'
})

const invoiceAddress = computed(() => {
  if (props.invoice.chargedCustomer?.address) {
    return props.invoice.chargedCustomer.address
  }
  if (props.invoice.consumerUnitAddress) {
    return props.invoice.consumerUnitAddress
  }
  return 'Endereço não disponível'
})

const displayMonth = computed(() => {
  if (!props.invoice.billingMonth) return ''

  const [month] = props.invoice.billingMonth.split('/')
  return month
})

const formatCurrency = (value) => {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
</script>