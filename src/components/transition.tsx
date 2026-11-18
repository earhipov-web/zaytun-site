import * as React from "react";
import { useLocation, useNavigate, type To } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { GooeyLoader } from "@/components/ui/loader-10";

type Ctx = { go: (to: To) => void; loading: boolean };
const TransitionCtx = React.createContext<Ctx>({ go: () => {}, loading: false });

const HOLD = 650; // сколько держим загрузчик перед сменой страницы

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const reduce = useReducedMotion();
  const [loading, setLoading] = React.useState(true);
  const timers = React.useRef<number[]>([]);

  // первый заход на сайт
  React.useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), reduce ? 200 : 900);
    return () => window.clearTimeout(t);
  }, [reduce]);

  const go = React.useCallback(
    (to: To) => {
      const target = typeof to === "string" ? to : `${to.pathname ?? ""}${to.search ?? ""}`;
      if (target === location.pathname + location.search) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      timers.current.forEach(clearTimeout);
      setLoading(true);
      const hold = reduce ? 150 : HOLD;
      timers.current = [
        window.setTimeout(() => {
          navigate(to);
          window.scrollTo(0, 0);
        }, hold),
        window.setTimeout(() => setLoading(false), hold + 250),
      ];
    },
    [navigate, location, reduce],
  );

  return (
    <TransitionCtx.Provider value={{ go, loading }}>
      {children}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[100] grid place-items-center bg-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] } }}
          >
            <div className="flex flex-col items-center gap-6">
              <img src="/img/logo.webp" alt="" className="size-16 rounded-full opacity-90" />
              <GooeyLoader primaryColor="#B9977A" secondaryColor="#D9DFC8" borderColor="#E4D7C6" className="text-[10px]" />
              <span className="font-display text-lg italic text-muted">ZAYTUN</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionCtx.Provider>
  );
}

export const usePageTransition = () => React.useContext(TransitionCtx);

/** Ссылка, которая показывает экран загрузки перед переходом */
export function TLink({
  to,
  onClick,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const { go } = usePageTransition();
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(to);
      }}
      {...props}
    />
  );
}
