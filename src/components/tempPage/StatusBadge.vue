<template>
  <div
    class="rounded-[10px] p-[5px] gap-[10px] text-[0.75rem] font-semibold items-center uppercase"
    :class="statusClass"
  >
    {{ statusText }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['PAID', 'PENDING', 'OVERDUE'].includes(value),
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
})

const statusClass = computed(() => {
  const baseClasses = {
    PAID: 'bg-[#CEFFD0] text-[#007A25]',
    PENDING: 'bg-[#FDF8E2] text-[#C5A100]',
    OVERDUE: 'bg-[#FFE1E1] text-[#B81937]',
  }

  const sizeClasses = {
    small: 'text-[0.625rem] py-[3px] px-[6px]',
    default: '',
    large: 'text-[0.875rem] py-[6px] px-[10px]',
  }

  return `${baseClasses[props.status] || 'bg-gray-100 text-gray-700'} ${sizeClasses[props.size]}`
})

const statusText = computed(() => {
  const statusTextMap = {
    PAID: 'Fatura Paga',
    PENDING: 'A vencer',
    OVERDUE: 'Atrasada',
  }
  return statusTextMap[props.status] || 'Não informado'
})
</script>