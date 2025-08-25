<template>
  <div class="w-full animate-pulse">
    <!-- TITLE -->
    <div class="w-full pb-2 border-b border-gray-300">
      <div class="h-6 w-48 bg-gray-300 rounded"></div>
    </div>

    <!-- GRAPH AND INFO -->
    <div class="flex justify-between w-full mt-4">
      <!-- MONTHS -->
      <div class="flex items-center gap-2">
        <!-- ARROW LEFT -->
        <div class="h-12 w-12 bg-gray-300 rounded-full"></div>

        <!-- BARS -->
        <div class="flex gap-4 items-end">
          <div v-for="i in 6" :key="i" class="flex flex-col items-center">
            <div
              class="rounded min-w-[60px] bg-gray-300"
              :style="{ height: `${30 + i * 20}px` }"
            ></div>
            <div class="h-4 w-12 mt-2 bg-gray-300 rounded"></div>
          </div>
        </div>

        <!-- ARROW RIGHT -->
        <div class="h-12 w-12 bg-gray-300 rounded-full"></div>
      </div>

      <!-- MONTH INFO -->
      <div class="flex flex-col items-end text-right gap-2">
        <div class="h-4 w-32 bg-gray-300 rounded"></div>
        <div class="flex items-center gap-2">
          <div class="h-6 w-6 bg-gray-300 rounded"></div>
          <div class="h-8 w-24 bg-gray-300 rounded"></div>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-4 w-4 bg-gray-300 rounded"></div>
          <div class="h-4 w-40 bg-gray-300 rounded"></div>
        </div>
        <div class="mt-2 space-y-1">
          <div class="h-3 w-20 bg-gray-300 rounded"></div>
          <div class="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
        <div class="mt-2 space-y-1">
          <div class="h-3 w-20 bg-gray-300 rounded"></div>
          <div class="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
        <div class="mt-2 space-y-1">
          <div class="h-3 w-20 bg-gray-300 rounded"></div>
          <div class="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>

    <!-- CONSUMER UNITS -->
    <div class="mt-8">
      <div class="h-6 w-48 bg-gray-300 rounded"></div>
      <!-- HEADER ROW -->
      <div class="flex items-center justify-between font-bold text-gray-300 text-sm py-2 mt-4">
        <div class="h-4 w-40 bg-gray-300 rounded"></div>
        <div class="h-4 w-20 bg-gray-300 rounded"></div>
        <div class="h-4 w-16 bg-gray-300 rounded"></div>
        <div class="h-4 w-16 bg-gray-300 rounded"></div>
      </div>
      <!-- UNITS ROWS -->
      <div class="flex flex-col gap-2 mt-2">
        <div
          v-for="i in 4"
          :key="i"
          class="flex items-center justify-between py-2 border-b border-gray-300"
        >
          <div class="h-4 w-40 bg-gray-300 rounded"></div>
          <div class="h-4 w-20 bg-gray-300 rounded"></div>
          <div class="h-4 w-16 bg-gray-300 rounded"></div>
          <div class="h-4 w-16 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
