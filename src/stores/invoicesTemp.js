import { defineStore } from 'pinia';
// import axios from 'axios';
// import { getBaseURL } from "@/services/api";
// import { useLoginStore } from './login';

// const baseURL = getBaseURL();

export const useInvoicesStore = defineStore('invoices', {
    state: () => ({
        addresses: [],
        selectedAddressId: null,
        invoiceSummary: {
            pendingInvoices: 0,
            overdueInvoices: 0,
            totalInvoices: 0
        },
        invoices: [],
        selectedInvoice: null,
        loading: false,
        error: null
    }),

    actions: {

        async fetchUserAddresses() {
            this.loading = true;

            try {
                // const loginStore = useLoginStore();
                // const token = loginStore.token;
                // const userId = loginStore.user?.id;

                // Comentado para usar dados mockados
                // const response = await axios.get(`${baseURL}/api/addresses/${userId}`, {
                //   headers: { Authorization: `Bearer ${token}` }
                // });
                // this.addresses = response.data;

                // Usando dados mockados
                await new Promise(resolve => setTimeout(resolve, 800));
                this.addresses = this.getMockAddresses();


                if (this.addresses.length > 0 && !this.selectedAddressId) {
                    this.selectedAddressId = this.addresses[0].id;
                }

                this.loading = false;
            } catch (error) {
                this.error = 'Erro ao carregar endereços: ' + error.message;
                this.loading = false;
                console.error("Error fetching addresses:", error);
            }
        },


        async fetchInvoicesByAddress(addressId = null) {
            const targetAddressId = addressId || this.selectedAddressId;

            if (!targetAddressId) {
                this.error = 'Nenhum endereço selecionado';
                return;
            }

            this.loading = true;

            try {
                // const loginStore = useLoginStore();
                // const token = loginStore.token;

                // Comentado para usar dados mockados
                // const response = await axios.get(`${baseURL}/api/invoices/address/${targetAddressId}`, {
                //   headers: { Authorization: `Bearer ${token}` }
                // });
                // const data = response.data;
                // this.invoiceSummary = data.invoiceSummary;
                // this.invoices = data.invoices;

                // Usando dados mockados
                await new Promise(resolve => setTimeout(resolve, 1200));
                const mockData = this.getMockInvoicesByAddress(targetAddressId);
                this.invoiceSummary = mockData.invoiceSummary;
                this.invoices = mockData.invoices;

                this.loading = false;
            } catch (error) {
                this.error = 'Erro ao carregar faturas: ' + error.message;
                this.loading = false;
                console.error("Error fetching invoices:", error);
            }
        },


        async selectAddress(addressId) {
            this.selectedAddressId = addressId;
            await this.fetchInvoicesByAddress(addressId);
        },


        selectInvoice(invoice) {
            this.selectedInvoice = invoice;
        },


        clearSelectedInvoice() {
            this.selectedInvoice = null;
        },

        // Dados mockados - Endereços
        getMockAddresses() {
            return [
                {
                    id: 1,
                    address: "Rua Frei Casparino, Mooca, 23165-910, São Paulo - SP."
                },
                {
                    id: 2,
                    address: "Av. Paulista, 1000, 01310-100, São Paulo - SP."
                },
                {
                    id: 3,
                    address: "Rua Augusta, 500, Consolação, 01304-000, São Paulo - SP."
                },
                {
                    id: 4,
                    address: "Av. Brigadeiro Faria Lima, 3477, Itaim Bibi, 04538-133, São Paulo - SP."
                },
                {
                    id: 5,
                    address: "Rua Oscar Freire, 1000, Jardim Paulista, 01426-001, São Paulo - SP."
                }
            ];
        },

        // Dados mockados - Faturas por endereço
        getMockInvoicesByAddress(addressId) {

            const randomValue = (min, max, decimals = 2) => {
                const value = Math.random() * (max - min) + min;
                return Number(value.toFixed(decimals));
            };


            const formatDate = (date) => {
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            };


            const generateInvoices = (count, baseMonth = 0) => {
                const invoices = [];
                const currentDate = new Date();

                for (let i = 0; i < count; i++) {

                    const referenceDate = new Date(currentDate);
                    referenceDate.setMonth(currentDate.getMonth() - baseMonth - i);

                    const emissionDate = new Date(referenceDate);
                    emissionDate.setDate(1);

                    const dueDate = new Date(emissionDate);
                    dueDate.setDate(emissionDate.getDate() + 10);

                    let status = 'PENDING';
                    let paymentDate = null;


                    if (dueDate < currentDate) {

                        if (Math.random() < 0.7) {
                            status = 'OK';
                            const paymentDay = new Date(dueDate);

                            const daysToAdd = Math.floor(Math.random() * (dueDate.getDate() + 2 - emissionDate.getDate())) + emissionDate.getDate();
                            paymentDay.setDate(daysToAdd);
                            paymentDate = formatDate(paymentDay);
                        } else {
                            status = 'OVERDUE';
                        }
                    }

                    const monthNames = [
                        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                    ];

                    const month = referenceDate.getMonth();
                    const baseValue = month >= 10 || month <= 2 ? randomValue(400, 600) : randomValue(300, 450);

                    invoices.push({
                        id: i + 1 + (addressId * 100),
                        referenceMonth: monthNames[month],
                        dueDate: formatDate(dueDate),
                        totalValue: baseValue,
                        status: status,
                        paymentDate: paymentDate,
                        details: {
                            emissionDate: formatDate(emissionDate),
                            barcode: "23793.50909 90025.257537 85000.131004 9 12020000079424"
                        }
                    });
                }

                return invoices;
            };


            const invoices = generateInvoices(10, addressId - 1);


            const pendingCount = invoices.filter(inv => inv.status === 'PENDING').length;
            const overdueCount = invoices.filter(inv => inv.status === 'OVERDUE').length;

            return {
                invoiceSummary: {
                    pendingInvoices: pendingCount,
                    overdueInvoices: overdueCount,
                    totalInvoices: 100 + (addressId * 10)
                },
                invoices: invoices
            };
        }
    },

    getters: {

        currentAddress: (state) => {
            return state.addresses.find(addr => addr.id === state.selectedAddressId) || null;
        },

        invoiceCountByStatus: (state) => (status) => {
            return state.invoices.filter(inv => inv.status === status).length;
        },

        sortedInvoices: (state) => {
            return [...state.invoices].sort((a, b) => {
                const dateA = a.dueDate.split('/').reverse().join('-');
                const dateB = b.dueDate.split('/').reverse().join('-');
                return new Date(dateB) - new Date(dateA);
            });
        },

        totalPendingAmount: (state) => {
            return state.invoices
                .filter(inv => inv.status === 'PENDING' || inv.status === 'OVERDUE')
                .reduce((sum, inv) => sum + Number(inv.totalValue), 0);
        }
    }
});