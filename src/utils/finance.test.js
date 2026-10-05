import { calculateSavingsRate, estimateMonthlyCommitment, goalProgress } from "./finance";

describe("finance calculations", () => {
  test("calculates a positive savings rate", () => expect(calculateSavingsRate(100000, 75000)).toBe(25));
  test("never reports a negative savings rate", () => expect(calculateSavingsRate(50000, 70000)).toBe(0));
  test("normalizes recurring commitments to a monthly estimate", () => expect(estimateMonthlyCommitment([{ amount: 1000, intervalDays: 30 }, { amount: 700, intervalDays: 7 }])).toBe(4000));
  test("caps completed goals at one hundred percent", () => expect(goalProgress(12000, 10000)).toBe(100));
});
