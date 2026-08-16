import { useEffect, useRef, useState } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const posRef = useRef({ x: -200, y: -200 });
  const haloPos = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Hide on touch devices
    if ('ontouchstart' in window) return;

    const dot = dotRef.current;
    const halo = haloRef.current;
    if (!dot || !halo) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor="pointer"], .btn')) {
        setIsHovering(true);
      }
    };

    const onLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor="pointer"], .btn')) {
        setIsHovering(false);
      }
    };

    function animate() {
      const { x, y } = posRef.current;

      // Snap dot to cursor
      dot!.style.transform = `translate(${x - 4}px, ${y - 4}px)`;

      // Interpolate halo (lerp)
      haloPos.current.x += (x - haloPos.current.x) * 0.12;
      haloPos.current.y += (y - haloPos.current.y) * 0.12;
      halo!.style.transform = `translate(${haloPos.current.x - 20}px, ${haloPos.current.y - 20}px)`;

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className={`${styles.dot} ${isHovering ? styles.dotHover : ''}`}
        aria-hidden="true"
      />
      <div
        ref={haloRef}
        className={`${styles.halo} ${isHovering ? styles.haloHover : ''}`}
        aria-hidden="true"
      />
    </>
  );
}
