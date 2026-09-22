import React, { useEffect, useState, useCallback } from "react";
import { getSummary } from "../services/transactionService";
import CashFlowChart from "./Charts/CashFlowChart";
import CategoryExpenseChart from "./Charts/CategoryExpenseChart";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";

function Dashboard({ refreshTrigger, transactions = [] }) {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSummary();
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch financial summary:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [refreshTrigger, fetchSummary]);

  const { totalIncome, totalExpense, balance } = summary;
  const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  return (
    <div className="dashboard-section">
      {/* 4 Hero Metric Cards */}
      <div className="dashboard-grid">
        <div className="metric-card income-card">
          <div className="metric-card-header">
            <span className="metric-label">Total Income</span>
            <div className="metric-icon-circle bg-emerald">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="metric-value text-emerald">
            {loading ? "..." : `₹${Number(totalIncome).toLocaleString("en-IN")}`}
          </div>
          <span className="metric-sub">Earned this period</span>
        </div>

        <div className="metric-card expense-card">
          <div className="metric-card-header">
            <span className="metric-label">Total Expenses</span>
            <div className="metric-icon-circle bg-rose">
              <TrendingDown size={18} />
            </div>
          </div>
          <div className="metric-value text-rose">
            {loading ? "..." : `₹${Number(totalExpense).toLocaleString("en-IN")}`}
          </div>
          <span className="metric-sub">Spent this period</span>
        </div>

        <div className="metric-card balance-card">
          <div className="metric-card-header">
            <span className="metric-label">Net Balance</span>
            <div className="metric-icon-circle bg-indigo">
              <Wallet size={18} />
            </div>
          </div>
          <div className={`metric-value ${balance >= 0 ? "text-indigo" : "text-rose"}`}>
            {loading ? "..." : `${balance >= 0 ? "" : "-"}₹${Math.abs(Number(balance)).toLocaleString("en-IN")}`}
          </div>
          <span className="metric-sub">
            {balance >= 0 ? "Healthy financial balance" : "Deficit: spending exceeds income"}
          </span>
        </div>

        <div className="metric-card savings-card">
          <div className="metric-card-header">
            <span className="metric-label">Savings Rate</span>
            <div className="metric-icon-circle bg-amber">
              <PiggyBank size={18} />
            </div>
          </div>
          <div className="metric-value text-amber">
            {loading ? "..." : `${savingsRate.toFixed(1)}%`}
          </div>
          <span className="metric-sub">
            {savingsRate >= 20 ? "Target reached (≥20%)" : "Target: 20% of income"}
          </span>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="dashboard-analytics-row">
        <div className="analytics-card">
          <h3 className="analytics-title">Spending by Category</h3>
          <CategoryExpenseChart transactions={transactions} />
        </div>

        <div className="analytics-card">
          <h3 className="analytics-title">Cash Flow & Liquidity</h3>
          <CashFlowChart income={Number(totalIncome)} expense={Number(totalExpense)} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
