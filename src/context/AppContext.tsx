import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addDays, format, startOfMonth, addMonths, isAfter, differenceInDays } from 'date-fns';
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

// Sample data with Brazilian context
const sampleProperties: Property[] = [
  {
    id: '1',
    name: 'Edifício Skyline',
    address: 'Rua das Flores, 123, Vila Madalena, São Paulo - SP',
    type: 'building',
    area: 2500,
    description: 'Prédio moderno com vista para a cidade',
    status: 'occupied',
    imageUrl: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
    units: [
      {
        id: '1-1',
        propertyId: '1',
        unitNumber: '101',
        bedrooms: 2,
        bathrooms: 1,
        area: 75,
        monthlyRent: 1800,
        status: 'occupied',
        tenantId: '1'
      },
      {
        id: '1-2',
        propertyId: '1',
        unitNumber: '102',
        bedrooms: 2,
        bathrooms: 1,
        area: 75,
        monthlyRent: 1800,
        status: 'vacant'
      }
    ],
    createdAt: new Date('2022-01-15')
  },
  {
    id: '2',
    name: 'Casa Jardim',
    address: 'Avenida Central, 456, Copacabana, Rio de Janeiro - RJ',
    type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    description: 'Casa espaçosa com jardim',
    status: 'vacant',
    imageUrl: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
    createdAt: new Date('2022-03-20')
  },
  {
    id: '3',
    name: 'Loja Centro',
    address: 'Rua Comercial, 789, Centro, Belo Horizonte - MG',
    type: 'commercial',
    bedrooms: 0,
    bathrooms: 1,
    area: 50,
    description: 'Loja no centro da cidade',
    status: 'maintenance',
    imageUrl: 'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg',
    createdAt: new Date('2022-05-10')
  }
];

const sampleContracts: Contract[] = [
  {
    id: '1',
    propertyId: '1',
    unitId: '1-1',
    tenantId: '1',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    monthlyRent: 1800,
    depositAmount: 1800,
    paymentDueDay: 5,
    lateFeeDays: 5,
    lateFeePercentage: 10,
    status: 'active',
    createdAt: new Date('2022-12-15')
  }
];

const sampleTenants: Tenant[] = [
  {
    id: '1',
    name: 'João Silva Santos',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    occupants: 2,
    propertyId: '1',
    unitId: '1-1',
    contractId: '1',
    createdAt: new Date('2022-12-15')
  }
];

// Generate payments for the last 6 months
const generateSamplePayments = (): Payment[] => {
  const payments: Payment[] = [];
  const today = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const month = startOfMonth(addMonths(today, -i));
    const dueDate = new Date(month);
    dueDate.setDate(5); // Due on the 5th
    
    const paymentDate = new Date(dueDate);
    
    // For demo purposes: Most payments paid on time, one overdue, one pending
    let status: 'paid' | 'pending' | 'overdue' = 'paid';
    let lateFee = 0;
    
    if (i === 0) {
      status = 'pending';
      paymentDate.setDate(31); // Future date (not yet paid)
    } else if (i === 1) {
      status = 'overdue';
      // No payment date for overdue
    } else {
      // Random: sometimes paid on time, sometimes late
      const daysLate = Math.floor(Math.random() * 7); // 0-6 days late
      if (daysLate > 0) {
        paymentDate.setDate(dueDate.getDate() + daysLate);
        if (daysLate > 5) { // If late by more than 5 days
          lateFee = 1800 * 0.1; // 10% late fee
        }
      }
    }
    
    payments.push({
      id: uuidv4(),
      contractId: '1',
      amount: 1800,
      date: status === 'paid' ? paymentDate : new Date(), // Only set date if paid
      dueDate,
      status,
      lateFee,
      paymentMethod: status === 'paid' ? 'pix' : undefined,
      notes: lateFee > 0 ? 'Pago com multa por atraso' : '',
      createdAt: month
    });
  }
  
  return payments;
};

// Generate expenses for the last 6 months
const generateSampleExpenses = (): Expense[] => {
  const expenses: Expense[] = [];
  const today = new Date();
  const categories: Expense['category'][] = ['maintenance', 'utilities', 'taxes', 'insurance', 'other'];
  
  for (let i = 5; i >= 0; i--) {
    const month = startOfMonth(addMonths(today, -i));
    
    // Add 2-3 expenses per month
    const numExpenses = 2 + Math.floor(Math.random() * 2);
    
    for (let j = 0; j < numExpenses; j++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      let amount = 0;
      let description = '';
      
      // Different average amounts per category
      switch (category) {
        case 'maintenance':
          amount = 100 + Math.floor(Math.random() * 300);
          description = 'Manutenção predial';
          break;
        case 'utilities':
          amount = 80 + Math.floor(Math.random() * 120);
          description = 'Conta de luz/água';
          break;
        case 'taxes':
          amount = 200 + Math.floor(Math.random() * 100);
          description = 'IPTU';
          break;
        case 'insurance':
          amount = 150 + Math.floor(Math.random() * 50);
          description = 'Seguro predial';
          break;
        case 'other':
          amount = 50 + Math.floor(Math.random() * 100);
          description = 'Despesas diversas';
          break;
      }
      
      const date = new Date(month);
      date.setDate(1 + Math.floor(Math.random() * 28)); // Random day in month
      
      expenses.push({
        id: uuidv4(),
        propertyId: '1',
        amount,
        date,
        category,
        description,
        recurring: category === 'utilities' || category === 'insurance',
        createdAt: date
      });
    }
  }
  
  return expenses;
};

