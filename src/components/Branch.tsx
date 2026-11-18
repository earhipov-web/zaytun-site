import type * as React from "react";

/** Ветвь с нераскрывшимися бутонами: растёт из левого нижнего угла по диагонали */
const buds: { x: number; y: number; r: number; s?: number; d: number }[] = [
  { x: 58, y: 688, r: -42, d: 1.0 },
  { x: 254, y: 666, r: 62, s: 0.9, d: 1.2 },
  { x: 206, y: 498, r: -30, d: 1.45 },
  { x: 424, y: 478, r: 78, s: 0.85, d: 1.65 },
  { x: 356, y: 318, r: -18, d: 1.85 },
  { x: 566, y: 298, r: 72, s: 0.9, d: 2.05 },
  { x: 506, y: 138, r: -14, s: 0.8, d: 2.25 },
  { x: 664, y: 56, r: 40, s: 1.1, d: 2.5 },
];

const leaves: { x: number; y: number; r: number; d: number }[] = [
  { x: 132, y: 732, r: 120, d: 1.1 },
  { x: 318, y: 530, r: -60, d: 1.5 },
  { x: 432, y: 352, r: 115, d: 1.9 },
  { x: 610, y: 140, r: -70, d: 2.3 },
];

export function Branch() {
  return (
    <div aria-hidden className="pointer-events-none fixed bottom-0 left-0 z-0 h-[78svh] w-[92vw] max-w-[720px] opacity-[0.26] md:h-[92svh] md:opacity-[0.3]">
      <svg viewBox="0 0 700 900" preserveAspectRatio="xMinYMax meet" className="h-full w-full">
        <g fill="none" stroke="#8C6B52" strokeLinecap="round">
          <path className="branch-stroke" pathLength={1} strokeWidth={7}
            d="M-20 915 C 110 830, 120 720, 220 620 S 400 470, 430 360 S 600 170, 664 58" />
          <path className="branch-stroke" pathLength={1} strokeWidth={3} d="M114 768 C 98 742, 82 716, 58 688" />
          <path className="branch-stroke" pathLength={1} strokeWidth={3} d="M163 690 C 196 692, 228 682, 254 666" />
          <path className="branch-stroke" pathLength={1} strokeWidth={3} d="M271 572 C 248 548, 226 524, 206 498" />
          <path className="branch-stroke" pathLength={1} strokeWidth={2.6} d="M362 482 C 384 484, 396 484, 424 478" />
          <path className="branch-stroke" pathLength={1} strokeWidth={2.6} d="M416 398 C 392 372, 370 346, 356 318" />
          <path className="branch-stroke" pathLength={1} strokeWidth={2.4} d="M457 302 C 494 304, 538 300, 566 298" />
          <path className="branch-stroke" pathLength={1} strokeWidth={2.2} d="M531 212 C 520 190, 516 164, 506 138" />
        </g>
        {leaves.map((l, i) => (
          <g key={`l${i}`} transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}>
            <g className="branch-bud" style={{ "--d": `${l.d}s` } as React.CSSProperties}>
              <path d="M0 0 C 10 -10, 30 -12, 44 0 C 30 10, 10 10, 0 0 Z" fill="#B7A98A" />
              <path d="M2 0 L 40 0" stroke="#9B8A68" strokeWidth={1} />
            </g>
          </g>
        ))}
        {buds.map((b, i) => (
          <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.r}) scale(${b.s ?? 1})`}>
            <g className="branch-bud" style={{ "--d": `${b.d}s` } as React.CSSProperties}>
              <path d="M0 0 C -9 -8 -10 -24 0 -36 C 10 -24 9 -8 0 0 Z" fill="#E9CDBF" stroke="#B48E74" strokeWidth={1.4} />
              <path d="M0 -4 C -3 -14 -3 -24 0 -33" stroke="#D2AE9B" strokeWidth={1.2} fill="none" />
              <path d="M-8 -3 C -6 -11 -3 -12 0 -8 C 3 -12 6 -11 8 -3 C 4 2 -4 2 -8 -3 Z" fill="#9C8466" />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
