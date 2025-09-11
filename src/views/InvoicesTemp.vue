<template>
  <div class="app-container pt-[30px] h-[calc(100vh-30px)] gap-[73px] justify-center">
    <div class="max-w-[915px] h-[calc(100vh-100px)]">
      <div class="w-full rounded-[10px] bg-[#FAF7F5]">
        <div class="px-[30px] pt-[30px] w-[915px]">

          <!-- LOGO -->
          <div class="flex flex-row gap-[100px] justify-between">
            <img :src="cotesaLogo" alt="Move Energia Logo" class="max-w-[245px] max-h-[65px]" />

            <!-- ADDRESS SELECTOR -->
            <div class="pt-[12px] justify-end">
              <AddressSelector :isColor="false" class="border border-gray-300 rounded-full" />
            </div>
          </div>

          <!-- INVOICES INFORMATION -->
          <InvoiceInformation
            customerName="Eztools consultoria em tecnologia da informação LTDA"
            customerDocument="CNPJ: 36.140.482/0001-22"
            :pendingInvoices="invoicesStore.invoiceSummary.pendingInvoices"
            :overdueInvoices="invoicesStore.invoiceSummary.overdueInvoices"
            :totalInvoices="invoicesStore.invoiceSummary.totalInvoices"
          />
        </div>
      </div>
      <div class="w-full my-8 border-b border-[#D2D2D2] px-[4px] pb-2">
        <h2 class="font-bold text-[1.375rem]">Lista de Faturas</h2>
      </div>

      <!-- INVOICE SUMMARY CARDS LIST -->
      <div class="overflow-y-auto h-[calc(100vh-450px)] pr-2">
        <InvoiceSummaryCard
          v-for="invoice in invoicesStore.sortedInvoices"
          :key="invoice.id"
          :referenceMonth="invoice.referenceMonth"
          :dueDate="invoice.dueDate"
          :totalValue="invoice.totalValue"
          :status="invoice.status"
          @show-invoice-details="handleShowInvoiceDetails(invoice)"
        />
      </div>
    </div>
    
    <!-- INVOICE DETAILS PANEL -->
    <transition
      enter-active-class="transform transition ease-in-out duration-300"
      enter-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transform transition ease-in-out duration-300"
      leave-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="selectedInvoice"
        class="fixed top-0 right-0 h-screen bg-[#FAF7F5] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] z-50 border-l border-[#D2D2D2]"
      >
        <InvoiceDetailsPanel :invoice="selectedInvoice" @close="closeInvoiceDetails" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import cotesaLogo from '@/assets/images/cotesaLogo.png'
import AddressSelector from '@/components/tempPage/AddressSelectorTemp.vue'
import InvoiceInformation from '@/components/tempPage/InvoiceInformation.vue'
import InvoiceSummaryCard from '@/components/tempPage/InvoiceSummaryCard.vue'
import InvoiceDetailsPanel from '@/components/tempPage/InvoiceDetailsPanel.vue'
import { useInvoicesStore } from '@/stores/invoicesTemp.js'

const invoicesStore = useInvoicesStore()
const selectedInvoice = ref(null)

onMounted(async () => {

  try {
    await invoicesStore.fetchUserAddresses()

    if (invoicesStore.addresses.length > 0) {
      await invoicesStore.fetchInvoicesByAddress(invoicesStore.selectedAddressId)
    }
  } catch (error) {
    console.error('Error loading', error)
  }
})

function handleShowInvoiceDetails(invoice) {
  selectedInvoice.value = invoice
}
function closeInvoiceDetails() {
  selectedInvoice.value = null
}
</script>

<style scoped>
.app-container {
  display: flex;
  align-items: center;
  flex-direction: row;

  box-sizing: border-box;
  overflow-y: auto;
}
</style>