interface AppContextType {
  properties: Property[];
  tenants: Tenant[];
  contracts: Contract[];
  payments: Payment[];
  expenses: Expense[];
  stats: Stats;
  monthlyFinancials: MonthlyFinancials[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  updateProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
  addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt'>) => void;
  updateTenant: (tenant: Tenant) => void;
  deleteTenant: (id: string) => void;
  addContract: (contract: Omit<Contract, 'id' | 'createdAt'>) => void;
  updateContract: (contract: Contract) => void;
  deleteContract: (id: string) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  updatePayment: (payment: Payment) => void;
  deletePayment: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  calculateLateFee: (payment: Payment) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [tenants, setTenants] = useState<Tenant[]>(sampleTenants);
  const [contracts, setContracts] = useState<Contract[]>(sampleContracts);
  const [payments, setPayments] = useState<Payment[]>(generateSamplePayments());
  const [expenses, setExpenses] = useState<Expense[]>(generateSampleExpenses());
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

  // Update stats whenever relevant data changes
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
        .filter(p => p.status === 'paid' && 
          format(new Date(p.date), 'MMM yyyy', { locale: ptBR }) === monthStr)
        .reduce((sum, payment) => sum + payment.amount + payment.lateFee, 0);
      
      // Filter expenses for this month
      const monthlyExpenses = expenses
        .filter(e => format(new Date(e.date), 'MMM yyyy', { locale: ptBR }) === monthStr)
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

  const addProperty = (property: Omit<Property, 'id' | 'createdAt'>) => {
    const newProperty: Property = {
      ...property,
      id: uuidv4(),
      createdAt: new Date()
    };
    setProperties([...properties, newProperty]);
  };

  const updateProperty = (property: Property) => {
    setProperties(properties.map(p => p.id === property.id ? property : p));
  };

  const deleteProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
    // Cascade delete related entities
    setTenants(tenants.filter(t => t.propertyId !== id));
    setContracts(contracts.filter(c => c.propertyId !== id));
    setExpenses(expenses.filter(e => e.propertyId !== id));
  };

  const addTenant = (tenant: Omit<Tenant, 'id' | 'createdAt'>) => {
    const newTenant: Tenant = {
      ...tenant,
      id: uuidv4(),
      createdAt: new Date()
    };
    setTenants([...tenants, newTenant]);
  };

  const updateTenant = (tenant: Tenant) => {
    setTenants(tenants.map(t => t.id === tenant.id ? tenant : t));
  };

  const deleteTenant = (id: string) => {
    setTenants(tenants.filter(t => t.id !== id));
    // Update contracts
    setContracts(contracts.map(c => {
      if (c.tenantId === id) {
        return {...c, tenantId: '', status: 'terminated'};
      }
      return c;
    }));
  };

  const addContract = (contract: Omit<Contract, 'id' | 'createdAt'>) => {
    const newContract: Contract = {
      ...contract,
      id: uuidv4(),
      createdAt: new Date()
    };
    setContracts([...contracts, newContract]);
    
    // Update property status
    setProperties(properties.map(p => 
      p.id === contract.propertyId ? {...p, status: 'occupied'} : p
    ));
    
    // Update tenant's contract and property
    setTenants(tenants.map(t => 
      t.id === contract.tenantId ? 
        {...t, contractId: newContract.id, propertyId: contract.propertyId, unitId: contract.unitId} : t
    ));
  };

  const updateContract = (contract: Contract) => {
    setContracts(contracts.map(c => c.id === contract.id ? contract : c));
  };

  const deleteContract = (id: string) => {
    const contract = contracts.find(c => c.id === id);
    if (!contract) return;
    
    setContracts(contracts.filter(c => c.id !== id));
    
    // Update property status
    setProperties(properties.map(p => 
      p.id === contract.propertyId ? {...p, status: 'vacant'} : p
    ));
    
    // Update tenant's contract
    setTenants(tenants.map(t => 
      t.contractId === id ? {...t, contractId: ''} : t
    ));
    
    // Remove related payments
    setPayments(payments.filter(p => p.contractId !== id));
  };

  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: uuidv4(),
      createdAt: new Date()
    };
    setPayments([...payments, newPayment]);
  };

  const updatePayment = (payment: Payment) => {
    setPayments(payments.map(p => p.id === payment.id ? payment : p));
  };

  const deletePayment = (id: string) => {
    setPayments(payments.filter(p => p.id !== id));
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: uuidv4(),
      createdAt: new Date()
    };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (expense: Expense) => {
    setExpenses(expenses.map(e => e.id === expense.id ? expense : e));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
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