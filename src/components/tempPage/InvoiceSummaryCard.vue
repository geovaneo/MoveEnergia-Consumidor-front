<template>
  <div class="justify-between flex flex-row border border-[#D2D2D2] rounded-[10px] w-full mb-[8px]">
    <div class="gap-[6.438rem] flex flex-row items-center">
      <div
        class="flex flex-col bg-[#FAF7F5] w-[132px] gap-[3px] p-4 pr-[21px] rounded-tl-[10px] rounded-bl-[10px] border-l border-t border-b border-[#D2D2D2]"
      >
        <p class="text-[0.875rem]">Mês referente</p>
        <p class="text-[1rem] font-bold uppercase">{{ referenceMonth }}</p>
      </div>
      <div class="flex flex-col gap-[3px] p-4 pr-[21px]">
        <p class="text-[0.875rem]">Vencimento</p>
        <p class="text-[1rem] font-bold uppercase">{{ dueDate }}</p>
      </div>
      <div class="flex flex-col gap-[3px] p-4 pr-[21px]">
        <p class="text-[0.875rem]">Valor</p>
        <p class="text-[1rem] font-bold uppercase">{{ formatCurrency(totalValue) }}</p>
      </div>
    </div>
    <div class="gap-2 w-full flex flex-row items-center justify-end pr-[14px]">
      <StatusBadge :status="status" />
      <div>
        <div
          @click="showInvoiceDetails"
          class="rounded-full border border-[#57799A] bg-white flex flex-row justify-end gap-2 py-[3px] px-2 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <mdicon name="barcode" size="24" class="text-[#57799A]"></mdicon>
          <p class="text-[0.875rem] text-[#57799A]">Visualizar boleto</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import StatusBadge from './StatusBadge.vue'

defineProps({
  referenceMonth: {
    type: String,
    default: 'Janeiro',
  },
  dueDate: {
    type: String,
    default: '01/01/2023',
  },
  totalValue: {
    type: [Number, String],
    default: '0.00',
  },
  status: {
    type: String,
    default: 'PENDING',
  },
})

const emit = defineEmits(['show-invoice-details'])

function showInvoiceDetails() {
  emit('show-invoice-details')
}

function formatCurrency(value) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value

  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}
</script>