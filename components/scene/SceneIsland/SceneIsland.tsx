'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import StateCard from '@/components/scene/StateCard';
import PixelButton from '@/components/ui/PixelButton';
import callouts from '@/lib/scene/poster-callouts.json';
import type { SceneEngine } from '@/lib/scene/engine';
import type { AgentCard, Arm } from '@/lib/scene/sim';

const W = 432;
const H = 280;

type Tally = { started: number; writingFirst: number; submitted: number };

type Props = {
  mode: 'life' | 'ab';
  label: string;
  priority?: boolean;
  arm?: Arm;
  onTally?: (tally: Tally) => void;
  /** Max share of the viewport height the scene may take. */
  maxVh?: number;
};

type Phase = 'poster' | 'running' | 'failed';

const CALLOUT_TEXT: Record<string, string> = {
  frustrated: 'Hit friction',
  done: 'Task done',
  tired: 'Getting tired',
};

const REDUCED = '(prefers-reduced-motion: reduce)';

function staticPreferred(): boolean {
  const reduced = window.matchMedia?.(REDUCED).matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return Boolean(reduced || saveData || typeof IntersectionObserver === 'undefined');
}

function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia?.(REDUCED);
  mq?.addEventListener?.('change', onChange);
  return () => mq?.removeEventListener?.('change', onChange);
}

/** Reduced motion, save-data or no observers: keep the still. The server always renders the poster. */
function useStill(): boolean {
  return useSyncExternalStore(subscribeMotion, staticPreferred, () => false);
}

/** Device pixels per scene pixel, kept an integer so the pixel art stays crisp. */
function scaleFor(width: number, maxVh: number): number {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const maxCss = (window.innerHeight * maxVh) / H;
  let n = Math.floor((Math.min(width, W * maxCss) * dpr) / W);
  // small screens: the nearest integer scale at or just above the box width, centre-cropped
  if (n / dpr < 1) n = Math.ceil((width * dpr) / W);
  return Math.max(1, n) / dpr;
}

