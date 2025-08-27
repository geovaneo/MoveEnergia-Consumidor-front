<template>
  <div class="w-full">
    <template v-if="homeStore.consumptionGraphMonths.length === 0">
      <ConsumptionGraphSkeleton />
    </template>

    <template v-else>
      <!-- TITLE -->
      <div class="w-full pb-[8px] border-b border-grey-border flex items-center gap-[16px]">
        <h2 class="text-[1.375rem] font-bold">Histórico de consumo</h2>
        <!-- SPINNER -->
        <div
          v-if="homeStore.loadingConsumptionGraph"
          class="w-[16px] h-[16px] border-[3px] border-primary-orange border-t-transparent rounded-full animate-spin"
        ></div>
      </div>

      <!-- GRAPH AND INFO -->
      <div class="flex justify-between w-full mt-[16px]">
        <!-- MONTHS -->
        <div class="flex items-center">
          <!-- ARROW LEFT -->
          <button
            :class="`${
              isFirstMonthInView
                ? 'pointer-events-none disabled opacity-90 text-gray-300'
                : 'text-primary-orange'
            }`"
            @click="goToPreviousMonth()"
            class="h-[50px] w-[50px] hover:bg-orange-50 active:bg-orange-100 transition-all rounded-full flex items-center justify-center mr-[8px]"
          >
            <mdicon name="arrow-left" size="40" class="cursor-pointer" />
          </button>
          <div class="flex gap-[16px] items-end">
            <div
              v-for="(month, index) in visibleMonths"
              :key="index"
              class="flex flex-col items-center"
              :class="`${
                homeStore.loadingConsumptionGraph ? 'animate-pulse pointer-events-none' : ''
              }`"
              @click="selectConsumptionGraphMonth(month.month)"
            >
              <!-- BAR -->
              <div
                class="rounded-[5px] min-w-[60px]"
                :class="`${
                  isSelectedMonth(month.month)
                    ? 'bg-primary-blue'
                    : 'bg-primary-blue/20 hover:bg-primary-blue/50 active:bg-primary-blue/80 transition-colors duration-75 cursor-pointer'
                }`"
                :style="{ height: `${getBarHeight(month.consumption)}px` }"
              ></div>
              <!-- LABEL -->
              <span class="mt-[8px] text-[0.75rem] font-bold uppercase">
                {{ month.month.split('/')[0] }} {{ month.month.split('/')[1].slice(-2) }}
              </span>
            </div>
          </div>
          <!-- ARROW RIGHT -->
          <button
            :class="`${
              isLastMonthInView
                ? 'pointer-events-none disabled opacity-90 text-gray-300'
                : 'text-primary-orange'
            }`"
            @click="goToNextMonth"
            class="h-[50px] w-[50px] hover:bg-orange-50 active:bg-orange-100 transition-all rounded-full flex items-center justify-center ml-[8px]"
          >
            <mdicon name="arrow-right" size="40" class="cursor-pointer" />
          </button>
        </div>

        <!-- MONTH INFO -->
        <div class="flex flex-col items-end text-right">
          <p class="text-[0.875rem] font-bold text-lighten-blue">
            Mês de {{ getSelectedMonthText }}
          </p>
          <div class="flex items-center gap-[8px]">
            <mdicon name="lightning-bolt" size="24" class="text-primary-orange" />
            <p class="text-[1.75rem] font-bold text-primary-blue">
              {{ consumptionGraphDetails.consumption }} kWh
            </p>
          </div>
          <div class="flex items-center gap-[8px]">
            <mdicon
              :name="
                consumptionGraphDetails.increasedConsumption > 0 ? 'trending-up' : 'trending-down'
              "
              size="16"
              class="text-lighten-blue"
            />
            <p class="text-[0.875rem] font-regular text-lighten-blue">
              {{
                consumptionGraphDetails.increasedConsumption > 0
                  ? `${consumptionGraphDetails.increasedConsumption}% de aumento no consumo`
                  : `${consumptionGraphDetails.increasedConsumption}% de redução no consumo`
              }}
            </p>
          </div>
          <div class="mt-[10px] text-[0.875rem] font-semibold">
            <p class="text-lighten-blue">Período</p>
            <p class="text-primary-blue">{{ consumptionGraphDetails.period }}</p>
          </div>
          <div class="mt-[10px] text-[0.875rem] font-semibold">
            <p class="text-lighten-blue">Fatura do mês</p>
            <p class="text-primary-blue">
              {{
                Number(consumptionGraphDetails.totalInvoice).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })
              }}
            </p>
          </div>
          <div class="mt-[10px] text-[0.875rem] font-semibold">
            <p class="text-lighten-blue">Economia no mês</p>
            <p class="text-primary-blue">
              {{
                Number(consumptionGraphDetails.monthSavings).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- CONSUMER UNITS -->
      <div class="mt-[32px]">
        <h3 class="text-[1.125rem] font-bold text-primary-orange">Unidades Consumidoras</h3>
      </div>
      <div
        class="flex items-center justify-between font-bold text-primary-orange text-[0.875rem] py-[8px] mt-[16px] pr-[5px]"
      >
        <p class="max-w-[400px] w-full">Unidade</p>
        <p class="max-w-[150px] w-full text-right">Energia Compensada</p>
        <p class="max-w-[110px] w-full text-right">Fatura</p>
        <p class="max-w-[110px] w-full text-right">Desconto</p>
      </div>
      <div
        v-if="consumerUnits.length > 0"
        class="flex flex-col max-h-[420px] -mr-[5px] pr-[5px] overflow-y-auto"
      >
        <div
          v-for="unit in consumerUnits"
          :key="unit"
          class="flex items-center justify-between py-[8px] text-[1rem] font-medium border-b border-grey-border"
        >
          <p class="max-w-[400px] truncate w-full">{{ unit.name }}</p>
          <p class="max-w-[150px] w-full text-right">{{ unit.consumption }} kWh</p>
          <p class="max-w-[110px] w-full text-right">
            {{
              Number(unit.totalInvoice).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })
            }}
          </p>
          <p class="max-w-[110px] w-full text-right">
            {{
              Number(unit.savings).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            }}
          </p>
        </div>
      </div>
      <div v-else>
        <p class="text-[1rem] font-medium text-center text-grey py-[32px]">
          Nenhuma unidade consumidora encontrada para este mês.
        </p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useHomeStore } from '@/stores/home'

import ConsumptionGraphSkeleton from '@/components/Skeletons/ConsumptionGraphSkeleton.vue'

const homeStore = useHomeStore()

// -----------------------------------
// MONTHS VISIBILITY CONTROL

const visibleStartIndex = ref(0)
const visibleMonthsCount = 7

const visibleMonths = computed(() => {
  return homeStore.consumptionGraphMonths.slice(
    visibleStartIndex.value,
    visibleStartIndex.value + visibleMonthsCount
  )
})

const isFirstMonthInView = computed(() => {
  return visibleStartIndex.value === 0
})

const isLastMonthInView = computed(() => {
  return visibleStartIndex.value + visibleMonthsCount >= homeStore.consumptionGraphMonths.length
})

watch(
  () => homeStore.consumptionGraphMonths,
  (newMonths) => {
    if (newMonths.length > 0) {
      visibleStartIndex.value = Math.max(0, newMonths.length - visibleMonthsCount)
    }
  }
)

const initializeVisibleWindow = () => {
  const totalMonths = homeStore.consumptionGraphMonths.length
  if (totalMonths > 0) {
    // Mostrar os últimos 7 meses (ou todos se tiver menos de 7)
    visibleStartIndex.value = Math.max(0, totalMonths - visibleMonthsCount)
  }
}

// -----------------------------------
// MONTHS LABEL AND BAR SETTINGS
const maxBarHeight = 210
const maxConsumption = computed(() => {
  const visible = visibleMonths.value
  return Math.max(...visible.map((m) => m.consumption))
})

const getBarHeight = (consumption) => {
  if (!maxConsumption.value || maxConsumption.value === 0) return 0
  return (consumption / maxConsumption.value) * maxBarHeight
}

const isSelectedMonth = (month) => {
  return month === selectedConsumptionGraphMonth.value
}

const goToPreviousMonth = () => {
  if (visibleStartIndex.value > 0) {
    visibleStartIndex.value--
  }
}

const goToNextMonth = () => {
  if (visibleStartIndex.value + visibleMonthsCount < homeStore.consumptionGraphMonths.length) {
    visibleStartIndex.value++
  }
}

// -----------------------------------
// DETAILS INFO SETTINGS
const consumptionGraphDetails = computed(() => {
  return homeStore.consumptionGraphDetails
})

const selectedConsumptionGraphMonth = computed(() => {
  return homeStore.consumptionGraphDetails.month
})

const getSelectedMonthText = computed(() => {
  const monthMap = {
    JAN: 'Janeiro',
    FEV: 'Fevereiro',
    MAR: 'Março',
    ABR: 'Abril',
    MAI: 'Maio',
    JUN: 'Junho',
    JUL: 'Julho',
    AGO: 'Agosto',
    SET: 'Setembro',
    OUT: 'Outubro',
    NOV: 'Novembro',
    DEZ: 'Dezembro',
  }
  if (!selectedConsumptionGraphMonth.value) return ''

  const monthAbbr = selectedConsumptionGraphMonth.value.split('/')[0]

  return monthMap[monthAbbr] || ''
})

const selectConsumptionGraphMonth = async (month) => {
  homeStore.loadingConsumptionGraph = true
  const { month: selectedMonth, year: selectedYear } = homeStore.getMonthAndYear(month)
  await homeStore.fetchGraphicDetails(selectedMonth, selectedYear)
  homeStore.loadingConsumptionGraph = false

  const selectedIndex = homeStore.consumptionGraphMonths.findIndex((m) => m.month === month)
  if (selectedIndex !== -1) {
    if (
      selectedIndex < visibleStartIndex.value ||
      selectedIndex >= visibleStartIndex.value + visibleMonthsCount
    ) {
      visibleStartIndex.value = Math.max(0, selectedIndex - Math.floor(visibleMonthsCount / 2))
    }
  }
}

// -----------------------------------
// CONSUMER UNITS
const consumerUnits = computed(() => {
  return homeStore.consumptionGraphDetails?.consumerUnit || []
})

// -----------------------------------
// ON MOUNTED
onMounted(() => {
  if (homeStore.consumptionGraphMonths.length > 0) {
    initializeVisibleWindow()
  }
})
</script>