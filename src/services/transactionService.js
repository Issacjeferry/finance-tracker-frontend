import axios from "axios";

const API = axios.create({
  baseURL: "https://finance-tracker-backend-j2il.onrender.com"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getTransactions = () =>
  API.get("/api/transactions");

export const createTransaction = (data) =>
  API.post("/api/transactions", data);

export const deleteTransaction = (id) =>
  API.delete(`/api/transactions/${id}`);

export const updateTransaction = (id, data) =>
  API.put(`/api/transactions/${id}`, data);

export const getIncome = () =>
  API.get("/api/transactions/summary/income");

export const getExpense = () =>
  API.get("/api/transactions/summary/expense");

export const getBalance = () =>
  API.get("/api/transactions/summary/balance");