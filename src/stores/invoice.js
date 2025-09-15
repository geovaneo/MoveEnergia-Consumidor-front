import { defineStore } from 'pinia';

export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    invoiceDetails: {
      id: null,
      invoicesStatus: "", // "OK", "PENDING", "OVERDUE"
      currentInvoice: {
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
      consumption: {
        peak: 0,
        offPeak: 0,
        total: 0
      },
      charges: []
    },
    loadingInvoices: false,
    loadingInvoiceDetails: false,
    consumerUnits: [],
    selectedConsumerUnit: null,
    currentFilter: {
      year: new Date().getFullYear(),
      status: 'all'
    },
    allUnitsId: 'all',
    months: ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'],
    monthMap: { 'JANEIRO': 1, 'FEVEREIRO': 2, 'MARÇO': 3, 'ABRIL': 4, 'MAIO': 5, 'JUNHO': 6, 'JULHO': 7, 'AGOSTO': 8, 'SETEMBRO': 9, 'OUTUBRO': 10, 'NOVEMBRO': 11, 'DEZEMBRO': 12 },
    invoiceStatusEnum: { OK: 'OK', PENDING: 'PENDING', OVERDUE: 'OVERDUE' },

  }),

  actions: {

    async fetchUserAddresses() {
      this.loadingInvoices = true;

      try {
        await this.getMockAddresses();
        return this.consumerUnits;
      } catch (error) {
        console.error("Error in fetchUserAddresses:", error);
        return [];
      } finally {
        this.loadingInvoices = false;
      }
    },

    async fetchInvoices(page = 1, unitId = null) {
      this.loadingInvoices = true;

      try {
        const consumerUnitId = unitId || this.selectedConsumerUnit;

        if (consumerUnitId === this.allUnitsId) {
          await this.getMockInvoicesForAllUnits(page);
        } else {
          await this.getMockInvoicesForUnit(consumerUnitId, page);
        }

        return this.invoicesInfo;
      } catch (error) {
        console.error("Error fetching invoices:", error);
        return null;
      } finally {
        this.loadingInvoices = false;
      }
    },

    async getMockInvoicesForUnit(unitId, page = 1) {
      await new Promise(resolve => setTimeout(resolve, 600));

      if (!unitId) {
        this.setEmptyInvoices();
        return;
      }

      const allInvoices = this.getMockInvoicesData();
      const filteredInvoices = allInvoices.filter(invoice =>
        invoice.consumerUnitId === unitId.toString()
      );

      this.setPaginatedInvoices(filteredInvoices, page, 10);
    },

    async getMockInvoicesForAllUnits(page = 1) {
      await new Promise(resolve => setTimeout(resolve, 600));

      const allInvoices = this.getMockInvoicesData();
      this.setPaginatedInvoices(allInvoices, page, 15);
    },
    generateInvoiceValues(year, month, invoicesStatus) {
      const consumption = Math.floor(Math.random() * 900) + 300;

      const ratePerKwh = parseFloat((Math.random() * 0.3 + 0.7).toFixed(3));

      const totalValue = parseFloat((consumption * ratePerKwh).toFixed(2));

      const dueDay = Math.floor(Math.random() * 28) + 1;
      const dueDate = `${dueDay.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;

      let paymentDate = null;
      if (invoicesStatus === this.invoiceStatusEnum.OK) {

        const offset = Math.floor(Math.random() * 5) - 2;
        const payDay = Math.min(28, Math.max(1, dueDay + offset));
        paymentDate = `${payDay.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
      }

      return { totalValue, consumption, dueDate, paymentDate };
    },



    setPaginatedInvoices(invoices, page, itemsPerPage) {
      const sortedInvoices = this.sortInvoicesByDate(invoices);

      const totalItems = sortedInvoices.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedInvoices = sortedInvoices.slice(startIndex, startIndex + itemsPerPage);

      this.invoicesInfo = {
        invoices: paginatedInvoices,
        pagination: {
          totalItems,
          itemsPerPage,
          totalPages,
          currentPage: page
        }
      };
    },

    sortInvoicesByDate(invoices) {
      return [...invoices].sort((a, b) => {
        const [monthA, yearA] = a.billingMonth.split('/');
        const [monthB, yearB] = b.billingMonth.split('/');

        if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
        return this.monthMap[monthB] - this.monthMap[monthA];
      });
    },

    async fetchInvoiceDetails(invoiceId) {
      this.loadingInvoiceDetails = true;

      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (["1", "2", "3"].includes(invoiceId)) {
          return this.getFixedInvoiceDetails(invoiceId);
        }

        return this.getDynamicInvoiceDetails(invoiceId);
      } catch (error) {
        console.error("Error fetching invoice details:", error);
        return null;
      } finally {
        this.loadingInvoiceDetails = false;
      }
    },

    getFixedInvoiceDetails(invoiceId) {
      const fixedDetails = {
        "1": {
          id: "1",
          consumerUnitId: "1",
          billingNumber: "09270",
          issuedDate: "06/08/2025",
          installationNumber: "6/1189076-1",
          clientNumber: "6/1189076-1",
          billingMonth: "AGOSTO/2025",
          dueDate: "06/09/2025",
          totalValue: 614.22,
          invoicesStatus: this.invoiceStatusEnum.PENDING,
          paymentDate: null,
          pdfUrl: "#",
          consumption: {
            peak: 172,
            offPeak: 260,
            total: 432
          },
          charges: [
            { description: "Consumo Energia", value: 368.53 },
            { description: "Transmissão", value: 73.71 },
            { description: "Distribuição", value: 67.56 },
            { description: "Encargos Setoriais", value: 49.14 },
            { description: "Tributos", value: 110.56 },
            { description: "Crédito Energia Solar", value: -55.28 }
          ],
          chargedCustomer: {
            name: "Eztools consultoria em tecnologia da informação LTDA",
            address: "Rua Frei Casparino, Mooca, 23165-910, São Paulo - SP.",
            city: "São Paulo - SP",
            phone: "(11) 91234-5678"
          }
        },
        "2": {
          id: "2",
          consumerUnitId: "2",
          billingNumber: "09221",
          issuedDate: "05/08/2025",
          installationNumber: "6/1189076-2",
          clientNumber: "6/1189076-2",
          billingMonth: "AGOSTO/2025",
          dueDate: "07/09/2025",
          totalValue: 502.64,
          invoicesStatus: this.invoiceStatusEnum.PENDING,
          paymentDate: null,
          pdfUrl: "#",
          consumption: {
            peak: 344,
            offPeak: 638,
            total: 982
          },
          charges: [
            { description: "Consumo Energia", value: 301.58 },
            { description: "Transmissão", value: 60.32 },
            { description: "Distribuição", value: 55.29 },
            { description: "Encargos Setoriais", value: 40.21 },
            { description: "Tributos", value: 90.48 },
            { description: "Crédito Energia Solar", value: -45.24 }
          ],
          chargedCustomer: {
            name: "Eztools consultoria em tecnologia da informação LTDA",
            address: "Avenida Açocê, Indianopolis, 04921-290, São Paulo - SP.",
            city: "São Paulo - SP",
            phone: "(11) 9831-5893"
          }
        },
        "3": {
          id: "3",
          consumerUnitId: "3",
          billingNumber: "08237",
          issuedDate: "06/08/2025",
          installationNumber: "6/1189076-3",
          clientNumber: "6/1189076-3",
          billingMonth: "AGOSTO/2025",
          dueDate: "08/09/2025",
          totalValue: 543.28,
          invoicesStatus: this.invoiceStatusEnum.OVERDUE,
          paymentDate: null,
          pdfUrl: "#",
          consumption: {
            peak: 344,
            offPeak: 638,
            total: 982
          },
          charges: [
            { description: "Consumo Energia", value: 325.97 },
            { description: "Transmissão", value: 65.19 },
            { description: "Distribuição", value: 59.76 },
            { description: "Encargos Setoriais", value: 43.46 },
            { description: "Tributos", value: 97.79 },
            { description: "Crédito Energia Solar", value: -48.89 }
          ],
          chargedCustomer: {
            name: "Eztools consultoria em tecnologia da informação LTDA",
            address: "Rua José Quaresma Franco, Jardim Figueira Grande, 04921-290, São Paulo - SP.",
            city: "São Paulo - SP",
            phone: "(11) 99221-3326"
          }
        }
      };

      this.invoiceDetails = fixedDetails[invoiceId];
      return this.invoiceDetails;
    },

    getDynamicInvoiceDetails(invoiceId) {
      const allInvoices = this.getMockInvoicesData();
      const invoice = allInvoices.find(inv => inv.id === invoiceId);

      if (!invoice) {
        throw new Error("Invoice not found");
      }

      this.invoiceDetails = {
        ...invoice,
        consumption: {
          peak: Math.floor(invoice.consumption * 0.35),
          offPeak: Math.floor(invoice.consumption * 0.65),
          total: invoice.consumption
        },
        charges: [
          { description: "Consumo Energia", value: parseFloat((invoice.totalValue * 0.6).toFixed(2)) },
          { description: "Transmissão", value: parseFloat((invoice.totalValue * 0.12).toFixed(2)) },
          { description: "Distribuição", value: parseFloat((invoice.totalValue * 0.11).toFixed(2)) },
          { description: "Encargos Setoriais", value: parseFloat((invoice.totalValue * 0.08).toFixed(2)) },
          { description: "Tributos", value: parseFloat((invoice.totalValue * 0.18).toFixed(2)) },
          { description: "Crédito Energia Solar", value: parseFloat((invoice.totalValue * -0.09).toFixed(2)) }
        ]
      };

      return this.invoiceDetails;
    },

    async getMockAddresses() {
      await new Promise(resolve => setTimeout(resolve, 400));

      this.consumerUnits = [
        {
          id: this.allUnitsId,
          name: "Todos os endereços",
          address: []
        },
        {
          id: "1",
          address: [
            {
              addressStreet: "Rua Frei Casparino",
              addressNumber: "123",
              addressComplement: "Apto 42",
              addressNeighborhood: "Mooca",
              addressCity: "São Paulo",
              addressState: "SP",
              addressZipCode: "23165-910"
            }
          ]
        },
        {
          id: "2",
          address: [
            {
              addressStreet: "Avenida Açocê",
              addressNumber: "500",
              addressComplement: "Sala 302",
              addressNeighborhood: "Indianopolis",
              addressCity: "São Paulo",
              addressState: "SP",
              addressZipCode: "04921-290"
            }
          ]
        },
        {
          id: "3",
          address: [
            {
              addressStreet: "Rua José Quaresma Franco",
              addressNumber: "78",
              addressComplement: "",
              addressNeighborhood: "Jardim Figueira Grande",
              addressCity: "São Paulo",
              addressState: "SP",
              addressZipCode: "04921-290"
            }
          ]
        }
      ];

      this.selectedConsumerUnit = this.allUnitsId;
    },

    getMockInvoicesData() {
      const currentYear = new Date().getFullYear();
      const invoices = [];

      const currentDate = new Date();
      let previousMonthIndex = currentDate.getMonth() - 1;
      let billingYear = currentYear;

      if (previousMonthIndex < 0) {
        previousMonthIndex = 11;
        billingYear -= 1;
      }

      const previousMonth = this.months[previousMonthIndex];
      const previousMonthWithYear = `${previousMonth}/${billingYear}`;

      this.generateCurrentInvoices(invoices, previousMonthWithYear, billingYear, previousMonthIndex);

      let id = 4;

      for (let unitId = 1; unitId <= 3; unitId++) {
        for (const year of [currentYear, currentYear - 1, currentYear - 2]) {
          const monthEnd = year === currentYear ? previousMonthIndex : 11;

          for (let month = 0; month <= monthEnd; month++) {
            if (year === billingYear && month === previousMonthIndex) continue;

            const invoiceMonth = `${this.months[month]}/${year}`;

            const status = this.determineInvoiceStatus(year, month, currentDate);

            const { totalValue, consumption, dueDate, paymentDate } =
              this.generateInvoiceValues(year, month, status);

            const { address, phone } = this.getAddressInfo(unitId);

            invoices.push({
              id: id.toString(),
              invoicesStatus: this.invoiceStatusEnum.OK,
              consumerUnitId: unitId.toString(),
              billingNumber: `BIL-${year}${(month + 1).toString().padStart(2, '0')}${unitId}`,
              issuedDate: `01/${(month + 1).toString().padStart(2, '0')}/${year}`,
              installationNumber: `6/1189076-${unitId}`,
              clientNumber: `6/1189076-${unitId}`,
              billingMonth: invoiceMonth,
              dueDate,
              totalValue,
              paymentDate,
              pdfUrl: "#",
              consumption,
              chargedCustomer: {
                name: "Eztools consultoria em tecnologia da informação LTDA",
                address,
                city: "São Paulo - SP",
                phone
              }
            });

            id++;
          }
        }
      }

      return invoices;
    },

    generateCurrentInvoices(invoices, monthWithYear, year, monthIndex) {
      const issueMonth = monthIndex + 1;
      const dueMonth = issueMonth + 1;

      const issueYear = year;
      const dueYear = dueMonth > 12 ? year + 1 : year;

      const adjustedDueMonth = dueMonth > 12 ? dueMonth - 12 : dueMonth;
      const currentInvoices = [
        {
          id: "1",
          consumerUnitId: "1",
          billingNumber: "09270",
          issuedDate: `24/${issueMonth.toString().padStart(2, '0')}/${issueYear}`,
          installationNumber: "6/1189076-1",
          clientNumber: "6/1189076-1",
          billingMonth: monthWithYear,
          dueDate: `04/${adjustedDueMonth.toString().padStart(2, '0')}/${dueYear}`,
          totalValue: 614.22,
          invoicesStatus: this.invoiceStatusEnum.PENDING,
          consumption: 432,
          chargedCustomer: {
            name: "Eztools consultoria em tecnologia da informação LTDA",
            address: "Rua Frei Casparino, Mooca, 23165-910, São Paulo - SP.",
            city: "São Paulo - SP",
            phone: "(11) 91234-5678"
          }
        },
        {
          id: "2",
          consumerUnitId: "2",
          billingNumber: "09221",
          issuedDate: `24/${issueMonth.toString().padStart(2, '0')}/${issueYear}`,
          installationNumber: "6/1189076-2",
          clientNumber: "6/1189076-2",
          billingMonth: monthWithYear,
          dueDate: `04/${adjustedDueMonth.toString().padStart(2, '0')}/${dueYear}`,
          totalValue: 502.64,
          invoicesStatus: this.invoiceStatusEnum.OK,
          consumption: 982,
          chargedCustomer: {
            name: "Eztools consultoria em tecnologia da informação LTDA",
            address: "Avenida Açocê, Indianopolis, 04921-290, São Paulo - SP.",
            city: "São Paulo - SP",
            phone: "(11) 9831-5893"
          }
        },
        {
          id: "3",
          consumerUnitId: "3",
          billingNumber: "08237",
          issuedDate: `24/${issueMonth.toString().padStart(2, '0')}/${issueYear}`,
          installationNumber: "6/1189076-3",
          clientNumber: "6/1189076-3",
          billingMonth: monthWithYear,
          dueDate: `04/${adjustedDueMonth.toString().padStart(2, '0')}/${dueYear}`,
          totalValue: 543.28,
          invoicesStatus: this.invoiceStatusEnum.OVERDUE,
          consumption: 982,
          chargedCustomer: {
            name: "Eztools consultoria em tecnologia da informação LTDA",
            address: "Rua José Quaresma Franco, Jardim Figueira Grande, 04921-290, São Paulo - SP.",
            city: "São Paulo - SP",
            phone: "(11) 99221-3326"
          }
        }
      ];

      invoices.push(...currentInvoices);
    },

    determineInvoiceStatus(year, month, currentDate) {
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      let invoicesStatus = this.invoiceStatusEnum.OK;

      if (year === currentYear && month >= currentMonth - 2 && month !== currentMonth) {
        invoicesStatus = Math.random() > 0.7 ? this.invoiceStatusEnum.PENDING : this.invoiceStatusEnum.OK;
      }

      if (invoicesStatus === this.invoiceStatusEnum.OK && year === currentYear &&
        month >= currentMonth - 4 && month < currentMonth - 1 && Math.random() < 0.15) {
        invoicesStatus = this.invoiceStatusEnum.OVERDUE;
      }

      return invoicesStatus;
    },


    getAddressInfo(unitId) {
      const addressMap = {
        1: {
          address: "Rua Frei Casparino, Mooca, 23165-910, São Paulo - SP.",
          phone: "(11) 91234-5678"
        },
        2: {
          address: "Avenida Açocê, Indianopolis, 04921-290, São Paulo - SP.",
          phone: "(11) 9831-5893"
        },
        3: {
          address: "Rua José Quaresma Franco, Jardim Figueira Grande, 04921-290, São Paulo - SP.",
          phone: "(11) 99221-3326"
        }
      };

      return addressMap[unitId] || { address: "", phone: "" };
    }
  }
});