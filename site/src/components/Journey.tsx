import { useRef, useState, type ReactNode, type TouchEvent } from "react";
import { experience, missionApps, type MissionApp } from "../data/resume";
import { imageFit, landscapeReferenceAspect } from "../lib/imageFit";
import { useMediaQuery } from "../hooks/useMediaQuery";
import SteppedSection from "./SteppedSection";
import styles from "./Journey.module.css";
import monitoringImg from "../assets/images/journey-monitoring.jpg";
import trainingImg from "../assets/images/journey-training.jpg";
import videowallImg from "../assets/images/project-videowall.jpg";
import lmvShipImg from "../assets/images/journey-lmv-ship.jpg";
import commandConsoleImg from "../assets/images/journey-command-console.jpg";
import watercannonImg from "../assets/images/journey-watercannon.jpg";
import chatpostitImg from "../assets/images/journey-chatpostit.jpg";

type StepImage = { src: string; width: number; height: number; caption?: string };

const PROJECT_IMAGES: Record<string, StepImage> = {
  "Monitoring Platform": { src: monitoringImg, width: 643, height: 360 },
  "Analytics Dashboard": { src: trainingImg, width: 960, height: 538 },
  "Various Video Wall Projects": { src: videowallImg, width: 1200, height: 675 },
  "Littoral Mission Vessel": {
    src: lmvShipImg,
    width: 387,
    height: 386,
    caption: "At the first LMV commissioning, 2017",
  },
};

const SUBAPP_IMAGES: Record<string, StepImage> = {
  "Command Console": { src: commandConsoleImg, width: 698, height: 393 },
  "Subsystem Control": { src: watercannonImg, width: 508, height: 338 },
  "Communications": { src: chatpostitImg, width: 752, height: 564 },
};

// Both tables feed the same carousel, so they form one group for sizing.
const LANDSCAPE_ASPECT = landscapeReferenceAspect([
  ...Object.values(PROJECT_IMAGES),
  ...Object.values(SUBAPP_IMAGES),
]);

