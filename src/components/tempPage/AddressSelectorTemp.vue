<template>
  <div class="relative w-full max-w-[500px]" ref="dropdownContainer">
    <div
      v-bind="$attrs"
      :class="[
        'w-full flex items-center gap-[8px] px-[16px] py-[8px] rounded-full cursor-pointer hover:brightness-95 active:brightness-90 transition-all',
        isColor ? 'bg-orange-100' : 'bg-transparent',
      ]"
      @click="toggleDropdown"
    >
      <mdicon name="map-marker-radius" size="24" />
      <p class="w-full truncate">
        {{ currentAddress ? currentAddress.address : 'Selecione um endereço' }}
      </p>
      <mdicon
        name="menu-down"
        size="24"
        class="transition-all"
        :class="`${isDropdownOpen ? 'rotate-180' : ''}`"
      />
    </div>

    <!-- Dropdown menu -->
    <transition name="fade" mode="out-in">
      <div
        v-if="isDropdownOpen"
        class="absolute z-50 mt-2 w-full max-w-[500px] min-w-[500px] bg-white rounded-lg shadow-xl"
      >
        <div v-if="invoicesStore.loading" class="p-3 text-center text-gray-500">
          <p>Carregando endereços...</p>
        </div>
        <div v-else class="max-h-[300px] overflow-y-auto">
          <div
            v-for="address in invoicesStore.addresses"
            :key="address.uc"
            class="p-3 hover:bg-gray-100 cursor-pointer transition-colors active:brightness-95"
            :class="{ 'bg-gray-100 font-medium': address.uc === invoicesStore.selectedAddressId }"
            @click="selectAddress(address.uc)"
          >
            <div class="flex items-center gap-2">
              <mdicon
                name="check"
                size="20"
                class="text-primary-orange"
                :class="`${address.uc === invoicesStore.selectedAddressId ? '' : 'invisible'}`"
              />
              <p class="truncate" :title="address.address">
                {{ address.address }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useInvoicesStore } from '@/stores/invoicesTemp'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  isColor: { type: Boolean, default: true },
})

const isColor = props.isColor

const invoicesStore = useInvoicesStore()

const dropdownContainer = ref(null)
const isDropdownOpen = ref(false)

const currentAddress = computed(() => invoicesStore.currentAddress)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value

  if (isDropdownOpen.value && invoicesStore.addresses.length === 0) {
    invoicesStore.userAddresses()
  }
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const selectAddress = async (addressId) => {
  invoicesStore.loading = true

  await invoicesStore.selectAddress(addressId)

  closeDropdown()
}

const handleClickOutside = (event) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  if (invoicesStore.addresses.length === 0) {
    invoicesStore.userAddresses()
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>