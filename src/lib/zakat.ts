export const ZAKAT_RATE = 0.025;
export const NISAB_GOLD_GRAMS = 85;
export const FITRAH_RICE_KG = 2.5;
export const MONTHS_PER_YEAR = 12;
/** Setara Rp 47.000 per jiwa (SK BAZNAS RI, wilayah Jabodetabek). Pengguna dapat mengubahnya. */
export const DEFAULT_RICE_PRICE_PER_KG = 18_800;

export interface NisabResult {
  /** Total harta/penghasilan yang dihitung (tidak pernah negatif). */
  total: number;
  /** Batas nisab dalam rupiah untuk periode perhitungan. */
  nisab: number;
  /** Rasio total terhadap nisab, 1 = tepat mencapai nisab. */
  nisabRatio: number;
  isWajib: boolean;
  /** Zakat yang harus dibayar dalam rupiah (dibulatkan). */
  amount: number;
}

export type ProfesiPeriod = 'bulanan' | 'tahunan';

export interface ProfesiInput {
  monthlyIncome: number;
  /** Bonus/THR/pendapatan lain dalam periode yang sama (bulan ini atau setahun). */
  bonus: number;
}

export interface MaalInput {
  gold: number;
  savings: number;
  investments: number;
  debts: number;
}

export interface PerdaganganInput {
  inventory: number;
  cash: number;
  receivables: number;
  debts: number;
}

export interface FitrahInput {
  people: number;
  ricePricePerKg: number;
}

export interface FitrahResult {
  people: number;
  riceKg: number;
  amount: number;
}

const nonNegative = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0);

const sum = (...values: number[]) => values.reduce((acc, value) => acc + nonNegative(value), 0);

export function yearlyNisab(goldPricePerGram: number) {
  return nonNegative(goldPricePerGram) * NISAB_GOLD_GRAMS;
}

export function monthlyNisab(goldPricePerGram: number) {
  return yearlyNisab(goldPricePerGram) / MONTHS_PER_YEAR;
}

function evaluate(total: number, nisab: number): NisabResult {
  const isWajib = nisab > 0 && total >= nisab;
  return {
    total,
    nisab,
    nisabRatio: nisab > 0 ? total / nisab : 0,
    isWajib,
    amount: isWajib ? Math.round(total * ZAKAT_RATE) : 0,
  };
}

/**
 * Zakat profesi 2,5%. Bulanan: (gaji + bonus bulan ini) dibanding nisab 85 g emas / 12.
 * Tahunan: (gaji × 12 + bonus setahun) dibanding nisab 85 g emas.
 */
export function calculateProfesi(
  input: ProfesiInput,
  goldPricePerGram: number,
  period: ProfesiPeriod = 'bulanan'
) {
  if (period === 'tahunan') {
    return evaluate(
      sum(nonNegative(input.monthlyIncome) * MONTHS_PER_YEAR, input.bonus),
      yearlyNisab(goldPricePerGram)
    );
  }
  return evaluate(sum(input.monthlyIncome, input.bonus), monthlyNisab(goldPricePerGram));
}

/** Zakat maal tahunan: 2,5% dari harta bersih yang telah mencapai nisab dan haul. */
export function calculateMaal(input: MaalInput, goldPricePerGram: number) {
  const total = Math.max(
    0,
    sum(input.gold, input.savings, input.investments) - nonNegative(input.debts)
  );
  return evaluate(total, yearlyNisab(goldPricePerGram));
}

/** Zakat perdagangan: 2,5% dari (persediaan + kas + piutang lancar − utang jangka pendek). */
export function calculatePerdagangan(input: PerdaganganInput, goldPricePerGram: number) {
  const total = Math.max(
    0,
    sum(input.inventory, input.cash, input.receivables) - nonNegative(input.debts)
  );
  return evaluate(total, yearlyNisab(goldPricePerGram));
}

/** Zakat fitrah: 2,5 kg beras (atau setaranya dalam rupiah) per jiwa. */
export function calculateFitrah(input: FitrahInput): FitrahResult {
  const people = Math.floor(nonNegative(input.people));
  const riceKg = people * FITRAH_RICE_KG;
  return {
    people,
    riceKg,
    amount: Math.round(riceKg * nonNegative(input.ricePricePerKg)),
  };
}
