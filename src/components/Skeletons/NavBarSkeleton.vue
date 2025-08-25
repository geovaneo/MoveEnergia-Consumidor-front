<template>
  <div class="flex w-full justify-between items-center py-4">
    <!-- LOGO SKELETON -->
    <div class="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>

    <!-- MENUS SKELETON -->
    <ul class="flex items-center justify-center gap-10">
      <li v-for="i in 3" :key="i" class="h-6 w-24 bg-gray-200 rounded animate-pulse"></li>
    </ul>

    <!-- USER AVATAR SKELETON -->
    <div class="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
  </div>
</template>

<script setup>
</script>