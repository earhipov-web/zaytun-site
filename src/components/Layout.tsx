import * as React from "react";
import { useLocation } from "react-router-dom";
import { Home, Users, Sparkles, ShoppingCart, NotebookPen, Phone, Send, MapPin, Clock, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { TLink } from "@/components/transition";
import { Branch } from "@/components/Branch";
import { useCart } from "@/store/cart";
import { contacts, tgLink } from "@/data/site";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Главная", icon: Home },
  { to: "/masters", label: "О мастерах", short: "Мастера", icon: Users },
  { to: "/services", label: "Услуги", icon: Sparkles },
];

function CartBadge({ className }: { className?: string }) {
  const { count, lastAdded } = useCart();
  const [bump, setBump] = React.useState(false);
  React.useEffect(() => {
    if (!lastAdded) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 260);
    return () => clearTimeout(t);
  }, [lastAdded]);
  if (!count) return null;
  return (
    <span
      className={cn(
        "absolute -right-1.5 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#e5484d] px-1 text-[11px] font-bold leading-none text-white transition-transform duration-200 ease-[var(--ease-out)]",
        bump && "scale-125",
        className,
      )}
    >
      {count}
    </span>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="relative min-h-svh overflow-x-clip">
      <Branch />

      <header className="paper sticky top-0 z-40 border-b border-linen/70 pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 md:h-[72px] md:px-8">
          <TLink to="/" className="flex items-center gap-2.5" aria-label="ZAYTUN — на главную">
            <img src="/img/logo.webp" alt="" className="size-9 rounded-full md:size-11" />
            <span className="leading-none">
              <span className="block font-display text-[22px] font-semibold tracking-[0.08em] text-wood-dark md:text-2xl">ZAYTUN</span>
              <span className="mt-0.5 hidden text-[11px] uppercase tracking-[0.18em] text-muted sm:block">фитнес &amp; spa</span>
            </span>
          </TLink>

          <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Основное меню">
            {nav.map((n) => (
              <TLink
                key={n.to}
                to={n.to}
                aria-current={isActive(n.to) ? "page" : undefined}
                className={cn(
                  "press rounded-full px-4 py-2 text-[15px] font-medium text-muted hover:text-ink",
                  isActive(n.to) && "bg-sand text-ink",
                )}
              >
                {n.label}
              </TLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 md:gap-2">
            <a href={contacts.phoneHref} className="press hidden items-center gap-2 rounded-full px-3 py-2 text-[15px] font-medium text-ink hover:bg-sand lg:flex">
              <Phone className="size-4 text-wood" aria-hidden /> {contacts.phone}
            </a>
            <a
              href={tgLink()}
              target="_blank"
              rel="noreferrer"
              className="press grid size-10 place-items-center rounded-full text-wood hover:bg-sand md:hidden"
              aria-label="Написать в Telegram"
            >
              <Send className="size-[18px]" />
            </a>
            <a href={contacts.phoneHref} className="press grid size-10 place-items-center rounded-full text-wood hover:bg-sand lg:hidden" aria-label="Позвонить">
              <Phone className="size-[18px]" />
            </a>
            <TLink
              to="/cart"
              className="press relative hidden h-11 items-center gap-2.5 rounded-xl border border-linen bg-surface/70 px-4 text-[15px] font-semibold text-ink hover:border-wood/40 hover:bg-surface md:flex"
            >
              <ShoppingCart className="size-[18px]" strokeWidth={2} aria-hidden />
              Корзина
              <CartBadge className="-right-2.5 -top-2.5 h-[22px] min-w-[22px] text-[12px] ring-2 ring-bg" />
            </TLink>
            <TLink
              to="/booking"
              className="press hidden rounded-full bg-olive px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-[#525d3b] md:inline-block"
            >
              Записаться
            </TLink>
          </div>
        </div>
      </header>

      <main className="relative z-10 pb-6 md:pb-0">{children}</main>

      <footer className="relative z-10 mt-16 border-t border-linen bg-surface/80 pb-[calc(80px+env(safe-area-inset-bottom))] md:mt-24 md:pb-0">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.4fr_1fr_1fr] md:px-8 md:py-14">
          <div>
            <div className="flex items-center gap-3">
              <img src="/img/logo.webp" alt="" className="size-12 rounded-full" />
              <div>
                <p className="font-display text-2xl font-semibold tracking-[0.08em] text-wood-dark">ZAYTUN</p>
                <p className="text-sm text-muted">Женская студия фитнеса и SPA</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted">
              Сайт-пример. Цены и отзывы взяты с Яндекс Карт, акции, афиша и команда — из Telegram-канала студии.
            </p>
          </div>
          <div className="space-y-2.5 text-[15px]">
            <p className="flex gap-2.5"><MapPin className="mt-1 size-4 shrink-0 text-wood" aria-hidden />{contacts.city}, {contacts.address}</p>
            <p className="flex gap-2.5"><Clock className="mt-1 size-4 shrink-0 text-wood" aria-hidden />{contacts.hours}</p>
            <a href={contacts.phoneHref} className="flex gap-2.5 hover:text-wood"><Phone className="mt-1 size-4 shrink-0 text-wood" aria-hidden />{contacts.phone}</a>
          </div>
          <div className="flex flex-col gap-2.5 text-[15px]">
            <a href={tgLink()} target="_blank" rel="noreferrer" className="hover:text-wood">Telegram: @{contacts.telegram}</a>
            <a href={contacts.channel} target="_blank" rel="noreferrer" className="hover:text-wood">Канал с акциями</a>
            <a href={contacts.yandex} target="_blank" rel="noreferrer" className="hover:text-wood">Мы на Яндекс Картах</a>
          </div>
        </div>
      </footer>

      {/* Нижняя навигация на телефоне */}
      <MobileNav isActive={isActive} />
    </div>
  );
}

const mobileNav: { to: string; match: string[]; label: string; icon: LucideIcon; badge?: boolean }[] = [
  { to: "/", match: ["/"], label: "Главная", icon: Home },
  { to: "/masters", match: ["/masters"], label: "Мастера", icon: Users },
  { to: "/services", match: ["/services"], label: "Услуги", icon: Sparkles },
  { to: "/cart", match: ["/cart", "/checkout"], label: "Корзина", icon: ShoppingCart, badge: true },
  { to: "/booking", match: ["/booking"], label: "Запись", icon: NotebookPen },
];

/** Нижнее меню на телефоне: светло-коричневый овал переезжает за активной иконкой */
function MobileNav({ isActive }: { isActive: (to: string) => boolean }) {
  const reduce = useReducedMotion();
  return (
    <nav
      aria-label="Навигация"
      className="paper fixed inset-x-0 bottom-0 z-40 border-t border-linen/80 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="grid h-16 grid-cols-5 items-center px-1">
        {mobileNav.map((n) => {
          const active = n.match.some((m) => isActive(m));
          return (
            <TLink
              key={n.to}
              to={n.to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 py-1 text-[11px] font-medium text-muted transition-colors duration-200",
                active && "text-wood-dark",
              )}
            >
              <span className="relative grid h-8 w-14 place-items-center">
                {active && (
                  <motion.span
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 rounded-full bg-[#e8d9c6]"
                    transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.5, bounce: 0.18 }}
                  />
                )}
                <n.icon className={cn("relative size-[21px] transition-colors duration-200", active && "text-wood-dark")} strokeWidth={active ? 2.1 : 1.8} />
                {n.badge && <CartBadge className="right-1.5 top-0" />}
              </span>
              {n.label}
            </TLink>
          );
        })}
      </div>
    </nav>
  );
}

export function PageHead({ eyebrow, title, lead }: { eyebrow?: string; title: React.ReactNode; lead?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-7 md:px-8 md:pt-14">
      {eyebrow && <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-wood">{eyebrow}</p>}
      <h1 className="mt-2 text-[40px] text-wood-dark md:text-[64px]">{title}</h1>
      {lead && <p className="mt-3 max-w-2xl text-muted md:text-lg">{lead}</p>}
    </div>
  );
}

export function SectionHead({ eyebrow, title, action }: { eyebrow?: string; title: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 md:mb-7">
      <div>
        {eyebrow && <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-wood">{eyebrow}</p>}
        <h2 className="mt-1.5 text-[32px] text-wood-dark md:text-[48px]">{title}</h2>
      </div>
      {action}
    </div>
  );
}
