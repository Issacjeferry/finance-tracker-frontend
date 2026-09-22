import React from "react";

const PALETTE = [
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#14b8a6", // Teal
  "#f97316", // Orange
  "#64748b", // Slate
];

function CategoryExpenseChart({ transactions = [] }) {
  // Filter for expenses
  const expenses = transactions.filter(
    (t) => (t.type || "").toUpperCase() === "EXPENSE" && t.amount > 0
  );

  const categoryTotals = expenses.reduce((acc, t) => {
    const cat = t.category ? t.category.trim() : "Uncategorized";
    acc[cat] = (acc[cat] || 0) + Number(t.amount);
    return acc;
  }, {});

  const totalExpense = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const categories = Object.keys(categoryTotals)
    .map((name, i) => ({
      name,
      amount: categoryTotals[name],
      percentage: totalExpense > 0 ? (categoryTotals[name] / totalExpense) * 100 : 0,
      color: PALETTE[i % PALETTE.length],
    }))
    .sort((a, b) => b.amount - a.amount);

  if (categories.length === 0) {
    return (
      <div className="chart-empty">
        <p>No expense data yet</p>
        <span>Add expenses to visualize your spending breakdown</span>
      </div>
    );
  }

  // Calculate SVG donut paths
  let cumulativeAngle = 0;
  const radius = 68;
  const strokeWidth = 24;
  const center = 100;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="category-chart-container">
      <div className="donut-wrapper">
        <svg viewBox="0 0 200 200" className="donut-svg">
          {categories.map((cat, i) => {
            const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativeAngle / 100) * circumference);
            cumulativeAngle += cat.percentage;

            return (
              <circle
                key={cat.name}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={cat.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="donut-segment"
              />
            );
          })}
        </svg>
        <div className="donut-center-label">
          <span className="donut-sub">Total</span>
          <span className="donut-amount">₹{totalExpense.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="chart-legend">
        {categories.map((cat) => (
          <div key={cat.name} className="legend-item">
            <span
              className="legend-color-dot"
              style={{ backgroundColor: cat.color }}
            />
            <span className="legend-name">{cat.name}</span>
            <span className="legend-percent">{cat.percentage.toFixed(1)}%</span>
            <span className="legend-amount">₹{cat.amount.toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryExpenseChart;
