import { useState, useEffect, useRef, useCallback } from 'react';
import { networkBus } from '../../lib/networkBus';
import styles from './Terminal.module.css';

/* ─── Types ─────────────────────────────────────────────── */
type LineType = 'cmd' | 'output' | 'progress' | 'blank' | 'menu' | 'success' | 'error';

interface Line {
  id: number;
  type: LineType;
  text: string;
  progress?: number;
}

/* ─── CV ────────────────────────────────────────────────── */
const CV_PATH = import.meta.env.BASE_URL + 'Jose-Carmona-Vendoiro-CV.pdf';

async function cvExists(): Promise<boolean> {
  try {
    const res = await fetch(CV_PATH, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

function triggerDownload() {
  const a = document.createElement('a');
  a.href = CV_PATH;
  a.download = 'Jose_Carmona_Vendoiro_CV.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ─── Navigation ─────────────────────────────────────────── */
function smoothScrollTo(id: string) {
  setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80);
}

/* ─── Menu ───────────────────────────────────────────────── */
const MENU_LINES = [
  '┌──────────────────────────────────────┐',
  '│  PORTFOLIO COMMAND CENTER            │',
  '├──────────────────────────────────────┤',
  '│  [1] About me                        │',
  '│  [2] Security Projects               │',
  '│  [3] Skills & Certifications         │',
  '│  [4] Hack The Box Labs               │',
  '│  [5] Download CV                     │',
  '│  [6] Contact                         │',
  '│                                      │',
  '│  Type a number or "help"             │',
  '└──────────────────────────────────────┘',
];

/* ─── ID counter ──────────────────────────────────────────── */
let _id = 0;
const uid = () => ++_id;

/* ─── Intro definition ───────────────────────────────────── */
type StepKind = 'cmd' | 'out' | 'progress' | 'blank' | 'menu';

interface IntroStep {
  kind: StepKind;
  text?: string;
  delay: number;   // pause BEFORE this step
  speed?: number;  // ms per character (for cmd)
}

// Slower, more deliberate timing
const INTRO: IntroStep[] = [
  { kind: 'cmd',      text: '$ initializing_portfolio',                      delay: 400,  speed: 55 },
  { kind: 'blank',    delay: 120 },
  { kind: 'out',      text: 'Loading security environment...',                delay: 0 },
  { kind: 'progress', delay: 120 },
  { kind: 'blank',    delay: 150 },
  { kind: 'cmd',      text: '$ whoami',                                       delay: 350,  speed: 55 },
  { kind: 'out',      text: 'Jose Carmona Vendoiro',                          delay: 120 },
  { kind: 'blank',    delay: 150 },
  { kind: 'cmd',      text: '$ status',                                       delay: 350,  speed: 55 },
  { kind: 'out',      text: 'Computer Engineering · Cybersecurity · IT Project Management', delay: 120 },
  { kind: 'blank',    delay: 100 },
  { kind: 'out',      text: 'System ready.',                                  delay: 200 },
  { kind: 'blank',    delay: 120 },
  { kind: 'out',      text: 'Type a command or select an option:',            delay: 0 },
  { kind: 'blank',    delay: 120 },
  { kind: 'menu',     delay: 120 },
  { kind: 'blank',    delay: 80 },
];

/* ──────────────────────────────────────────────────────────
   Terminal Component
────────────────────────────────────────────────────────── */
export default function Terminal() {
  const [lines, setLines]     = useState<Line[]>([]);
  const [input, setInput]     = useState('');
  const [ready, setReady]     = useState(false);
  const [focused, setFocused] = useState(false);

  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  // Generation counter — each new mount gets a unique gen.
  // When cleanup runs it increments the counter, invalidating
  // any in-flight async work from the previous run.
  const genRef     = useRef(0);
  const historyRef = useRef<string[]>([]);
  const histIdxRef = useRef(-1);

  /* ── Auto-scroll ──────────────────────────────────────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [lines]);

  /* ── Auto-focus when prompt appears ──────────────────── */
  useEffect(() => {
    if (ready) setTimeout(() => inputRef.current?.focus(), 100);
  }, [ready]);

  /* ── Console hint ─────────────────────────────────────── */
  useEffect(() => {
    console.log('%c Welcome, operator.', 'color:#5EFFD8;font-family:monospace;font-size:14px;font-weight:700');
    console.log('%c Try: "sudo hire jose"', 'color:#7A8FAD;font-family:monospace;font-size:12px');
  }, []);

  /* ── Helpers (access latest setLines via closure) ─────── */

  // Cancellable sleep — resolves after ms but also tracks generation.
  // If the generation has changed by the time it resolves, callers
  // check isAlive() and bail.
  function sleep(ms: number): Promise<void> {
    return new Promise((res) => setTimeout(res, ms));
  }

  function pushLines(...items: Omit<Line, 'id'>[]) {
    setLines((prev) => [...prev, ...items.map((l) => ({ ...l, id: uid() }))]);
  }

  /* ── Typing animation ─────────────────────────────────── */
  async function typeLine(
    text: string,
    speed: number,
    type: LineType,
    isAlive: () => boolean,
  ): Promise<void> {
    const lineId = uid();
    setLines((prev) => [...prev, { id: lineId, type, text: '' }]);
    for (let i = 1; i <= text.length; i++) {
      await sleep(speed);
      if (!isAlive()) return;
      setLines((prev) =>
        prev.map((l) => (l.id === lineId ? { ...l, text: text.slice(0, i) } : l))
      );
    }
  }

  /* ── Progress bar animation ───────────────────────────── */
  async function animProgress(fast: boolean, isAlive: () => boolean): Promise<void> {
    const lineId = uid();
    setLines((prev) => [...prev, { id: lineId, type: 'progress', text: '', progress: 0 }]);
    let p = 0;
    const stepMs = fast ? 38 : 90;
    while (p < 100) {
      await sleep(stepMs);
      if (!isAlive()) return;
      p = Math.min(100, p + (fast ? 28 : Math.random() * 12 + 4));
      setLines((prev) =>
        prev.map((l) => (l.id === lineId ? { ...l, progress: p } : l))
      );
    }
    await sleep(fast ? 60 : 200);
  }

  /* ── Intro sequence ───────────────────────────────────── */
  useEffect(() => {
    // Increment generation — any leftover async work from a previous
    // mount (e.g. StrictMode double-invoke) will see a stale gen and stop.
    genRef.current += 1;
    const myGen = genRef.current;
    const isAlive = () => genRef.current === myGen;

    setLines([]);
    setReady(false);

    async function runIntro() {
      for (const step of INTRO) {
        if (!isAlive()) return;

        if (step.delay > 0) {
          await sleep(step.delay);
          if (!isAlive()) return;
        }

        switch (step.kind) {
          case 'cmd':
            await typeLine(step.text ?? '', step.speed ?? 55, 'cmd', isAlive);
            break;
          case 'out':
            pushLines({ type: 'output', text: step.text ?? '' });
            break;
          case 'progress':
            await animProgress(false, isAlive);
            break;
          case 'blank':
            pushLines({ type: 'blank', text: '' });
            break;
          case 'menu':
            pushLines(...MENU_LINES.map((t) => ({ type: 'menu' as LineType, text: t })));
            break;
        }
      }

      if (isAlive()) setReady(true);
    }

    runIntro();

    return () => {
      // Invalidate this run — any pending await will check isAlive() and stop
      genRef.current += 1;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── CV download sequence ─────────────────────────────── */
  const downloadCV = useCallback(async () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const exists = await cvExists();

    if (!exists) {
      setLines((prev) => [
        ...prev,
        { id: uid(), type: 'error',  text: 'CV file not found.' },
        { id: uid(), type: 'output', text: 'Add Jose-Carmona-Vendoiro-CV.pdf to /public.' },
        { id: uid(), type: 'blank',  text: '' },
      ]);
      return;
    }

    if (prefersReduced) {
      triggerDownload();
      setLines((prev) => [
        ...prev,
        { id: uid(), type: 'success', text: '✓ Download started.' },
        { id: uid(), type: 'blank',   text: '' },
      ]);
      return;
    }

    // Animated sequence
    const addLine = (type: LineType, text: string) =>
      setLines((prev) => [...prev, { id: uid(), type, text }]);

    addLine('output', 'Requesting document...');
    await sleep(320);
    addLine('output', 'Verifying access...');
    await sleep(320);
    addLine('output', 'CV located.');
    addLine('blank', '');
    addLine('output', 'Downloading Jose_Carmona_Vendoiro_CV.pdf...');
    await sleep(80);

    // Inline progress for CV (doesn't need generation check — user-triggered)
    const lineId = uid();
    setLines((prev) => [...prev, { id: lineId, type: 'progress', text: '', progress: 0 }]);
    let p = 0;
    while (p < 100) {
      await sleep(38);
      p = Math.min(100, p + 28);
      setLines((prev) =>
        prev.map((l) => (l.id === lineId ? { ...l, progress: p } : l))
      );
    }
    await sleep(60);

    triggerDownload();
    setLines((prev) => [
      ...prev,
      { id: uid(), type: 'success', text: '✓ Download complete.' },
      { id: uid(), type: 'blank',   text: '' },
    ]);
  }, []);

  /* ── Execute a user command ───────────────────────────── */
  const execute = useCallback(async (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    historyRef.current.unshift(raw.trim());
    if (historyRef.current.length > 50) historyRef.current.pop();
    histIdxRef.current = -1;

    // Echo typed command
    setLines((prev) => [
      ...prev,
      { id: uid(), type: 'cmd', text: `jose@portfolio:~$ ${raw.trim()}` },
    ]);

    // Background pulse
    networkBus.emit({ type: 'command-pulse' });

    const add = (...items: Omit<Line, 'id'>[]) =>
      setLines((prev) => [...prev, ...items.map((l) => ({ ...l, id: uid() }))]);

    switch (cmd) {
      case '1': case 'about':
        add({ type: 'output', text: 'Opening profile...' }, { type: 'blank', text: '' });
        smoothScrollTo('about');
        break;

      case '2': case 'projects':
        add(
          { type: 'output', text: 'Loading security projects...' },
          { type: 'output', text: '3 case studies found.' },
          { type: 'blank',  text: '' },
        );
        smoothScrollTo('projects');
        break;

      case '3': case 'skills': case 'certifications':
        add({ type: 'output', text: 'Loading skills & certifications...' }, { type: 'blank', text: '' });
        smoothScrollTo('skills');
        break;

      case '4': case 'htb':
        add({ type: 'output', text: 'Connecting to Hack The Box...' }, { type: 'blank', text: '' });
        smoothScrollTo('htb');
        break;

      case '5': case 'cv':
        await downloadCV();
        break;

      case '6': case 'contact':
        add(
          { type: 'output', text: 'Opening secure communication channel...' },
          { type: 'blank',  text: '' },
        );
        smoothScrollTo('contact');
        break;

      case 'whoami':
        add(
          { type: 'output', text: 'Jose Carmona Vendoiro' },
          { type: 'output', text: 'Computer Engineering Student @ UCA' },
          { type: 'output', text: 'Cybersecurity | IT Project Management' },
          { type: 'blank',  text: '' },
        );
        break;

      case 'github':
        add(
          { type: 'output', text: 'Opening GitHub profile...' },
          { type: 'output', text: '→ github.com/pep-vnd' },
          { type: 'blank',  text: '' },
        );
        window.open('https://github.com/pep-vnd', '_blank', 'noopener,noreferrer');
        break;

      case 'help':
        add(...MENU_LINES.map((t) => ({ type: 'menu' as LineType, text: t })));
        add({ type: 'blank', text: '' });
        break;

      case 'clear':
        setLines([]);
        return;

      /* ── Easter eggs ──────────────────────────────────── */
      case 'sudo hire jose':
        add(
          { type: 'output',  text: '[sudo] evaluating candidate...' },
          { type: 'blank',   text: '' },
          { type: 'output',  text: '✓ Engineering background detected' },
          { type: 'output',  text: '✓ Cybersecurity mindset detected' },
          { type: 'output',  text: '✓ Security projects detected' },
          { type: 'output',  text: '✓ Continuous learning detected' },
          { type: 'blank',   text: '' },
          { type: 'success', text: 'ACCESS GRANTED' },
          { type: 'blank',   text: '' },
          { type: 'output',  text: 'Opening contact channel...' },
          { type: 'blank',   text: '' },
        );
        smoothScrollTo('contact');
        break;

      case '1337':
        add(
          { type: 'success', text: 'ELITE MODE UNLOCKED' },
          { type: 'output',  text: 'Network visualization enhanced.' },
          { type: 'blank',   text: '' },
        );
        networkBus.emit({ type: 'elite-mode', active: true });
        setTimeout(() => networkBus.emit({ type: 'elite-mode', active: false }), 6000);
        break;

      case 'ls projects/': case 'ls projects':
        add(
          { type: 'output', text: 'total 3' },
          { type: 'output', text: 'drwxr-xr-x  botium-toys-audit/' },
          { type: 'output', text: 'drwxr-xr-x  multimedia-dos-analysis/' },
          { type: 'output', text: 'drwxr-xr-x  healthcare-ransomware-journal/' },
          { type: 'blank',  text: '' },
        );
        break;

      case 'cat certifications.txt':
        add(
          { type: 'output', text: '# certifications.txt' },
          { type: 'output', text: 'Google Cybersecurity Professional Certificate — Jul 2026' },
          { type: 'output', text: 'IBM Cybersecurity Fundamentals — Mar 2026' },
          { type: 'blank',  text: '' },
        );
        break;

      default:
        add(
          { type: 'error',  text: `bash: ${raw.trim()}: command not found` },
          { type: 'output', text: "Type 'help' to see available commands." },
          { type: 'blank',  text: '' },
        );
    }
  }, [downloadCV]);

  /* ── Keyboard ─────────────────────────────────────────── */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = input.trim();
      setInput('');
      if (val) execute(val);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const h = historyRef.current;
      const idx = Math.min(histIdxRef.current + 1, h.length - 1);
      if (idx >= 0) { histIdxRef.current = idx; setInput(h[idx]); }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = Math.max(histIdxRef.current - 1, -1);
      histIdxRef.current = idx;
      setInput(idx === -1 ? '' : historyRef.current[idx]);
    }
  }, [input, execute]);

  /* ── Click body → focus input ─────────────────────────── */
  const handleBodyClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  /* ── Render ───────────────────────────────────────────── */
  return (
    <div
      className={`${styles.terminal} ${focused ? styles.focused : ''}`}
      role="region"
      aria-label="Interactive terminal — type help for commands"
    >
      {/* Title bar */}
      <div className={styles.titleBar}>
        <div className={styles.controls} aria-hidden="true">
          <span className={`${styles.dot} ${styles.red}`} />
          <span className={`${styles.dot} ${styles.yellow}`} />
          <span className={`${styles.dot} ${styles.green}`} />
        </div>
        <span className={styles.title}>jose@portfolio:~</span>
        <span className={styles.titleRight}>zsh</span>
      </div>

      {/* Output + input */}
      <div
        className={styles.body}
        onClick={handleBodyClick}
        aria-live="polite"
        aria-atomic="false"
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className={`${styles.line} ${styles[line.type] ?? ''}`}
          >
            {line.type === 'progress' ? (
              <div className={styles.progressBar}>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${Math.round(line.progress ?? 0)}%` }}
                  />
                </div>
                <span className={styles.progressPercent}>
                  {Math.round(line.progress ?? 0)}%
                </span>
              </div>
            ) : line.type === 'blank' ? (
              <>&nbsp;</>
            ) : (
              <span>{line.text}</span>
            )}
          </div>
        ))}

        {ready && (
          <div className={styles.inputLine}>
            <span className={styles.prompt}>jose@portfolio:~$ </span>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-label="Terminal command input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="send"
            />
          </div>
        )}

        <div ref={bottomRef} style={{ height: 1 }} />
      </div>
    </div>
  );
}
