import { useState, useEffect } from 'react';

const SECTIONS = ['about', 'projects', 'skills', 'certifications', 'htb', 'contact'];

export function useScrollSpy(): string {
  const [active, setActive] = useState('');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const sectionMap = new Map<string, number>();

    const callback = (id: string) => (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sectionMap.set(id, entry.intersectionRatio);
        } else {
          sectionMap.delete(id);
        }
        // Pick the section with the highest intersection ratio
        let maxRatio = 0;
        let maxId = '';
        sectionMap.forEach((ratio, sid) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            maxId = sid;
          }
        });
        setActive(maxId);
      });
    };

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(callback(id), {
        threshold: [0, 0.1, 0.25, 0.5],
        rootMargin: '-80px 0px -40% 0px',
      });
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return active;
}
