import { defineStore } from 'pinia';
import { getBaseURL } from "@/services/api";
import { useNotifyStore } from '@/stores/notify';
import { useInvoicesStore } from '@/stores/invoicesTemp'
import axios from 'axios';
import router from "@/router";

const baseURL = getBaseURL();

export const useLoginStore = defineStore('login', {
  state: () => ({
    user: null,
    token: null,
    loadingLogin: false,
    authenticated: false,
    codeInput: '',
    missingEmail: false,
    userNotFound: false,
    showEmailSelectionOptions: false,
    emailsToSelectList: [],
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    setToken(token) {
      this.token = token;
    },
    clearAuth() {
      this.user = null;
      this.token = null;
      this.authenticated = false;
      localStorage.removeItem('moveEnergia@token');
      localStorage.removeItem('moveEnergia@user');
    },

    async authenticateUser(credentials) {
      this.loadingLogin = true;

      let userName = credentials.userName.replace(/\D/g, '');

      function encodeBase64(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
          })
        );
      }

      const encodedUserName = encodeBase64(userName);
      const encodedPassword = encodeBase64(credentials.passWord);

      const loginPayload = {
        userName: encodedUserName,
        passWord: encodedPassword
      }

      const response = await axios.post(
        `${baseURL}/api/Authentication/AuthenticateUser`,
        loginPayload,
        {
          headers: {
            apiKey: import.meta.env.VITE_API_KEY,
            apiKeyUser: import.meta.env.VITE_API_KEY_USER,
          }
        }
      ).then((response) => {

        if (response.data.error) {
          if (response.data?.erros[0]?.errorMessage === "FirstAccess") {
            useNotifyStore().info('Primeiro Acesso!', 'Por favor, cadastre sua senha.');
            return response.data;
          }
          else {
            useNotifyStore().error('Usuário ou senha inválidos ou não cadastrados!', 'Verifique o login e tente novamente.');
            return response.data;
          }
        }

        this.user = response.data.data;
        this.token = response.data.security.tokenUser;

        localStorage.setItem('moveEnergia@token', this.token);
        localStorage.setItem('moveEnergia@user', JSON.stringify(this.user));

        this.authenticated = true;

        useNotifyStore().success('Sucesso!', 'Login realizado com sucesso.');

        router.push('/');
        return response.data;

      }).catch((error) => {
        this.authenticated = false;

        console.error("Authentication error:", error);

        if (error.response?.data?.erros[0]?.errorMessage === "FirstAccess") {
          useNotifyStore().info('Primeiro Acesso!', 'Por favor, cadastre sua senha.');
          return error.response.data;
        }

        useNotifyStore().error('Usuário ou senha inválidos ou não cadastrados!', 'Verifique o login e tente novamente.');

        return error.response.data;
      }).finally(() => {
        this.loadingLogin = false;
      });

      return response;
    },

    async verifyToken() {
      const invoicesStore = useInvoicesStore();
      const token = localStorage.getItem('moveEnergia@token');
      const user = JSON.parse(localStorage.getItem('moveEnergia@user'));
      if (!token) {
        this.clearAuth();
        invoicesStore.resetStore();
        this.authenticated = false;
        return;
      }

      try {
        await axios.get(`${baseURL}/api/ConsumerUnit/Adress/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.user = user;
        this.token = token;
        this.authenticated = true;
      } catch (error) {
        this.clearAuth();
        invoicesStore.resetStore();
        router.push('/login');
        console.error("Token verification error:", error);
      }
    },

    logoutUser() {
      const invoicesStore = useInvoicesStore();

      this.clearAuth();
      invoicesStore.resetStore();
      router.push('/login');
      useNotifyStore().success('Logout realizado com sucesso!', 'Você foi desconectado.');
    },

    async sendNewPasswordCode(credentials) {

      let userCredential = credentials.replace(/\D/g, '');

      let email = await axios.get(
        `${baseURL}/api/Authentication/SendNewPasswordCode/${userCredential}`,
        {
          headers: {
            apiKey: import.meta.env.VITE_API_KEY,
            apiKeyUser: import.meta.env.VITE_API_KEY_USER,
          }
        }
      ).then((response) => {
        if (!response.data.error) {
          useNotifyStore().success('Código enviado!', 'Verifique seu e-mail para o código de recuperação.');
          const emailReceiver = response.data.data?.email || '*******@****.***'
          return emailReceiver
        } else if (response.data?.erros[0]?.errorMessage === "selectEmailToSend") {
          this.emailsToSelectList = response.data?.erros[0]?.emailList || [];
          this.showEmailSelectionOptions = true;
          return false;
        } else {
          useNotifyStore().error('Erro ao enviar código!', 'Tente novamente mais tarde.');
          return false;
        }
      }).catch((error) => {
        console.error("Error sending forgot password code:", error);
        if (error.response?.data?.erros[0].errorMessage === "E-mail não cadastrado") {
          useNotifyStore().error('E-mail não cadastrado!', 'Verifique o e-mail e tente novamente.');
          this.missingEmail = true;
          return false;
        } else if (error.response?.data?.erros[0].errorMessage.includes("Usuário não encontrado:")) {
          useNotifyStore().error('Erro ao enviar código!', 'Usuário não encontrado. Verifique o CPF/CNPJ e tente novamente.');
          this.userNotFound = true;
          return false;
        } else if (error.response.data?.erros[0]?.errorMessage === "selectEmailToSend") {
          this.emailsToSelectList = error.response.data?.erros[0]?.emailList || [];
          this.showEmailSelectionOptions = true;
          return false;
        } else {
          useNotifyStore().error('Erro ao enviar código!', 'Tente novamente mais tarde.');
          return false;
        }
      });

      return email;
    },

    async selectEmailAndSendCode(credential, email) {
      if (!email || !credential) {
        return false;
      }

      const userCredential = credential.replace(/\D/g, '');

      const hasSendedCode = await axios.post(
        `${baseURL}/api/Authentication/SendNewPasswordCodeToEmail`,
        {
          email: email,
          credential: userCredential
        },
        {
          headers: {
            apiKey: import.meta.env.VITE_API_KEY,
            apiKeyUser: import.meta.env.VITE_API_KEY_USER,
          }
        }
      ).then((response) => {
        if (!response.data.error) {
          useNotifyStore().success('Código enviado!', 'Verifique seu e-mail para o código de recuperação.');
          return true;
        } else {
          useNotifyStore().error('Erro ao enviar código!', 'Tente novamente mais tarde.');
          return false;
        }
      }).catch((error) => {
        console.error("Error selecting email and sending forgot password code:", error);
        useNotifyStore().error('Erro ao enviar código!', 'Tente novamente mais tarde.');
        return false;
      });

      return hasSendedCode;
    },

    async verifyNewPasswordCode(payload) {

      const userCredential = payload.credential.replace(/\D/g, '');

      let token = await axios.get(
        `${baseURL}/api/Authentication/VerifyNewPasswordCode/${userCredential}/${payload.code}`,
        {
          headers: {
            apiKey: import.meta.env.VITE_API_KEY,
            apiKeyUser: import.meta.env.VITE_API_KEY_USER,
          }
        }
      ).then((response) => {
        if (!response.data.error) {
          let token = response.data.data?.uuid || null;
          useNotifyStore().success('Código verificado!', 'Você pode redefinir sua senha.');
          return token;
        } else {
          useNotifyStore().error('Erro ao verificar código!', 'Tente novamente mais tarde.');
          return false;
        }
      }).catch((error) => {
        console.error("Error verifying forgot password code:", error);
        useNotifyStore().error('Erro ao verificar código!', 'Tente novamente mais tarde.');
        return false;
      });

      return token;
    },

    async changePassword(userCredential, newPassword, token) {
      function encodeBase64(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
          })
        );
      }

      let userName = userCredential.replace(/\D/g, '');

      const encodedPassword = encodeBase64(newPassword);

      const hasChangedPassword = await axios.post(
        `${baseURL}/api/Authentication/ChangePassword`,
        {
          'UserName': userName,
          'password': encodedPassword,
          'uuid': token
        },
        {
          headers: {
            apiKey: import.meta.env.VITE_API_KEY,
            apiKeyUser: import.meta.env.VITE_API_KEY_USER,
            Authorization: `Bearer ${token}`,
          }
        }
      ).then((response) => {
        if (!response.data.error) {
          useNotifyStore().success('Senha alterada!', 'Sua senha foi alterada com sucesso.');
          return true;
        } else {
          useNotifyStore().error('Erro ao alterar senha!', 'Tente novamente mais tarde.');
          return false;
        }
      }).catch((error) => {
        console.error("Error changing password:", error);
        useNotifyStore().error('Erro ao alterar senha!', 'Tente novamente mais tarde.');
        return false;
      });

      return hasChangedPassword;
    },

    async validateResetPasswordToken(credential, token) {

      let userCredential = credential.replace(/\D/g, '');

      const isValidToken = await axios.get(
        `${baseURL}/api/Authentication/ValidateResetPasswordToken/${userCredential}/${token}`,
        {
          headers: {
            apiKey: import.meta.env.VITE_API_KEY,
            apiKeyUser: import.meta.env.VITE_API_KEY_USER,
          }
        }
      ).then((response) => {
        if (!response.data.error) {
          return true;
        } else {
          return false;
        }
      }).catch((error) => {
        console.error("Error validating reset password token:", error);
        return false;
      });

      return isValidToken;
    },
  },
});