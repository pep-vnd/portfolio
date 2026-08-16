import { useEffect, useRef } from 'react';
import { networkBus } from '../../lib/networkBus';
import styles from './NetworkBackground.module.css';

/* ─── Types ────────────────────────────────────────────── */
interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
  opacity: number;
  born: number;        // timestamp — for fade-in and age tracking
  dynamic: boolean;    // was this spawned by a click?
  life: number;        // 0-1, starts at 0, rises to 1 then stays
}

interface ClickRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  born: number;
}

/* ─── Constants ─────────────────────────────────────────── */
const DESKTOP_BASE = 65;
const MOBILE_BASE  = 22;
const MAX_DYNAMIC  = 40;          // max click-spawned nodes
const MAX_TOTAL    = DESKTOP_BASE + MAX_DYNAMIC;

const CONNECTION_DIST = 145;
const MOUSE_ATTRACT_DIST = 130;   // gentle attraction
const MOUSE_ATTRACT_STRENGTH = 0.018;
const BASE_SPEED  = 0.22;
const MAX_SPEED   = BASE_SPEED * 3.5;
const DAMPING     = 0.994;

const RIPPLE_SPEED   = 3.5;       // px per frame
const RIPPLE_MAXR    = 90;
const CLICK_CHILDREN = { min: 3, max: 7 };
const CHILD_SPREAD   = 70;

/* ─── Helpers ────────────────────────────────────────────── */
function isMobile() { return window.innerWidth < 768; }
function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function rand(lo: number, hi: number) { return lo + Math.random() * (hi - lo); }

let idCounter = 0;
function makeNode(
  x: number, y: number,
  dynamic = false,
  vx = (Math.random() - 0.5) * BASE_SPEED,
  vy = (Math.random() - 0.5) * BASE_SPEED,
): Node {
  return {
    x, y, vx, vy,
    radius: rand(0.8, 2.2),
    baseOpacity: rand(0.25, 0.65),
    opacity: 0,
    born: performance.now(),
    dynamic,
    life: 0,
  };
  void idCounter; // suppress lint
}

