import { createContext, use, useEffect, useState, type ReactNode } from 'react';
import {
  DEFAULT_GOLD_PRICE,
  readOverride,
  resolveGoldPrice,
  writeOverride,
  type GoldPrice,
} from '@/lib/gold-price';

interface GoldPriceContextValue {
  /** Harga yang dipakai untuk perhitungan (manual bila ada override). */
  price: GoldPrice;
  /** Harga dari sumber otomatis, terlepas dari override. */
  marketPrice: GoldPrice;
  isLoading: boolean;
  setManualPrice: (pricePerGram: number | null) => void;
}

const GoldPriceContext = createContext<GoldPriceContextValue | null>(null);

export function GoldPriceProvider({ children }: { children: ReactNode }) {
  const [marketPrice, setMarketPrice] = useState<GoldPrice>(DEFAULT_GOLD_PRICE);
  const [manualPrice, setManualPriceState] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setManualPriceState(readOverride(localStorage));
    resolveGoldPrice({ storage: localStorage }).then((resolved) => {
      if (cancelled) return;
      setMarketPrice(resolved);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setManualPrice = (pricePerGram: number | null) => {
    writeOverride(localStorage, pricePerGram);
    setManualPriceState(pricePerGram);
  };

  const price: GoldPrice =
    manualPrice === null
      ? marketPrice
      : { pricePerGram: manualPrice, date: marketPrice.date, source: 'manual' };

  return (
    <GoldPriceContext value={{ price, marketPrice, isLoading, setManualPrice }}>
      {children}
    </GoldPriceContext>
  );
}

export function useGoldPrice() {
  const context = use(GoldPriceContext);
  if (!context) throw new Error('useGoldPrice must be used inside <GoldPriceProvider>');
  return context;
}
