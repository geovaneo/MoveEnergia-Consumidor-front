<template>
  <div class="relative w-full max-w-[500px]" ref="dropdownContainer">
    <div
      class="w-full flex items-center gap-[8px] px-[16px] py-[8px] bg-orange-100 rounded-full cursor-pointer hover:brightness-95 active:brightness-90 transition-all"
      @click="toggleDropdown"
    >
      <mdicon name="map-marker-radius" size="24" />
      <p class="w-full truncate">{{ selectedAddress?.address[0]?.addressStreet }}</p>
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
        class="absolute z-50 mt-2 w-full max-w-[500px] bg-white rounded-lg shadow-xl"
      >
        <div class="max-h-[300px] overflow-y-auto">
          <div
            v-for="(address, index) in userAddresses"
            :key="index"
            class="p-3 hover:bg-gray-100 cursor-pointer transition-colors active:brightness-95"
            :class="{ 'bg-gray-100 font-medium': address.id === selectedAddress.id }"
            @click="selectAddress(address.id)"
          >
            <div class="flex items-center gap-2">
              <mdicon
                name="check"
                size="20"
                class="text-primary"
                :class="`${address.id === selectedAddress.id ? '' : 'invisible'}`"
              />
              <p class="truncate" :title="address?.address[0]?.addressStreet">
                {{ address?.address[0]?.addressStreet }}
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
import { useHomeStore } from '@/stores/home'

const homeStore = useHomeStore()

const dropdownContainer = ref(null)
const isDropdownOpen = ref(false)

const selectedAddress = computed(() =>
  homeStore.consumerUnits.find((address) => address.id === homeStore.selectedConsumerUnit)
)
const userAddresses = computed(() => homeStore.consumerUnits)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const selectAddress = async (addressId) => {
  homeStore.loadingHomeData = true
  homeStore.selectedConsumerUnit = addressId
  closeDropdown()
  await homeStore.fetchHomeData()
  homeStore.loadingHomeData = false
}

// Click outside to close dropdown
const handleClickOutside = (event) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    closeDropdown()
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
</style>