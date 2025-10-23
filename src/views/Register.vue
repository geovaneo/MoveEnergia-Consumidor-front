<template>
  <div class="w-[100vw] h-[100vh] flex" style="font-family: 'Red Hat Display', sans-serif">
    <div class="flex flex-col grow relative p-[30px]">
      <div class="flex items-start justify-between max-[1024px]:hidden">
        <img :src="cotesaLogo" alt="Logo Move Energia" class="max-h-[65px] max-[1400px]:h-[50px]" />
        <p class="font-medium">
          Já possui uma conta?
          <span
            @click="$router.push({ name: 'Login' })"
            class="text-primary-orange hover:underline cursor-pointer active:font-bold active:scale-110 transition-all"
            >Fazer login</span
          >
        </p>
      </div>

      <div
        class="flex items-center text-center gap-[8px] cursor-pointer text-primary-blue hover:text-lighten-blue hover:brightness-110 hover:underline transition-all min-[1024px]:hidden active:font-bold active:scale-110"
        @click="$router.push({ name: 'Login' })"
      >
        <mdicon name="chevron-left" size="24" />
        <p>Voltar</p>
      </div>
      <!-- FORGOT PASSWORD FORM -->
      <form
        v-if="!sendedCode && !showEmailSelection"
        class="w-full h-full flex flex-col items-center justify-center text-[1.125rem] max-[1400px]:text-[1rem]"
        autocomplete="on"
      >
        <div class="max-w-[450px] w-full">
          <div class="flex items-center justify-center">
            <div
              class="w-[120px] h-[120px] flex items-center justify-center rounded-full bg-grey-background"
            >
              <mdicon name="hand-wave-outline" size="90" class="text-primary-blue wave-hand" />
            </div>
          </div>

          <h1 class="text-[2.5rem] max-[1400px]:text-[2rem] font-bold text-center">
            Primeira vez aqui? <br />Boas-vindas!
          </h1>
          <p class="text-lighten-blue mt-[24px] max-[1400px]:mt-[8px] text-center">
            Insira seu CPF / CPNJ cadastrado para adicionar sua senha de acesso.
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
                placeholder="Insira seu CPF ou CNPJ"
                autocomplete="username"
                @focus="formatUserName"
                @input="formatUserName"
                class="h-[56px] bg-orange-50 border border-grey-border rounded-[10px] px-[16px] focus:outline-primary-orange"
                :class="`${loadingLogin ? 'pointer-events-none' : ''}`"
              />
            </div>
          </div>

          <div
            v-if="showErrorAlert"
            class="flex w-full p-[16px] border border-red-500 bg-red-50 rounded-[10px] mt-[20px]"
          >
            <mdicon class="text-red-500 mr-[10px]" name="information" size="24px" />
            <div v-if="loginStore.missingEmail" class="text-red-500">
              <p class="font-bold mb-[5px]">E-mail não cadastrado.</p>
              <p class="text-[14px]">
                Você não possui um e-mail cadastrado. Entre em contato com o
                <a
                  href="https://wa.me/5548991173295"
                  target="_blank"
                  class="font-bold text-purple-700 hover:opacity underline cursor-pointer inline-flex items-center w-auto"
                  >nosso suporte <mdicon name="link-variant" size="16" class="ml-[3px]"
                /></a>
              </p>
            </div>
            <div v-else-if="loginStore.userNotFound" class="text-red-500">
              <p class="font-bold mb-[5px] max-[700px]:text-[15px]">CPF/CNPJ não encontrado.</p>
              <p class="text-[14px] max-[700px]:text-[13px]">
                Seu CPF/CNPJ não foi encontrado na nossa base de usuarios. Caso já seja nosso
                cliente, entre em contato através do link:
                <a
                  href="https://wa.me/5548991173295"
                  target="_blank"
                  class="font-bold text-purple-700 hover:opacity underline cursor-pointer inline-flex items-center w-auto"
                  >https://wa.me/5548991173295
                  <mdicon name="link-variant" size="16" class="ml-[3px]"
                /></a>
              </p>
            </div>
            <div v-else class="text-red-500">
              <p class="font-bold mb-[5px]">Ops! Algo deu errado.</p>
              <p class="text-[14px]">
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
            @click.prevent="sendCode"
            type="submit"
            class="mt-[40px] max-[1400px]:mt-[24px] w-full flex items-center justify-center text-center text-[1.375rem] font-bold bg-primary-orange text-white rounded-[10px] h-[56px] hover:brightness-110 hover:scale-105 active:scale-100 active:brightness-85 transition-all cursor-pointer"
            :class="`${loading ? 'pointer-events-none' : ''}`"
          >
            <SpinnerLoading v-if="loading" :size="24" color="white" />
            <p v-else>Enviar</p>
          </button>

          <div class="mt-[24px] text-[0.875rem] max-[1024px]:text-center">
            Não possui e-mail cadastrado? Entre em contato com o
            <a
              href="https://wa.me/5548991173295"
              target="_blank"
              class="text-primary-orange hover:underline cursor-pointer font-bold"
              >nosso suporte.</a
            >
          </div>

          <div
            class="flex items-center justify-center gap-[8px] mt-[40px] cursor-pointer text-primary-blue hover:text-lighten-blue hover:brightness-110 hover:underline transition-all max-[1024px]:hidden"
            @click="$router.push({ name: 'Login' })"
          >
            <mdicon name="chevron-left" size="24" />
            <p>Voltar a tela de login</p>
          </div>
        </div>
      </form>

      <div
        class="w-full h-full flex flex-col items-center justify-center text-[1.125rem] max-[1400px]:text-[1rem]"
        v-else-if="showEmailSelection"
      >
        <div class="max-w-[450px] w-full">
          <div class="flex items-center justify-center">
            <div
              class="w-[120px] h-[120px] flex items-center justify-center rounded-full bg-grey-background"
            >
              <mdicon name="email-search-outline" size="90" class="text-primary-blue" />
            </div>
          </div>

          <h1 class="text-[2.5rem] max-[1400px]:text-[2rem] font-bold text-center">
            Selecione um e-mail
          </h1>
          <p class="text-lighten-blue mt-[24px] max-[1400px]:mt-[8px] text-center">
            Selecione o e-mail que deseja receber o código de verificação.
          </p>

          <div
            class="mt-[40px] max-[1400px]:mt-[24px]"
            :class="`${loadingLogin ? 'cursor-progress' : ''}`"
          >
            <!-- EMAIL SELECTORS -->
            <div class="flex flex-col gap-4 items-center">
              <label
                v-for="(email, index) in loginStore.emailsToSelectList"
                :key="index"
                class="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50 transition w-full"
              >
                <input
                  type="radio"
                  name="selectedEmail"
                  :value="email"
                  v-model="selectedEmailToSendCode"
                  class="h-[20px] w-[20px] accent-darken-orange"
                />
                <span class="flex-1 flex items-center justify-between gap-2">
                  <span
                    class="block w-full p-2 rounded-md transition-all"
                    :class="
                      selectedEmailToSendCode === email
                        ? 'text-primary-orange font-semibold'
                        : 'text-gray-700'
                    "
                  >
                    {{ email }}
                  </span>
                  <mdicon
                    v-if="selectedEmailToSendCode === email"
                    name="check-circle"
                    size="20"
                    class="text-primary-orange"
                  />
                </span>
              </label>
            </div>
          </div>

          <!-- SELECT AND SEND BUTTON -->
          <button
            @click.prevent="selectEmailAndSendCode"
            type="submit"
            class="mt-[40px] max-[1400px]:mt-[24px] w-full flex items-center justify-center text-center text-[1.375rem] font-bold bg-primary-orange text-white rounded-[10px] h-[56px] hover:brightness-110 hover:scale-105 active:scale-100 active:brightness-85 transition-all cursor-pointer"
            :class="`${loading ? 'pointer-events-none' : ''}`"
          >
            <SpinnerLoading v-if="loading" :size="24" color="white" />
            <p v-else>Enviar</p>
          </button>

          <div
            class="flex items-center justify-center gap-[8px] mt-[40px] cursor-pointer text-primary-blue hover:text-lighten-blue hover:brightness-110 hover:underline transition-all max-[1024px]:hidden"
            @click="$router.push({ name: 'Login' })"
          >
            <mdicon name="chevron-left" size="24" />
            <p>Voltar a tela de login</p>
          </div>
        </div>
      </div>

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
            {{ userEmailPreview }}
          </p>

          <CodeVerificationInput
            :code="currentCode"
            class="mt-[32px]"
            :length="6"
            @update:code="currentCode = $event"
            :hasError="showCodeErrorAlert"
          />

          <div v-if="showCodeErrorAlert" class="flex max-w-[360px] w-full mt-[16px] text-start">
            <div class="text-red-500">
              <p class="text-[14px]">
                O código que você digitou está incorreto, por favor tente novamente.
              </p>
            </div>
          </div>

          <button
            @click.prevent="confirmButtonAction"
            type="submit"
            class="mt-[40px] max-[1400px]:mt-[24px] max-w-[360px] w-full flex items-center justify-center text-center text-[1.375rem] font-bold bg-primary-orange text-white rounded-[10px] h-[56px] hover:brightness-110 hover:scale-105 active:scale-95 active:brightness-85 transition-all cursor-pointer"
            :class="`${loading ? 'pointer-events-none' : ''}`"
          >
            <SpinnerLoading v-if="loading" :size="24" color="white" />
            <p v-else>Confirmar</p>
          </button>
          <div>
            <p v-if="resendTimer === 0" class="mt-[24px] text-[0.875rem]">
              Não recebeu o código?
              <span
                @click="sendCode"
                class="text-primary-orange hover:underline cursor-pointer active:font-bold active:scale-110 transition-all"
                >Reenviar</span
              >
            </p>
            <p v-else class="mt-[24px] text-[0.875rem]">
              Reenviar código em
              <span class="text-primary-orange">0:{{ String(resendTimer).padStart(2, '0') }}</span>
            </p>
          </div>

          <div>
            <p class="max-[700px]:text-[12px] text-[14px] mt-[16px]">
              Caso não reconheça o e-mail acima ou não tenha mais acesso, entre em contato com o
              nosso suporte para a troca do e-mail.
              <a
                href="https://wa.me/5548991173295"
                target="_blank"
                class="font-bold text-purple-700 hover:opacity underline cursor-pointer inline-flex items-center w-auto active:font-bold active:scale-95 transition-all"
                >https://wa.me/5548991173295 <mdicon name="link-variant" size="16" class="ml-[3px]"
              /></a>
            </p>
          </div>
        </div>
      </div>

      <div class="max-[1024px]:hidden">
        <p class="text-[0.875rem]">© 2025 Move Energia</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLoginStore } from '@/stores/login'
