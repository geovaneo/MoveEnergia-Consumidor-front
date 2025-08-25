<template>
  <div class="w-full flex flex-col gap-[8px]">
    <div class="flex items-center justify-between w-full pb-[8px] border-b border-grey-border">
      <h2 class="text-[1.375rem] font-bold">Sua fatura atual</h2>
      <div
        class="text-[#C5A100] bg-[#FDF8E2] px-[16px] h-[35px] flex items-center gap-[8px] rounded-full"
      >
        <mdicon name="alert-circle-outline" size="24" />
        <span class="text-[1rem] font-bold">Você possuí faturas pendentes</span>
      </div>
    </div>

    <!-- INVOICE CONTENT -->
    <div class="flex justify-between items-start pb-[8px] border-b border-grey-border">
      <!-- LEFT COLUMN -->
      <div>
        <div class="flex flex-col gap-[8px] font-semibold text-lighten-blue text-[0.875rem]">
          <p>
            Nº de cobrança:
            <span class="text-primary-blue">{{ currentInvoice.billingNumber }}</span>
          </p>
          <p>
            Data de emissão: <span class="text-primary-blue">{{ currentInvoice.issuedDate }}</span>
          </p>
          <p>
            Nº de instalação:
            <span class="text-primary-blue">{{ currentInvoice.installationNumber }}</span>
          </p>
          <p>
            Nº do cliente: <span class="text-primary-blue">{{ currentInvoice.clientNumber }}</span>
          </p>
        </div>
        <div class="mt-[24px]">
          <p class="font-semibold text-[1rem] text-primary-blue mb-[5px]">Fatura para</p>
          <div class="text-lighten-blue font-medium text-[0.875rem] flex flex-col gap-[5px]">
            <p>{{ currentInvoice.chargedCustomer.name }}</p>
            <p>{{ currentInvoice.chargedCustomer.address }}</p>
            <p>{{ currentInvoice.chargedCustomer.city }}</p>
            <p>{{ currentInvoice.chargedCustomer.phone }}</p>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="flex flex-col gap-[24px] text-right">
        <div>
          <p class="text-[0.75rem] text-lighten-blue font-medium">Referente a</p>
          <p class="text-[1rem] text-primary-blue font-bold">
            {{ currentInvoice.billingMonth }}
          </p>
        </div>
        <div>
          <p class="text-[0.75rem] text-lighten-blue font-medium">Vencimento</p>
          <p class="text-[1rem] text-primary-blue font-bold">
            {{ currentInvoice.dueDate }}
          </p>
        </div>
        <div>
          <p class="text-[0.75rem] text-lighten-blue font-medium">Total da fatura</p>
          <p class="text-[1.5rem] text-primary-blue font-bold">
            {{
              Number(currentInvoice.totalValue).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- BUTTONS -->
    <div class="flex justify-between items-center">
      <button
        class="h-[40px] px-[24px] bg-white border border-primary-orange text-primary-orange rounded-[10px] text-[1rem] font-medium hover:bg-orange-100 active:brightness-95 transition-all cursor-pointer"
      >
        Ver todas
      </button>
      <button
        class="h-[40px] px-[24px] bg-primary-orange border border-primary-orange text-white rounded-[10px] text-[1rem] font-medium hover:brightness-110 active:brightness-85 transition-all cursor-pointer"
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

const currentInvoice = computed(() => homeStore.homeInfo.currentInvoice)
</script>

<style>
</style>