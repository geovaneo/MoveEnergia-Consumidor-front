<template>
  <div class="flex flex-col w-full h-full items-center">
    <!-- LOADING SKELETON -->
    <template v-if="homeStore.loadingHome">
      <HomeSkeleton />
    </template>

    <template v-else>
      <!-- DATE AND ADDRESS SELECTOR -->
      <div class="flex items-center justify-between w-full pt-[32px]">
        <p class="text-[1.125rem] font-bold">{{ currentDateText }}</p>
        <AddressSelector />
      </div>

      <div
        v-if="homeStore.loadingHomeData"
        class="fixed inset-0 z-50 flex items-center justify-center bg-white/50 transition-opacity duration-300"
      >
        <div class="p-8 flex flex-col items-center">
          <!-- Spinner -->
          <div
            class="w-16 h-16 border-[5px] border-primary-orange border-t-transparent rounded-full animate-spin mb-4"
          ></div>
        </div>
      </div>

      <!-- BANNER WITH NAME AND TOTAL SAVINGS-->
      <div class="w-full mt-[24px]" :class="`${homeStore.loadingHomeData ? 'animate-pulse' : ''}`">
        <HomeBanner />
      </div>

      <!-- CURRENT INVOICE AND GENERAL INFO -->
      <div
        class="w-full mt-[32px] flex gap-[32px]"
        :class="`${homeStore.loadingHomeData ? 'animate-pulse' : ''}`"
      >
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
            <p class="text-[1.75rem] font-bold">
              {{ homeStore.homeInfo?.generalInfo?.compensatedEnergy || 0 }} kWh
            </p>
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
            <p class="text-[1.75rem] font-bold">
              {{
                Number(homeStore.homeInfo?.generalInfo?.monthSavings || 0).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- CONSUMPTION GRAPH -->
      <div
        class="w-full mt-[24px] pb-[100px]"
        :class="`${homeStore.loadingHomeData ? 'animate-pulse' : ''}`"
      >
        <ConsumptionGraph />
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useHomeStore } from '@/stores/home'

import AddressSelector from '@/components/AddressSelector.vue'
import HomeBanner from '@/components/HomeBanner.vue'
import CurrentInvoice from '@/components/CurrentInvoice.vue'
import ConsumptionGraph from '@/components/ConsumptionGraph.vue'
import HomeSkeleton from '@/components/Skeletons/HomeSkeleton.vue'

const homeStore = useHomeStore()

const homeInfo = computed(() => homeStore.homeInfo)

const currentDateText = computed(() => {
  const date = new Date()
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }

  let formatedDate = date.toLocaleDateString('pt-BR', options)

  formatedDate = formatedDate.replace(/^\w+/g, (day) => day.charAt(0).toUpperCase() + day.slice(1))

  return formatedDate
})

onMounted(async () => {
  homeStore.loadingHome = true

  await homeStore.fetchUserAddresses()
  await homeStore.fetchHomeData()
  await homeStore.fetchGraphicLabels()

  const { month, year } = homeStore.getMonthAndYear(homeStore.consumptionGraphMonths.at(-1).month)

  await homeStore.fetchGraphicDetails(month, year)

  homeStore.loadingHome = false
})
</script>

<style scoped>
</style>