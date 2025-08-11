import React, { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  rootMargin?: string;
  minOnceVisibleMs?: number;
  placeholder?: React.ReactNode;
};

const LazyOnVisible: React.FC<Props> = ({
  children,
  rootMargin = "200px",
  minOnceVisibleMs = 50,
  placeholder = null,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || isVisible) return;
    const el = ref.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // small delay to avoid quick flicker when scrolling fast
          const t = setTimeout(() => setVisible(true), minOnceVisibleMs);
          return () => clearTimeout(t);
        }
      },
      { root: null, rootMargin, threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [isVisible, rootMargin, minOnceVisibleMs]);

  return <div ref={ref}>{isVisible ? children : placeholder}</div>;
};

export default LazyOnVisible;
