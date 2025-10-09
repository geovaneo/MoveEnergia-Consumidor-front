<template>
  <div class="flex flex-col w-full h-full items-center">
    <!-- DATE AND ADDRESS SELECTOR -->
    <div class="flex items-center justify-between w-full pt-[32px]">
      <p class="text-[22px] font-bold">Resumo de faturas</p>
      <AddressSelector />
    </div>
    <!-- LOADING STATE -->
    <div v-if="invoiceStore.loadingInvoices" class="w-full py-12 flex justify-center">
      <div class="p-4 flex flex-col items-center">
        <div
          class="w-12 h-12 border-[4px] border-primary-orange border-t-transparent rounded-full animate-spin mb-4"
        ></div>
        <p class="text-gray-500">Carregando faturas...</p>
      </div>
    </div>

    <div v-else class="w-full mt-8 pb-16">
      <!-- CURRENT INVOICES -->
      <div v-if="currentInvoices.length > 0" class="mb-10">
        <div class="flex flex-row gap-[24px]">
          <h2 class="text-[1.625rem] text-[#F07F3A] font-bold items-center">FATURAS ATUAIS</h2>
          <div
            class="px-[16px] h-[35px] flex items-center gap-[8px] rounded-full"
            :class="invoiceStatus.style"
          >
            <mdicon :name="invoiceStatus.icon" size="24" />
            <span class="text-[1rem] font-bold">{{ invoiceStatus.text }}</span>
          </div>
        </div>

        <template v-if="invoiceStore.selectedConsumerUnit !== 'all'">
          <InvoiceCard
            :invoice="currentInvoices[0]"
            @view-details="viewInvoiceDetails"
            @download-pdf="downloadInvoicePdf"
            :current="true"
          />
        </template>

        <!-- ALL INVOICES -->
        <template v-else>
          <div class="flex flex-col gap-4">
            <div v-for="invoice in currentInvoices" :key="invoice.id" class="flex flex-col">
              <div class="text-sm text-gray-600 mb-1">
                {{ getAddressNameById(invoice.consumerUnitId) }}
              </div>
              <InvoiceCard
                :invoice="invoice"
                @view-details="viewInvoiceDetails"
                @download-pdf="downloadInvoicePdf"
                :current="true"
              />
            </div>
          </div>
        </template>
      </div>

      <!-- OLD INVOICES GROUPED BY YEAR -->
      <div v-for="(yearGroup, year) in groupedInvoices" :key="year" class="mb-10">
        <h2 class="text-[1.75rem] text-[#F07F3A] font-bold items-center">{{ year }}</h2>
        <div class="flex flex-col">
          <InvoiceCard
            v-for="invoice in yearGroup"
            :key="invoice.id"
            :invoice="invoice"
            @view-details="viewInvoiceDetails"
            @download-pdf="downloadInvoicePdf"
          />
        </div>
      </div>

      <!-- NO INVOICE -->
      <div
        v-if="currentInvoices.length === 0 && Object.keys(groupedInvoices).length === 0"
        class="bg-gray-50 rounded-lg p-8 text-center mt-6"
      >
        <mdicon name="file-document-outline" size="48" class="text-gray-400 mb-2 mx-auto" />
        <h3 class="text-lg font-medium text-gray-700">Nenhuma fatura encontrada</h3>
        <p class="text-gray-500 mt-2">Não foram encontradas faturas para este endereço.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useInvoiceStore } from '@/stores/invoice'
import { useHomeStore } from '@/stores/home'
import AddressSelector from '@/components/AddressSelector.vue'
import InvoiceCard from '@/components/InvoiceCard.vue'

const router = useRouter()
const invoiceStore = useInvoiceStore()
const homeStore = useHomeStore()

const getInvoiceStatusStyle = (status) => {
  switch (status) {
    case 'PENDING':
      return {
        style: 'text-warning bg-warning-bg',
        text: 'Você possui faturas a vencer',
        icon: 'alert-circle-outline',
      }
    case 'OVERDUE':
      return {
        style: 'text-red bg-red-bg',
        text: 'Você possui faturas atrasadas',
        icon: 'alert-circle-outline',
      }
    default:
      return {
        style: 'text-green bg-green-bg',
        text: 'Tudo certo por aqui! ;)',
        icon: 'check-circle-outline',
      }
  }
}
// const invoiceStatus = computed(() => getInvoiceStatusStyle(invoiceStore.invoiceDetails.invoicesStatus))
const invoiceStatus = computed(() => getInvoiceStatusStyle('PENDING'))

const getAddressNameById = (id) => {
  const unit = invoiceStore.consumerUnits.find((unit) => unit.id === id)
  return unit ? unit.name : 'Endereço não identificado'
}

const currentInvoices = computed(() => {
  const invoices = invoiceStore.invoicesInfo?.invoices || []
  if (!invoices || invoices.length === 0) return []

  const currentDate = new Date()
  let previousMonth = currentDate.getMonth() - 1
  let currentYear = currentDate.getFullYear()

  if (previousMonth < 0) {
    previousMonth = 11
    currentYear -= 1
  }

  const monthMap = {
    0: 'JANEIRO',
    1: 'FEVEREIRO',
    2: 'MARÇO',
    3: 'ABRIL',
    4: 'MAIO',
    5: 'JUNHO',
    6: 'JULHO',
    7: 'AGOSTO',
    8: 'SETEMBRO',
    9: 'OUTUBRO',
    10: 'NOVEMBRO',
    11: 'DEZEMBRO',
  }

  const previousMonthName = monthMap[previousMonth]
  const expectedBillingMonth = `${previousMonthName}/${currentYear}`

  const previousMonthInvoices = invoices.filter(
    (invoice) => invoice.billingMonth === expectedBillingMonth
  )

  if (previousMonthInvoices.length === 0 && invoiceStore.selectedConsumerUnit !== 'all') {
    return invoices.length > 0 ? [invoices[0]] : []
  }

  return previousMonthInvoices
})

const groupedInvoices = computed(() => {
  const invoices = invoiceStore.invoicesInfo?.invoices || []
  if (!invoices || invoices.length === 0) return {}

  const currentInvoiceIds = currentInvoices.value.map((inv) => inv.id)

  const groupedByYear = {}

  for (const invoice of invoices) {
    if (currentInvoiceIds.includes(invoice.id)) continue

    const [, year] = invoice.billingMonth.split('/')

    if (!groupedByYear[year]) {
      groupedByYear[year] = []
    }

    groupedByYear[year].push(invoice)
  }

  return groupedByYear
})

const viewInvoiceDetails = (invoiceId) => {
  router.push(`/faturas/${invoiceId}`)
}

watch(
  () => homeStore.selectedConsumerUnit,
  async (newValue) => {
    if (newValue) {
      invoiceStore.selectedConsumerUnit = newValue
      await invoiceStore.fetchInvoices()
    }
  }
)

onMounted(async () => {
  await invoiceStore.fetchUserAddresses()
  await invoiceStore.fetchInvoices()
})
</script>