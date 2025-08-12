<template>
  <div class="app-container">
    <div class="max-w-[915px] w-full h-full py-[30px]">
      <NavBar />
      <div class="main-content">
        <div class="router-view-container">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
</script>


<style scoped>
.app-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
}

.main-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
}

.router-view-container {
  flex-grow: 1;
  overflow-y: auto;
  max-width: 100%;
  box-sizing: border-box;
}
</style>