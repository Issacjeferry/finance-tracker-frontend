import API from "../api";

export const getTransactions = () => API.get("/api/transactions");

export const createTransaction = (data) => API.post("/api/transactions", data);

export const deleteTransaction = (id) => API.delete(`/api/transactions/${id}`);

export const updateTransaction = (id, data) => API.put(`/api/transactions/${id}`, data);

// Unified summary endpoint (1 round-trip)
export const getSummary = () => API.get("/api/transactions/summary");

// Legacy endpoints maintained for compatibility
export const getIncome = () => API.get("/api/transactions/summary/income");
export const getExpense = () => API.get("/api/transactions/summary/expense");
export const getBalance = () => API.get("/api/transactions/summary/balance");