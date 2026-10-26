import { useState, type ReactNode } from 'react';
import { CalculatorPage } from '@/components/calculator/calculator-page';
import { CurrencyField } from '@/components/calculator/currency-field';
import { StepperField } from '@/components/calculator/stepper-field';
import { getCalculator } from '@/content/calculators';
import { formatDecimal, formatRupiah } from '@/lib/format';
import { DEFAULT_RICE_PRICE_PER_KG, FITRAH_RICE_KG, calculateFitrah } from '@/lib/zakat';

export function FitrahCalculator({ children }: { children?: ReactNode }) {
  const [people, setPeople] = useState(1);
  const [ricePricePerKg, setRicePricePerKg] = useState(DEFAULT_RICE_PRICE_PER_KG);

  const result = calculateFitrah({ people, ricePricePerKg });
  const riceKg = formatDecimal(result.riceKg);

  return (
    <CalculatorPage
      calculator={getCalculator('fitrah')}
      shareLabel="Zakat fitrah keluargaku"
      heading="Kalkulator Zakat Fitrah"
      lead="Hitung zakat fitrah untuk seluruh anggota keluarga: 2,5 kg beras atau uang senilai itu untuk setiap jiwa, dibayar sebelum salat Idulfitri."
      fields={
        <>
          <StepperField
            label="Jumlah jiwa"
            hint="Diri Anda dan setiap orang yang nafkahnya Anda tanggung, termasuk bayi."
            unit="orang"
            value={people}
            onChange={setPeople}
          />
          <CurrencyField
            label="Harga beras per kg"
            hint="Pakai harga beras yang biasa Anda makan atau ketetapan BAZNAS daerah Anda."
            value={ricePricePerKg}
            onChange={setRicePricePerKg}
          />
        </>
      }
      result={{
        title: 'Zakat fitrah keluarga',
        amount: result.amount,
        status: result.people > 0 && ricePricePerKg > 0 ? 'wajib' : 'empty',
        message: `Atau bayar dengan ${riceKg} kg beras (${formatDecimal(FITRAH_RICE_KG)} kg × ${result.people} jiwa).`,
        details: [
          { label: 'Per jiwa', value: formatRupiah(FITRAH_RICE_KG * ricePricePerKg) },
          { label: 'Jumlah jiwa', value: `${result.people} orang` },
          { label: 'Total beras', value: `${riceKg} kg` },
        ],
      }}
    >
      {children}
    </CalculatorPage>
  );
}
