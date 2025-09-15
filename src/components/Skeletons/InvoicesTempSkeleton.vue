<template>
  <div class="flex flex-col w-full h-full items-center">
    <!-- BANNER (300px de altura) -->
    <div class="w-full mt-[24px]">
      <div class="h-[280px] bg-gray-200 rounded-[20px] animate-pulse"></div>
    </div>

    <!-- LINHA COM 45px DE ALTURA E MARGIN-Y DE 32px -->
    <div class="w-full my-[32px]">
      <div class="h-[35px] bg-gray-200 rounded-[20px] animate-pulse"></div>
    </div>

    <!-- LISTA DE 5 ITENS -->
    <div class="w-full max-w-[915px]">
      <div
        v-for="i in 4"
        :key="i"
        class="h-[70px] bg-gray-200 rounded-[20px] animate-pulse mb-[16px]"
      ></div>
    </div>
  </div>
</template>