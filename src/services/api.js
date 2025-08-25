// import axios from "axios";
// import { useLoginStore } from "@/stores/login";
// import router from "@/router";

// export const getBaseURL = () => {
//   const env = import.meta.env.VITE_APP_ENV;

//   switch (env) {
//     case "DEV":
//       return "https://consumidorgdapi.qa.moveenergia.com";
//     case "QAS":
//       return "https://consumidorgdapi.qa.moveenergia.com";
//     case "PROD":
//       return "https://consumidorgd.api.prod.moveenergia.com";
//     default:
//       return "https://consumidorgdapi.qa.moveenergia.com";
//   }
// };

// // Creates the axios instance
// const api = axios.create({
//   baseURL: getBaseURL(),
//   withCredentials: true, // necessary for HttpOnly cookies
// });

// // Request interceptor → adds token to the header
// api.interceptors.request.use((config) => {
//   const loginStore = useLoginStore();
//   if (loginStore.token) {
//     config.headers.Authorization = `Bearer ${loginStore.token}`;
//   }
//   return config;
// });

// // Response interceptor → tries automatic refresh
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const loginStore = useLoginStore();

//     if (error.response?.status === 401 && !error.config._retry) {
//       error.config._retry = true;

//       try {
//         const { data } = await axios.post(
//           `${getBaseURL()}/api/Authentication/Refresh`,
//           {},
//           { withCredentials: true }
//         );

//         loginStore.setToken(data.accessToken);

//         // retries the original request with the new token
//         error.config.headers["Authorization"] = `Bearer ${data.accessToken}`;
//         return api(error.config);
//       } catch {
//         loginStore.clearAuth();
//         router.push("/login");
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;


export const getBaseURL = () => {
  const env = import.meta.env.VITE_APP_ENV

  switch (env) {
    case 'DEV':
      return 'https://consumidorgdapi.qa.moveenergia.com'
    case 'QAS':
      return 'https://consumidorgdapi.qa.moveenergia.com'
    case 'PROD':
      return 'https://consumidorgd.api.prod.moveenergia.com'
    default:
      return 'https://consumidorgdapi.qa.moveenergia.com'
  }
}

