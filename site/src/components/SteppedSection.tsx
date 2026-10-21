import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import styles from "./SteppedSection.module.css";

type SteppedSectionProps = {
  id: string;
  steps: ReactNode[];
  bgClassName: string;
  header: ReactNode;
};

type CarouselState = {
  active: number;
  previous: number;
  direction: "forward" | "back";
};

export default function SteppedSection({
  id,
  steps,
  bgClassName,
  header,
}: SteppedSectionProps) {
  const [state, setState] = useState<CarouselState>({
    active: 0,
    previous: 0,
    direction: "forward",
  });
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchAxis = useRef<"horizontal" | "vertical" | null>(null);

  // Clicking this section's nav link should always land on card 1, even if
  // a previous visit left it further along.
  useEffect(() => {
    function onHashChange() {
      if (window.location.hash === `#${id}`) {
        setState((s) => ({ active: 0, previous: s.active, direction: "forward" }));
      }
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [id]);

  // The entering card's transition should always start from the side that
  // matches the direction just clicked ("forward"/right-arrow enters from
  // the right, "back"/left-arrow enters from the left). Relying purely on
  // className
  // bucketing (active/previous/other) breaks for short lists: with exactly
  // 2 cards, a card goes directly from "previous" (just exited) straight
  // back to "active" on the very next click, with no render in between
  // where it passes through the neutral "other" bucket to get re-parked on
  // the correct side. Without this effect, its CSS transition just
  // interpolates from wherever it happened to rest after exiting — which,
  // after an even number of same-direction clicks, is the wrong side, so
  // the card visibly slides in from the opposite direction than intended.
  // Skip this on mount: there's no previous card to enter "from", it
  // should just be there.
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const el = cardRefs.current[state.active];
    if (!el) return;
    const entryX = state.direction === "forward" ? "100%" : "-100%";
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = `translateX(${entryX})`;
    // Force the browser to commit the snap above as a real prior style
    // before the class-driven transition target is restored below —
    // otherwise the two writes collapse into one and nothing animates.
    void el.offsetWidth;
    el.style.transition = "";
    el.style.opacity = "";
    el.style.transform = "";
  }, [state.active, state.direction]);

  function step(delta: number) {
    setState((s) => ({
      active: (s.active + delta + steps.length) % steps.length,
      previous: s.active,
      direction: delta > 0 ? "forward" : "back",
    }));
  }

  function goTo(i: number) {
    setState((s) => (i === s.active ? s : { active: i, previous: s.active, direction: i > s.active ? "forward" : "back" }));
  }

  // Swipe support: attached as a native (non-passive) listener because
  // React's synthetic touchmove handlers are passive by default, which
  // would silently block our preventDefault() and let the page scroll
  // horizontally along with the card. Axis is locked on the first
  // meaningful move so a vertical swipe still scrolls the page normally
  // instead of being hijacked by the carousel.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
      touchAxis.current = null;
    }

    function onTouchMove(e: TouchEvent) {
      if (!touchStart.current) return;
      const t = e.touches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      if (touchAxis.current === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        touchAxis.current = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
      }
      if (touchAxis.current === "horizontal") {
        e.preventDefault();
      }
    }

    function onTouchEnd(e: TouchEvent) {
      if (touchStart.current && touchAxis.current === "horizontal") {
        const dx = e.changedTouches[0].clientX - touchStart.current.x;
        const threshold = 50;
        if (dx <= -threshold) step(1);
        else if (dx >= threshold) step(-1);
      }
      touchStart.current = null;
      touchAxis.current = null;
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [steps.length]);

  const { active, previous, direction } = state;

  return (
    <section id={id} className={`section ${styles.section}`}>
      <div className={`${styles.bgLayer} ${bgClassName}`} aria-hidden="true" />
      <div className={`section-inner ${styles.content}`}>
        {header}

        <div className={styles.carousel}>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            onClick={() => step(-1)}
            aria-label="Previous card"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* All cards render simultaneously, stacked in the same grid cell
              (grid-area 1/1) so the viewport's height auto-sizes to the
              tallest card at all times — otherwise switching to a shorter
              card shrinks the container and the arrows visibly jump
              vertically to re-center on it. Only opacity/transform (not
              layout) determine which card is actually visible. */}
          <div className={styles.cardViewport} ref={viewportRef}>
            {steps.map((stepContent, i) => {
              let cardClass: string;
              if (i === active) {
                cardClass = styles.cardActive;
              } else if (i === previous) {
                cardClass = direction === "forward" ? styles.cardExitLeft : styles.cardExitRight;
              } else {
                cardClass = direction === "forward" ? styles.cardParkRight : styles.cardParkLeft;
              }
              return (
                <div
                  key={i}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={`${styles.card} ${cardClass}`}
                  aria-hidden={i !== active}
                >
                  {stepContent}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={() => step(1)}
            aria-label="Next card"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className={styles.dots}>
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to card ${i + 1}`}
                className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
