<template>
  <div class="flex flex-row w-full">
    <!-- Título e informações do cliente -->
    <div class="mt-6 lg:mt-[30px] 2xl:mt-[50px] w-full lg:w-[18rem] xl:w-[21.438rem] lg:pb-2 2xl:pb-6 lg:pb-[32px]">
      <h2 class="text-xl lg:text-2xl xl:text-[1.75rem] text-primary-orange items-start font-bold uppercase pr-4 lg:pr-[32px]">
        Resumo de Faturas
      </h2>
      <div class="pt-3 lg:pt-4 flex flex-row gap-2 pr-4 lg:pr-[32px]">
        <div class="inline-flex items-center justify-center bg-[#FBB067] text-white rounded-full p-1">
          <mdicon size="32" lg:size="40" name="account" class="text-white rounded-full" />
        </div>
        <div class="w-full truncate flex flex-col">
          <p class="font-semibold text-sm lg:text-[1rem] truncate w-full">{{ customerName }}</p>
          <p class="text-xs lg:text-[0.875rem]">{{ customerDocument }}</p>
        </div>
      </div>
    </div>

    <!-- Cards de informações de faturas -->
    <div class="w-full flex flex-row divide-y lg:divide-y-0 lg:divide-x lg:divide-solid divide-primary-orange mt-4 lg:mt-[30px] 2xl:mt-[50px] gap-2 lg:gap-[0.531rem]">
      <!-- Faturas Pendentes -->
      <div class="flex-1 min-h-[80px] lg:min-h-[100px] xl:min-h-[120px] flex flex-col items-start px-4 py-3 lg:py-0 lg:border-l lg:border-primary-orange lg:border-solid">
        <p class="text-base lg:text-[1.125rem] font-semibold">Faturas Pendentes</p>
        <p class="text-xl lg:text-[1.625rem] font-bold text-gray-800">{{ pendingInvoices }}</p>
      </div>

      <!-- Faturas Atrasadas -->
      <div class="flex-1 min-h-[80px] lg:min-h-[100px] xl:min-h-[120px] flex flex-col items-start px-4 py-3 lg:py-0">
        <p class="text-base lg:text-[1.125rem] font-semibold">Faturas Atrasadas</p>
        <p class="text-xl lg:text-[1.625rem] font-bold text-gray-800">{{ overdueInvoices }}</p>
      </div>

      <!-- Número de Faturas -->
      <div class="flex-1 min-h-[80px] lg:min-h-[100px] xl:min-h-[120px] flex flex-col items-start px-4 py-3 lg:py-0">
        <p class="text-base lg:text-[1.125rem] font-semibold">Número de Faturas</p>
        <p class="text-xl lg:text-[1.625rem] font-bold text-gray-800">{{ totalInvoices }}</p>
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