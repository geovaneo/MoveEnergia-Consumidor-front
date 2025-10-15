<template>
  <div>
    <!-- MOBILE -->
    <div v-if="mobileLayout" class="px-[8px] pt-[22px] bg-[#FAF7F5] rounded-[10px]">
      <h2 class="font-bold text-[1.375rem] uppercase">Resumo de Faturas</h2>

      <div class="flex justify-between mt-[24px]">
        <!-- Faturas Pendentes -->
        <div
          class="flex flex-col min-w-[100px] max-[470px]:w-[100px] items-center gap-[8px] pb-[20px]"
        >
          <div>
            <p class="text-base text-[14px] font-semibold">Faturas a vencer</p>
            <p class="text-xl lg:text-[1.625rem] font-bold text-gray-800">{{ pendingInvoices }}</p>
          </div>
        </div>

        <div class="w-[1px] bg-primary-orange h-[90px]"></div>

        <!-- Faturas Atrasadas -->
        <div
          class="flex flex-col min-w-[100px] max-[470px]:w-[100px] items-center gap-[8px] pb-[20px]"
        >
          <div>
            <p class="text-base text-[14px] font-semibold">Faturas Atrasadas</p>
            <p class="text-xl lg:text-[1.625rem] font-bold text-gray-800">{{ overdueInvoices }}</p>
          </div>
        </div>

        <div class="w-[1px] bg-primary-orange h-[90px]"></div>

        <!-- Número de Faturas -->
        <div
          class="flex flex-col min-w-[100px] max-[470px]:w-[100px] items-center gap-[8px] pb-[20px]"
        >
          <div>
            <p class="text-base text-[14px] font-semibold">Número de Faturas</p>
            <p class="text-xl lg:text-[1.625rem] font-bold text-gray-800">{{ totalInvoices }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- DESKTOP -->
    <div v-else class="flex flex-row w-full">
      <!-- Título e informações do cliente -->
      <div
        class="mt-6 lg:mt-[30px] 2xl:mt-[50px] w-full flex flex-col flex-1 2xl:pb-6 lg:pb-[32px]"
      >
        <h2
          class="text-xl lg:text-2xl xl:text-[1.75rem] text-primary-orange items-start font-bold uppercase pr-4 lg:pr-[32px]"
        >
          Resumo de Faturas
        </h2>
        <div class="pt-3 lg:pt-4 flex flex-row items-center gap-2 pr-4 lg:pr-[32px]">
          <div class="relative group">
            <button
              @click="$emit('logout')"
              class="flex items-center justify-center gap-2 h-[50px] w-[50px] text-[24px] font-semibold text-red hover:bg-red-100 cursor-pointer px-3 py-2 rounded-full"
            >
              <mdicon name="logout" size="24" />
            </button>
            <span
              class="absolute left-1/2 -translate-x-1/2 top-14 bg-red-500 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
            >
              Sair
            </span>
          </div>
          <div class="w-full truncate flex flex-col max-w-[350px]">
            <p class="text-xs lg:text-[0.875rem]">Boas-vindas,</p>
            <p class="font-semibold text-sm lg:text-[1rem] truncate w-full">{{ customerName }}</p>
          </div>
        </div>
      </div>

      <!-- Cards de informações de faturas -->
      <div
        class="flex flex-row divide-y lg:divide-y-0 lg:divide-x lg:divide-solid divide-primary-orange mt-4 lg:mt-[30px] 2xl:mt-[50px] gap-2 lg:gap-[0.531rem]"
      >
        <!-- Faturas Pendentes -->
        <div
          class="flex-1 min-h-[80px] lg:min-h-[100px] xl:min-h-[120px] max-w-[160px] flex flex-col items-start px-4 py-3 lg:py-0 lg:border-l lg:border-primary-orange lg:border-solid"
        >
          <p class="text-base lg:text-[1.125rem] font-semibold">
            Faturas <br />
            a vencer
          </p>
          <p class="text-xl lg:text-[1.625rem] font-bold text-gray-800">{{ pendingInvoices }}</p>
        </div>

        <!-- Faturas Atrasadas -->
        <div
          class="flex-1 min-h-[80px] lg:min-h-[100px] xl:min-h-[120px] max-w-[160px] flex flex-col items-start px-4 py-3 lg:py-0"
        >
          <p class="text-base lg:text-[1.125rem] font-semibold">Faturas Atrasadas</p>
          <p class="text-xl lg:text-[1.625rem] font-bold text-gray-800">{{ overdueInvoices }}</p>
        </div>

        <!-- Número de Faturas -->
        <div
          class="flex-1 min-h-[80px] lg:min-h-[100px] xl:min-h-[120px] max-w-[160px] flex flex-col items-start px-4 py-3 lg:py-0"
        >
          <p class="text-base lg:text-[1.125rem] font-semibold">Número de Faturas</p>
          <p class="text-xl lg:text-[1.625rem] font-bold text-gray-800">{{ totalInvoices }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  customerName: {
    type: String,
    default: 'Usuário',
  },
  customerDocument: {
    type: String,
    default: 'XXX.XXX.XXX-XX',
  },
  pendingInvoices: {
    type: [Number, String],
    default: '1',
  },
  overdueInvoices: {
    type: [Number, String],
    default: '1',
  },
  totalInvoices: {
    type: [Number, String],
    default: '132',
  },
  mobileLayout: {
    type: Boolean,
    default: false,
  },
})

const UserMenuOpen = ref(false)

const toggleMenu = () => {
  UserMenuOpen.value = !UserMenuOpen.value
}

// References to detect click outside
import { ref as vueRef } from 'vue'
const menuRef = vueRef(null)
const buttonRef = vueRef(null)

const handleClickOutside = (event) => {
  // If the menu is open and the click was outside the menu and the button, close the menu
  if (
    UserMenuOpen.value &&
    menuRef.value &&
    buttonRef.value &&
    !menuRef.value.contains(event.target) &&
    !buttonRef.value.contains(event.target)
  ) {
    UserMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>