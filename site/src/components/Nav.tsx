import { useEffect, useRef, useState } from "react";
import styles from "./Nav.module.css";

const LINKS = [
  { id: "about", label: "About" },
  { id: "journey", label: "Career" },
  { id: "projects", label: "Personal Projects" },
  { id: "education", label: "Education" },
  { id: "hobbies", label: "Hobbies" },
  { id: "contact", label: "Contact" },
];

function useActiveSection() {
  const [activeId, setActiveId] = useState(LINKS[0].id);
  // The scroll-position bottom check must win over the IntersectionObserver:
  // once at true document bottom, the observer's narrow rootMargin band can
  // never intersect the last (short) section, so it would otherwise keep
  // re-asserting the previous link forever.
  const atBottomRef = useRef(false);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (atBottomRef.current) return;
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveId(topMost.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));

    let ticking = false;
    function checkBottom() {
      ticking = false;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom !== atBottomRef.current) {
        atBottomRef.current = atBottom;
        if (atBottom) setActiveId(LINKS[LINKS.length - 1].id);
      }
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(checkBottom);
    }

    checkBottom();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return activeId;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeId = useActiveSection();
  const barRef = useRef<HTMLDivElement>(null);

  // `scroll-padding-top` is what decides where a #hash link parks a section:
  // too small and this fixed bar covers the section's top, too large and the
  // tail of the previous section is left showing underneath it. It used to be a
  // hardcoded 5.5rem (88px) against a bar that actually measures 59px on a wide
  // viewport and ~67px once the layout switches to the hamburger, so ~29px of
  // the previous section stayed visible on every jump. Publishing the measured
  // height keeps the two in step at any viewport size.
  //
  // Only the bar is measured, never the whole <header>: the mobile panel is a
  // child of it and would add its own height to the total while open.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const publish = () =>
      document.documentElement.style.setProperty(
        "--nav-height",
        `${bar.getBoundingClientRect().height}px`
      );
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLinkClick = () => setOpen(false);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner} ref={barRef}>
        <a href="#top" className={styles.brand} onClick={handleLinkClick}>
          <span className={styles.brandMark} aria-hidden="true" />
          <span className={styles.brandText}>DARREN&nbsp;NG</span>
        </a>

        <nav className={styles.links} aria-label="Primary">
          {LINKS.map((link, i) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`${styles.link} ${activeId === link.id ? styles.linkActive : ""}`}
              aria-current={activeId === link.id ? "true" : undefined}
            >
              <span className={styles.linkIndex}>{String(i + 1).padStart(2, "0")}</span>
              {link.label}
            </a>
          ))}
        </nav>

        {/* <div className={styles.status} aria-hidden="true">
          <span className="status-dot ongoing" />
          <span className={styles.statusText}>AVAILABLE</span>
        </div> */}

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`${styles.bar} ${open ? styles.barOpen1 : ""}`} />
          <span className={`${styles.bar} ${open ? styles.barOpen2 : ""}`} />
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`${styles.mobilePanel} ${open ? styles.mobileOpen : ""}`}
      >
        <nav aria-label="Mobile">
          {LINKS.map((link, i) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`${styles.mobileLink} ${
                activeId === link.id ? styles.linkActive : ""
              }`}
              onClick={handleLinkClick}
            >
              <span className={styles.linkIndex}>{String(i + 1).padStart(2, "0")}</span>
              {link.label}
            </a>
          ))}
        </nav>
        {/* <div className={styles.mobileStatus}>
          <span className="status-dot ongoing" />
          AVAILABLE
        </div> */}
      </div>
    </header>
  );
}
