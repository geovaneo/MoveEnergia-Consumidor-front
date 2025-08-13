import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      name: "Eztools",
      photo: "https://static.wixstatic.com/media/3b60b4_ff32721d7b264b4a859fe987489f3b40~mv2.png/v1/fill/w_263,h_92,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logow%20(1).png",
      addresses: [
        {
          id: 1,
          addressStreet: "Rua Frei Casparino, Mooca, 23165-910, São Paulo - SP."
        },
        {
          id: 2,
          addressStreet: "Avenida Açocê, Indianopolis, 04921-290, São Paulo - SP."
        },
        {
          id: 3,
          addressStreet: "Rua José Quaresma Franco, Jardim Figueira Grande, 04921-290, São Paulo - SP."
        }
      ],
    },
    selectedAddress: 1,
  }),
  actions: {
    getUserInfo() {
    }
  },
  getters: {

  }
});