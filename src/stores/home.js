import { defineStore } from 'pinia';
// import axios from 'axios';

export const useHomeStore = defineStore('home', {
  state: () => ({
    homeInfo: {
      invoicesStatus: "PENDING", // "OK", "PENDING", "OVERDUE"
      currentInvoice: {
        id: 1,
        billingNumber: "09270",
        issuedDate: "06/08/2025",
        installationNumber: "6/1189076-1",
        clientNumber: "6/1189076-1",
        billingMonth: "JUL/2025",
        dueDate: "06/09/2025",
        totalValue: 614.22,
        chargedCustomer: {
          name: "Eztools consultoria em tecnologia da informação LTDA",
          address: "Rua Frei Casparino, Mooca, 23165-910, São Paulo - SP.",
          city: "São Paulo - SP",
          phone: "(11) 91234-5678"
        }
      },
      generalInfo: {
        compensatedEnergy: 1200,
        monthSavings: 108.39,
        totalSavings: 222350.19,
      },
    },
    consumptionGraphMonths: [
      {
        id: 2,
        month: "JUL/2025",
        consumption: 1200,
      },
      {
        id: 2,
        month: "JUN/2025",
        consumption: 1100,
      },

      {
        id: 2,
        month: "MAI/2025",
        consumption: 900,
      },

      {
        id: 2,
        month: "ABR/2025",
        consumption: 1050,
      },

      {
        id: 2,
        month: "MAR/2025",
        consumption: 1000,
      },
      {
        id: 2,
        month: "FEV/2025",
        consumption: 700,
      },
      {
        id: 2,
        month: "JAN/2025",
        consumption: 800,
      },
    ],
    consumptionGraphDetails: {
      month: "JUL/2025",
      consumption: 1200,
      increasedConsumption: 14.7,
      period: "01/07/2025 - 31/07/2025",
      totalInvoice: 614.22,
      monthSavings: 108.39,
      consumerUnits: [
        {
          name: "Todas",
          consumption: 3002,
          totalInvoice: 1536.60,
          savings: 271.16,
        },
        {
          name: "Rua Frei Casparino, Mooca, 23165-910, São Paulo - SP.",
          consumption: 1200,
          totalInvoice: 614.22,
          savings: 108.39,
        },
        {
          name: "Avenida Açocê, Indianopolis, 04921-290, São Paulo - SP.",
          consumption: 820,
          totalInvoice: 419.74,
          savings: 74.07,
        },
        {
          name: "Rua José Quaresma Franco, Jardim Figueira Grande, 04921-290, São Paulo - SP.",
          consumption: 982,
          totalInvoice: 502.64,
          savings: 88.70,
        },
      ]
    },
  }),
  actions: {
    async getHomeInfoByAddress(address_id) {
      this.loadingHome = true;
      //   await axios.get(`/api/home/${address_id}`)
      //     .then(response => {
      //       this.homeInfo = response.data;
      //     })
      //     .catch((error) => {
      //       console.error("Error fetching home information:", error);
      //     });
      // }

      await new Promise(resolve => setTimeout(resolve, 2000)); // SIMULA PAUSA PARA REQUISIÇÃO

      if (address_id == 1) {
        this.homeInfo = {
          invoicesStatus: "PENDING", // "OK", "PENDING", "OVERDUE"
          currentInvoice: {
            id: 1,
            billingNumber: "09270",
            issuedDate: "06/08/2025",
            instalationNumber: "6/1189076-1",
            clientNumber: "6/1189076-1",
            billingMonth: "JUL/2025",
            dueDate: "06/09/2025",
            totalValue: 614.22,
            chargedCustomer: {
              name: "Eztools consultoria em tecnologia da informação LTDA",
              address: "Rua Frei Casparino, Mooca, 23165-910, São Paulo - SP.",
              city: "São Paulo - SP",
              phone: "(11) 91234-5678"
            }
          },
          generalInfo: {
            compensatedEnergy: 1200,
            monthSavings: 108.39,
            totalSavings: 222350.19,
          },
        }
      } else if (address_id == 2) {
        this.homeInfo = {
          invoicesStatus: "PENDING", // "OK", "PENDING", "OVERDUE"
          currentInvoice: {
            id: 2,
            billingNumber: "09221",
            issuedDate: "05/08/2025",
            instalationNumber: "6/1189076-2",
            clientNumber: "6/1189076-2",
            billingMonth: "JUL/2025",
            dueDate: "07/09/2025",
            totalValue: 364.19,
            chargedCustomer: {
              name: "Eztools consultoria em tecnologia da informação LTDA",
              address: "Avenida Açocê, Indianopolis, 04921-290, São Paulo - SP.",
              city: "São Paulo - SP",
              phone: "(11) 9831-5893"
            }
          },
          generalInfo: {
            compensatedEnergy: 870,
            monthSavings: 121.02,
            totalSavings: 222350.19,
          },
        }
      } else if (address_id == 3) {
        this.homeInfo = {
          invoicesStatus: "PENDING", // "OK", "PENDING", "OVERDUE"
          currentInvoice: {
            id: 3,
            billingNumber: "08237",
            issuedDate: "06/08/2025",
            instalationNumber: "6/1189076-3",
            clientNumber: "6/1189076-3",
            billingMonth: "JUL/2025",
            dueDate: "08/09/2025",
            totalValue: 543.28,
            chargedCustomer: {
              name: "Eztools consultoria em tecnologia da informação LTDA",
              address: "Rua José Quaresma Franco, Jardim Figueira Grande, 04921-290, São Paulo - SP.",
              city: "São Paulo - SP",
              phone: "(11) 99221-3326"
            }
          },
          generalInfo: {
            compensatedEnergy: 982,
            monthSavings: 220.11,
            totalSavings: 222350.19,
          },
        }
      }

      this.loadingHome = false;
    },
  },
  getters: {

  }
})