export function calculateSavingsRate(income, expense) {
  const safeIncome = Number(income) || 0;
  if (safeIncome <= 0) return 0;
  return Math.max(0, ((safeIncome - (Number(expense) || 0)) / safeIncome) * 100);
}

export function estimateMonthlyCommitment(payments = []) {
  return payments.reduce((sum, payment) => {
    const days = Math.max(Number(payment.intervalDays) || 30, 1);
    return sum + (Number(payment.amount) || 0) * (30 / days);
  }, 0);
}

export function goalProgress(saved, target) {
  const safeTarget = Number(target) || 0;
  return safeTarget <= 0 ? 0 : Math.min(100, Math.round(((Number(saved) || 0) / safeTarget) * 100));
}
