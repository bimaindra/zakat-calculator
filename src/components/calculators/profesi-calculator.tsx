import { useState, type ReactNode } from 'react';
import { CalculatorPage } from '@/components/calculator/calculator-page';
import { CurrencyField } from '@/components/calculator/currency-field';
import { useGoldPrice } from '@/context/gold-price-context';
import { formatRupiah } from '@/lib/format';
import { calculateProfesi } from '@/lib/zakat';

export function ProfesiCalculator({ children }: { children?: ReactNode }) {
  const { price } = useGoldPrice();
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [bonus, setBonus] = useState(0);

  const result = calculateProfesi({ monthlyIncome, bonus }, price.pricePerGram);
  const status = result.total === 0 ? 'empty' : result.isWajib ? 'wajib' : 'belum';

  return (
    <CalculatorPage
      heading="Kalkulator Zakat Profesi"
      lead="Hitung zakat penghasilan bulanan Anda: 2,5% dari gaji dan pendapatan lain bila mencapai nisab 85 gram emas per tahun."
      fields={
        <>
          <CurrencyField
            label="Penghasilan per bulan"
            hint="Gaji pokok, tunjangan, honor, atau pendapatan rutin lainnya."
            value={monthlyIncome}
            onChange={setMonthlyIncome}
          />
          <CurrencyField
            label="Bonus, THR, dan pendapatan lain bulan ini"
            hint="Opsional. Isi bila ada pendapatan tambahan di bulan ini."
            value={bonus}
            onChange={setBonus}
          />
        </>
      }
      result={{
        title: 'Zakat profesi per bulan',
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
          { label: 'Total penghasilan', value: formatRupiah(result.total) },
          { label: 'Nisab per bulan', value: formatRupiah(result.nisab) },
          { label: 'Kadar zakat', value: '2,5%' },
        ],
      }}
    >
      {children}
    </CalculatorPage>
  );
}
