import { PageHead } from "@/components/Layout";
import { MasterCard } from "@/components/MasterCard";
import { Reveal, RevealImage } from "@/components/Reveal";
import { TLink } from "@/components/transition";
import { masters, trainers, contacts } from "@/data/site";

export function MastersPage() {
  return (
    <>
      <PageHead
        eyebrow="Команда"
        title="О мастерах"
        lead="Перед сеансом мастер спрашивает, чего вы ждёте, и подбирает давление и масло. Гости в отзывах чаще всего называют эти три имени."
      />
      <h2 className="mx-auto mt-6 max-w-6xl px-4 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-muted md:mt-10 md:px-8">Мастера массажа и SPA</h2>
      <section className="mx-auto mt-2.5 grid max-w-6xl gap-3 px-4 md:mt-4 md:grid-cols-3 md:gap-5 md:px-8">
        {masters.map((m, i) => (
          <Reveal key={m.id} delay={i * 80}>
            <MasterCard m={m} />
          </Reveal>
        ))}
      </section>

      <h2 className="mx-auto mt-8 max-w-6xl px-4 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-muted md:mt-14 md:px-8">Тренеры</h2>
      <section className="mx-auto mt-2.5 grid max-w-6xl gap-3 px-4 md:mt-4 md:grid-cols-3 md:gap-5 md:px-8">
        {trainers.map((m, i) => (
          <Reveal key={m.id} delay={i * 80}>
            <MasterCard m={m} />
          </Reveal>
        ))}
      </section>
      <p className="mx-auto mt-3 max-w-6xl px-4 text-[13px] text-muted md:px-8">
        Данные о мастерах и тренерах — из{" "}
        <a href={contacts.channel} target="_blank" rel="noreferrer" className="font-medium text-wood underline decoration-wood/30 underline-offset-4">
          Telegram-канала студии
        </a>{" "}
        и отзывов на Яндекс Картах.
      </p>

      <section className="mx-auto mt-10 grid max-w-6xl gap-3 px-4 md:mt-16 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-10 md:px-8">
        <div className="grid grid-cols-2 gap-2.5 md:gap-4">
          <RevealImage src="/img/room-4.webp" alt="Массажная комната" className="aspect-[3/4] rounded-[20px]" />
          <RevealImage src="/img/towels.webp" alt="Сауна и полотенца" className="mt-8 aspect-[3/4] rounded-[20px]" delay={120} />
        </div>
        <Reveal className="md:pl-4">
          <h2 className="text-[30px] text-wood-dark md:text-[44px]">Как проходит первый визит</h2>
          <ol className="mt-4 space-y-3 text-[15px]">
            {[
              "Администратор встречает, помогает повесить одежду и показывает студию.",
              "Мастер расспрашивает о самочувствии и пожеланиях, предлагает четыре масла на выбор.",
              "Сеанс проходит в отдельной комнате: свечи, тёплый свет, тихая музыка.",
              "После сеанса чай с орехами и сухофруктами. Можно полежать в зоне отдыха.",
            ].map((t, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-olive-soft text-[13px] font-semibold text-olive">{i + 1}</span>
                <span className="pt-0.5 text-ink">{t}</span>
              </li>
            ))}
          </ol>
          <TLink to="/booking" className="press mt-6 inline-block rounded-full bg-olive px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-[#525d3b]">
            Выбрать массаж и мастера
          </TLink>
        </Reveal>
      </section>
    </>
  );
}
