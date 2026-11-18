import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Send } from "lucide-react";
import { PageHead } from "@/components/Layout";
import { MasterCard } from "@/components/MasterCard";
import { Reveal } from "@/components/Reveal";
import { TLink, usePageTransition } from "@/components/transition";
import { findService, masters, massageServices, tgLink } from "@/data/site";
import { cn, rub } from "@/lib/utils";

function Steps({ current }: { current: 1 | 2 }) {
  const items = ["Массаж", "Мастер и время", "Telegram"];
  return (
    <ol className="mx-auto mt-4 flex max-w-6xl items-center gap-2 px-4 text-[12px] font-medium md:px-8 md:text-[13px]" aria-label="Шаги записи">
      {items.map((t, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={t} className="flex items-center gap-2" aria-current={active ? "step" : undefined}>
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full text-[12px]",
                done && "bg-olive text-white",
                active && "bg-wood-dark text-white",
                !done && !active && "bg-sand text-muted",
              )}
            >
              {done ? <Check className="size-3.5" strokeWidth={3} /> : n}
            </span>
            <span className={cn(active ? "text-ink" : "text-muted", !active && "hidden sm:inline")}>{t}</span>
            {n < items.length && <span className="h-px w-5 bg-linen md:w-10" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

function Chip({ active, onClick, children, className }: { active: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "press rounded-full border px-3.5 py-2 text-[14px] font-medium",
        active ? "border-olive bg-olive text-white" : "border-linen bg-surface text-ink hover:border-wood/40",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ---------------- Шаг 1: тип массажа и зона ---------------- */

export function BookingPage() {
  const [params] = useSearchParams();
  const { go } = usePageTransition();
  const initial = findService(params.get("service") ?? "")?.kind === "massage" ? params.get("service")! : massageServices[0].id;
  const [serviceId, setServiceId] = React.useState(initial);
  const service = findService(serviceId)!;
  const [option, setOption] = React.useState<string>(service.options?.[0] ?? "");

  React.useEffect(() => {
    setOption(findService(serviceId)?.options?.[0] ?? "");
  }, [serviceId]);

  const body = massageServices.filter((s) => !s.id.startsWith("face"));
  const face = massageServices.filter((s) => s.id.startsWith("face"));

  const group = (title: string, list: typeof massageServices) => (
    <div>
      <h2 className="mb-2 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">{title}</h2>
      <div className="grid gap-2 sm:grid-cols-2 md:gap-3">
        {list.map((s) => {
          const active = s.id === serviceId;
          return (
            <div
              key={s.id}
              className={cn(
                "paper rounded-[18px] border transition-[border-color,box-shadow] duration-200",
                active ? "border-olive ring-2 ring-olive/35" : "border-linen/80 hover:border-wood/40",
              )}
            >
              <button
                type="button"
                onClick={() => setServiceId(s.id)}
                aria-pressed={active}
                className="flex w-full items-start justify-between gap-3 p-3.5 text-left md:p-4"
              >
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold text-ink">{s.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-muted">{s.description}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-semibold tabular-nums text-ink">{rub(s.price)}</span>
                  <span className="block text-[12px] text-muted">{s.duration}</span>
                </span>
              </button>
              {active && s.options && s.options.length > 0 && (
                <div className="-mt-1 px-3.5 pb-3.5 md:px-4 md:pb-4">
                  <p className="text-[12px] font-semibold text-wood">{s.id.startsWith("face") || s.id === "massage-60" ? "Техника" : "Зона массажа"}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {s.options.map((o) => (
                      <Chip key={o} active={o === option} onClick={() => setOption(o)} className="px-3 py-1.5 text-[13px]">
                        {o}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <PageHead eyebrow="Запись на массаж" title="Какой массаж хотите?" />
      <Steps current={1} />
      <div className="mx-auto mt-5 grid max-w-6xl gap-5 px-4 md:mt-8 md:grid-cols-[1fr_340px] md:gap-8 md:px-8">
        <Reveal className="space-y-5">
          {group("Массаж тела", body)}
          {group("Массаж лица", face)}
        </Reveal>

        <div className="sticky bottom-[calc(72px+env(safe-area-inset-bottom))] z-20 md:top-24 md:bottom-auto md:self-start">
          <div className="paper flex items-center gap-3 rounded-[22px] border border-linen/80 p-3 shadow-[0_18px_40px_-28px_rgba(58,46,38,0.5)] md:block md:p-5 md:shadow-none">
            <div className="min-w-0 flex-1">
              <p className="hidden text-[13px] text-muted md:block">Вы выбрали</p>
              <p className="truncate text-[14px] font-semibold text-ink md:mt-0.5 md:font-display md:text-[26px] md:font-medium md:leading-tight md:text-wood-dark">
                {service.title}
              </p>
              <p className="truncate text-[12px] text-muted md:text-[14px]">
                {option && `${option} · `}
                {service.duration} · {rub(service.price)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => go(`/booking/master?service=${service.id}&option=${encodeURIComponent(option)}`)}
              className="press flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-olive px-5 text-[15px] font-semibold text-white hover:bg-[#525d3b] md:mt-5 md:h-[52px] md:w-full"
            >
              <span className="md:hidden">Далее</span>
              <span className="hidden md:inline">Выбрать мастера</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- Шаг 2: мастер, дата, время → Telegram ---------------- */

const fmtDay = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" });
const fmtWeek = new Intl.DateTimeFormat("ru-RU", { weekday: "short" });
const SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];

export function BookingMasterPage() {
  const [params] = useSearchParams();
  const service = findService(params.get("service") ?? "");
  const option = params.get("option") ?? "";
  const [masterId, setMasterId] = React.useState<string | null>(null);
  const days = React.useMemo(() => {
    const now = new Date();
    return Array.from({ length: 14 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + i));
  }, []);
  const [dayIdx, setDayIdx] = React.useState(0);
  const [time, setTime] = React.useState<string | null>(null);

  const master = masters.find((m) => m.id === masterId);
  const ready = master && time;
  const dateText = fmtDay.format(days[dayIdx]);
  const message = master && time ? `Здравствуйте! Хочу записаться к вам на массаж, к мастеру ${master.name} на ${dateText} в ${time}.` : "";

  // прошедшие слоты сегодняшнего дня недоступны
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const slotDisabled = (t: string) => {
    if (dayIdx !== 0) return false;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m <= nowMinutes + 30;
  };

  return (
    <>
      <PageHead
        eyebrow="Запись на массаж"
        title="Мастер и время"
        lead={
          service ? (
            <>
              {service.title}
              {option && ` · ${option}`} · {service.duration} · {rub(service.price)}{" "}
              <TLink to={`/booking?service=${service.id}`} className="ml-1 font-medium text-wood underline decoration-wood/30 underline-offset-4 hover:decoration-wood">
                изменить
              </TLink>
            </>
          ) : undefined
        }
      />
      <Steps current={2} />

      <div className="mx-auto mt-5 max-w-6xl px-4 md:mt-8 md:px-8">
        <h2 className="mb-2 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">1. Мастер</h2>
        <div className="no-scrollbar snap-row -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
          {masters.map((m) => (
            <div key={m.id} className="w-[78vw] max-w-[320px] shrink-0 md:w-auto md:max-w-none">
              <MasterCard m={m} compact selectable selected={m.id === masterId} onSelect={() => setMasterId(m.id)} />
            </div>
          ))}
        </div>

        <h2 className="mb-2 mt-6 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">2. Дата</h2>
        <div className="no-scrollbar snap-row -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          {days.map((d, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setDayIdx(i);
                setTime(null);
              }}
              aria-pressed={i === dayIdx}
              className={cn(
                "press flex w-[60px] shrink-0 flex-col items-center rounded-2xl border py-2 leading-tight",
                i === dayIdx ? "border-olive bg-olive text-white" : "border-linen bg-surface text-ink hover:border-wood/40",
              )}
            >
              <span className={cn("text-[11px] uppercase", i === dayIdx ? "text-white/80" : "text-muted")}>{i === 0 ? "сег" : fmtWeek.format(d)}</span>
              <span className="text-[20px] font-semibold">{d.getDate()}</span>
            </button>
          ))}
        </div>

        <h2 className="mb-2 mt-6 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">3. Время · {dateText}</h2>
        <div className="flex flex-wrap gap-2">
          {SLOTS.map((t) => (
            <button
              key={t}
              type="button"
              disabled={slotDisabled(t)}
              onClick={() => setTime(t)}
              aria-pressed={t === time}
              className={cn(
                "press rounded-full border px-4 py-2 text-[14px] font-medium tabular-nums disabled:cursor-not-allowed disabled:opacity-35",
                t === time ? "border-olive bg-olive text-white" : "border-linen bg-surface text-ink enabled:hover:border-wood/40",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-muted">Администратор подтвердит время в Telegram. Если слот занят, предложит ближайший.</p>

        <div className="paper sticky bottom-[calc(72px+env(safe-area-inset-bottom))] z-20 mt-6 rounded-[22px] border border-linen/80 p-3.5 shadow-[0_18px_40px_-28px_rgba(58,46,38,0.5)] md:bottom-6 md:flex md:items-center md:gap-5 md:p-4">
          <p className="min-w-0 flex-1 text-[13px] leading-snug text-muted md:text-[14px]">
            {ready ? (
              <>
                <span className="font-semibold text-ink">Сообщение: </span>
                {message}
              </>
            ) : (
              "Выберите мастера и время, и мы подготовим сообщение для Telegram."
            )}
          </p>
          <div className="mt-3 flex gap-2 md:mt-0">
            <TLink to={`/booking?service=${service?.id ?? ""}`} className="press grid size-12 shrink-0 place-items-center rounded-full border border-linen text-wood-dark hover:border-wood/40" aria-label="Назад к выбору массажа">
              <ArrowLeft className="size-4" />
            </TLink>
            <a
              href={ready ? tgLink(message) : undefined}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!ready}
              onClick={(e) => !ready && e.preventDefault()}
              className={cn(
                "press flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold md:flex-none",
                ready ? "bg-olive text-white hover:bg-[#525d3b]" : "cursor-not-allowed bg-sand text-muted",
              )}
            >
              <Send className="size-4" aria-hidden /> Записаться в Telegram
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
