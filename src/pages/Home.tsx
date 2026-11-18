import { Star, MapPin, Clock, Phone, ArrowUpRight, CalendarDays, Leaf, DoorClosed, CupSoda, Car } from "lucide-react";
import { RevealImage, Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/Layout";
import { TLink } from "@/components/transition";
import { PromoList } from "@/components/Promos";
import { contacts, events, reviews, gallery, tgLink } from "@/data/site";

const facts = [
  { icon: Leaf, title: "Только для женщин", text: "Тихое пространство без посторонних, молельная зона и ширма в раздевалке." },
  { icon: DoorClosed, title: "Одна гостья в комнате", text: "В SPA-зоне только вы и мастер. Музыка, свечи, согретый халат." },
  { icon: CupSoda, title: "Чай после сеанса", text: "Травяной сбор, орехи и сухофрукты. Можно никуда не торопиться." },
  { icon: Car, title: "Бесплатная парковка", text: "Большая парковка прямо у входа на Комсомольской." },
];

export function HomePage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 pt-6 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-12 md:px-8 md:pt-14">
        <Reveal>
          <a
            href={contacts.yandexReviews}
            target="_blank"
            rel="noreferrer"
            className="press inline-flex items-center gap-2 rounded-full border border-linen bg-surface/80 py-1.5 pl-2 pr-3.5 text-[13px] text-muted hover:border-wood/40"
          >
            <span className="flex items-center gap-1 rounded-full bg-blush px-2 py-0.5 font-semibold text-terracotta">
              <Star className="size-3.5 fill-current" aria-hidden /> 5,0
            </span>
            {contacts.ratingCount} оценок на Яндекс Картах
          </a>
          <h1 className="mt-4 text-[44px] text-wood-dark sm:text-[56px] md:text-[76px]">
            Тишина, тёплые руки <span className="italic text-wood">и чай после</span>
          </h1>
          <p className="mt-4 max-w-[34rem] text-[15px] text-muted md:text-lg">
            ZAYTUN — женская студия массажа, SPA и фитнеса в центре Казани. Сауна, скрабы с оливой, татарские банные ритуалы и
            массаж, после которого хочется полежать ещё полчаса.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:gap-2.5 md:mt-6">
            <TLink to="/booking" className="press rounded-full bg-olive px-4 py-3.5 text-center text-[14px] font-semibold text-white hover:bg-[#525d3b] sm:px-6 sm:text-[15px]">
              <span className="sm:hidden">Записаться</span>
              <span className="hidden sm:inline">Записаться на массаж</span>
            </TLink>
            <TLink to="/services" className="press rounded-full border border-wood/30 bg-surface/70 px-4 py-3.5 text-center text-[14px] font-semibold text-wood-dark hover:border-wood/60 sm:px-6 sm:text-[15px]">
              Услуги и цены
            </TLink>
          </div>
        </Reveal>

        <div className="grid grid-cols-[1.15fr_1fr] gap-2.5 md:gap-4">
          <RevealImage eager src="/img/lobby.webp" alt="Холл студии ZAYTUN с оливковым деревом" className="row-span-2 aspect-[3/4] rounded-[22px] md:rounded-[28px]" delay={150} />
          <RevealImage eager src="/img/room-1.webp" alt="Массажная комната с тёплым светом" className="aspect-[4/3.6] rounded-[18px] md:rounded-[24px]" delay={300} />
          <RevealImage eager src="/img/tea-1.webp" alt="Чай с орехами после сеанса" className="aspect-[4/3.6] rounded-[18px] md:rounded-[24px]" delay={450} />
        </div>
      </section>

      {/* ---------- О студии ---------- */}
      <section className="mx-auto mt-12 max-w-6xl px-4 md:mt-24 md:px-8">
        <SectionHead eyebrow="О студии" title="Место, куда убегают от суеты" />
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
          {facts.map((f, i) => (
            <Reveal key={f.title} delay={i * 60} className="paper rounded-[20px] border border-linen/80 p-3.5 md:p-5">
              <span className="grid size-9 place-items-center rounded-full bg-olive-soft text-olive md:size-10">
                <f.icon className="size-[18px]" aria-hidden />
              </span>
              <h3 className="mt-3 font-sans text-[14px] font-semibold leading-snug text-ink md:text-base">{f.title}</h3>
              <p className="mt-1 text-[13px] leading-snug text-muted md:text-sm">{f.text}</p>
            </Reveal>
          ))}
        </div>
        <div className="no-scrollbar snap-row -mx-4 mt-3 flex gap-2.5 overflow-x-auto px-4 md:mx-0 md:mt-4 md:grid md:grid-cols-6 md:gap-4 md:overflow-visible md:px-0">
          {gallery.map((g, i) => (
            <RevealImage key={g.src} src={g.src} alt={g.alt} delay={i * 70} className="aspect-[3/4] w-[38vw] shrink-0 rounded-[16px] md:w-auto md:rounded-[20px]" />
          ))}
        </div>
      </section>

      {/* ---------- Акции ---------- */}
      <section className="mx-auto mt-12 max-w-6xl px-4 md:mt-24 md:px-8" id="promos">
        <SectionHead
          eyebrow="Акции из Telegram-канала"
          title="Сейчас выгодно"
          action={
            <a href={contacts.channel} target="_blank" rel="noreferrer" className="hidden items-center gap-1 text-[14px] font-medium text-wood hover:text-wood-dark sm:flex">
              Все акции в Telegram <ArrowUpRight className="size-4" />
            </a>
          }
        />
        <Reveal>
          <PromoList />
        </Reveal>
      </section>

      {/* ---------- Афиша ---------- */}
      <section className="mt-12 md:mt-24" id="events">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHead
            eyebrow="Афиша и новости"
            title="Что происходит в студии"
            action={
              <a href={contacts.channel} target="_blank" rel="noreferrer" className="hidden items-center gap-1 text-[14px] font-medium text-wood hover:text-wood-dark sm:flex">
                Канал студии <ArrowUpRight className="size-4" />
              </a>
            }
          />
        </div>
        <div className="no-scrollbar snap-row mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 pb-2 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-8">
          {events.map((e, i) => (
            <Reveal key={e.id} delay={i * 70} as="article" className="paper flex w-[74vw] max-w-[300px] shrink-0 flex-col overflow-hidden rounded-[22px] border border-linen/80 md:w-auto md:max-w-none">
              <div className="relative">
                <RevealImage src={e.image} alt="" className="aspect-[4/3]" delay={i * 70 + 100} />
                <div className="absolute left-3 top-3 rounded-2xl bg-surface/95 px-3 py-1.5 text-center leading-none shadow-sm">
                  <p className="font-display text-[26px] font-semibold text-wood-dark">{e.day}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-muted">{e.month}</p>
                </div>
                <span className="absolute bottom-3 left-3 rounded-full bg-night/75 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">{e.tag}</span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="flex items-center gap-1.5 text-[12px] font-medium text-muted">
                  <CalendarDays className="size-3.5" aria-hidden /> {e.time} · {e.price}
                </p>
                <h3 className="mt-1.5 font-sans text-[16px] font-semibold leading-snug text-ink">{e.title}</h3>
                <p className="mt-1.5 flex-1 text-[13px] leading-snug text-muted">{e.text}</p>
                <div className="mt-3.5 flex items-center gap-2">
                  <a
                    href={tgLink(e.signup)}
                    target="_blank"
                    rel="noreferrer"
                    className="press flex-1 rounded-full border border-wood/30 py-2.5 text-center text-[14px] font-semibold text-wood-dark hover:border-wood/60 hover:bg-sand/50"
                  >
                    Записаться
                  </a>
                  <a
                    href={`${contacts.channel}/${e.post}`}
                    target="_blank"
                    rel="noreferrer"
                    className="press grid size-10 shrink-0 place-items-center rounded-full text-wood hover:bg-sand"
                    aria-label={`Пост «${e.title}» в Telegram-канале`}
                  >
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Отзывы ---------- */}
      <section className="mt-12 md:mt-24" id="reviews">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHead
            eyebrow="Отзывы с Яндекс Карт"
            title={
              <>
                5,0 <span className="text-[0.55em] italic text-wood">из {contacts.reviewCount} отзывов</span>
              </>
            }
            action={
              <a href={contacts.yandexReviews} target="_blank" rel="noreferrer" className="hidden items-center gap-1 text-[14px] font-medium text-wood hover:text-wood-dark sm:flex">
                Читать все <ArrowUpRight className="size-4" />
              </a>
            }
          />
        </div>
        <div className="no-scrollbar snap-row mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 pb-2 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-8">
          {reviews.map((r, i) => (
            <Reveal key={r.name + r.date} delay={(i % 3) * 70} as="article" className="paper flex w-[82vw] max-w-[340px] shrink-0 flex-col rounded-[22px] border border-linen/80 p-4 md:w-auto md:max-w-none md:p-6">
              <div className="flex items-center gap-0.5 text-[#c08b5c]" aria-label="5 из 5">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="size-3.5 fill-current" aria-hidden />
                ))}
                {r.service && <span className="ml-2 truncate text-[12px] font-medium text-muted">{r.service}</span>}
              </div>
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink md:text-[15px]">«{r.text}»</p>
              <div className="mt-4 flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-full bg-sand font-display text-lg text-wood-dark">{r.name[0]}</span>
                <div className="leading-tight">
                  <p className="text-[14px] font-semibold text-ink">{r.name}</p>
                  <p className="text-[12px] text-muted">{r.date}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:hidden">
          <a href={contacts.yandexReviews} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-1 text-[14px] font-medium text-wood">
            Все отзывы на Яндекс Картах <ArrowUpRight className="size-4" />
          </a>
        </div>
      </section>

      {/* ---------- Как добраться ---------- */}
      <section className="mx-auto mt-12 max-w-6xl px-4 md:mt-24 md:px-8" id="address">
        <SectionHead eyebrow="Как нас найти" title="Комсомольская, 1" />
        <div className="grid gap-3 md:grid-cols-[1fr_1.2fr] md:gap-4">
          <Reveal className="paper flex flex-col rounded-[22px] border border-linen/80 p-4 md:p-6">
            <ul className="space-y-3 text-[15px]">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-wood" aria-hidden />
                <span>
                  {contacts.city}, {contacts.address}
                  <span className="block text-[13px] text-muted">Отдельный вход с улицы: серый фасад, стеклянная дверь с табличкой ZAYTUN, олива и герань в кадках.</span>
                </span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-wood" aria-hidden /> {contacts.hours}
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-wood" aria-hidden />
                <a href={contacts.phoneHref} className="hover:text-wood">{contacts.phone}</a>
              </li>
            </ul>
            <div className="mt-4 overflow-hidden rounded-[16px] border border-linen">
              <iframe
                title="ZAYTUN на Яндекс Картах"
                src={`https://yandex.ru/map-widget/v1/?ll=${contacts.coords[0]}%2C${contacts.coords[1]}&z=16&pt=${contacts.coords[0]},${contacts.coords[1]},pm2brm&oid=122462904652`}
                className="block h-[220px] w-full md:h-[260px]"
                loading="lazy"
              />
            </div>
            <a href={contacts.yandex} target="_blank" rel="noreferrer" className="press mt-3 flex items-center justify-center gap-1.5 rounded-full border border-wood/30 py-3 text-[14px] font-semibold text-wood-dark hover:border-wood/60">
              Построить маршрут <ArrowUpRight className="size-4" />
            </a>
          </Reveal>

          <div className="grid grid-cols-2 gap-2.5 md:gap-4">
            <figure className="col-span-2">
              <RevealImage src="/img/entrance-1.webp" alt="Фасад здания на Комсомольской, 1 и вход в студию" className="aspect-[16/10] rounded-[20px]" />
              <figcaption className="mt-1.5 text-[12px] text-muted">Фасад со стороны Комсомольской: вход под круглым фонарём</figcaption>
            </figure>
            <figure>
              <RevealImage src="/img/entrance-2.webp" alt="Стеклянная дверь студии с табличкой" className="aspect-square rounded-[18px]" delay={100} />
              <figcaption className="mt-1.5 text-[12px] text-muted">Дверь с табличкой ZAYTUN</figcaption>
            </figure>
            <figure>
              <RevealImage src="/img/entrance-3.webp" alt="Гостья открывает дверь студии" className="aspect-square rounded-[18px]" imgClassName="object-[50%_35%]" delay={200} />
              <figcaption className="mt-1.5 text-[12px] text-muted">Олива и герань у входа</figcaption>
            </figure>
          </div>
        </div>
      </section>
    </>
  );
}
