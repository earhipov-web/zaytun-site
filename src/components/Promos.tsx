import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, ChevronRight as Arrow, Clock, X, Check, ArrowUpRight } from "lucide-react";
import { promos, findService, contacts, type Promo } from "@/data/site";
import { useCart } from "@/store/cart";
import { usePageTransition } from "@/components/transition";
import { cn, rub } from "@/lib/utils";

const EASE = [0.23, 1, 0.32, 1] as const;
const DRAWER = [0.32, 0.72, 0, 1] as const;

function Badge({ p, withThumb = true }: { p: Promo; withThumb?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full py-[3px] pr-2.5 text-[12px] font-semibold",
        withThumb ? "pl-[3px]" : "pl-2.5",
        p.badgeTone === "terracotta" ? "bg-blush text-terracotta" : "bg-olive-soft text-olive",
      )}
    >
      {withThumb && <img src={p.image} alt="" className="size-[22px] rounded-full object-cover" />}
      {p.badge}
    </span>
  );
}

function Price({ p, size = "md" }: { p: Promo; size?: "md" | "lg" }) {
  return (
    <span className="flex flex-col items-end leading-tight">
      {p.oldPrice && <s className={cn("text-muted", size === "lg" ? "text-sm" : "text-[12px]")}>{rub(p.oldPrice)}</s>}
      <span className={cn("font-semibold tabular-nums text-ink", size === "lg" ? "text-xl" : "text-[15px] md:text-base")}>{rub(p.price)}</span>
    </span>
  );
}

/** Список акций, как в макете: строка = акция, по нажатию открывается карточка */
export function PromoList() {
  const [open, setOpen] = React.useState<number | null>(null);
  return (
    <>
      <ul className="paper divide-y divide-linen overflow-hidden rounded-[22px] border border-linen/80 shadow-[0_1px_0_rgba(91,70,54,0.04),0_12px_40px_-24px_rgba(91,70,54,0.25)]">
        {promos.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 px-4 py-3.5 text-left transition-colors duration-200 hover:bg-sand/50 md:grid-cols-[1fr_110px_120px_20px] md:gap-6 md:px-7 md:py-5"
            >
              <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="text-[15px] font-medium text-ink md:text-[17px]">{p.title}</span>
                <Badge p={p} />
              </span>
              <span className="col-start-1 row-start-2 text-[13px] text-muted md:col-start-2 md:row-start-1 md:text-[15px]">{p.duration}</span>
              <span className="col-start-2 row-span-2 row-start-1 md:col-start-3 md:row-span-1">
                <Price p={p} />
              </span>
              <Arrow
                aria-hidden
                className="hidden size-4 text-muted transition-transform duration-200 group-hover:translate-x-0.5 md:col-start-4 md:block"
              />
            </button>
          </li>
        ))}
      </ul>
      <PromoDialog index={open} onIndex={setOpen} />
    </>
  );
}

