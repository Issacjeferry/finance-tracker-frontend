import React from "react";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
});

function Dashboard({ transactions }) {
  const income = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
  const expense = transactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
  const balance = income - expense;

  return (
    <section className="dashboard" aria-label="Financial summary">
      <div className="card income-card">
        <span className="card-label">Total income</span>
        <strong className="income">{money.format(income)}</strong>
        <span className="card-hint">Money coming in</span>
      </div>
      <div className="card expense-card">
        <span className="card-label">Total expenses</span>
        <strong className="expense">{money.format(expense)}</strong>
        <span className="card-hint">Money going out</span>
      </div>
      <div className="card balance-card">
        <span className="card-label">Current balance</span>
        <strong className={balance >= 0 ? "balance-positive" : "balance-negative"}>
          {money.format(balance)}
        </strong>
        <span className="card-hint">Your net position</span>
      </div>
    </section>
  );
}

export default Dashboard;