/* ─── Component ─────────────────────────────────────────── */
export default function NetworkBackground() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const mouseRef     = useRef({ x: -2000, y: -2000 });
  const nodesRef     = useRef<Node[]>([]);
  const ripplesRef   = useRef<ClickRipple[]>([]);
  const rafRef       = useRef<number>(0);
  const dimRef       = useRef({ w: 0, h: 0, dpr: 1 });
  const eliteModeRef = useRef(false);         // 1337 mode
  const eliteTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pulseRef     = useRef(0);             // 0-1 command pulse

  useEffect(() => {
    if (reducedMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /* ── Resize ─────────────────────────────────────────── */
    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w   = window.innerWidth;
      const h   = window.innerHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimRef.current = { w, h, dpr };
    }

    /* ── Init base nodes ────────────────────────────────── */
    function initNodes() {
      const count = isMobile() ? MOBILE_BASE : DESKTOP_BASE;
      const { w, h } = dimRef.current;
      nodesRef.current = Array.from({ length: count }, () =>
        makeNode(rand(0, w), rand(0, h))
      );
      // Instant-set life so they're visible immediately
      nodesRef.current.forEach((n) => { n.life = 1; n.opacity = n.baseOpacity; });
    }

    /* ── Click expand ───────────────────────────────────── */
    function spawnClickCluster(cx: number, cy: number) {
      const nodes    = nodesRef.current;
      const dynamic  = nodes.filter((n) => n.dynamic);
      const childCount = Math.floor(rand(CLICK_CHILDREN.min, CLICK_CHILDREN.max + 1));

      // Evict oldest dynamic nodes if over limit
      const needed = childCount + 1; // +1 for center
      if (dynamic.length + needed > MAX_DYNAMIC) {
        const toRemove = dynamic.length + needed - MAX_DYNAMIC;
        // Sort by born time, remove oldest
        dynamic.sort((a, b) => a.born - b.born);
        const removeSet = new Set(dynamic.slice(0, toRemove));
        nodesRef.current = nodes.filter((n) => !removeSet.has(n));
      }

      // Enforce absolute cap
      while (nodesRef.current.length >= MAX_TOTAL) {
        const idx = nodesRef.current.findIndex((n) => n.dynamic);
        if (idx === -1) break;
        nodesRef.current.splice(idx, 1);
      }

      // Center node (stays near click)
      nodesRef.current.push(makeNode(cx, cy, true, 0, 0));

      // Children radiating outward
      for (let i = 0; i < childCount; i++) {
        const angle = (i / childCount) * Math.PI * 2 + rand(-0.3, 0.3);
        const dist  = rand(20, CHILD_SPREAD);
        const tx    = cx + Math.cos(angle) * dist;
        const ty    = cy + Math.sin(angle) * dist;
        const speed = rand(0.05, 0.18);
        nodesRef.current.push(makeNode(tx, ty, true,
          Math.cos(angle) * speed * 0.5,
          Math.sin(angle) * speed * 0.5,
        ));
      }

      // Ripple
      ripplesRef.current.push({
        x: cx, y: cy,
        radius: 0, maxRadius: RIPPLE_MAXR,
        alpha: 0.5, born: performance.now(),
      });
    }

    /* ── Draw frame ─────────────────────────────────────── */
    function draw() {
      const { w, h }  = dimRef.current;
      ctx!.clearRect(0, 0, w, h);

      const nodes   = nodesRef.current;
      const mx      = mouseRef.current.x;
      const my      = mouseRef.current.y;
      const elite   = eliteModeRef.current;
      const pulse   = pulseRef.current;
      const now     = performance.now();

      // Glow multiplier
      const glowMult = elite ? 2.2 : 1 + pulse * 0.8;

      /* Update nodes */
      nodes.forEach((node) => {
        // Fade-in life
        const age = (now - node.born) / 600;
        node.life = Math.min(1, age);
        node.opacity = node.baseOpacity * node.life;

        // Gentle mouse attraction (not repulsion)
        const dx   = mx - node.x;
        const dy   = my - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_ATTRACT_DIST && dist > 0) {
          const strength = (1 - dist / MOUSE_ATTRACT_DIST) * MOUSE_ATTRACT_STRENGTH;
          node.vx += (dx / dist) * strength;
          node.vy += (dy / dist) * strength;
        }

        // Clamp speed
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > MAX_SPEED) {
          node.vx = (node.vx / speed) * MAX_SPEED;
          node.vy = (node.vy / speed) * MAX_SPEED;
        }

        // Damping
        node.vx *= DAMPING;
        node.vy *= DAMPING;

        node.x += node.vx;
        node.y += node.vy;

        // Wrap
        if (node.x < -15) node.x = w + 15;
        if (node.x > w + 15) node.x = -15;
        if (node.y < -15) node.y = h + 15;
        if (node.y > h + 15) node.y = -15;
      });

      /* Connections */
      const connDist  = elite ? CONNECTION_DIST * 1.4 : CONNECTION_DIST;
      const baseAlpha = elite ? 0.18 : 0.11;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= connDist) continue;

          const proximity = 1 - dist / connDist;

          // Mouse boost on midpoint
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          const mdx  = midX - mx, mdy = midY - my;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          const boost = mdist < 160 ? (1 - mdist / 160) * 0.35 * glowMult : 0;

          const alpha = (proximity * baseAlpha + boost) * Math.min(a.life, b.life);

          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.strokeStyle = `rgba(94,255,216,${Math.min(alpha, 0.7)})`;
          ctx!.lineWidth   = elite ? 0.7 : 0.5;
          ctx!.stroke();
        }
      }

      /* Nodes */
      nodes.forEach((node) => {
        const dx   = node.x - mx, dy = node.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const halo = dist < 130 ? (1 - dist / 130) * 0.45 * glowMult : 0;
        const alpha = Math.min((node.opacity + halo) * (elite ? 1.5 : 1), 1);

        ctx!.beginPath();
        ctx!.arc(node.x, node.y, node.radius * (elite ? 1.3 : 1), 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(94,255,216,${alpha})`;
        ctx!.fill();
      });

      /* Ripples */
      ripplesRef.current = ripplesRef.current.filter((r) => {
        r.radius += RIPPLE_SPEED;
        r.alpha  -= 0.018;
        if (r.alpha <= 0 || r.radius >= r.maxRadius) return false;

        ctx!.beginPath();
        ctx!.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(94,255,216,${r.alpha})`;
        ctx!.lineWidth   = 1;
        ctx!.stroke();
        return true;
      });

      /* Command pulse decay */
      if (pulseRef.current > 0) {
        pulseRef.current = Math.max(0, pulseRef.current - 0.015);
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    /* ── Event bus ──────────────────────────────────────── */
    const unsubBus = networkBus.on((event) => {
      switch (event.type) {
        case 'click-expand': {
          const e = event as { type: string; x: number; y: number };
          spawnClickCluster(e.x, e.y);
          break;
        }
        case 'elite-mode': {
          const e = event as { type: string; active: boolean };
          eliteModeRef.current = e.active;
          if (!e.active) {
            pulseRef.current = 0;
          }
          break;
        }
        case 'command-pulse':
          pulseRef.current = 1;
          break;
        case 'signal': {
          const e = event as { type: string; x: number; y: number };
          ripplesRef.current.push({
            x: e.x, y: e.y,
            radius: 0, maxRadius: 60,
            alpha: 0.4, born: performance.now(),
          });
          break;
        }
      }
    });

    /* ── Canvas click ───────────────────────────────────── */
    function handleCanvasClick(e: MouseEvent) {
      // Only fire on the canvas itself, not on overlaid elements
      if (e.target !== canvas) return;
      spawnClickCluster(e.clientX, e.clientY);
    }

    /* ── Touch ──────────────────────────────────────────── */
    function handleTouch(e: TouchEvent) {
      if (e.target !== canvas) return;
      const t = e.touches[0];
      if (!t) return;
      // Simplified expansion on mobile
      ripplesRef.current.push({
        x: t.clientX, y: t.clientY,
        radius: 0, maxRadius: 60,
        alpha: 0.4, born: performance.now(),
      });
    }

    /* ── Mouse move ─────────────────────────────────────── */
    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    /* ── Mouse leave ────────────────────────────────────── */
    function handleMouseLeave() {
      mouseRef.current = { x: -2000, y: -2000 };
    }

    /* ── Resize ─────────────────────────────────────────── */
    function handleResize() {
      resize();
      const { w, h } = dimRef.current;
      nodesRef.current.forEach((n) => {
        n.x = Math.min(n.x, w);
        n.y = Math.min(n.y, h);
      });
    }

    resize();
    initNodes();
    draw();

    window.addEventListener('click',       handleCanvasClick, { passive: true });
    window.addEventListener('touchstart',  handleTouch,       { passive: true });
    window.addEventListener('mousemove',   handleMouseMove,   { passive: true });
    window.addEventListener('mouseleave',  handleMouseLeave,  { passive: true });
    window.addEventListener('resize',      handleResize,      { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(eliteTimerRef.current);
      unsubBus();
      window.removeEventListener('click',      handleCanvasClick);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('mousemove',  handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize',     handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-hidden="true"
    />
  );
}