function PromoPoster({ p }: { p: Promo }) {
  return (
    <div className="w-full max-w-[340px] overflow-hidden rounded-[22px] bg-[#f3ece2] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
      <div className="aspect-[4/3.4] overflow-hidden">
        <img src={p.image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex items-start justify-between gap-3 p-4 md:p-5">
        <div className="min-w-0">
          <p className="font-display text-[38px] font-semibold leading-none text-terracotta md:text-[44px]">
            {p.discount ?? (p.oldPrice ? rub(p.price) : p.badge)}
          </p>
          <p className="mt-1 font-display text-xl leading-tight text-ink">{p.title}</p>
          <ul className="mt-2 space-y-0.5 text-[11px] leading-snug text-muted">
            {p.bullets.map((b) => (
              <li key={b}>· {b}</li>
            ))}
          </ul>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[11px] font-bold tracking-[0.2em] text-wood-dark">ZAYTUN</p>
          <p className="mt-0.5 max-w-[90px] text-[10px] leading-tight text-muted">{p.when}</p>
        </div>
      </div>
    </div>
  );
}

function PromoDialog({ index, onIndex }: { index: number | null; onIndex: (i: number | null) => void }) {
  const reduce = useReducedMotion();
  const { add } = useCart();
  const { go } = usePageTransition();
  const [dir, setDir] = React.useState(1);
  const [added, setAdded] = React.useState<string | null>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const isOpen = index !== null;
  const p = index !== null ? promos[index] : null;

  const step = React.useCallback(
    (d: number) => {
      if (index === null) return;
      setDir(d);
      onIndex((index + d + promos.length) % promos.length);
    },
    [index, onIndex],
  );

  React.useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onIndex(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onIndex, step]);

  React.useEffect(() => setAdded(null), [index]);

  const service = p ? findService(p.serviceId) : undefined;
  const isMassage = service?.kind === "massage";

  const cta = () => {
    if (!p || !service) return;
    if (isMassage) {
      onIndex(null);
      go(`/booking?service=${service.id}`);
    } else if (added === p.id) {
      onIndex(null);
      go("/cart");
    } else {
      add(service.id, { price: p.price, basePrice: p.oldPrice ?? service.price, note: `по акции: ${p.badge}` });
      setAdded(p.id);
    }
  };

  const slide = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 40, scale: reduce ? 1 : 0.97 }),
    center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.45, ease: EASE } },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -40, transition: { duration: 0.2, ease: EASE } }),
  };

  // портал: окно не должно зависеть от transform/backdrop-filter родителей
  return createPortal(
    <AnimatePresence>
      {isOpen && p && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-label={`Акция: ${p.title}`}>
          <motion.div
            className="absolute inset-0 bg-[#2b2620]/55 backdrop-blur-[2px]"
            onClick={() => onIndex(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          />
          <motion.div
            className="relative flex max-h-[94svh] w-full flex-col overflow-hidden rounded-t-[26px] bg-surface shadow-2xl md:grid md:max-h-[640px] md:max-w-[960px] md:grid-cols-[1.25fr_1fr] md:rounded-[26px]"
            initial={reduce ? { opacity: 0 } : { y: "100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0, transition: { duration: 0.5, ease: DRAWER } }}
            exit={reduce ? { opacity: 0 } : { y: "100%", transition: { duration: 0.3, ease: DRAWER } }}
          >
            {/* Фото-панель */}
            <div className="relative flex shrink-0 items-center justify-center overflow-hidden bg-night px-14 pb-4 pt-6 md:px-16 md:py-10">
              <span aria-hidden className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/30 md:hidden" />
              <AnimatePresence mode="popLayout" custom={dir} initial={false}>
                <motion.div key={p.id} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" className="flex w-full justify-center">
                  <div className="relative aspect-[4/3] w-full max-w-[300px] overflow-hidden rounded-[18px] shadow-[0_24px_50px_-28px_rgba(0,0,0,0.7)] md:hidden">
                    <img src={p.image} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2b2620]/85 via-[#2b2620]/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5 text-white">
                      <div className="min-w-0">
                        <p className="font-display text-[32px] font-semibold leading-none text-[#f3d3c2]">
                          {p.discount ?? (p.oldPrice ? rub(p.price) : p.badge)}
                        </p>
                        <p className="mt-1 line-clamp-2 font-display text-[19px] leading-tight">{p.title}</p>
                      </div>
                      <p className="shrink-0 text-[10px] font-bold tracking-[0.2em] text-white/80">ZAYTUN</p>
                    </div>
                  </div>
                  <div className="hidden w-full md:block">
                    <PromoPoster p={p} />
                  </div>
                </motion.div>
              </AnimatePresence>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Предыдущая акция"
                className="press absolute left-2.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/12 text-white backdrop-blur hover:bg-white/20 md:left-4"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Следующая акция"
                className="press absolute right-2.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/12 text-white backdrop-blur hover:bg-white/20 md:right-4"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            {/* Описание */}
            <div className="flex min-h-0 flex-1 flex-col bg-[#fbf8f2]">
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4 pt-4 md:px-7 md:pt-7">
                <div className="flex items-start justify-between gap-3">
                  <p className="pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Акция {index! + 1} из {promos.length}
                  </p>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => onIndex(null)}
                    aria-label="Закрыть"
                    className="press -mr-1 -mt-1 grid size-10 place-items-center rounded-full bg-sand text-ink hover:bg-linen"
                  >
                    <X className="size-[18px]" />
                  </button>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  >
                    <div className="mt-2 flex flex-wrap items-center gap-2.5">
                      <Badge p={p} withThumb={false} />
                      <span className="flex items-center gap-1 text-[13px] text-muted">
                        <Clock className="size-3.5" aria-hidden /> {p.when}
                      </span>
                    </div>
                    <h3 className="mt-3 text-[30px] text-wood-dark md:text-[36px]">{p.title}</h3>
                    <p className="mt-2 text-[15px] text-muted">{p.subtitle}</p>
                    <a
                      href={`${contacts.channel}/${p.post}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-[13px] font-medium text-wood underline decoration-wood/30 underline-offset-4 hover:decoration-wood"
                    >
                      Пост в Telegram-канале <ArrowUpRight className="size-3.5" aria-hidden />
                    </a>
                    <ul className="mt-4 space-y-2">
                      {p.bullets.map((b) => (
                        <li key={b} className="flex gap-2.5 text-[15px] text-ink">
                          <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-wood" aria-hidden />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex items-center justify-between rounded-2xl bg-sand/60 px-4 py-3">
                      <span className="text-[14px] text-muted">{p.duration}</span>
                      <Price p={p} size="lg" />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="border-t border-linen px-5 pb-[calc(14px+env(safe-area-inset-bottom))] pt-3.5 md:px-7 md:pb-6">
                <button
                  type="button"
                  onClick={cta}
                  className="press flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-olive text-[15px] font-semibold text-white hover:bg-[#525d3b]"
                >
                  {isMassage ? "Записаться по акции" : added === p.id ? (
                    <>
                      <Check className="size-4" /> Добавлено, перейти к оплате
                    </>
                  ) : (
                    "Добавить в корзину по акции"
                  )}
                </button>
                <div className="no-scrollbar mt-3.5 flex gap-2 overflow-x-auto">
                  {promos.map((q, i) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setDir(i > index! ? 1 : -1);
                        onIndex(i);
                      }}
                      aria-label={q.title}
                      aria-current={i === index}
                      className={cn(
                        "press size-12 shrink-0 overflow-hidden rounded-xl border-2 opacity-70 transition-[opacity,border-color] duration-200 md:size-14",
                        i === index ? "border-ink opacity-100" : "border-transparent hover:opacity-100",
                      )}
                    >
                      <img src={q.image} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
