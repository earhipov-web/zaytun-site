import * as React from "react";
import { cn } from "@/lib/utils";

function useInView<T extends Element>() {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

/** Фото, которое «выплывает» из песочного фона при появлении на экране */
export function RevealImage({
  src,
  alt,
  className,
  imgClassName,
  delay = 0,
  eager,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  delay?: number;
  eager?: boolean;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [loaded, setLoaded] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  React.useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth) return setLoaded(true);
    // страховка: если событие load потерялось, показываем фото всё равно
    const t = window.setTimeout(() => setLoaded(true), 2500);
    img.decode?.().then(() => setLoaded(true)).catch(() => {});
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div
      ref={ref}
      className={cn("reveal-img", inView && loaded && "is-in", className)}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  id,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref as React.Ref<never>}
      id={id}
      className={cn("reveal", inView && "is-in", className)}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
