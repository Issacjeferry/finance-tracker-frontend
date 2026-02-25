import React, { useEffect, useState } from "react";
import {
  getIncome,
  getExpense,
  getBalance
} from "../services/transactionService";

function Dashboard({ refreshTrigger }) {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchSummary();
  }, [refreshTrigger]);

  const fetchSummary = async () => {
    const incomeRes = await getIncome();
    const expenseRes = await getExpense();
    const balanceRes = await getBalance();

    setIncome(incomeRes.data);
    setExpense(expenseRes.data);
    setBalance(balanceRes.data);
  };

  return (
  <div className="dashboard">
    <div className="card">
      <h3>Total Income</h3>
      <p className="income">₹ {income}</p>
    </div>

    <div className="card">
      <h3>Total Expense</h3>
      <p className="expense">₹ {expense}</p>
    </div>

    <div className="card">
      <h3>Balance</h3>
      <p className={balance >= 0 ? "balance-positive" : "balance-negative"}>
        ₹ {balance}
      </p>
    </div>
  </div>
);

}

const cardStyle = {
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  width: "200px",
  textAlign: "center",
  boxShadow: "2px 2px 10px rgba(0,0,0,0.1)"
};

export default Dashboard;
