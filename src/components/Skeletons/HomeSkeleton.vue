<template>
  <div class="flex flex-col w-full h-full items-center">
    <!-- DATE AND ADDRESS SELECTOR -->
    <div class="flex items-center justify-between w-full pt-[32px]">
      <div class="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
      <div class="h-10 w-44 bg-gray-200 rounded animate-pulse"></div>
    </div>

    <!-- BANNER -->
    <div class="w-full mt-[24px]">
      <div class="h-32 bg-gray-200 rounded animate-pulse"></div>
    </div>

    <!-- CURRENT INVOICE + CARDS -->
    <div class="w-full mt-[32px] flex gap-[32px]">
      <div class="flex-1 h-52 bg-gray-200 rounded animate-pulse"></div>
      <div class="flex flex-col h-full max-w-[195px] w-full gap-[32px]">
        <div class="h-32 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>

    <!-- CONSUMPTION GRAPH -->
    <div class="w-full mt-[24px] pb-[100px]">
      <div class="h-72 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
</template>

<script setup>
</script>