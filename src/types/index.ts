export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'commercial' | 'building' | 'lot';
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  description: string;
  status: 'occupied' | 'vacant' | 'maintenance';
  imageUrl?: string;
  units?: PropertyUnit[];
  createdAt: Date;
}

export interface PropertyUnit {
  id: string;
  propertyId: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  monthlyRent: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  tenantId?: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  occupants: number;
  propertyId: string;
  unitId?: string;
  contractId: string;
  createdAt: Date;
}

export interface Contract {
  id: string;
  propertyId: string;
  unitId?: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  depositAmount: number;
  paymentDueDay: number;
  lateFeeDays: number;
  lateFeePercentage: number;
  status: 'active' | 'expired' | 'terminated';
  contractFile?: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  contractId: string;
  amount: number;
  date: Date;
  dueDate: Date;
  status: 'paid' | 'pending' | 'overdue';
  lateFee: number;
  paymentMethod?: string;
  notes?: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  propertyId: string;
  amount: number;
  date: Date;
  category: 'maintenance' | 'utilities' | 'taxes' | 'insurance' | 'other';
  description: string;
  receipt?: string;
  recurring: boolean;
  createdAt: Date;
}

export interface Stats {
  totalProperties: number;
  occupiedProperties: number;
  vacantProperties: number;
  maintenanceProperties: number;
  totalTenants: number;
  pendingPayments: number;
  overduePayments: number;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
}

export interface MonthlyFinancials {
  month: string;
  income: number;
  expenses: number;
  netIncome: number;
}