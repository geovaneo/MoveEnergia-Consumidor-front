import { defineStore } from 'pinia';
import axios from 'axios';
import { getBaseURL } from "@/services/api";
import { useLoginStore } from './login';
// import api from "@/services/api";

const baseURL = getBaseURL();

export const useHomeStore = defineStore('home', {
  state: () => ({
    homeInfo: {
      invoicesStatus: "", // "OK", "PENDING", "OVERDUE"
      currentInvoice: {
        id: null,
        billingNumber: "",
        issuedDate: "",
        installationNumber: "",
        clientNumber: "",
        billingMonth: "",
        dueDate: "",
        totalValue: 0,
        chargedCustomer: {
          name: "",
          address: "",
          city: "",
          phone: ""
        }
      },
      generalInfo: {
        compensatedEnergy: 0,
        monthSavings: 0,
        totalSavings: 0,
      },
    },
    consumptionGraphMonths: [],
    consumptionGraphDetails: {
      month: "",
      consumption: 0,
      increasedConsumption: 0,
      period: "",
      totalInvoice: 0,
      monthSavings: 0,
      consumerUnit: []
    },
    loadingConsumptionGraph: false,
    loadingHome: false,
    loadingHomeData: false,
    consumerUnits: [],
    selectedConsumerUnit: null
  }),
  actions: {

    async fetchUserAddresses() {
      const loginStore = useLoginStore();
      const token = loginStore.token;
      const userId = loginStore.user.id;

      await axios.get(`${baseURL}/api/ConsumerUnit/Adress/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          this.consumerUnits = response.data.data;
          this.selectedConsumerUnit = this.consumerUnits.length > 0 ? this.consumerUnits[0].id : null;
        }).catch((error) => {
          console.error("Error fetching user addresses:", error);
        })
    },

    async fetchHomeData() {
      const loginStore = useLoginStore();
      const token = loginStore.token;

      await axios.get(`${baseURL}/api/HomeInfo/Info/Id/${this.selectedConsumerUnit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          this.homeInfo = response.data.data;
        }).catch((error) => {
          console.error("Error fetching home info:", error);
        })
    },

    async fetchGraphicLabels() {
      const loginStore = useLoginStore();
      const token = loginStore.token;

      await axios.get(`${baseURL}/api/HomeInfo/LabelGraphic/${this.selectedConsumerUnit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          this.consumptionGraphMonths = response.data.data;
        }).catch((error) => {
          console.error("Error fetching graphic labels:", error);
        });
    },

    async fetchGraphicDetails(month, year) {
      const loginStore = useLoginStore();
      const token = loginStore.token;

      await axios.get(`${baseURL}/api/HomeInfo/LabelGraphicDetail/${this.selectedConsumerUnit}/${month}/${year}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          this.consumptionGraphDetails = response.data.data;
        }).catch((error) => {
          console.error("Error fetching graphic details:", error);
        });
    },

    getMonthAndYear(monthString) {
      const [monthStr, year] = monthString.split('/')

      const monthMap = {
        JAN: 1,
        FEV: 2,
        MAR: 3,
        ABR: 4,
        MAI: 5,
        JUN: 6,
        JUL: 7,
        AGO: 8,
        SET: 9,
        OUT: 10,
        NOV: 11,
        DEZ: 12,
      }

      const month = monthMap[monthStr.toUpperCase()] || 1
      return { month, year }
    },

    // FUNÇÃO DE MOCKUP
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
          invoicesStatus: "OK", // "OK", "PENDING", "OVERDUE"
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
          invoicesStatus: "OVERDUE", // "OK", "PENDING", "OVERDUE"
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

    // FUNÇÃO DE MOCKUP
    async getConsumptionGraphInfoByMonth(month) {
      this.loadingConsumptionGraph = true;

      this.consumptionGraphDetails.month = month;

      await new Promise(resolve => setTimeout(resolve, 2000)); // Simula requisição

      // Extrair mês e ano
      const [monthStr, yearStr] = month.split("/");
      const monthMap = {
        JAN: 1, FEV: 2, MAR: 3, ABR: 4, MAI: 5, JUN: 6,
        JUL: 7, AGO: 8, SET: 9, OUT: 10, NOV: 11, DEZ: 12
      };
      const monthNum = monthMap[monthStr.toUpperCase()];
      const yearNum = parseInt(yearStr);

      // Último dia do mês
      const lastDay = new Date(yearNum, monthNum, 0).getDate();

      // Função auxiliar para valores aleatórios
      const rand = (min, max, decimals = 0) => {
        const val = Math.random() * (max - min) + min;
        return parseFloat(val.toFixed(decimals));
      };

      // Lista de nomes de unidades (mantida fixa)
      const consumerUnitNames = [
        "Todas",
        "Rua Frei Casparino, Mooca, 23165-910, São Paulo - SP.",
        "Avenida Açocê, Indianopolis, 04921-290, São Paulo - SP.",
        "Rua José Quaresma Franco, Jardim Figueira Grande, 04921-290, São Paulo - SP.",
      ];

      // Gerar unidades consumidoras
      const consumerUnits = consumerUnitNames.map(name => {
        const consumption = rand(500, 4000, 0); // Consumo entre 500 e 4000
        const totalInvoice = rand(200, 2000, 2);
        const savings = rand(50, 500, 2);
        return { name, consumption, totalInvoice, savings };
      });

      // Garantir que "Todas" seja a soma das demais
      consumerUnits[0].consumption = consumerUnits.slice(1).reduce((sum, u) => sum + u.consumption, 0);
      consumerUnits[0].totalInvoice = consumerUnits.slice(1).reduce((sum, u) => sum + u.totalInvoice, 0);
      consumerUnits[0].savings = consumerUnits.slice(1).reduce((sum, u) => sum + u.savings, 0);

      this.consumptionGraphDetails = {
        month,
        consumption: consumerUnits[0].consumption,
        increasedConsumption: rand(-20, 20, 1), // Pode ser negativa
        period: `01/${monthNum.toString().padStart(2, "0")}/${yearNum} - ${lastDay.toString().padStart(2, "0")}/${monthNum.toString().padStart(2, "0")}/${yearNum}`,
        totalInvoice: consumerUnits[0].totalInvoice,
        monthSavings: consumerUnits[0].savings,
        consumerUnits
      };

      console.log(this.consumptionGraphDetails);

      this.loadingConsumptionGraph = false;
    },

    async getConsumptionGraphMonthsLabels() {
      this.consumptionGraphMonths = [
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
      ]
    }
  },
  getters: {

  }
})