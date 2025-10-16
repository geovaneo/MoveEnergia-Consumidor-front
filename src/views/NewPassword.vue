<template>
  <div class="w-[100vw] h-[100vh] flex" style="font-family: 'Red Hat Display', sans-serif">
    <div class="flex flex-col grow relative p-[30px]">
      <div class="flex items-start justify-between">
        <img :src="cotesaLogo" alt="Logo Move Energia" class="max-h-[65px] max-[1400px]:h-[50px]" />
        <p class="font-medium">
          Já possui uma conta?
          <span
            @click="$router.push({ name: 'Login' })"
            class="text-primary-orange hover:underline cursor-pointer"
            >Fazer login</span
          >
        </p>
      </div>
      <!-- FORGOT PASSWORD FORM -->
      <form
        v-if="!sendedCode"
        class="w-full h-full flex flex-col items-center justify-center text-[1.125rem] max-[1400px]:text-[1rem]"
        autocomplete="on"
      >
        <div class="max-w-[450px] w-full">
          <div class="flex items-center justify-center">
            <div
              class="w-[120px] h-[120px] flex items-center justify-center rounded-full bg-grey-background"
            >
              <mdicon name="lock-plus-outline" size="90" class="text-primary-blue" />
            </div>
          </div>

          <h1 class="text-[2.5rem] max-[1400px]:text-[2rem] font-bold text-center">
            Criar nova senha
          </h1>
          <p class="text-lighten-blue mt-[24px] max-[1400px]:mt-[8px] text-center">
            Insira a nova senha desejada abaixo.
          </p>

          <div
            class="mt-[40px] max-[1400px]:mt-[24px]"
            :class="`${loadingLogin ? 'cursor-progress' : ''}`"
          >
            <!-- NEW PASSWORD -->
            <div
              class="flex flex-col gap-[8px] mt-[40px] max-[1400px]:mt-[24px]"
              :class="`${loadingLogin ? 'cursor-progress' : ''}`"
            >
              <label for="password" class="font-medium">Nova senha</label>
              <div class="relative w-full">
                <input
                  v-model="passWordForm.passWord"
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
            </div>

            <!-- CONFIRM NEW PASSWORD -->
            <div
              class="flex flex-col gap-[8px] mt-[40px] max-[1400px]:mt-[24px]"
              :class="`${loadingLogin ? 'cursor-progress' : ''}`"
            >
              <label for="password" class="font-medium">Confirme sua nova senha</label>
              <div class="relative w-full">
                <input
                  v-model="passWordForm.confirmPassWord"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  id="confirm-password"
                  required
                  placeholder="Confirme sua senha"
                  autocomplete="current-password"
                  class="w-full h-[56px] bg-orange-50 border border-grey-border rounded-[10px] px-[16px] pr-[48px] focus:outline-primary-orange"
                  :class="`${loadingLogin ? 'pointer-events-none' : ''} ${
                    passWordsDoNotMatch
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500 bg-red-100'
                      : ''
                  }`"
                  @input="removeSpaces('confirmPassWord')"
                />
                <!-- SHOW PASSWORD ICON -->
                <span
                  class="absolute right-[16px] top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-primary-orange transition"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <mdicon :name="showConfirmPassword ? 'eye-off' : 'eye'" size="24" />
                </span>
                <span
                  v-if="passWordsDoNotMatch"
                  class="absolute right-[48px] top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-primary-orange transition"
                >
                  <mdicon class="text-red-500" name="alert-circle" size="24" />
                </span>
              </div>
              <span v-if="passWordsDoNotMatch" class="text-[13px] text-red-500"
                >As senhas não coincidem</span
              >
            </div>
          </div>

          <div
            v-if="showErrorAlert"
            class="flex w-full p-[16px] border border-red-500 bg-red-50 rounded-[10px] mt-[20px]"
          >
            <mdicon class="text-red-500 mr-[10px]" name="information" size="24px" />
            <div class="text-red-500">
              <p class="font-bold mb-[5px]">Ops! Algo deu errado.</p>
              <p class="text-[14px]">
                Não foi possível realizar a troca de senha. Tente novamente em breve, se o problema
                persistir entre em contato com o suporte.
              </p>
            </div>
          </div>

          <!-- SEND BUTTON -->
          <button
            @click.prevent="sendNewPassword"
            type="submit"
            class="mt-[40px] max-[1400px]:mt-[24px] w-full flex items-center justify-center text-center text-[1.375rem] font-bold bg-primary-orange text-white rounded-[10px] h-[56px] hover:brightness-110 hover:scale-105 active:scale-100 active:brightness-85 transition-all cursor-pointer"
            :class="`${loading ? 'pointer-events-none' : ''} ${
              passWordsDoNotMatch ||
              passWordForm.confirmPassWord === '' ||
              passWordForm.passWord === ''
                ? 'opacity-60 cursor-not-allowed pointer-events-none'
                : ''
            }`"
            :disabled="
              passWordsDoNotMatch ||
              passWordForm.confirmPassWord === '' ||
              passWordForm.passWord === ''
            "
          >
            <SpinnerLoading v-if="loading" :size="24" color="white" />
            <p v-else>Trocar senha</p>
          </button>
        </div>
      </form>

      <div>
        <p class="text-[0.875rem]">© 2025 Move Energia</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useLoginStore } from '@/stores/login'
import { useRoute, useRouter } from 'vue-router'
import cotesaLogo from '@/assets/images/cotesaLogo.png'
import SpinnerLoading from '@/components/SpinnerLoading.vue'

const loginStore = useLoginStore()
const loading = ref(false)
const route = useRoute()
const router = useRouter()
const token = ref(null)
const user = ref(null)

// --------------------
// FORM

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showErrorAlert = ref(false)

const passWordForm = ref({
  passWord: '',
  confirmPassWord: '',
})

const passWordsDoNotMatch = computed(() => {
  return (
    passWordForm.value.passWord !== passWordForm.value.confirmPassWord &&
    passWordForm.value.confirmPassWord
  )
})

const removeSpaces = (field) => {
  passWordForm.value[field] = passWordForm.value[field].replace(/\s/g, '')
}

const sendNewPassword = async () => {
  if (
    passWordsDoNotMatch.value ||
    !passWordForm.value.passWord ||
    !passWordForm.value.confirmPassWord
  ) {
    return
  }

  loading.value = true
  const hasChangedPassword = await loginStore.changePassword(
    user.value,
    passWordForm.value.passWord,
    token.value
  )
  if (hasChangedPassword) {
    router.push({ name: 'Login' })
  } else {
    showErrorAlert.value = true
  }
  loading.value = false
}

onMounted(async () => {
  token.value = route.params.token
  user.value = route.params.user
  if (token.value) {
    const isValidToken = await loginStore.validateResetPasswordToken(user.value, token.value)
    if (!isValidToken) {
      router.push({ name: 'Login' })
    }
  } else {
    router.push({ name: 'Login' })
  }
})
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