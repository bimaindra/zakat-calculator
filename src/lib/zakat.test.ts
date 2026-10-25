import { describe, expect, it } from 'vitest';
import {
  calculateFitrah,
  calculateMaal,
  calculatePerdagangan,
  calculateProfesi,
  monthlyNisab,
  yearlyNisab,
} from './zakat';

const GOLD = 2_000_000; // Rp/gram, round number for readable expectations
const YEARLY_NISAB = 170_000_000; // 85 g × 2.000.000
const MONTHLY_NISAB = YEARLY_NISAB / 12;

describe('nisab', () => {
  it('is 85 g of gold per year and 1/12 of that per month', () => {
    expect(yearlyNisab(GOLD)).toBe(YEARLY_NISAB);
    expect(monthlyNisab(GOLD)).toBeCloseTo(MONTHLY_NISAB);
  });

  it('treats an invalid gold price as zero', () => {
    expect(yearlyNisab(Number.NaN)).toBe(0);
    expect(yearlyNisab(-1)).toBe(0);
  });
});

describe('calculateProfesi', () => {
  it('is not wajib below the monthly nisab', () => {
    const result = calculateProfesi({ monthlyIncome: 10_000_000, bonus: 0 }, GOLD);
    expect(result.isWajib).toBe(false);
    expect(result.amount).toBe(0);
    expect(result.nisabRatio).toBeCloseTo(10_000_000 / MONTHLY_NISAB);
  });

  it('charges 2.5% of income plus bonus at or above the nisab', () => {
    const result = calculateProfesi({ monthlyIncome: 15_000_000, bonus: 5_000_000 }, GOLD);
    expect(result.total).toBe(20_000_000);
    expect(result.isWajib).toBe(true);
    expect(result.amount).toBe(500_000);
  });

  it('is wajib exactly at the nisab', () => {
    const result = calculateProfesi({ monthlyIncome: MONTHLY_NISAB, bonus: 0 }, GOLD);
    expect(result.isWajib).toBe(true);
  });

  it('ignores negative and non-finite inputs', () => {
    const result = calculateProfesi({ monthlyIncome: -5, bonus: Number.NaN }, GOLD);
    expect(result.total).toBe(0);
    expect(result.isWajib).toBe(false);
  });

  it('is never wajib when the gold price is unknown', () => {
    const result = calculateProfesi({ monthlyIncome: 100_000_000, bonus: 0 }, 0);
    expect(result.isWajib).toBe(false);
    expect(result.nisabRatio).toBe(0);
  });
});

describe('calculateMaal', () => {
  it('subtracts debts from zakatable wealth', () => {
    const result = calculateMaal(
      { gold: 50_000_000, savings: 150_000_000, investments: 20_000_000, debts: 20_000_000 },
      GOLD
    );
    expect(result.total).toBe(200_000_000);
    expect(result.isWajib).toBe(true);
    expect(result.amount).toBe(5_000_000);
  });

  it('never goes negative when debts exceed wealth', () => {
    const result = calculateMaal(
      { gold: 0, savings: 10_000_000, investments: 0, debts: 50_000_000 },
      GOLD
    );
    expect(result.total).toBe(0);
    expect(result.isWajib).toBe(false);
  });

  it('rounds the zakat amount to whole rupiah', () => {
    const result = calculateMaal(
      { gold: 0, savings: YEARLY_NISAB + 1, investments: 0, debts: 0 },
      GOLD
    );
    expect(result.amount).toBe(Math.round((YEARLY_NISAB + 1) * 0.025));
  });
});

describe('calculatePerdagangan', () => {
  it('uses inventory + cash + receivables − short-term debts', () => {
    const result = calculatePerdagangan(
      { inventory: 120_000_000, cash: 40_000_000, receivables: 30_000_000, debts: 10_000_000 },
      GOLD
    );
    expect(result.total).toBe(180_000_000);
    expect(result.amount).toBe(4_500_000);
  });

  it('is not wajib below the yearly nisab', () => {
    const result = calculatePerdagangan(
      { inventory: 100_000_000, cash: 0, receivables: 0, debts: 0 },
      GOLD
    );
    expect(result.isWajib).toBe(false);
  });
});

describe('calculateFitrah', () => {
  it('is 2.5 kg of rice per person', () => {
    expect(calculateFitrah({ people: 4, ricePricePerKg: 15_000 })).toEqual({
      people: 4,
      riceKg: 10,
      amount: 150_000,
    });
  });

  it('floors partial people and ignores negatives', () => {
    expect(calculateFitrah({ people: 2.7, ricePricePerKg: 15_000 }).people).toBe(2);
    expect(calculateFitrah({ people: -1, ricePricePerKg: 15_000 }).amount).toBe(0);
  });
});
