<template>
  <div class="app-container">
    <div class="max-w-[975px] w-full p-[30px]">
      <NavBar />
      <div class="main-content">
        <div class="router-view-container">
          <RouterView v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </RouterView>
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
  overflow-y: auto;
}

.main-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: calc(100% - 56px);
}

.router-view-container {
  flex-grow: 1;
  overflow-y: auto;
  max-width: 100%;
  overflow: visible;
  box-sizing: border-box;
  height: 100%;
}
</style>