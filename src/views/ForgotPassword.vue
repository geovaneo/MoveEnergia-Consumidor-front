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
              <mdicon name="lock-reset" size="90" class="text-primary-blue" />
            </div>
          </div>

          <h1 class="text-[2.5rem] max-[1400px]:text-[2rem] font-bold text-center">
            Esqueceu sua senha?
          </h1>
          <p class="text-lighten-blue mt-[24px] max-[1400px]:mt-[8px] text-center">
            Insira seu CPF / CPNJ para enviarmos um <br />
            código de recuperação
          </p>

          <div
            class="mt-[40px] max-[1400px]:mt-[24px]"
            :class="`${loadingLogin ? 'cursor-progress' : ''}`"
          >
            <!-- CPF/CPNPJ -->
            <div class="flex flex-col gap-[8px]">
              <label for="user" class="font-medium">CPF/CNPJ</label>
              <input
                v-model="userCredential"
                type="text"
                id="user"
                required
                placeholder="Insira suas credenciais"
                autocomplete="username"
                class="h-[56px] bg-orange-50 border border-grey-border rounded-[10px] px-[16px] focus:outline-primary-orange"
                :class="`${loadingLogin ? 'pointer-events-none' : ''}`"
                @input="removeSpaces('userName')"
              />
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
                Verifique se o CPF/CNPJ está correto e tente novamente. Se o problema persistir,
                entre em contato com o suporte.
              </p>
            </div>
          </div>

          <!-- ACCESS BUTTON -->
          <button
            @click.prevent="sendCode"
            type="submit"
            class="mt-[40px] max-[1400px]:mt-[24px] w-full flex items-center justify-center text-center text-[1.375rem] font-bold bg-primary-orange text-white rounded-[10px] h-[56px] hover:brightness-110 hover:scale-105 active:scale-100 active:brightness-85 transition-all cursor-pointer"
            :class="`${loading ? 'pointer-events-none' : ''}`"
          >
            <SpinnerLoading v-if="loading" :size="24" color="white" />
            <p v-else>Enviar</p>
          </button>

          <div
            class="flex items-center justify-center gap-[8px] mt-[40px] cursor-pointer text-primary-blue hover:text-lighten-blue hover:brightness-110 hover:underline transition-all"
            @click="$router.push({ name: 'Login' })"
          >
            <mdicon name="chevron-left" size="24" />
            <p>Voltar a tela de login</p>
          </div>
        </div>
      </form>

      <div
        v-else
        class="w-full h-full flex flex-col items-center justify-center text-[1.125rem] max-[1400px]:text-[1rem]"
      >
        <div class="max-w-[450px] w-full text-center flex flex-col items-center justify-center">
          <div class="flex items-center justify-center mb-[16px]">
            <div
              class="w-[120px] h-[120px] flex items-center justify-center rounded-full bg-grey-background"
            >
              <mdicon name="email-fast-outline" size="90" class="text-primary-blue" />
            </div>
          </div>

          <h1 class="text-[2.5rem] max-[1400px]:text-[2rem] font-bold text-center">
            Código enviado!
          </h1>
          <p class="text-lighten-blue mt-[24px] max-[1400px]:mt-[8px] text-center">
            Enviamos um código de verificação para o seu email: <br />
            g***@***.com
          </p>
          <CodeVerificationInput class="mt-[32px]" :length="6" @complete="handleCodeComplete" />
          <button
            @click.prevent="sendCode"
            type="submit"
            class="mt-[40px] max-[1400px]:mt-[24px] max-w-[360px] w-full flex items-center justify-center text-center text-[1.375rem] font-bold bg-primary-orange text-white rounded-[10px] h-[56px] hover:brightness-110 hover:scale-105 active:scale-100 active:brightness-85 transition-all cursor-pointer"
            :class="`${loading ? 'pointer-events-none' : ''}`"
          >
            <SpinnerLoading v-if="loading" :size="24" color="white" />
            <p v-else>Confirmar</p>
          </button>
          <div>
            <p v-if="resendTimer === 0" class="mt-[24px] text-[0.875rem]">
              Não recebeu o código?
              <span @click="sendCode" class="text-primary-orange hover:underline cursor-pointer"
                >Reenviar</span
              >
            </p>
            <p v-else class="mt-[24px] text-[0.875rem]">
              Reenviar código em
              <span class="text-primary-orange">0:{{ resendTimer }}</span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <p class="text-[0.875rem]">© 2025 Move Energia</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login'
import cotesaLogo from '@/assets/images/cotesaLogo.png'
import SpinnerLoading from '@/components/SpinnerLoading.vue'
import CodeVerificationInput from '@/components/CodeVerificationInput.vue'

const router = useRouter()
const loginStore = useLoginStore()
const loading = ref(false)

// --------------------
// FORM
const userCredential = ref('')
const showErrorAlert = ref(false)

const removeSpaces = () => {
  userCredential.value = userCredential.value.replace(/\s/g, '')
}

// --------------------
// SENDING CODE
const sendedCode = ref(false)
const showCodeErrorAlert = ref(false)
const resendTimer = ref(59)

const sendCode = async () => {
  showErrorAlert.value = false
  loading.value = true
  const hasSendedCode = await loginStore.sendNewPasswordCode(userCredential.value)
  loading.value = false
  if (hasSendedCode || !hasSendedCode) {
    sendedCode.value = true
    resendTimer.value = 59
    const timerInterval = setInterval(() => {
      if (resendTimer.value > 0) {
        resendTimer.value -= 1
      } else {
        clearInterval(timerInterval)
      }
    }, 1000)
  } else {
    showErrorAlert.value = true
  }
}

const handleCodeComplete = async (code) => {
  loading.value = true
  let payload = {
    userCredential: userCredential.value,
    code: code,
  }
  let token = await loginStore.verifyNewPasswordCode(payload)
  token = 'akbasksa0123013298asolda9019213lsldaspaebkca0383812kda04jf8321kd912kasd01la'
  if (token) {
    router.push({ name: 'NewPassword', params: { token } })
  } else {
    showCodeErrorAlert.value = true
  }
  loading.value = false
}
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