export default function SceneIsland({ mode, label, priority = false, arm, onTally, maxVh = 0.64 }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const engine = useRef<SceneEngine | null>(null);
  const pinned = useRef(false);
  const [phase, setPhase] = useState<Phase>('poster');
  const [scale, setScale] = useState<number | null>(null);
  const [card, setCard] = useState<AgentCard | null>(null);
  const lastCard = useRef(0);
  const onTallyRef = useRef(onTally);
  useEffect(() => {
    onTallyRef.current = onTally;
  }, [onTally]);
  const still = useStill();

  const poster = mode === 'life' ? '/scene/poster.png' : '/scene/poster-ab.png';

  // integer scaling
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const update = () => setScale(scaleFor(el.clientWidth, maxVh));
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [maxVh]);

  const onSelected = useCallback((next: AgentCard | null, x: number, y: number) => {
    const el = cardRef.current;
    const box = canvas.current;
    if (el && box && next && wrap.current) {
      const outer = wrap.current.getBoundingClientRect();
      const inner = box.getBoundingClientRect();
      const k = inner.width / W;
      const left = Math.min(Math.max(inner.left - outer.left + x * k, 136), outer.width - 136);
      const top = inner.top - outer.top + (y - 24) * k;
      el.style.setProperty('--x', `${left}px`);
      el.style.setProperty('--y', `${top}px`);
    }
    const now = performance.now();
    if (!next || now - lastCard.current > 250 || next.id !== cardIdRef.current) {
      lastCard.current = now;
      cardIdRef.current = next?.id ?? null;
      setCard(next);
    }
  }, []);
  const cardIdRef = useRef<number | null>(null);

  // load the engine when the scene is visible and the browser is idle
  useEffect(() => {
    if (still) return;
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    let cancelled = false;
    let visible = false;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    const IDLE_AFTER = 45_000;

    const resume = () => {
      if (engine.current && visible && !document.hidden) engine.current.start();
    };
    const pause = () => engine.current?.stop();
    const bumpIdle = () => {
      clearTimeout(idleTimer);
      resume();
      idleTimer = setTimeout(pause, IDLE_AFTER);
    };

    let booting = false;
    const boot = async () => {
      if (booting) return;
      booting = true;
      try {
        const { SceneEngine } = await import('@/lib/scene/engine');
        if (cancelled) return;
        engine.current = await SceneEngine.create(cv, {
          mode,
          population: window.innerWidth < 768 ? (mode === 'life' ? 12 : 8) : mode === 'life' ? 24 : 12,
          seed: mode === 'life' ? 42 : 7,
          arm,
          onTally: (t) => onTallyRef.current?.(t),
          onSelected,
        });
        if (cancelled) return engine.current.destroy();
        setPhase('running');
        bumpIdle();
      } catch {
        setPhase('failed');
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) return pause();
        if (engine.current) return bumpIdle();
        // after the document has loaded and the main thread is free: the poster already did the job
        const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
        const schedule = () => (idle ? idle(boot, { timeout: 4000 }) : setTimeout(boot, 800));
        if (document.readyState === 'complete') schedule();
        else window.addEventListener('load', schedule, { once: true });
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(el);
    const onVisibility = () => (document.hidden ? pause() : resume());
    document.addEventListener('visibilitychange', onVisibility);
    const activity = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'wheel', 'touchstart'] as const;
    for (const e of activity) window.addEventListener(e, bumpIdle, { passive: true });

    return () => {
      cancelled = true;
      io.disconnect();
      clearTimeout(idleTimer);
      document.removeEventListener('visibilitychange', onVisibility);
      for (const e of activity) window.removeEventListener(e, bumpIdle);
      engine.current?.destroy();
      engine.current = null;
    };
    // engine options are fixed for the island's life; arm changes go through setArm below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, onSelected, still]);

  useEffect(() => {
    if (arm && engine.current) engine.current.setArm(arm);
  }, [arm]);

  const toCanvas = (e: React.PointerEvent): [number, number] | null => {
    const box = canvas.current?.getBoundingClientRect();
    if (!box) return null;
    return [((e.clientX - box.left) / box.width) * W, ((e.clientY - box.top) / box.height) * H];
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || pinned.current || !engine.current) return;
    const p = toCanvas(e);
    if (p) engine.current.select(...p);
  };
  const onPointerLeave = () => {
    if (!pinned.current) engine.current?.select(null);
  };
  const onClick = (e: React.PointerEvent) => {
    if (!engine.current) return;
    const p = toCanvas(e);
    if (!p) return;
    const id = engine.current.select(...p);
    pinned.current = id !== null;
  };

  return (
    <div
      ref={wrap}
      data-scene={mode}
      className="relative w-full overflow-hidden"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerUp={onClick}
    >
      <div
        aria-hidden="true"
        className="relative left-1/2 aspect-[432/280] w-[max(100%,432px)] max-w-none -translate-x-1/2 md:w-[min(100%,864px)]"
        style={scale ? { width: W * scale } : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt=""
          width={W}
          height={H}
          className="pixelated absolute inset-0 size-full select-none"
          fetchPriority={priority ? 'high' : 'auto'}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
        />
        <canvas
          ref={canvas}
          width={W}
          height={H}
          className={`pixelated absolute inset-0 size-full transition-opacity duration-500 ${phase === 'running' ? 'opacity-100' : 'opacity-0'}`}
        />
        {(still || phase === 'failed') &&
          mode === 'life' &&
          callouts.callouts.map((c) => (
            <span
              key={c.label}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${(c.x / W) * 100}%`, top: `${((c.y - 10) / H) * 100}%` }}
            >
              <span className="block border-2 border-ink bg-paper-raised px-1.5 py-1 font-pixel text-[0.625rem] leading-tight whitespace-nowrap shadow-[2px_2px_0_var(--color-ink)]">
                {CALLOUT_TEXT[c.kind]} · R {c.R.toFixed(2)} F {c.F.toFixed(2)} M {c.M.toFixed(2)}
              </span>
              <span className="mx-auto block h-3 w-0.5 bg-ink" />
            </span>
          ))}
      </div>

      <div
        ref={cardRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-10 max-md:inset-x-4 max-md:top-auto max-md:bottom-3 md:w-64 md:translate-x-[calc(var(--x,0px)-50%)] md:translate-y-[calc(var(--y,0px)-100%)]"
      >
        {card && <StateCard card={card} />}
      </div>

      {phase === 'running' && (
        <div
          className="absolute bottom-3 -translate-x-full max-md:hidden"
          style={{ left: scale ? `calc(50% + ${(W * scale) / 2}px - 12px)` : 'calc(100% - 12px)' }}
          onPointerUp={(e) => e.stopPropagation()}
        >
          <PixelButton
            size="sm"
            variant="secondary"
            onClick={() => {
              pinned.current = true;
              engine.current?.selectNext();
            }}
          >
            Inspect a person
          </PixelButton>
        </div>
      )}
      <span className="sr-only">{label}</span>
      <span className="sr-only" role="status" aria-live="polite">
        {card ? `${card.label}: ${card.task} on a ${card.device}, risk of leaving ${card.risk}.` : ''}
      </span>
    </div>
  );
}
