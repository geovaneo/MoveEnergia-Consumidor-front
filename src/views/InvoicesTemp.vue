<template>
  <div
    class="app-container lg:pt-[15px] 2xl:pt-[30px] h-[calc(100vh-30px)] gap-[73px] justify-center"
  >
    <InvoicesTempSkeleton class="max-w-[915px]" v-if="invoicesStore.loading" />
    <div v-else>
      <div class="max-w-[915px] h-[calc(100vh-100px)]">
        <div class="w-full rounded-[10px] bg-[#FAF7F5]">
          <div class="px-[30px] pt-[30px] w-[915px]">
            <!-- LOGO -->
            <div class="flex flex-row gap-[100px] justify-between">
              <img
                :src="cotesaLogo"
                alt="Move Energia Logo"
                class="lg:max-w-[200px] xl:max-w-[220px] 2xl:max-w-[245px] md:max-h-[45px] lg:max-h-[55px] xl:max-h-[65px]"
              />

              <!-- ADDRESS SELECTOR -->
              <div class="pt-[12px] justify-end">
                <AddressSelector :isColor="false" class="border border-gray-300 rounded-full" />
              </div>
            </div>

            <!-- INVOICES INFORMATION -->
            <InvoiceInformation
              :customerName="userFullName"
              :pendingInvoices="invoicesStore.invoiceSummary.pendingInvoices"
              :overdueInvoices="invoicesStore.invoiceSummary.overdueInvoices"
              :totalInvoices="invoicesStore.invoiceSummary.totalInvoices"
              @logout="loginStore.logoutUser()"
            />
            <!-- customerDocument="" -->
          </div>
        </div>
        <div
          class="w-full flex flex-row justify-between lg:my-4 2xl:my-8 border-b border-[#D2D2D2] px-[4px] pb-2"
        >
          <h2 class="font-bold text-[1.375rem]">Lista de Faturas</h2>
          <div
            class="rounded-full py-2 px-4 flex items-center gap-2 text-sm font-medium"
            :class="invoiceStatus.style"
          >
            <mdicon :name="invoiceStatus.icon" size="20" />
            <span>{{ invoiceStatus.text }}</span>
          </div>
        </div>

        <!-- INVOICE SUMMARY CARDS LIST -->
        <div class="overflow-y-auto 2xl:h-[calc(100vh-480px)] lg:h-[calc(100vh-400px)] pr-2">
          <InvoiceSummaryCard
            v-for="invoice in invoicesStore.sortedInvoices"
            :key="invoice.id"
            :referenceMonth="invoice.referenceMonth"
            :dueDate="invoice.dueDate"
            :totalValue="invoice.totalValue"
            :status="invoice.status"
            @show-invoice-details="handleShowInvoiceDetails(invoice)"
          />
          <div
            v-if="invoicesStore.sortedInvoices.length === 0 && invoicesStore.selectedAddressId"
            class="text-center py-10 text-gray-500"
          >
            Nenhuma fatura encontrada.
          </div>
        </div>
      </div>

      <!-- INVOICE DETAILS PANEL -->
      <transition name="slide" mode="out-in">
        <div
          v-if="selectedInvoice"
          class="fixed top-0 right-0 h-screen bg-[#FAF7F5] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] z-50"
        >
          <InvoiceDetailsPanel :invoice="selectedInvoice" @close="closeInvoiceDetails" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import cotesaLogo from '@/assets/images/cotesaLogo.png'
import AddressSelector from '@/components/tempPage/AddressSelectorTemp.vue'
import InvoiceInformation from '@/components/tempPage/InvoiceInformation.vue'
import InvoiceSummaryCard from '@/components/tempPage/InvoiceSummaryCard.vue'
import InvoiceDetailsPanel from '@/components/tempPage/InvoiceDetailsPanel.vue'
import InvoicesTempSkeleton from '@/components/Skeletons/InvoicesTempSkeleton.vue'
import { useInvoicesStore } from '@/stores/invoicesTemp.js'
import { useLoginStore } from '@/stores/login'

const invoicesStore = useInvoicesStore()
const loginStore = useLoginStore()
const selectedInvoice = ref(null)

const user = computed(() => loginStore.user)

const userFullName = computed(() => {
  const { name = '', surname = '' } = user.value || {}
  const fullName = [name, surname].filter(Boolean).join(' ')
  return fullName || 'Usuário'
})

const getInvoiceStatusStyle = (hasOverdue, hasPending) => {
  if (hasOverdue) {
    return {
      style: 'text-[#D10000] bg-[#FFD6D6]',
      text: 'Você possui faturas atrasadas',
      icon: 'alert-circle-outline',
    }
  } else if (hasPending) {
    return {
      style: 'text-[#C5A100] bg-[#FDF8E2]',
      text: 'Você possui faturas pendentes',
      icon: 'alert-circle-outline',
    }
  } else {
    return {
      style: 'text-[#007A25] bg-[#CEFFD0]',
      text: 'Tudo certo por aqui! ;)',
      icon: 'check-circle-outline',
    }
  }
}

const invoiceStatus = computed(() => {
  const hasOverdue = invoicesStore.invoices.some((invoice) => invoice.status === 'OVERDUE')
  const hasPending = invoicesStore.invoices.some((invoice) => invoice.status === 'PENDING')
  return getInvoiceStatusStyle(hasOverdue, hasPending)
})

onMounted(async () => {
  try {
    if (invoicesStore.addresses.length > 0) {
      await invoicesStore.invoicesByAddress(invoicesStore.selectedAddressId)
    }
  } catch (error) {
    console.error('Error loading', error)
  }
})

function handleShowInvoiceDetails(invoice) {
  setTimeout(() => {
    selectedInvoice.value = invoice
  }, 10)
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

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease-in-out;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>