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



export default Dashboard;