function StepCard({
  title,
  duration,
  meta,
  description,
  tags,
  image,
}: {
  title: string;
  duration?: string;
  meta?: ReactNode;
  description: string;
  tags: string[];
  image?: StepImage;
}) {
  const fit = image && imageFit(image, LANDSCAPE_ASPECT, { x: 1.6, y: 1.4 });
  return (
    <div className={`hud-panel ${styles.stepCard}`}>
      {image && (
        <figure className={styles.stepFigure}>
          <img
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            className={`${styles.stepImage} ${fit?.className ?? ""}`}
            style={fit?.style}
          />
          {image.caption && <figcaption className={styles.figCaption}>{image.caption}</figcaption>}
        </figure>
      )}
      <div className={styles.stepText}>
        <div className={styles.stepHead}>
          <h3 className={styles.stepTitle}>{title}</h3>
          {duration && <span className={`mono ${styles.stepDuration}`}>{duration}</span>}
        </div>
        {meta && <div className={styles.meta}>{meta}</div>}
        <p className={styles.stepDescription}>{description}</p>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

type LmvPage = {
  title: string;
  duration?: string;
  meta?: ReactNode;
  description: string;
  tags: string[];
  image?: StepImage;
};

// The Littoral Mission Vessel project bundles 3 sub-applications the user
// wants visually surfaced (image + name + description each) rather than
// folded into the standard image-above-text StepCard, which read as a wall
// of text.
//
// Desktop: split into a top half (ship image + description, side by side)
// and a bottom half (3-column subsystem grid) — all 4 "pages" (LMV overview
// + 3 subsystems) visible at once.
//
// Mobile: showing all 4 stacked made this by far the tallest step in the
// Journey carousel, and since every card in the shared carousel reserves
// space for the tallest one, ALL of Journey's cards ended up with a huge
// dead gap. Below the same breakpoint the stepped carousel itself switches
// to (860px), the whole card becomes one swappable page instead — a small
// up arrow above the image cycles to the previous page, a small down arrow
// below the tags cycles to the next, and the visible content (image,
// title, description, tags) swaps between the LMV overview and each
// subsystem in turn, wrapping from Chat and Post-It back to the LMV
// overview. Vertical swipe on the card does the same.
function LmvCard({
  title,
  duration,
  meta,
  description,
  tags,
  image,
  note,
  subApps,
}: {
  title: string;
  duration?: string;
  meta?: ReactNode;
  description: string;
  tags: string[];
  image?: StepImage;
  note?: string;
  subApps: MissionApp[];
}) {
  const isMobile = useMediaQuery("(max-width: 860px)");
  const [pageIndex, setPageIndex] = useState(0);
  const touchStartY = useRef<number | null>(null);

  const pages: LmvPage[] = [
    { title, duration, meta, description, tags, image },
    ...subApps.map((app) => ({
      title: app.name,
      description: app.description,
      tags: app.tags,
      image: SUBAPP_IMAGES[app.name],
    })),
  ];

  function go(delta: number) {
    setPageIndex((i) => (i + delta + pages.length) % pages.length);
  }

  function onTouchStart(e: TouchEvent<HTMLDivElement>) {
    touchStartY.current = e.touches[0].clientY;
  }

  function onTouchEnd(e: TouchEvent<HTMLDivElement>) {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    touchStartY.current = null;
    const SWIPE_THRESHOLD = 24;
    if (deltaY < -SWIPE_THRESHOLD) go(1);
    else if (deltaY > SWIPE_THRESHOLD) go(-1);
  }

  if (!isMobile) {
    return (
      <div className={`hud-panel ${styles.lmvCard}`}>
        <div className={styles.lmvTop}>
          {image && (
            <figure className={styles.lmvFigure}>
              <img
                src={image.src}
                alt=""
                width={image.width}
                height={image.height}
                className={styles.lmvImage}
              />
              {image.caption && <figcaption className={styles.figCaption}>{image.caption}</figcaption>}
            </figure>
          )}
          <div className={styles.lmvInfo}>
            <div className={styles.stepHead}>
              <h3 className={styles.stepTitle}>{title}</h3>
              {duration && <span className={`mono ${styles.stepDuration}`}>{duration}</span>}
            </div>
            {meta && <div className={styles.meta}>{meta}</div>}
            <p className={styles.stepDescription}>{description}</p>
            <div className={styles.tags}>
              {tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.lmvSubApps}>
          {note && <span className={styles.subAppsLabel.replace(":","")}>{note}</span>}
          <div className={styles.subAppGrid}>
            {subApps.map((app) => {
              const appImage = SUBAPP_IMAGES[app.name];
              return (
                <div key={app.name} className={styles.subAppCol}>
                  {appImage && (
                    <div className={styles.subAppImageWrap}>
                      <img src={appImage.src} alt="" className={styles.subAppImage} />
                    </div>
                  )}
                  <span className={styles.subAppName}>{app.name}</span>
                  <p className={styles.subAppDesc}>{app.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`hud-panel ${styles.lmvCard}`}>
      <button type="button" className={styles.subNavArrow} onClick={() => go(-1)} aria-label="Previous">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 15L12 8L19 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {/* All 4 pages render simultaneously, stacked in the same grid cell
          (grid-area 1/1) so the panel's height is always the tallest one —
          normally the LMV overview page, since it carries a meta line the
          subsystem pages don't. Rendering only the active page instead
          would let the panel (and the up/down arrows around it) resize to
          match each page's own shorter height, visibly shifting position
          every time it switched. */}
      <div className={styles.lmvMobilePanel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {pages.map((p, i) => (
          <div
            key={i}
            className={`${styles.lmvMobilePage} ${i === pageIndex ? styles.lmvMobilePageActive : ""}`}
            aria-hidden={i !== pageIndex}
          >
            {p.image && (
              <figure className={styles.lmvFigure}>
                <img
                  src={p.image.src}
                  alt=""
                  width={p.image.width}
                  height={p.image.height}
                  className={styles.lmvImage}
                />
                {p.image.caption && <figcaption className={styles.figCaption}>{p.image.caption}</figcaption>}
              </figure>
            )}
            <div className={styles.lmvInfo}>
              <div className={styles.stepHead}>
                <h3 className={styles.stepTitle}>{p.title}</h3>
                {p.duration && <span className={`mono ${styles.stepDuration}`}>{p.duration}</span>}
              </div>
              {p.meta && <div className={styles.meta}>{p.meta}</div>}
              <p className={styles.stepDescription}>{p.description}</p>
              <div className={styles.tags}>
                {p.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Only meaningful for the LMV overview page — visibility:hidden
          (not conditional unmounting) so this still occupies its line of
          space when viewing a subsystem, keeping the down arrow below it
          from shifting position between pages. */}
      {note && (
        <span
          className={styles.subAppsLabel}
          style={{ visibility: pageIndex === 0 ? "visible" : "hidden" }}
        >
          {note}
        </span>
      )}
      <button type="button" className={styles.subNavArrow} onClick={() => go(1)} aria-label="Next">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 9L12 16L19 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export default function Journey() {
  const employer = experience[0];

  const steps = employer.projects.map((project) => {
    const meta = (
      <>
        <span>
          <strong>Role</strong> {project.role}
        </span>
        {project.team && (
          <span>
            <strong>Team</strong> {project.team}
          </span>
        )}
      </>
    );

    if (project.name === "Littoral Mission Vessel") {
      return (
        <LmvCard
          key={project.name}
          title={project.name}
          duration={project.duration}
          meta={meta}
          description={project.description}
          tags={project.tags}
          image={PROJECT_IMAGES[project.name]}
          note={project.note}
          subApps={missionApps}
        />
      );
    }

    return (
      <StepCard
        key={project.name}
        title={project.name}
        duration={project.duration}
        meta={meta}
        description={project.description}
        tags={project.tags}
        image={PROJECT_IMAGES[project.name]}
      />
    );
  });

  const header = (
    <>
      <div className="section-head">
        <span className="eyebrow">02 // Career</span>
        <h2 className="section-title">13 years, one employer, many mission systems.</h2>
      </div>
      <div className={styles.employerHead}>
        <span className={`status-dot ${employer.status}`} />
        <div>
          <h3 className={styles.employerName}>{employer.name}</h3>
          <span className={`mono ${styles.employerDuration}`}>
            {employer.duration}
            {employer.status === "ongoing" && <span className={styles.liveBadge}>ONGOING</span>}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <SteppedSection id="journey" steps={steps} bgClassName={styles.bg} header={header} />
  );
}
