import { db } from "../firebase";
import {
  collection, getDocs, addDoc, deleteDoc, doc, setDoc
} from "firebase/firestore";
import { Property, Tenant, Contract, Payment, Expense } from "../types";

// Função utilitária para converter campos de data
function convertDates(obj: any, dateFields: string[]) {
  const result = { ...obj };
  dateFields.forEach(field => {
    if (result[field]?.toDate) {
      result[field] = result[field].toDate();
    }
  });
  return result;
}

// --- PROPERTIES ---
export async function getProperties() {
  const snapshot = await getDocs(collection(db, "properties"));
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...convertDates(docSnap.data(), ["createdAt"])
  })) as Property[];
}
export async function addProperty(property: Omit<Property, "id" | "createdAt">) {
  return await addDoc(collection(db, "properties"), {
    ...property,
    createdAt: new Date()
  });
}
export async function updateProperty(property: Property) {
  const ref = doc(db, "properties", property.id);
  return await setDoc(ref, property);
}
export async function deleteProperty(id: string) {
  return await deleteDoc(doc(db, "properties", id));
}

// --- TENANTS ---
export async function getTenants() {
  const snapshot = await getDocs(collection(db, "tenants"));
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...convertDates(docSnap.data(), ["createdAt"])
  })) as Tenant[];
}
export async function addTenant(tenant: Omit<Tenant, "id" | "createdAt">) {
  return await addDoc(collection(db, "tenants"), {
    ...tenant,
    createdAt: new Date()
  });
}
export async function updateTenant(tenant: Tenant) {
  const ref = doc(db, "tenants", tenant.id);
  return await setDoc(ref, tenant);
}
export async function deleteTenant(id: string) {
  return await deleteDoc(doc(db, "tenants", id));
}

// --- CONTRACTS ---
export async function getContracts() {
  const snapshot = await getDocs(collection(db, "contracts"));
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...convertDates(docSnap.data(), ["startDate", "endDate", "createdAt"])
  })) as Contract[];
}
export async function addContract(contract: Omit<Contract, "id" | "createdAt">) {
  return await addDoc(collection(db, "contracts"), {
    ...contract,
    createdAt: new Date()
  });
}
export async function updateContract(contract: Contract) {
  const ref = doc(db, "contracts", contract.id);
  return await setDoc(ref, contract);
}
export async function deleteContract(id: string) {
  return await deleteDoc(doc(db, "contracts", id));
}

// --- PAYMENTS ---
export async function getPayments() {
  const snapshot = await getDocs(collection(db, "payments"));
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...convertDates(docSnap.data(), ["date", "dueDate", "createdAt"])
  })) as Payment[];
}
export async function addPayment(payment: Omit<Payment, "id" | "createdAt">) {
  return await addDoc(collection(db, "payments"), {
    ...payment,
    createdAt: new Date()
  });
}
export async function updatePayment(payment: Payment) {
  const ref = doc(db, "payments", payment.id);
  return await setDoc(ref, payment);
}
export async function deletePayment(id: string) {
  return await deleteDoc(doc(db, "payments", id));
}

// --- EXPENSES ---
export async function getExpenses() {
  const snapshot = await getDocs(collection(db, "expenses"));
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...convertDates(docSnap.data(), ["date", "createdAt"])
  })) as Expense[];
}
export async function addExpense(expense: Omit<Expense, "id" | "createdAt">) {
  return await addDoc(collection(db, "expenses"), {
    ...expense,
    createdAt: new Date()
  });
}
export async function updateExpense(expense: Expense) {
  const ref = doc(db, "expenses", expense.id);
  return await setDoc(ref, expense);
}
export async function deleteExpense(id: string) {
  return await deleteDoc(doc(db, "expenses", id));
}