import cotesaLogo from '@/assets/images/cotesaLogo.png'
import SpinnerLoading from '@/components/SpinnerLoading.vue'
import CodeVerificationInput from '@/components/CodeVerificationInput.vue'

const router = useRouter()
const route = useRoute()
const loginStore = useLoginStore()
const loading = ref(false)
const currentCode = ref('')

const confirmButtonAction = () => {
  if (!userCredential.value || (!currentCode.value && sendedCode.value)) {
    return
  }

  if (sendedCode.value) {
    handleCodeComplete(currentCode.value)
  } else {
    sendCode()
  }
}

// --------------------
// FORM
const userCredential = ref('')
const showErrorAlert = ref(false)
const userEmailPreview = ref('')

const formatUserName = () => {
  let value = userCredential.value.replace(/\D/g, '')
  value = value.slice(0, 14)

  if (value.length < 12) {
    value = value
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  } else {
    value = value
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  userCredential.value = value
}

// --------------------
// SENDING CODE
const sendedCode = ref(false)
const showCodeErrorAlert = ref(false)
const showEmailSelection = ref(false)
const resendTimer = ref(59)
const selectedEmailToSendCode = ref('')

const selectEmailAndSendCode = async () => {
  if (!selectedEmailToSendCode.value) {
    return
  }

  loading.value = true

  currentCode.value = ''

  showErrorAlert.value = false
  loginStore.missingEmail = false
  loginStore.userNotFound = false
  showCodeErrorAlert.value = false

  const hasSendedCode = await loginStore.selectEmailAndSendCode(
    userCredential.value,
    selectedEmailToSendCode.value
  )

  if (hasSendedCode) {
    showEmailSelection.value = false

    sendedCode.value = true
    resendTimer.value = 59

    userEmailPreview.value = selectedEmailToSendCode.value

    const timerInterval = setInterval(() => {
      if (resendTimer.value > 0) {
        resendTimer.value -= 1
      } else {
        clearInterval(timerInterval)
      }
    }, 1000)
  }

  loading.value = false
}

const sendCode = async () => {
  if (!userCredential.value) {
    return
  }

  loading.value = true

  currentCode.value = ''

  showErrorAlert.value = false
  loginStore.missingEmail = false
  loginStore.userNotFound = false
  showCodeErrorAlert.value = false
  showEmailSelection.value = false
  selectedEmailToSendCode.value = ''

  const emailReceiver = await loginStore.sendNewPasswordCode(userCredential.value)

  if (emailReceiver) {
    sendedCode.value = true
    resendTimer.value = 59

    userEmailPreview.value = emailReceiver

    const timerInterval = setInterval(() => {
      if (resendTimer.value > 0) {
        resendTimer.value -= 1
      } else {
        clearInterval(timerInterval)
      }
    }, 1000)
  } else {
    if (loginStore.showEmailSelectionOptions) {
      showEmailSelection.value = true
    } else {
      showErrorAlert.value = true
    }
  }

  loading.value = false
}

const handleCodeComplete = async (code) => {
  showCodeErrorAlert.value = false
  loginStore.missingEmail = false
  loading.value = true
  let payload = {
    credential: userCredential.value,
    code: code,
  }
  let token = await loginStore.verifyNewPasswordCode(payload)
  if (token) {
    router.push({
      name: 'NewPassword',
      params: { user: userCredential.value.replace(/\D/g, ''), token },
    })
  } else {
    showCodeErrorAlert.value = true
  }
  loading.value = false
}

onMounted(() => {
  const userParam = route.query.user
  if (userParam) {
    userCredential.value = userParam
  }
})
</script>

<style scoped>
.wave-hand {
  animation-name: wave-animation; /* Refers to the name of your @keyframes element below */
  animation-duration: 2.5s; /* Change to speed up or slow down */
  animation-iteration-count: infinite; /* Never stop waving :) */
  transform-origin: 0% 100%; /* Pivot around the bottom-left palm */
}

@keyframes wave-animation {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(-14deg);
  } /* The following five values can be played with to make the waving more or less extreme */
  20% {
    transform: rotate(8deg);
  }
  30% {
    transform: rotate(-14deg);
  }
  40% {
    transform: rotate(4deg);
  }
  50% {
    transform: rotate(-10deg);
  }
  60% {
    transform: rotate(0deg);
  } /* Reset for the last half to pause */
  100% {
    transform: rotate(0deg);
  }
}
</style>