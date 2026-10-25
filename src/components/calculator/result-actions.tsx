import { useState } from 'react';
import { useHistory } from '@/hooks/use-history';
import type { CalculatorId } from '@/content/calculators';
import { buildShareText, whatsappShareUrl } from '@/lib/share';

interface ResultActionsProps {
  type: CalculatorId;
  amount: number;
  shareLabel: string;
  path: string;
}

export function ResultActions({ type, amount, shareLabel, path }: ResultActionsProps) {
  const { add } = useHistory();
  const [feedback, setFeedback] = useState('');
  const text = buildShareText({ label: shareLabel, amount, path });

  const flash = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(''), 2500);
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch (error) {
        if ((error as DOMException).name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      flash('Teks disalin ke papan klip.');
    } catch {
      flash('Gagal menyalin. Coba bagikan lewat WhatsApp.');
    }
  };

  const save = () => {
    add({ type, amount });
    flash('Tersimpan di riwayat perangkat ini.');
  };

  const buttonClass =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors';

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={share}
          className={`${buttonClass} bg-on-primary text-primary-strong hover:bg-on-primary/90`}
        >
          Bagikan
        </button>
        <button
          type="button"
          onClick={save}
          className={`${buttonClass} border border-on-primary/30 hover:bg-on-primary/10`}
        >
          Simpan
        </button>
      </div>
      <a
        href={whatsappShareUrl(text)}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-sm font-medium text-on-primary/90 underline-offset-4 hover:underline"
      >
        Kirim lewat WhatsApp
      </a>
      <p role="status" className="min-h-5 text-center text-sm text-on-primary/90">
        {feedback}
      </p>
    </div>
  );
}
