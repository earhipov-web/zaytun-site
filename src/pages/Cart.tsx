import * as React from "react";
import { Minus, Plus, Trash2, ShieldCheck, CreditCard, Smartphone, CheckCircle2 } from "lucide-react";
import { PageHead } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { TLink, usePageTransition } from "@/components/transition";
import { useCart } from "@/store/cart";
import { cn, rub } from "@/lib/utils";

/** Итог чека: сумма к оплате, скидка и сумма без скидки */
function Totals({ label = "Итого:", className }: { label?: string; className?: string }) {
  const { total, fullTotal, discount } = useCart();
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between">
        <span className="text-muted">{label}</span>
        <span className="font-display text-[34px] font-semibold tabular-nums text-wood-dark">{rub(total)}</span>
      </div>
      <dl className="mt-1.5 space-y-1 text-[14px]">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Ваша скидка:</dt>
          <dd className={cn("font-semibold tabular-nums", discount > 0 ? "text-terracotta" : "text-muted")}>
            {discount > 0 ? `−${rub(discount)}` : rub(0)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Без скидки:</dt>
          <dd className={cn("tabular-nums text-muted", discount > 0 && "line-through decoration-muted/60")}>{rub(fullTotal)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function CartPage() {
  const { items, setQty, remove } = useCart();
  const { go } = usePageTransition();

  return (
    <>
      <PageHead eyebrow="Корзина" title="Ваш заказ" lead={items.length ? "Проверьте услуги и переходите к оплате. Время визита администратор согласует после оплаты." : undefined} />
      <div className="mx-auto mt-5 max-w-6xl px-4 md:mt-8 md:px-8">
        {items.length === 0 ? (
          <Reveal className="paper rounded-[24px] border border-linen/80 p-6 text-center md:p-10">
            <p className="font-display text-[28px] text-wood-dark">Пока пусто</p>
            <p className="mx-auto mt-1 max-w-sm text-[14px] text-muted">
              Добавьте SPA-программу или абонемент на тренировки. Массаж записываем отдельно, через мастера и Telegram.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <TLink to="/services" className="press rounded-full bg-olive px-6 py-3 text-[15px] font-semibold text-white">К услугам</TLink>
              <TLink to="/booking" className="press rounded-full border border-wood/30 px-6 py-3 text-[15px] font-semibold text-wood-dark">Записаться на массаж</TLink>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-4 md:grid-cols-[1fr_340px] md:gap-8">
            <Reveal as="section" className="paper rounded-[24px] border border-linen/80 px-4 md:px-6">
              <ul className="divide-y divide-linen">
                {items.map((i) => (
                  <li key={i.id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 py-4">
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold text-ink">{i.title}</p>
                      <p className="text-[13px] text-muted">
                        {i.basePrice && i.basePrice > i.price && <s className="mr-1">{rub(i.basePrice)}</s>}
                        {rub(i.price)} {i.note && <span className="text-terracotta">· {i.note}</span>}
                      </p>
                    </div>
                    <p className="text-right font-semibold tabular-nums">{rub(i.price * i.qty)}</p>
                    <div className="col-span-2 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-linen bg-surface">
                        <button type="button" onClick={() => setQty(i.id, i.qty - 1)} className="press grid size-10 place-items-center text-wood-dark" aria-label="Меньше">
                          <Minus className="size-4" />
                        </button>
                        <span className="w-6 text-center text-[15px] font-semibold tabular-nums" aria-live="polite">{i.qty}</span>
                        <button type="button" onClick={() => setQty(i.id, i.qty + 1)} className="press grid size-10 place-items-center text-wood-dark" aria-label="Больше">
                          <Plus className="size-4" />
                        </button>
                      </div>
                      <button type="button" onClick={() => remove(i.id)} className="press flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] text-muted hover:text-terracotta">
                        <Trash2 className="size-4" /> Удалить
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={80} className="md:sticky md:top-24 md:self-start">
              <div className="paper rounded-[24px] border border-linen/80 p-4 md:p-5">
                <Totals />
                <button
                  type="button"
                  onClick={() => go("/checkout")}
                  className="press mt-4 flex h-[52px] w-full items-center justify-center rounded-full bg-olive text-[15px] font-semibold text-white hover:bg-[#525d3b]"
                >
                  Перейти к оплате
                </button>
                <TLink to="/services" className="mt-3 block text-center text-[14px] font-medium text-wood">Добавить ещё услугу</TLink>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </>
  );
}

export function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [method, setMethod] = React.useState<"card" | "sbp">("sbp");
  const [done, setDone] = React.useState<null | { total: number; id: string }>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const phone = String(f.get("phone") ?? "").replace(/\D/g, "");
    const err: Record<string, string> = {};
    if (!name) err.name = "Как к вам обращаться?";
    if (phone.length < 10) err.phone = "Нужен номер из 10–11 цифр";
    setErrors(err);
    if (Object.keys(err).length) return;
    setDone({ total, id: String(Math.floor(100000 + Math.random() * 900000)) });
    clear();
  };

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-10 md:pt-20">
        <Reveal className="paper rounded-[26px] border border-linen/80 p-6 text-center md:p-10">
          <CheckCircle2 className="mx-auto size-12 text-olive" aria-hidden />
          <h1 className="mt-3 text-[36px] text-wood-dark">Заказ №{done.id} оформлен</h1>
          <p className="mt-2 text-[15px] text-muted">
            Это демо-страница: деньги не списаны. В рабочей версии здесь будет подтверждение оплаты на {rub(done.total)}, а администратор напишет вам, чтобы
            согласовать время.
          </p>
          <TLink to="/" className="press mt-6 inline-block rounded-full bg-olive px-6 py-3 text-[15px] font-semibold text-white">На главную</TLink>
        </Reveal>
      </div>
    );
  }

  const field = "mt-1.5 h-12 w-full rounded-2xl border bg-surface px-4 text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted/60 focus:border-wood focus:ring-4 focus:ring-wood/10";

  return (
    <>
      <PageHead eyebrow="Оплата" title="Оформление" />
      <div className="mx-auto mt-5 max-w-6xl px-4 md:mt-8 md:px-8">
        {items.length === 0 ? (
          <p className="text-muted">
            В корзине ничего нет. <TLink to="/services" className="font-medium text-wood underline underline-offset-4">Выбрать услуги</TLink>
          </p>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-4 md:grid-cols-[1fr_360px] md:gap-8">
            <Reveal as="section" className="paper space-y-4 rounded-[24px] border border-linen/80 p-4 md:p-6">
              <h2 className="font-sans text-[15px] font-semibold text-ink">Контакты</h2>
              <label className="block text-[14px] font-medium text-ink">
                Имя
                <input name="name" autoComplete="given-name" className={cn(field, errors.name ? "border-terracotta" : "border-linen")} aria-invalid={!!errors.name} />
                {errors.name && <span className="mt-1 block text-[13px] text-terracotta">{errors.name}</span>}
              </label>
              <label className="block text-[14px] font-medium text-ink">
                Телефон
                <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 900 000-00-00" className={cn(field, errors.phone ? "border-terracotta" : "border-linen")} aria-invalid={!!errors.phone} />
                {errors.phone && <span className="mt-1 block text-[13px] text-terracotta">{errors.phone}</span>}
              </label>
              <label className="block text-[14px] font-medium text-ink">
                Комментарий <span className="font-normal text-muted">(необязательно)</span>
                <textarea name="comment" rows={2} className={cn(field, "h-auto resize-none border-linen py-3")} placeholder="Например, удобное время визита" />
              </label>

              <h2 className="pt-2 font-sans text-[15px] font-semibold text-ink">Способ оплаты</h2>
              <div className="grid gap-2 sm:grid-cols-2" role="radiogroup">
                {[
                  { id: "sbp" as const, label: "СБП", hint: "По QR-коду из приложения банка", icon: Smartphone },
                  { id: "card" as const, label: "Банковская карта", hint: "Мир, Visa, Mastercard", icon: CreditCard },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={method === m.id}
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      "press flex items-center gap-3 rounded-2xl border p-3.5 text-left",
                      method === m.id ? "border-olive bg-olive-soft/50 ring-2 ring-olive/30" : "border-linen bg-surface hover:border-wood/40",
                    )}
                  >
                    <m.icon className="size-5 shrink-0 text-wood" aria-hidden />
                    <span>
                      <span className="block text-[14px] font-semibold text-ink">{m.label}</span>
                      <span className="block text-[12px] text-muted">{m.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
              <p className="flex items-start gap-2 rounded-2xl bg-sand/60 p-3 text-[13px] text-muted">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-olive" aria-hidden />
                Демо-версия: платёжный шлюз не подключён, данные никуда не отправляются.
              </p>
            </Reveal>

            <Reveal delay={80} className="md:sticky md:top-24 md:self-start">
              <div className="paper rounded-[24px] border border-linen/80 p-4 md:p-5">
                <ul className="space-y-2 text-[14px]">
                  {items.map((i) => (
                    <li key={i.id} className="flex justify-between gap-3">
                      <span className="text-ink">
                        {i.title} {i.qty > 1 && <span className="text-muted">× {i.qty}</span>}
                      </span>
                      <span className="shrink-0 tabular-nums">{rub(i.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>
                <Totals className="mt-4 border-t border-linen pt-3" />
                <button type="submit" className="press mt-4 flex h-[52px] w-full items-center justify-center rounded-full bg-olive text-[15px] font-semibold text-white hover:bg-[#525d3b]">
                  Оплатить {rub(total)}
                </button>
                <TLink to="/cart" className="mt-3 block text-center text-[14px] font-medium text-wood">Вернуться в корзину</TLink>
              </div>
            </Reveal>
          </form>
        )}
      </div>
    </>
  );
}
