import { useEffect, useMemo, useState } from 'react';

interface UseScrollSpyOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

/**
 * Stable scroll spy hook with dynamic root support
 */
export function useScrollSpy(sectionIds: string[], { threshold = 0.5, rootMargin = '0px 0px -50% 0px', root }: UseScrollSpyOptions = {}) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observedIds = useMemo(() => sectionIds.slice(), [sectionIds]);

  useEffect(() => {
    if (!observedIds.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;

        for (const entry of entries) {
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        }

        if (best && best.intersectionRatio >= threshold) {
          setActiveSection(best.target.id);
        }
      },
      {
        root,
        rootMargin,
        threshold: [0, threshold, 1],
      }
    );

    const elements = observedIds.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [observedIds, root, rootMargin, threshold]);

  return activeSection;
}

/**
 * ScrollToSection with support for custom scroll container
 */
export function useScrollToSection(scrollContainer?: HTMLElement | null) {
  const scrollToSection = (id: string, offset = 0) => {
    const el = document.getElementById(id);
    if (!el) return;

    const top = el.offsetTop - offset;

    if (scrollContainer) {
      scrollContainer.scrollTo({ top, behavior: 'smooth' });
      return;
    }

    window.scrollTo({ top, behavior: 'smooth' });
  };

  return { scrollToSection };
}
