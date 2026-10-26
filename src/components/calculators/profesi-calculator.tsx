import { useState, type ReactNode } from 'react';
import { CalculatorPage } from '@/components/calculator/calculator-page';
import { CurrencyField } from '@/components/calculator/currency-field';
import { SegmentedField } from '@/components/calculator/segmented-field';
import { useGoldPrice } from '@/context/gold-price-context';
import { getCalculator } from '@/content/calculators';
import { formatRupiah } from '@/lib/format';
import { calculateProfesi, type ProfesiPeriod } from '@/lib/zakat';

const PERIOD_OPTIONS = [
  { value: 'bulanan', label: 'Per bulan' },
  { value: 'tahunan', label: 'Per tahun' },
] as const;

export function ProfesiCalculator({ children }: { children?: ReactNode }) {
  const { price, isPricePending } = useGoldPrice();
  const [period, setPeriod] = useState<ProfesiPeriod>('bulanan');
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [bonus, setBonus] = useState(0);

  const yearly = period === 'tahunan';
  const unit = yearly ? 'tahun' : 'bulan';
  const result = calculateProfesi({ monthlyIncome, bonus }, price.pricePerGram, period);
  const status = result.total === 0 ? 'empty' : result.isWajib ? 'wajib' : 'belum';

  return (
    <CalculatorPage
      calculator={getCalculator('profesi')}
      shareLabel={`Zakat profesi saya ${unit} ini`}
      heading="Kalkulator Zakat Profesi"
      lead="Hitung zakat penghasilan Anda per bulan atau per tahun: 2,5% dari gaji dan pendapatan lain bila mencapai nisab 85 gram emas per tahun."
      fields={
        <>
          <SegmentedField
            label="Bayar zakat"
            options={PERIOD_OPTIONS}
            value={period}
            onChange={setPeriod}
            hint={
              yearly
                ? 'Penghasilan setahun dijumlahkan lalu dibandingkan dengan nisab 85 gram emas.'
                : 'Dihitung setiap kali menerima gaji, dengan nisab 85 gram emas ÷ 12.'
            }
          />
          <CurrencyField
            label="Penghasilan per bulan"
            hint={
              yearly
                ? 'Gaji pokok, tunjangan, atau honor rutin. Otomatis dikalikan 12.'
                : 'Gaji pokok, tunjangan, honor, atau pendapatan rutin lainnya.'
            }
            value={monthlyIncome}
            onChange={setMonthlyIncome}
          />
          <CurrencyField
            label={
              yearly
                ? 'Bonus, THR, dan pendapatan lain setahun'
                : 'Bonus, THR, dan pendapatan lain bulan ini'
            }
            hint={
              yearly
                ? 'Opsional. Jumlah semua pendapatan tambahan selama setahun.'
                : 'Opsional. Isi bila ada pendapatan tambahan di bulan ini.'
            }
            value={bonus}
            onChange={setBonus}
          />
        </>
      }
      result={{
        title: `Zakat profesi per ${unit}`,
        amount: result.amount,
        status,
        nisabRatio: result.total ? result.nisabRatio : undefined,
        message:
          status === 'empty'
            ? 'Masukkan penghasilan Anda untuk melihat hasilnya.'
            : status === 'wajib'
              ? 'Penghasilan Anda mencapai nisab. Anda wajib membayar zakat profesi.'
              : 'Penghasilan Anda belum mencapai nisab. Anda belum wajib zakat, tetapi tetap dianjurkan bersedekah.',
        details: [
          {
            label: yearly ? 'Total penghasilan setahun' : 'Total penghasilan',
            value: formatRupiah(result.total),
          },
          {
            label: `Nisab per ${unit}`,
            value: formatRupiah(result.nisab),
            pending: isPricePending,
          },
          { label: 'Kadar zakat', value: '2,5%' },
        ],
      }}
    >
      {children}
    </CalculatorPage>
  );
}
