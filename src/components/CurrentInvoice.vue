<template>
  <div class="w-full flex flex-col gap-[8px]">
    <div class="flex items-center justify-between w-full pb-[8px] border-b border-grey-border">
      <h2 class="text-[1.375rem] font-bold">Sua fatura atual</h2>
      <div
        class="px-[16px] h-[35px] flex items-center gap-[8px] rounded-full"
        :class="invoiceStatus.style"
      >
        <mdicon :name="invoiceStatus.icon" size="24" />
        <span class="text-[1rem] font-bold">{{ invoiceStatus.text }}</span>
      </div>
    </div>

    <!-- INVOICE CONTENT -->
    <div
      v-if="currentInvoice"
      class="flex justify-between items-start pb-[8px] border-b border-grey-border"
    >
      <!-- LEFT COLUMN -->
      <div>
        <div class="flex flex-col gap-[8px] font-semibold text-lighten-blue text-[0.875rem]">
          <p>
            Nº de cobrança:
            <span class="text-primary-blue">{{ currentInvoice?.billingNumber }}</span>
          </p>
          <p>
            Data de emissão: <span class="text-primary-blue">{{ currentInvoice?.issuedDate }}</span>
          </p>
          <p>
            Nº de instalação:
            <span class="text-primary-blue">{{ currentInvoice?.installationNumber }}</span>
          </p>
          <p>
            Nº do cliente: <span class="text-primary-blue">{{ currentInvoice?.clientNumber }}</span>
          </p>
        </div>
        <div class="mt-[24px]">
          <p class="font-semibold text-[1rem] text-primary-blue mb-[5px]">Fatura para</p>
          <div class="text-lighten-blue font-medium text-[0.875rem] flex flex-col gap-[5px]">
            <p>{{ currentInvoice?.chargedCustomer.name }}</p>
            <p>{{ currentInvoice?.chargedCustomer.address }}</p>
            <p>{{ currentInvoice?.chargedCustomer.city }}</p>
            <p>{{ currentInvoice?.chargedCustomer.phone }}</p>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="flex flex-col gap-[24px] text-right">
        <div>
          <p class="text-[0.75rem] text-lighten-blue font-medium">Referente a</p>
          <p class="text-[1rem] text-primary-blue font-bold">
            {{ currentInvoice?.billingMonth }}
          </p>
        </div>
        <div>
          <p class="text-[0.75rem] text-lighten-blue font-medium">Vencimento</p>
          <p class="text-[1rem] text-primary-blue font-bold">
            {{ currentInvoice?.dueDate }}
          </p>
        </div>
        <div>
          <p class="text-[0.75rem] text-lighten-blue font-medium">Total da fatura</p>
          <p class="text-[1.5rem] text-primary-blue font-bold">
            {{
              Number(currentInvoice?.totalValue).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })
            }}
          </p>
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex h-[185px] justify-center items-center pb-[8px] border-b border-grey-border"
    >
      <p class="text-lighten-blue text-[1.125rem]">Nenhuma fatura encontrada</p>
    </div>

    <!-- BUTTONS -->
    <div class="flex justify-between items-center">
      <button
        class="h-[40px] px-[24px] bg-white border rounded-[10px] text-[1rem] font-medium hover:bg-orange-100 active:brightness-95 transition-all cursor-pointer"
        :class="
          !currentInvoice
            ? 'pointer-events-none text-gray-400 border-gray-400'
            : 'border-primary-orange text-primary-orange'
        "
      >
        Ver todas
      </button>
      <button
        class="h-[40px] px-[24px] border text-white rounded-[10px] text-[1rem] font-medium hover:brightness-110 active:brightness-85 transition-all cursor-pointer"
        :class="
          !currentInvoice
            ? 'pointer-events-none bg-gray-300 border-gray-300'
            : 'border-primary-orange bg-primary-orange'
        "
      >
        Avançar para detalhes
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useHomeStore } from '@/stores/home'

const homeStore = useHomeStore()

const getInvoiceStatusStyle = (status) => {
  switch (status) {
    case 'PENDING':
      return {
        style: 'text-warning bg-warning-bg',
        text: 'Você possuí faturas pendentes',
        icon: 'alert-circle-outline',
      }
    case 'OVERDUE':
      return {
        style: 'text-red bg-red-bg',
        text: 'Você possuí faturas atrasadas',
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

const currentInvoice = computed(() => homeStore.homeInfo.currentInvoice)
const invoiceStatus = computed(() => getInvoiceStatusStyle(homeStore.homeInfo.invoicesStatus))
</script>

<style>
</style>