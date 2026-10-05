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

export const getBudgets = () => API.get("/api/planning/budgets");
export const createBudget = (data) => API.post("/api/planning/budgets", data);
export const deleteBudget = (id) => API.delete(`/api/planning/budgets/${id}`);
export const getGoals = () => API.get("/api/planning/goals");
export const createGoal = (data) => API.post("/api/planning/goals", data);
export const updateGoal = (id, data) => API.put(`/api/planning/goals/${id}`, data);
export const deleteGoal = (id) => API.delete(`/api/planning/goals/${id}`);
export const getRecurring = () => API.get("/api/planning/recurring");
export const createRecurring = (data) => API.post("/api/planning/recurring", data);
export const deleteRecurring = (id) => API.delete(`/api/planning/recurring/${id}`);
export const getIntelligence = () => API.get("/api/intelligence");
export const simulatePurchase = (data) => API.post("/api/intelligence/simulate", data);
