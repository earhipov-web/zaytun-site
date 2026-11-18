import * as React from "react";
import { Check, Plus, CalendarHeart, Send } from "lucide-react";
import { PageHead } from "@/components/Layout";
import { Reveal, RevealImage } from "@/components/Reveal";
import { usePageTransition } from "@/components/transition";
import { serviceGroups, promoServiceGroup, tgLink, type Service } from "@/data/site";
import { useCart } from "@/store/cart";
import { cn, rub } from "@/lib/utils";

function ServiceRow({ s }: { s: Service }) {
  const { add } = useCart();
  const { go } = usePageTransition();
  const [added, setAdded] = React.useState(false);

  const onClick = () => {
    const id = s.serviceId ?? s.id;
    if (s.kind === "massage") return go(`/booking?service=${id}`);
    if (s.kind === "telegram") return void window.open(tgLink(`Здравствуйте! Хочу записаться: ${s.title}.`), "_blank", "noopener");
    add(id, s.serviceId ? { price: s.price, basePrice: s.basePrice, note: s.note } : undefined);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <li className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 py-3.5 md:grid-cols-[1fr_auto_auto] md:items-center md:gap-6 md:py-4">
      <div className="row-span-2 min-w-0 md:row-span-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5">
          <h3 className="font-sans text-[15px] font-semibold text-ink md:text-base">{s.title}</h3>
          {s.duration && <span className="text-[13px] text-muted">{s.duration}</span>}
          {s.badge && (
            <span className="self-center rounded-full bg-blush px-2 py-0.5 text-[11px] font-semibold text-terracotta">{s.badge}</span>
          )}
        </div>
        <p className="mt-0.5 text-[13px] leading-snug text-muted md:text-sm">{s.description}</p>
        {s.includes && (
          <p className="mt-1 text-[12px] leading-snug text-wood md:text-[13px]">{s.includes.join(" · ")}</p>
        )}
        {!s.badge && s.options && s.options.length > 1 && (
          <p className="mt-1 text-[12px] leading-snug text-wood md:text-[13px]">{s.options.join(" · ")}</p>
        )}
      </div>
      <div className="text-right md:min-w-[96px]">
        {s.basePrice && s.basePrice > s.price && <s className="block text-[12px] tabular-nums text-muted">{rub(s.basePrice)}</s>}
        <p className="font-semibold tabular-nums text-ink">{s.price ? rub(s.price) : "Бесплатно"}</p>
        {s.priceNote && <p className="text-[11px] leading-tight text-muted">{s.priceNote}</p>}
      </div>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "press flex h-9 items-center justify-center gap-1.5 self-start justify-self-end rounded-full px-3.5 text-[13px] font-semibold md:h-10 md:w-[152px] md:self-center md:px-4 md:text-[14px]",
          s.kind !== "cart"
            ? "bg-olive text-white hover:bg-[#525d3b]"
            : added
              ? "bg-olive-soft text-olive"
              : "border border-wood/30 text-wood-dark hover:border-wood/60 hover:bg-sand/50",
        )}
      >
        {s.kind === "telegram" ? (
          <>
            <Send className="size-4" aria-hidden /> Написать
          </>
        ) : s.kind === "massage" ? (
          <>
            <CalendarHeart className="size-4" aria-hidden /> Записаться
          </>
        ) : added ? (
          <>
            <Check className="size-4" aria-hidden /> В корзине
          </>
        ) : (
          <>
            <Plus className="size-4" aria-hidden /> В корзину
          </>
        )}
      </button>
    </li>
  );
}

export function ServicesPage() {
  return (
    <>
      <PageHead
        eyebrow="Прайс"
        title="Услуги"
        lead="Массаж записываем через выбор мастера и Telegram. SPA-программы и тренировки можно собрать в корзину и оплатить на сайте."
      />

      <nav className="no-scrollbar sticky top-14 z-30 mt-3 flex gap-2 overflow-x-auto bg-bg/90 px-4 py-2 backdrop-blur-md md:top-[72px] md:mx-auto md:mt-4 md:max-w-6xl md:bg-transparent md:px-8 md:backdrop-blur-none" aria-label="Разделы прайса">
        {[promoServiceGroup, ...serviceGroups].map((g) => (
          <a
            key={g.id}
            href={`#${g.id}`}
            className="press paper shrink-0 rounded-full border border-linen px-3.5 py-2 text-[13px] font-medium text-wood-dark hover:border-wood/40"
          >
            {g.title}
          </a>
        ))}
      </nav>

      <div className="mx-auto mt-3 max-w-6xl space-y-4 px-4 md:mt-6 md:space-y-6 md:px-8">
        {[promoServiceGroup, ...serviceGroups].map((g) => (
          <Reveal key={g.id} id={g.id} as="section" className="paper scroll-mt-32 overflow-hidden rounded-[24px] border border-linen/80 md:grid md:grid-cols-[260px_1fr]">
            <div className="flex gap-3 p-4 md:block md:p-6">
              <RevealImage src={g.image} alt="" className="aspect-square w-[88px] shrink-0 rounded-[16px] md:aspect-[4/5] md:w-full md:rounded-[18px]" />
              <div className="min-w-0 md:mt-4">
                <h2 className="text-[28px] text-wood-dark md:text-[34px]">{g.title}</h2>
                <p className="mt-1 text-[13px] leading-snug text-muted md:text-sm">{g.lead}</p>
              </div>
            </div>
            <ul className="divide-y divide-linen border-t border-linen px-4 md:border-l md:border-t-0 md:px-7">
              {g.items.map((s) => (
                <ServiceRow key={s.id} s={s} />
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </>
  );
}
