<template>
  <div class="flex w-full justify-between items-center">
    <img :src="cotesaLogo" alt="Move Energia Logo" class="max-w-[190px]" />
    <ul class="flex items-center justify-center gap-[40px]">
      <li
        v-for="menu in menus"
        :key="menu.title"
        class="text-[1.125rem] transition-colors text-lighten-blue hover:text-primary-blue"
        :class="`${
          isActive(menu)
            ? 'text-primary-orange font-bold underline underline-offset-[5px] decoration-[5px] hover:text-primary-orange'
            : 'font-medium'
        }`"
      >
        <router-link :to="menu.path">{{ menu.title }}</router-link>
      </li>
    </ul>
    <div class="relative">
      <!-- botão foto -->
      <div
        class="rounded-full border border-white shadow-sm cursor-pointer"
        @click="toggleMenu"
        ref="buttonRef"
      >
        <img
          :src="userDefault"
          alt="User Photo"
          class="rounded-full w-[50px] h-[50px] object-cover"
        />
      </div>

      <transition name="fade" mode="out-in">
        <div
          v-if="UserMenuOpen"
          ref="menuRef"
          class="absolute top-0 left-[60px] shadow-lg rounded-md w-[200px] z-50 transition-all ease-in-out text-[grey]"
        >
          <button
            @click="meusDados"
            class="flex items-center h-[50px] gap-2 w-full mb-2 text-[1rem] text-[grey] font-semibold hover:bg-gray-100 rounded-md cursor-pointer px-3 py-2"
          >
            <mdicon name="account" size="24" class="mr-[4px]" />
            Meus dados
          </button>

          <button
            @click="sair"
            class="flex items-center gap-2 h-[50px] w-full text-[1rem] font-semibold text-red hover:bg-red-50 rounded-md cursor-pointer px-3 py-2"
          >
            <mdicon name="logout" size="24" class="mr-[4px]" />
            Sair
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import cotesaLogo from '@/assets/images/cotesaLogo.png'
import userDefault from '@/assets/images/userDefault.png'
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (menu) => {
  return menu.path === route.path
}

const menus = ref([
  { title: 'Visão Geral', path: '/' },
  { title: 'Faturas', path: '/faturas' },
  { title: 'Ajuda', path: '/ajuda' },
])

const UserMenuOpen = ref(false)

const toggleMenu = () => {
  UserMenuOpen.value = !UserMenuOpen.value
}

// Referências para detectar clique fora
import { ref as vueRef } from 'vue'
const menuRef = vueRef(null)
const buttonRef = vueRef(null)

const handleClickOutside = (event) => {
  // Se o menu estiver aberto e o clique foi fora do menu e do botão, fecha o menu
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

<style>
</style>