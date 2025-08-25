// import { defineStore } from "pinia";
// import api from "@/services/api";
// import { useNotifications } from '@/services/useNotifications'

// const { notificationSuccess, notificationError } = useNotifications()

// export const useLoginStore = defineStore("login", {
//   state: () => ({
//     user: null,
//     token: null,
//     loadingLogin: false,
//   }),
//   actions: {
//     setUser(user) {
//       this.user = user;
//     },
//     setToken(token) {
//       this.token = token; // token só fica na memória
//     },
//     clearAuth() {
//       this.user = null;
//       this.token = null;
//     },
//     async authenticateUser(credentials) {
//       this.loadingLogin = true;
//       try {
//         const { data } = await api.post(
//           "/api/Authentication/AuthenticateUser",
//           credentials
//         );

//         this.setUser(data.user);
//         this.setToken(data.accessToken);
//         notificationSuccess("Login realizado com sucesso!");
//         return true;
//       } catch (error) {
//         notificationError("Credenciais inválidas");
//         throw new Error("Credenciais inválidas");
//       } finally {
//         this.loadingLogin = false;
//       }
//     },
//     async logout() {
//       this.clearAuth();
//       // opcional: pedir pro backend invalidar o refreshToken
//       await api.post("/api/Authentication/Logout");
//     },
//   },
// });

import { defineStore } from 'pinia';
import { getBaseURL } from "@/services/api";
import { useNotifyStore } from '@/stores/notify';
import axios from 'axios';
import router from "@/router";

const baseURL = getBaseURL();

export const useLoginStore = defineStore('login', {
  state: () => ({
    user: null,
    token: null,
    loadingLogin: false,
    authenticated: false,
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
    },

    async authenticateUser(credentials) {
      this.loadingLogin = true;

      function encodeBase64(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
          })
        );
      }

      const encodedUserName = encodeBase64(credentials.userName);
      const encodedPassword = encodeBase64(credentials.passWord);
      const loginPayload = {
        userName: encodedUserName,
        passWord: encodedPassword
      }

      try {
        const response = await axios.post(`${baseURL}/api/Authentication/AuthenticateUser`, loginPayload);
        this.authenticated = true;
        useNotifyStore().success('Sucesso!', 'Login realizado com sucesso.');
        router.push('/');
        return response.data;
      } catch (error) {
        this.authenticated = false;
        console.error("Authentication error:", error);
        useNotifyStore().error('Credenciais Incorretas!', 'Verifique o login e tente novamente.');
        throw new Error("Invalid credentials");
      } finally {
        this.loadingLogin = false;
      }
    },

    logoutUser() {
      this.clearAuth();
      router.push('/login');
      useNotifyStore().success('Logout realizado com sucesso!', 'Você foi desconectado.');
    },
  }
});