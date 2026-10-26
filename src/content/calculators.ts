export type CalculatorId = 'profesi' | 'maal' | 'fitrah' | 'perdagangan';

export interface CalculatorInfo {
  id: CalculatorId;
  path: `/zakat-${CalculatorId}`;
  /** Label lengkap untuk navigasi, mis. "Zakat Profesi". */
  navLabel: string;
  /** Label pendek untuk tab di layar kecil. */
  tabLabel: string;
  /** Ringkasan satu kalimat untuk kartu di beranda. */
  summary: string;
  /** Nisab bergantung pada harga emas (semua kecuali fitrah). */
  usesGoldPrice: boolean;
}

export const CALCULATORS: readonly CalculatorInfo[] = [
  {
    id: 'profesi',
    path: '/zakat-profesi',
    navLabel: 'Zakat Profesi',
    tabLabel: 'Profesi',
    summary: 'Zakat dari gaji, honor, dan penghasilan rutin bulanan.',
    usesGoldPrice: true,
  },
  {
    id: 'maal',
    path: '/zakat-maal',
    navLabel: 'Zakat Maal',
    tabLabel: 'Maal',
    summary: 'Zakat atas tabungan, emas, dan investasi yang tersimpan setahun.',
    usesGoldPrice: true,
  },
  {
    id: 'fitrah',
    path: '/zakat-fitrah',
    navLabel: 'Zakat Fitrah',
    tabLabel: 'Fitrah',
    summary: 'Zakat wajib setiap jiwa menjelang Idulfitri.',
    usesGoldPrice: false,
  },
  {
    id: 'perdagangan',
    path: '/zakat-perdagangan',
    navLabel: 'Zakat Perdagangan',
    tabLabel: 'Dagang',
    summary: 'Zakat atas modal usaha, stok barang, dan piutang dagang.',
    usesGoldPrice: true,
  },
];

export const getCalculator = (id: CalculatorId) =>
  CALCULATORS.find((calculator) => calculator.id === id) as CalculatorInfo;
