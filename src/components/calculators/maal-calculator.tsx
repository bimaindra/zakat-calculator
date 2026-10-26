import { useState, type ReactNode } from 'react';
import { CalculatorPage } from '@/components/calculator/calculator-page';
import { CurrencyField } from '@/components/calculator/currency-field';
import { useGoldPrice } from '@/context/gold-price-context';
import { getCalculator } from '@/content/calculators';
import { formatRupiah } from '@/lib/format';
import { calculateMaal } from '@/lib/zakat';

export function MaalCalculator({ children }: { children?: ReactNode }) {
  const { price, isPricePending } = useGoldPrice();
  const [savings, setSavings] = useState(0);
  const [gold, setGold] = useState(0);
  const [investments, setInvestments] = useState(0);
  const [debts, setDebts] = useState(0);

  const result = calculateMaal({ gold, savings, investments, debts }, price.pricePerGram);
  const hasInput = savings + gold + investments > 0;
  const status = !hasInput ? 'empty' : result.isWajib ? 'wajib' : 'belum';

  return (
    <CalculatorPage
      calculator={getCalculator('maal')}
      shareLabel="Zakat maal saya tahun ini"
      heading="Kalkulator Zakat Maal"
      lead="Hitung zakat harta yang telah Anda miliki selama satu tahun hijriah (haul): 2,5% dari harta bersih bila mencapai nisab 85 gram emas."
      fields={
        <>
          <CurrencyField
            label="Uang tunai, tabungan, dan deposito"
            hint="Termasuk saldo rekening, dompet digital, dan hasil sewa properti yang tersimpan."
            value={savings}
            onChange={setSavings}
          />
          <CurrencyField
            label="Emas dan perak"
            hint="Nilai rupiah emas/perak yang disimpan, bukan perhiasan yang dipakai wajar sehari-hari."
            value={gold}
            onChange={setGold}
          />
          <CurrencyField
            label="Investasi"
            hint="Saham, reksa dana, sukuk, obligasi, kripto. Rumah dan kendaraan yang Anda pakai sendiri tidak dihitung."
            value={investments}
            onChange={setInvestments}
          />
          <CurrencyField
            label="Utang jatuh tempo"
            hint="Opsional. Utang atau cicilan yang harus dibayar saat ini (bukan seluruh sisa pinjaman jangka panjang)."
            value={debts}
            onChange={setDebts}
          />
        </>
      }
      result={{
        title: 'Zakat maal per tahun',
        amount: result.amount,
        status,
        nisabRatio: hasInput ? result.nisabRatio : undefined,
        message:
          status === 'empty'
            ? 'Masukkan harta Anda untuk melihat hasilnya.'
            : status === 'wajib'
              ? 'Harta Anda mencapai nisab. Bila sudah tersimpan satu tahun (haul), Anda wajib membayar zakat maal.'
              : 'Harta bersih Anda belum mencapai nisab, sehingga belum wajib zakat maal.',
        details: [
          { label: 'Harta bersih', value: formatRupiah(result.total) },
          { label: 'Nisab per tahun', value: formatRupiah(result.nisab), pending: isPricePending },
          { label: 'Kadar zakat', value: '2,5%' },
        ],
      }}
    >
      {children}
    </CalculatorPage>
  );
}
