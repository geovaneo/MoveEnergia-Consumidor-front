<template>
  <div style="font-family: 'Red Hat Display', sans-serif">
    <div class="w-[100vw] h-[100vh] flex max-[1023px]:hidden">
      <!-- LEFT SIDE -->
      <div class="flex flex-col grow relative p-[30px]">
        <div>
          <img
            :src="cotesaLogo"
            alt="Logo Move Energia"
            class="max-h-[65px] max-[1400px]:h-[50px]"
          />
        </div>
        <!-- LOGIN FORM -->
        <form
          class="w-full h-full flex flex-col items-center justify-center text-[1.125rem] max-[1400px]:text-[1rem]"
          autocomplete="on"
        >
          <div class="max-w-[450px] w-full">
            <h1 class="text-[2.5rem] max-[1400px]:text-[2rem] font-bold text-center">
              Portal do Consumidor
            </h1>
            <p class="text-lighten-blue mt-[24px] max-[1400px]:mt-[8px] text-center">
              Entre com suas credenciais
            </p>

            <!-- LOGIN -->
            <div
              class="mt-[40px] max-[1400px]:mt-[24px]"
              :class="`${loadingLogin ? 'cursor-progress' : ''}`"
            >
              <div class="flex flex-col gap-[8px]">
                <label for="user" class="font-medium">Login</label>
                <input
                  v-model="loginForm.userName"
                  type="text"
                  id="user"
                  required
                  placeholder="Insira seu login"
                  autocomplete="username"
                  class="h-[56px] bg-orange-50 border border-grey-border rounded-[10px] px-[16px] focus:outline-primary-orange"
                  :class="`${loadingLogin ? 'pointer-events-none' : ''}`"
                  @input="removeSpaces('userName')"
                />
              </div>

              <!-- PASSWORD -->
              <div
                class="flex flex-col gap-[8px] mt-[40px] max-[1400px]:mt-[24px]"
                :class="`${loadingLogin ? 'cursor-progress' : ''}`"
              >
                <label for="password" class="font-medium">Senha</label>
                <div class="relative w-full">
                  <input
                    v-model="loginForm.passWord"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    required
                    placeholder="Insira sua senha"
                    autocomplete="current-password"
                    class="w-full h-[56px] bg-orange-50 border border-grey-border rounded-[10px] px-[16px] pr-[48px] focus:outline-primary-orange"
                    :class="`${loadingLogin ? 'pointer-events-none' : ''}`"
                    @input="removeSpaces('passWord')"
                  />

                  <!-- SHOW PASSWORD ICON -->
                  <span
                    class="absolute right-[16px] top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-primary-orange transition"
                    @click="showPassword = !showPassword"
                  >
                    <mdicon :name="showPassword ? 'eye-off' : 'eye'" size="24" />
                  </span>
                </div>

                <p
                  @click="$router.push({ name: 'ForgotPassword' })"
                  class="text-[0.875rem] text-primary-orange text-right cursor-pointer hover:brightness-85 hover:underline transition-all active:font-bold"
                >
                  Esqueceu sua senha?
                </p>
              </div>
            </div>

            <!-- ACCESS BUTTON -->
            <button
              @click.prevent="loginStore.authenticateUser(loginForm)"
              type="submit"
              class="mt-[40px] max-[1400px]:mt-[24px] w-full flex items-center justify-center text-center text-[1.375rem] font-bold bg-primary-orange text-white rounded-[10px] h-[56px] hover:brightness-110 hover:scale-105 active:scale-100 active:brightness-85 transition-all cursor-pointer"
              :class="`${loadingLogin ? 'pointer-events-none' : ''}`"
            >
              <SpinnerLoading v-if="loadingLogin" :size="24" color="white" />
              <p v-else>Acessar</p>
            </button>

            <p class="pt-[16px] mt-[24px] border-t border-[#d2d2d2] text-[1rem] text-center">
              Realizando o primeiro acesso?
              <span
                @click="$router.push({ name: 'Register' })"
                class="text-primary-orange hover:underline cursor-pointer transition-all"
                >Clique aqui para começar</span
              >
            </p>
          </div>
        </form>
        <div>
          <p class="text-[0.875rem]">© 2025 Move Energia</p>
        </div>
      </div>

      <!-- RIGHT SIDE -->
      <div class="relative bg-gray-200 w-full max-w-[60%]">
        <!-- CAROUSEL -->
        <div class="absolute inset-0 flex flex-col items-center justify-center gap-[24px]">
          <transition name="carousel-fade" mode="out-in">
            <div :key="selectedCarouselItem" class="text-center text-white">
              <h2 class="text-[3.125rem] max-[1400px]:text-[2.5rem] font-bold whitespace-pre-line">
                {{ CarouselItems[selectedCarouselItem - 1].title }}
              </h2>
              <p class="text-[1.875rem] max-[1400px]:text-[1.375rem]">
                {{ CarouselItems[selectedCarouselItem - 1].subtitle }}
              </p>
            </div>
          </transition>

          <!-- CAROUSEL CONTROLLERS -->
          <div class="flex items-center justify-center gap-[8px]">
            <div v-for="item in CarouselItems" :key="item.id">
              <div
                @click="selectItem(item.id)"
                :class="`
                      h-[10px] rounded-full bg-white
                      transition-[width] duration-500 ease-in-out
                      ${
                        selectedCarouselItem === item.id
                          ? 'w-[50px]'
                          : 'w-[10px] bg-white/50 cursor-pointer hover:bg-white/100'
                      }
                    `"
              ></div>
            </div>
          </div>
        </div>
        <div>
          <a
            href="https://lp.moveenergia.com/move?_gl=1*1t8xuuk*_ga*MTIzNjk4MjI0Mi4xNzUzNTEyMzQw*_ga_PNYNVD7ZL2*czE3NTYwODI1NDgkbzckZzAkdDE3NTYwODI1NDgkajYwJGwwJGgw*_ga_CMW6FPJ9Y3*czE3NTYwODI1NDgkbzckZzAkdDE3NTYwODI1NDgkajYwJGwwJGgw"
            target="_blank"
            class="absolute flex items-center justify-center top-[30px] right-[30px] h-[50px] px-[24px] text-[1rem] font-semibold text-white liquid-glass-button transition-all cursor-pointer"
          >
            Quero fazer parte
          </a>
        </div>
        <!-- WALLPAPER -->
        <img :src="loginWallpaper" alt="Imagem de fundo" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- MOBILE -->
    <div
      class="w-[100dvw] h-[100dvh] max-h-[100dvh] flex flex-col min-[1024px]:hidden p-[24px] box-border"
    >
      <div
        class="w-full flex items-center justify-center"
        :class="
          showErrorAlert
            ? 'my-[1dvh]'
            : 'mb-[10dvh] mt-[9dvh] [@media(max-height:760px)]:mt-[6dvh] [@media(max-height:760px)]:mb-[6dvh]'
        "
      >
        <img :src="cotesaLogoMobile" alt="Logo Move Energia" class="max-h-[130px] h-full" />
      </div>

      <div class="flex flex-col min-[500px]:items-center">
        <h1 class="text-[1.75rem] font-bold">Portal do consumidor</h1>
        <p class="[@media(max-height:760px)]:mt-[3px] mt-[8px]">
          Entre utilizando suas credenciais.
        </p>
      </div>

      <div class="[@media(max-height:760px)]:mt-[3dvh] mt-[5dvh]">
        <form
          class="w-full h-full flex flex-col items-center justify-center text-[1.125rem]"
          autocomplete="on"
        >
          <div class="w-full">
            <!-- LOGIN -->
            <div :class="`${loadingLogin ? 'cursor-progress' : ''}`">
              <div class="flex flex-col gap-[8px]">
                <label for="user" class="font-medium">CPF/CNPJ</label>
                <input
                  v-model="loginForm.userName"
                  type="text"
                  id="user"
                  required
                  placeholder="Insira seu login"
                  autocomplete="username"
                  class="h-[40px] bg-orange-50 border border-grey-border rounded-[10px] px-[16px] focus:outline-primary-orange"
                  :class="`${loadingLogin ? 'pointer-events-none' : ''}`"
                  @input="removeSpaces('userName')"
                />
              </div>

              <!-- PASSWORD -->
              <div
                class="flex flex-col gap-[8px] mt-[3dvh]"
                :class="`${loadingLogin ? 'cursor-progress' : ''}`"
              >
                <label for="password" class="font-medium">Senha</label>
                <div class="relative w-full">
                  <input
                    v-model="loginForm.passWord"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    required
                    placeholder="Insira sua senha"
                    autocomplete="current-password"
                    class="w-full h-[40px] bg-orange-50 border border-grey-border rounded-[10px] px-[16px] pr-[48px] focus:outline-primary-orange"
                    :class="`${loadingLogin ? 'pointer-events-none' : ''}`"
                    @input="removeSpaces('passWord')"
                  />

                  <!-- SHOW PASSWORD ICON -->
                  <span
                    class="absolute right-[0px] flex pr-[16px] pl-[8px] items-center h-full top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-primary-orange transition"
                    @pointerdown.prevent="showPassword = !showPassword"
                  >
                    <mdicon :name="showPassword ? 'eye-off' : 'eye'" size="24" />
                  </span>
                </div>

                <p
                  @click="$router.push({ name: 'ForgotPassword' })"
                  class="text-[0.875rem] text-primary-orange text-right cursor-pointer hover:brightness-85 hover:underline transition-all active:font-bold"
                >
                  Esqueceu sua senha?
                </p>
              </div>
            </div>

            <!-- ERROR -->
            <div
              v-if="showErrorAlert"
              class="flex w-full p-[16px] border border-red-500 bg-red-50 rounded-[10px] mt-[20px]"
            >
              <mdicon class="text-red-500 mr-[10px]" name="information" size="24px" />
              <div class="text-red-500">
                <p class="font-bold mb-[5px] text-[15px]">
                  Credenciais inválidas ou não cadastradas.
                </p>
                <p class="text-[13px]">
                  Verifique se o CPF/CNPJ está correto e tente novamente. Se o problema persistir,
                  entre em contato com o
                  <a
                    href="https://wa.me/5548991173295"
                    target="_blank"
                    class="font-bold text-purple-700 hover:opacity underline cursor-pointer inline-flex items-center w-auto"
                    >nosso suporte <mdicon name="link-variant" size="16" class="ml-[3px]"
                  /></a>
                </p>
              </div>
            </div>

            <!-- ACCESS BUTTON -->
            <button
              @click.prevent="login"
              type="submit"
              class="mt-[3dvh] w-full flex items-center justify-center text-center text-[1.375rem] font-bold bg-primary-orange text-white rounded-[10px] h-[56px] hover:brightness-110 hover:scale-105 active:scale-100 active:brightness-85 transition-all cursor-pointer"
              :class="`${loadingLogin ? 'pointer-events-none' : ''}`"
            >
              <SpinnerLoading v-if="loadingLogin" :size="24" color="white" />
              <p v-else>Acessar</p>
            </button>

            <p class="pt-[16px] mt-[2dvh] border-t border-[#d2d2d2] text-[0.813rem] text-center">
              Realizando o primeiro acesso?
              <span
                @click="$router.push({ name: 'Register' })"
                class="text-primary-orange hover:underline cursor-pointer transition-all"
                >Clique aqui para começar</span
              >
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import cotesaLogo from '@/assets/images/cotesaLogo.png'
import cotesaLogoMobile from '@/assets/images/cotesaLogoVertical.png'
import loginWallpaper from '@/assets/images/loginWallpaper.png'
import SpinnerLoading from '@/components/SpinnerLoading.vue'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useLoginStore } from '@/stores/login'
import { useRouter } from 'vue-router'

const router = useRouter()

const showPassword = ref(false)

const loginStore = useLoginStore()

const loadingLogin = computed(() => loginStore.loadingLogin)

const loginForm = ref({
  userName: '',
  passWord: '',
})

const removeSpaces = (field) => {
  loginForm.value[field] = loginForm.value[field].replace(/\s/g, '')
}

// CAROUSEL AREA ITEMS --------------------------------------------------------------------
const CarouselItems = computed(() => [
  {
    id: 1,
    title: 'Sua energia, mais \nlimpa e mais barata.',
    subtitle: 'Juntos, movemos energia e sustentabilidade.',
  },
  {
    id: 2,
    title: 'Movendo energia, \ntransformando vidas.',
    subtitle: 'Faça parte de uma rede que gera e compartilha energia limpa.',
  },
  {
    id: 3,
    title: 'Transforme consumo \nem consciência',
    subtitle: 'Pague menos, consuma limpo e faça parte da mudança.',
  },
])

const selectedCarouselItem = ref(1)
let interval = null
const intervalTime = 5000 // 5s

const startCarousel = () => {
  clearInterval(interval)
  interval = setInterval(() => {
    nextItem()
  }, intervalTime)
}

const nextItem = () => {
  const currentIndex = CarouselItems.value.findIndex((i) => i.id === selectedCarouselItem.value)
  const nextIndex = (currentIndex + 1) % CarouselItems.value.length
  selectedCarouselItem.value = CarouselItems.value[nextIndex].id
}

const selectItem = (id) => {
  selectedCarouselItem.value = id
  startCarousel()
}

const showErrorAlert = ref(false)

const login = async () => {
  showErrorAlert.value = false
  const logged = await loginStore.authenticateUser(loginForm.value)
  console.log(logged)
  if (logged.error) {
    console.log('erros1', logged.erros[0])
    if (logged.erros[0].errorMessage === 'FirstAccess') {
      router.push({ name: 'Register', query: { user: loginForm.value.userName } })
    } else if (logged.erros[0].errorCode === 400) {
      showErrorAlert.value = true
    }
  }
}

onMounted(startCarousel)
onBeforeUnmount(() => clearInterval(interval))
</script>

<style scoped>
/* Carousel Fade */
.carousel-fade-enter-active,
.carousel-fade-leave-active {
  transition: opacity 1s ease;
}
.carousel-fade-enter-from,
.carousel-fade-leave-to {
  opacity: 0;
}
</style>