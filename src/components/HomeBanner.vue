<template>
  <div
    class="relative w-full h-[250px] rounded-[20px] bg-primary-blue flex items-center justify-between overflow-hidden"
  >
    <div class="z-1 max-w-[400px] h-[180px] w-full flex flex-col justify-between ml-[24px]">
      <div>
        <h1 class="text-white font-bold text-[2.125rem] w-full line-clamp-2">
          {{ user.name }}
        </h1>
      </div>
      <div class="max-w-[300px] text-[1.375rem] text-white">
        <p>CONOSCO A SUA ECONOMIA É <span class="font-bold">GARANTIDA</span></p>
      </div>
    </div>

    <div class="liquid-glass-element p-[16px] z-2 max-w-[320px] w-full mr-[60px]">
      <div class="flex flex-col gap-[8px] items-end text-right">
        <div
          class="w-[40px] h-[40px] flex justify-center items-center rounded-[10px] border-[0.5px] border-white bg-orange-100 shadow-lg"
        >
          <mdicon name="leaf" size="24" class="text-primary-orange" />
        </div>
        <p class="text-white font-semibold text-[1.375rem] max-w-[210px]">
          Total economizado com a Move Energia
        </p>
        <h2 class="text-[2.375rem] text-white font-bold">
          {{ totalSavings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
        </h2>
      </div>
    </div>

    <img
      :src="homeBannerBackground"
      alt="Banner Background"
      class="absolute z-0 -top-[20px] -right-[60px] object-cover h-[300px] rounded-[20px]"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useHomeStore } from '@/stores/home'
import { useLoginStore } from '@/stores/login'
import homeBannerBackground from '@/assets/images/homeBannerBackground.png'

const homeStore = useHomeStore()
const loginStore = useLoginStore()

const user = computed(() => loginStore.user)
const totalSavings = computed(() => homeStore.homeInfo?.generalInfo?.totalSavings || 0)
</script>


<style scoped>
</style>