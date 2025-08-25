import { defineStore } from 'pinia';
import { getBaseURL } from "@/services/api";
import axios from 'axios';

const baseURL = getBaseURL();

export const useLoginStore = defineStore('login', {
  state: () => ({
    user: null,
    token: null,
    loadingLogin: false
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
    },
    authenticateUser(credentials) {

      this.loadingLogin = true;

      const encodedUserName = btoa(credentials.userName);
      const encodedPassword = btoa(credentials.password);
      const loginPayload = {
        userName: encodedUserName,
        password: encodedPassword
      }

      return axios.post(`${baseURL}/api/Authentication/AuthenticateUser`, loginPayload)
        .then(response => {
          this.setUser(response.data.user);
          this.setToken(response.data.token);
          return true;
        })
        .catch(error => {
          console.error("Authentication error:", error);
          throw new Error("Invalid credentials");
        }).finally(() => {
          this.loadingLogin = false;
        });
    }
  },
  getters: {

  }
});