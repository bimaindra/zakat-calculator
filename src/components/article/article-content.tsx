import type { ArticleSection, Source, WorkedExample } from '@/content/articles';
import type { FaqItem } from '@/lib/seo';
import { PendingValue } from '@/components/pending-value';

function Section({ section }: { section: ArticleSection }) {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-bold tracking-tight">{section.heading}</h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className="leading-relaxed text-ink-muted">
          {paragraph}
        </p>
      ))}
      {section.list && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {section.list.map((item) => (
            <li key={item} className="flex gap-3 rounded-xl bg-surface-muted px-4 py-3">
              <span className="text-gold" aria-hidden="true">
                ✦
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <section aria-labelledby="faq-title" className="space-y-4">
      <h2 id="faq-title" className="text-2xl font-bold tracking-tight">
        Pertanyaan yang sering diajukan
      </h2>
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {items.map((item) => (
          <details key={item.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold transition-colors hover:bg-surface-muted [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                className="shrink-0 text-xl text-primary transition-transform duration-200 group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="px-5 pb-5 leading-relaxed text-ink-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Sources({ sources }: { sources: Source[] }) {
  return (
    <section aria-labelledby="sumber-title" className="space-y-3">
      <h2 id="sumber-title" className="text-lg font-bold">
        Rujukan
      </h2>
      <ul className="space-y-1.5 text-sm">
        {sources.map((source) => (
          <li key={source.label}>
            <a
              href={source.url}
              rel="noopener"
              className="text-ink-muted underline decoration-line underline-offset-4 hover:text-primary hover:decoration-primary"
            >
              {source.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface ArticleContentProps {
  sections: ArticleSection[];
  formula?: string;
  example?: WorkedExample;
  /** Contoh masih memakai harga emas bawaan: samarkan angka yang bergantung padanya. */
  examplePending?: boolean;
  faq: FaqItem[];
  sources: Source[];
}

export function ArticleContent({
  sections,
  formula,
  example,
  examplePending = false,
  faq,
  sources,
}: ArticleContentProps) {
  return (
    <article className="mx-auto mt-20 max-w-3xl space-y-12 px-4 sm:px-6">
      {sections.map((section) => (
        <Section key={section.heading} section={section} />
      ))}

      {formula && (
        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Rumus perhitungan</h2>
          <p className="rounded-2xl border border-primary/20 bg-primary-soft px-5 py-4 font-semibold text-primary-strong">
            {formula}
          </p>
        </section>
      )}

      {example && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Contoh perhitungan</h2>
          <div className="space-y-4 rounded-2xl border border-line bg-surface p-6">
            <p className="font-medium">{example.scenario}</p>
            <ol className="list-decimal space-y-2 pl-5 text-ink-muted marker:font-semibold marker:text-primary">
              {example.steps.map((step) => (
                <li key={step} className="tabular pl-1">
                  <PendingValue pending={examplePending}>{step}</PendingValue>
                </li>
              ))}
            </ol>
            <p className="rounded-xl bg-gold-soft px-4 py-3 font-semibold">
              <PendingValue pending={examplePending}>{example.conclusion}</PendingValue>
            </p>
          </div>
        </section>
      )}

      <Faq items={faq} />
      <Sources sources={sources} />
    </article>
  );
}
