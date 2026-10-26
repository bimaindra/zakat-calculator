import { useState, type ReactNode } from 'react';
import { CalculatorPage } from '@/components/calculator/calculator-page';
import { CurrencyField } from '@/components/calculator/currency-field';
import { useGoldPrice } from '@/context/gold-price-context';
import { getCalculator } from '@/content/calculators';
import { formatRupiah } from '@/lib/format';
import { calculatePerdagangan } from '@/lib/zakat';

export function PerdaganganCalculator({ children }: { children?: ReactNode }) {
  const { price, isPricePending } = useGoldPrice();
  const [inventory, setInventory] = useState(0);
  const [cash, setCash] = useState(0);
  const [receivables, setReceivables] = useState(0);
  const [debts, setDebts] = useState(0);

  const result = calculatePerdagangan({ inventory, cash, receivables, debts }, price.pricePerGram);
  const hasInput = inventory + cash + receivables > 0;
  const status = !hasInput ? 'empty' : result.isWajib ? 'wajib' : 'belum';

  return (
    <CalculatorPage
      calculator={getCalculator('perdagangan')}
      shareLabel="zakat usaha tahun ini"
      heading="Kalkulator Zakat Perdagangan"
      lead="Hitung zakat usaha Anda setiap tutup buku tahunan: 2,5% dari aset lancar usaha dikurangi utang jangka pendek, bila mencapai nisab 85 gram emas."
      fields={
        <>
          <CurrencyField
            label="Nilai stok barang dagangan"
            hint="Dihitung dengan harga pasar saat ini, bukan harga beli."
            value={inventory}
            onChange={setInventory}
          />
          <CurrencyField label="Kas dan saldo rekening usaha" value={cash} onChange={setCash} />
          <CurrencyField
            label="Piutang lancar"
            hint="Piutang dagang yang diperkirakan akan tertagih."
            value={receivables}
            onChange={setReceivables}
          />
          <CurrencyField
            label="Utang jangka pendek"
            hint="Utang usaha yang jatuh tempo dalam waktu dekat. Aset tetap seperti toko dan kendaraan usaha tidak dihitung."
            value={debts}
            onChange={setDebts}
          />
        </>
      }
      result={{
        title: 'Zakat perdagangan per tahun',
        amount: result.amount,
        status,
        nisabRatio: hasInput ? result.nisabRatio : undefined,
        message:
          status === 'empty'
            ? 'Masukkan aset usaha Anda untuk melihat hasilnya.'
            : status === 'wajib'
              ? 'Aset usaha Anda mencapai nisab. Anda wajib membayar zakat perdagangan.'
              : 'Aset usaha bersih belum mencapai nisab, sehingga belum wajib zakat perdagangan.',
        details: [
          { label: 'Aset usaha bersih', value: formatRupiah(result.total) },
          { label: 'Nisab per tahun', value: formatRupiah(result.nisab), pending: isPricePending },
          { label: 'Kadar zakat', value: '2,5%' },
        ],
      }}
    >
      {children}
    </CalculatorPage>
  );
}
