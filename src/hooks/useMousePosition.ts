import { useState, useEffect, useCallback, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);
  const pending = useRef<MousePosition>({ x: -200, y: -200 });

  const onMouseMove = useCallback((e: MouseEvent) => {
    pending.current = { x: e.clientX, y: e.clientY };
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        setPosition({ ...pending.current });
        rafRef.current = 0;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onMouseMove]);

  return position;
}
