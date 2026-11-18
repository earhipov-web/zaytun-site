import { Fragment } from "react";
import { Check, Quote } from "lucide-react";
import type { Person } from "@/data/site";
import { cn } from "@/lib/utils";

/** Карточка мастера. В режиме выбора (selectable) работает как радиокнопка. */
export function MasterCard({
  m,
  selectable,
  selected,
  onSelect,
  compact,
}: {
  m: Person;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
}) {
  const Tag = selectable ? "button" : "article";
  return (
    <Tag
      {...(selectable ? { type: "button" as const, onClick: onSelect, "aria-pressed": selected } : {})}
      className={cn(
        "paper relative flex h-full w-full flex-col overflow-hidden rounded-[22px] border text-left",
        selectable && "press",
        selected ? "border-olive ring-2 ring-olive/40" : "border-linen/80",
        selectable && !selected && "hover:border-wood/40",
      )}
    >
      <div className={cn("relative flex items-end gap-3 p-4", !compact && "md:p-5")} style={{ background: `linear-gradient(160deg, ${m.tone}, transparent 85%)` }}>
        {m.photo ? (
          <img
            src={m.photo}
            alt=""
            className={cn("shrink-0 rounded-full border-2 border-white/80 object-cover object-top", compact ? "size-14" : "size-16 md:size-20")}
          />
        ) : (
          <span
            className={cn(
              "grid shrink-0 place-items-center rounded-full border border-white/70 bg-surface/70 font-display font-medium text-wood-dark shadow-[inset_0_0_0_6px_rgba(255,255,255,0.35)]",
              compact ? "size-14 text-2xl" : "size-16 text-[28px] md:size-20 md:text-[34px]",
            )}
            aria-hidden
          >
            {m.name[0]}
          </span>
        )}
        <div className="min-w-0 pb-0.5">
          <h3 className={cn("text-wood-dark", compact ? "text-[24px]" : "text-[26px] md:text-[32px]")}>{m.name}</h3>
          <p className="text-[13px] text-muted">{m.role}</p>
        </div>
        {selectable && (
          <span
            className={cn(
              "absolute right-3 top-3 grid size-6 place-items-center rounded-full border transition-colors duration-200",
              selected ? "border-olive bg-olive text-white" : "border-wood/30 bg-surface",
            )}
            aria-hidden
          >
            {selected && <Check className="size-3.5" strokeWidth={3} />}
          </span>
        )}
      </div>
      <div className={cn("flex flex-1 flex-col px-4 pb-4", !compact && "md:px-5 md:pb-5")}>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13px]">
          {(compact ? m.facts.slice(-1) : m.facts).map((f) => (
            <Fragment key={f.label}>
              <dt className="text-muted">{f.label}</dt>
              <dd className="font-medium text-ink">{f.value}</dd>
            </Fragment>
          ))}
        </dl>
        <p className="mt-2.5 text-[14px] leading-snug text-ink">{m.about}</p>
        {!compact && m.quote && (
          <blockquote className="mt-3 rounded-2xl bg-sand/55 p-3 text-[13px] leading-snug text-muted">
            <Quote className="mb-1 size-3.5 text-wood" aria-hidden />
            {m.quote.text}
            <footer className="mt-1 text-[12px] font-medium text-wood-dark">— {m.quote.author}, отзыв на {m.quote.source === "Яндекс Карты" ? "Яндекс Картах" : m.quote.source}</footer>
          </blockquote>
        )}
      </div>
    </Tag>
  );
}
