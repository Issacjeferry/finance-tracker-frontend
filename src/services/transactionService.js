import API from "../api";

export const getTransactions = () => API.get("/api/transactions");
export const createTransaction = (data) => API.post("/api/transactions", data);
export const deleteTransaction = (id) => API.delete(`/api/transactions/${id}`);
export const updateTransaction = (id, data) => API.put(`/api/transactions/${id}`, data);
