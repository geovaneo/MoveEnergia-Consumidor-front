import { defineStore } from 'pinia';
import axios from 'axios';
import { getBaseURL } from '@/services/api';
import { useLoginStore } from './login';

export const useInvoicesStore = defineStore('invoices', {
    state: () => ({
        addresses: [],
        selectedAddressId: null,
        invoiceSummary: {
            pendingInvoices: 0,
            overdueInvoices: 0,
            paidInvoices: 0,
            totalInvoices: 0
        },
        invoices: [],
        selectedInvoice: null,
        loading: false,
    }),

    actions: {
        async userAddresses() {
            this.loading = true;

            try {
                const baseURL = getBaseURL();
                const loginStore = useLoginStore();
                const token = loginStore?.token;
                const userId = loginStore?.user?.id;

                const headers = { Authorization: `Bearer ${token}` };


                const response = await axios.get(`${baseURL}/api/ConsumerUnit/Adress/${userId}`, { headers });

                const payload = response.data;
                if (payload.error) {
                    throw new Error(`API retornou erro. statusCode=${payload.statusCode}`);
                }


                const addressesData = payload.data || [];


                this.addresses = addressesData.map(item => ({
                    id: item.id,
                    name: item.name,
                    uc: item.uc,

                    address: item.address && item.address.length > 0
                        ? item.address[0].addressStreet
                        : `UC: ${item.uc}`
                }));

                if (this.addresses.length > 0 && !this.selectedAddressId) {
                    this.selectedAddressId = this.addresses[0].uc || this.addresses[0].id;
                }

                this.loading = false;
            } catch (error) {
                this.error = 'Erro ao carregar endereços: ' + (error?.message || error);
                this.loading = false;
                console.error("Error fetching addresses:", error);
            }
        },

        async invoicesByAddress(addressId = null) {

            const targetAddressId = addressId || this.selectedAddressId;

            this.loading = true;

            try {
                const baseURL = getBaseURL();
                const loginStore = useLoginStore();
                const token = loginStore?.token;

                const headers = { Authorization: `Bearer ${token}` };

                const response = await axios.get(`${baseURL}/api/HomeInfo/ChargeList/${targetAddressId}`, { headers });

                const payload = response.data;
                const data = payload.data || {};

                if (!data.invoiceSummary && (!data.invoices || data.invoices.length === 0)) {
                    this.loading = false;
                    return;
                }

                if (data.invoiceSummary) {
                    this.invoiceSummary = {
                        pendingInvoices: data.invoiceSummary?.pendingInvoices ?? 0,
                        overdueInvoices: data.invoiceSummary?.overdueInvoices ?? 0,
                        paidInvoices: data.invoiceSummary?.paidInvoices ?? 0,
                        totalInvoices: data.invoiceSummary?.totalInvoices ?? 0
                    };
                }


                const normalizeStatus = (s) => {
                    if (!s) return 'PENDING';
                    const up = String(s).toUpperCase();
                    if (up.includes('VENC')) return 'OVERDUE';
                    if (up.includes('PEND')) return 'PENDING';
                    if (up.includes('PAGA') || up === 'OK' || up === 'PAID') return 'OK';
                    return up;
                };

                if (data.invoices && data.invoices.length > 0) {
                    this.invoices = data.invoices.map(inv => ({
                        id: inv.id,
                        referenceMonth: inv.referenceMonth,
                        dueDate: inv.dueDate,
                        totalValue: Number(inv.totalValue),
                        status: normalizeStatus(inv.status),
                        paymentDate: inv.paymentDate || null,
                        details: {
                            emissionDate: inv.details?.emissionDate || '',
                            barcode: inv.details?.barcode || ''
                        }
                    }));
                } else {
                    this.invoices = [];
                }

                this.loading = false;
            } catch (error) {
                this.error = 'Erro ao carregar faturas: ' + (error?.message || error);
                this.loading = false;
                console.error("Error fetching invoices:", error);

            }
        },

        async selectAddress(addressId) {
            this.selectedAddressId = addressId;
            await this.invoicesByAddress(addressId);
        },

        selectInvoice(invoice) {
            this.selectedInvoice = invoice;
        },

        clearSelectedInvoice() {
            this.selectedInvoice = null;
        }

    },

    getters: {
        currentAddress: (state) => {
            return state.addresses.find(addr => addr.id === state.selectedAddressId || addr.uc === state.selectedAddressId) || null;
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