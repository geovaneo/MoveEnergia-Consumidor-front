<template>
  <div class="flex flex-col w-full h-full items-center">
    <!-- DATE AND ADDRESS SELECTOR -->
    <div class="flex items-center justify-between w-full pt-[32px]">
      <p class="text-[1.125rem] font-bold">{{ currentDateText }}</p>
      <AddressSelector />
    </div>

    <!-- BANNER WITH NAME AND TOTAL SAVINGS-->
    <div class="w-full mt-[24px]">
      <HomeBanner />
    </div>

    <!-- CURRENT INVOICE AND GENERAL INFO -->
    <div class="w-full mt-[32px] flex gap-[32px]">
      <CurrentInvoice />
      <div class="flex flex-col h-full max-w-[195px] w-full gap-[32px]">
        <div
          class="w-full rounded-[10px] py-[24px] px-[16px] bg-orange-50 flex flex-col items-end text-right"
        >
          <div
            class="w-[40px] h-[40px] flex justify-center items-center rounded-[10px] border-[0.5px] border-primary-orange bg-orange-50 mb-[8px]"
          >
            <mdicon name="home-lightning-bolt-outline" size="24" class="text-primary-orange" />
          </div>
          <p class="text-[1rem] font-semibold mb-[5px]">Energia Compensada</p>
          <p class="text-[1.75rem] font-bold">1200 kWh</p>
        </div>
        <div
          class="w-full rounded-[10px] py-[24px] px-[16px] bg-orange-50 flex flex-col items-end text-right"
        >
          <div
            class="w-[40px] h-[40px] flex justify-center items-center rounded-[10px] border-[0.5px] border-primary-orange bg-orange-50 mb-[8px]"
          >
            <mdicon name="currency-usd" size="24" class="text-primary-orange" />
          </div>
          <p class="text-[1rem] font-semibold mb-[5px]">Economia este mês</p>
          <p class="text-[1.75rem] font-bold">R$ 108.39</p>
        </div>
      </div>
    </div>

    <!-- CONSUMPTION GRAPH -->
    <div class="w-full mt-[24px] pb-[100px]">
      <ConsumptionGraph />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AddressSelector from '@/components/AddressSelector.vue'
import HomeBanner from '@/components/HomeBanner.vue'
import CurrentInvoice from '@/components/CurrentInvoice.vue'
import ConsumptionGraph from '@/components/ConsumptionGraph.vue'

const currentDateText = computed(() => {
  const data = new Date()
  const opcoes = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }

  let dataFormatada = data.toLocaleDateString('pt-BR', opcoes)

  dataFormatada = dataFormatada.replace(
    /^\w+/g,
    (dia) => dia.charAt(0).toUpperCase() + dia.slice(1)
  )

  return dataFormatada
})
</script>

<style scoped>
</style>