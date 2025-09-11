<template>
  <div class="flex flex-row w-full">
    <div class="mt-[50px] w-[21.438rem] pb-[32px]">
      <h2 class="text-[1.75rem] text-primary-orange items-start font-bold uppercase pr-[32px]">
        Resumo de Faturas
      </h2>
      <div class="pt-4 flex flex-row gap-2 pr-[32px]">
        <div class="inline-flex items-center justify-center bg-[#FBB067] text-white rounded-full p-1">
          <mdicon size="40" name="account" class="text-white rounded-full" />
        </div>
        <div class="w-full truncate flex flex-col">
          <p class="font-semibold text-[1rem] truncate w-full">{{ customerName }}</p>
          <p class="text-[0.875rem]">{{ customerDocument }}</p>
        </div>
      </div>
    </div>
    <!-- INVOICE INFORMATION -->
    <div class="w-full flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x sm:divide-solid divide-primary-orange mt-[50px] gap-[0.531rem]">
      <div class="flex-1 min-h-[120px] flex flex-col items-start px-4 sm:border-l sm:border-primary-orange sm:border-solid">
        <p class="text-[1.125rem] font-semibold">Faturas Pendentes</p>
        <p class="text-[1.625rem] font-bold text-gray-800">{{ pendingInvoices }}</p>
      </div>

      <div class="flex-1 min-h-[120px] flex flex-col items-start px-4">
        <p class="text-[1.125rem] font-semibold">Faturas Atrasadas</p>
        <p class="text-[1.625rem] font-bold text-gray-800">{{ overdueInvoices }}</p>
      </div>

      <div class="flex-1 min-h-[120px] flex flex-col items-start px-4">
        <p class="text-[1.125rem] font-semibold">Número de Faturas</p>
        <p class="text-[1.625rem] font-bold text-gray-800">{{ totalInvoices }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  customerName: {
    type: String,
    default: 'Eztools consultoria em tecnologia da informação LTDA'
  },
  customerDocument: {
    type: String,
    default: 'CNPJ: 36.140.482/0001-22'
  },
  pendingInvoices: {
    type: [Number, String],
    default: '1'
  },
  overdueInvoices: {
    type: [Number, String],
    default: '1'
  },
  totalInvoices: {
    type: [Number, String],
    default: '132'
  }
})
</script>