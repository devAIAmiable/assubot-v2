import { useEffect, useState } from 'react';

interface UseScrollSpyOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Hook to track which section is currently in view for scroll spy navigation
 */
export function useScrollSpy(sectionIds: string[], options: UseScrollSpyOptions = {}): string | null {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const { threshold = 0.5, rootMargin = '0px 0px -50% 0px' } = options;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let maxRatio = 0;
        let maxEntry: IntersectionObserverEntry | null = null;

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            maxEntry = entry;
          }
        });

        if (maxEntry && (maxEntry as IntersectionObserverEntry).intersectionRatio >= threshold) {
          setActiveSection((maxEntry as IntersectionObserverEntry).target.id);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds, options.threshold, options.rootMargin]);

  return activeSection;
}

/**
 * Hook to scroll to a specific section smoothly
 */
export function useScrollToSection() {
  const scrollToSection = (sectionId: string, offset = 0) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  return { scrollToSection };
}
