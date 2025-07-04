import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { differenceInDays, format, startOfMonth, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Property,
  Tenant,
  Contract,
  Payment,
  Expense,
  Stats,
  MonthlyFinancials
} from '../types';
import * as firestoreService from '../services/firestoreService';

interface AppContextType {
  properties: Property[];
  tenants: Tenant[];
  contracts: Contract[];
  payments: Payment[];
  expenses: Expense[];
  stats: Stats;
  monthlyFinancials: MonthlyFinancials[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => Promise<void>;
  updateProperty: (property: Property) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt'>) => Promise<void>;
  updateTenant: (tenant: Tenant) => Promise<void>;
  deleteTenant: (id: string) => Promise<void>;
  addContract: (contract: Omit<Contract, 'id' | 'createdAt'>) => Promise<void>;
  updateContract: (contract: Contract) => Promise<void>;
  deleteContract: (id: string) => Promise<void>;
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => Promise<void>;
  updatePayment: (payment: Payment) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  calculateLateFee: (payment: Payment) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    occupiedProperties: 0,
    vacantProperties: 0,
    maintenanceProperties: 0,
    totalTenants: 0,
    pendingPayments: 0,
    overduePayments: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0
  });
  const [monthlyFinancials, setMonthlyFinancials] = useState<MonthlyFinancials[]>([]);

  // Carregar dados do Firestore ao iniciar
  useEffect(() => {
    firestoreService.getProperties().then(setProperties);
    firestoreService.getTenants().then(setTenants);
    firestoreService.getContracts().then(setContracts);
    firestoreService.getPayments().then(setPayments);
    firestoreService.getExpenses().then(setExpenses);
  }, []);

  // Atualizar stats e financeiros mensais sempre que dados mudam
  useEffect(() => {
    updateStats();
    updateMonthlyFinancials();
  }, [properties, tenants, payments, expenses]);

  const updateStats = () => {
    const occupiedProperties = properties.filter(p => p.status === 'occupied').length;
    const vacantProperties = properties.filter(p => p.status === 'vacant').length;
    const maintenanceProperties = properties.filter(p => p.status === 'maintenance').length;

    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const overduePayments = payments.filter(p => p.status === 'overdue').length;

    const totalIncome = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, payment) => sum + payment.amount + payment.lateFee, 0);

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netIncome = totalIncome - totalExpenses;

    setStats({
      totalProperties: properties.length,
      occupiedProperties,
      vacantProperties,
      maintenanceProperties,
      totalTenants: tenants.length,
      pendingPayments,
      overduePayments,
      totalIncome,
      totalExpenses,
      netIncome
    });
  };

  const updateMonthlyFinancials = () => {
    const last6Months: MonthlyFinancials[] = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthDate = startOfMonth(addMonths(today, -i));
      const monthStr = format(monthDate, 'MMM yyyy', { locale: ptBR });

      // Filter payments for this month
      const monthlyIncome = payments
        .filter(p =>
          p.status === 'paid' &&
          p.date && !isNaN(new Date(p.date).getTime()) && 
          format(new Date(p.date), 'MMM yyyy', { locale: ptBR }) === monthStr
        )
        .reduce((sum, payment) => sum + payment.amount + payment.lateFee, 0);

      // Filter expenses for this month
      const monthlyExpenses = expenses
        .filter(e =>
          e.date && !isNaN(new Date(e.date).getTime()) && 
          format(new Date(e.date), 'MMM yyyy', { locale: ptBR }) === monthStr
        )
        .reduce((sum, expense) => sum + expense.amount, 0);

      last6Months.push({
        month: monthStr,
        income: monthlyIncome,
        expenses: monthlyExpenses,
        netIncome: monthlyIncome - monthlyExpenses
      });
    }

    setMonthlyFinancials(last6Months);
  };

  const calculateLateFee = (payment: Payment): number => {
    if (payment.status !== 'overdue') return 0;

    const contract = contracts.find(c => c.id === payment.contractId);
    if (!contract) return 0;

    const today = new Date();
    const dueDate = new Date(payment.dueDate);
    const daysLate = differenceInDays(today, dueDate);

    if (daysLate <= contract.lateFeeDays) return 0;

    return payment.amount * (contract.lateFeePercentage / 100);
  };

  // Funções CRUD usando Firestore
  const addProperty = async (property: Omit<Property, 'id' | 'createdAt'>) => {
    await firestoreService.addProperty(property);
    setProperties(await firestoreService.getProperties());
  };
  const updateProperty = async (property: Property) => {
    await firestoreService.updateProperty(property);
    setProperties(await firestoreService.getProperties());
  };
  const deleteProperty = async (id: string) => {
    await firestoreService.deleteProperty(id);
    setProperties(await firestoreService.getProperties());
  };

  const addTenant = async (tenant: Omit<Tenant, 'id' | 'createdAt'>) => {
    await firestoreService.addTenant(tenant);
    setTenants(await firestoreService.getTenants());
  };
  const updateTenant = async (tenant: Tenant) => {
    await firestoreService.updateTenant(tenant);
    setTenants(await firestoreService.getTenants());
  };
  const deleteTenant = async (id: string) => {
    await firestoreService.deleteTenant(id);
    setTenants(await firestoreService.getTenants());
  };

  const addContract = async (contract: Omit<Contract, 'id' | 'createdAt'>) => {
    await firestoreService.addContract(contract);
    setContracts(await firestoreService.getContracts());
  };
  const updateContract = async (contract: Contract) => {
    await firestoreService.updateContract(contract);
    setContracts(await firestoreService.getContracts());
  };
  const deleteContract = async (id: string) => {
    await firestoreService.deleteContract(id);
    setContracts(await firestoreService.getContracts());
  };

  const addPayment = async (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    await firestoreService.addPayment(payment);
    setPayments(await firestoreService.getPayments());
  };
  const updatePayment = async (payment: Payment) => {
    await firestoreService.updatePayment(payment);
    setPayments(await firestoreService.getPayments());
  };
  const deletePayment = async (id: string) => {
    await firestoreService.deletePayment(id);
    setPayments(await firestoreService.getPayments());
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    await firestoreService.addExpense(expense);
    setExpenses(await firestoreService.getExpenses());
  };
  const updateExpense = async (expense: Expense) => {
    await firestoreService.updateExpense(expense);
    setExpenses(await firestoreService.getExpenses());
  };
  const deleteExpense = async (id: string) => {
    await firestoreService.deleteExpense(id);
    setExpenses(await firestoreService.getExpenses());
  };

  return (
    <AppContext.Provider value={{
      properties,
      tenants,
      contracts,
      payments,
      expenses,
      stats,
      monthlyFinancials,
      addProperty,
      updateProperty,
      deleteProperty,
      addTenant,
      updateTenant,
      deleteTenant,
      addContract,
      updateContract,
      deleteContract,
      addPayment,
      updatePayment,
      deletePayment,
      addExpense,
      updateExpense,
      deleteExpense,
      calculateLateFee
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};