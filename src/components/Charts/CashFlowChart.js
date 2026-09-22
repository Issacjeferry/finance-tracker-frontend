import React from "react";

function CashFlowChart({ income = 0, expense = 0 }) {
  const total = income + expense;
  const incomeRatio = total > 0 ? (income / total) * 100 : 50;
  const expenseRatio = total > 0 ? (expense / total) * 100 : 50;
  const netSavings = income - expense;
  const savingsRate = income > 0 ? Math.max(0, ((income - expense) / income) * 100) : 0;

  return (
    <div className="cashflow-card">
      <div className="cashflow-header">
        <h4>Cash Flow & Savings Rate</h4>
        <span className={`savings-badge ${savingsRate >= 20 ? "badge-success" : savingsRate > 0 ? "badge-info" : "badge-danger"}`}>
          {savingsRate.toFixed(1)}% Saved
        </span>
      </div>

      <div className="flow-ratio-bar">
        <div
          className="flow-bar-income"
          style={{ width: `${incomeRatio}%` }}
          title={`Income: ₹${income.toLocaleString("en-IN")} (${incomeRatio.toFixed(1)}%)`}
        />
        <div
          className="flow-bar-expense"
          style={{ width: `${expenseRatio}%` }}
          title={`Expense: ₹${expense.toLocaleString("en-IN")} (${expenseRatio.toFixed(1)}%)`}
        />
      </div>

      <div className="flow-metrics">
        <div className="flow-metric-item">
          <span className="metric-dot dot-income" />
          <div>
            <span className="metric-title">Income</span>
            <strong>₹{income.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <div className="flow-metric-item">
          <span className="metric-dot dot-expense" />
          <div>
            <span className="metric-title">Expenses</span>
            <strong>₹{expense.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <div className="flow-metric-item">
          <span className="metric-dot dot-balance" />
          <div>
            <span className="metric-title">Net Savings</span>
            <strong className={netSavings >= 0 ? "text-income" : "text-expense"}>
              {netSavings >= 0 ? "+" : ""}₹{netSavings.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CashFlowChart;
