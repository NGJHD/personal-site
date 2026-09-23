import type { ComponentType } from "react";
import { personalProjects, isEndedPeriod } from "../data/resume";
import { imageFit, landscapeReferenceAspect } from "../lib/imageFit";
import SteppedSection from "./SteppedSection";
import styles from "./Projects.module.css";
import musicPlayerImg from "../assets/images/project-music-player.jpg";
import movieCatalogueImg from "../assets/images/project-movie-catalogue.jpg";
import cryptoImg from "../assets/images/project-crypto.jpg";
import thesisImg from "../assets/images/project-thesis.webp";
import waveKeepImg from "../assets/images/project-wavekeep.webp";
import mediaWhiteboardImg from "../assets/images/project-mediawhiteboard.webp";
import videoTrimCropImg from "../assets/images/project-videoTrimCrop.png";
import kanbanBoardImg from "../assets/images/project-kanban-board.png";
import meetingImg from "../assets/images/project-meeting.png";
import portKillerImg from "../assets/images/project-port-killer.png";
import compositionMarkerImg from "../assets/images/project-composition-marker.png";
import websiteWidgetImg from "../assets/images/project-website-widget.png";
import pdfAppImg from "../assets/images/project-pdf-app.png";

const PROJECT_VISUALS: Record<
  string,
  { image?: { src: string; width: number; height: number }; icon?: ComponentType }
> = {
  "Wave Keep": { image: { src: waveKeepImg, width: 200, height: 466 } },
  "Stock Thesis Monitor Bot": { image: { src: thesisImg, width: 1988, height: 1260 } },
  "Cryptocurrency Trading Bot": { image: { src: cryptoImg, width: 1704, height: 923 } },
  "Music Folder Player": { image: { src: musicPlayerImg, width: 895, height: 595 } },
  "Movie Catalogue Software": { image: { src: movieCatalogueImg, width: 1920, height: 1152 } },
  "Media Whiteboard": { image: { src: mediaWhiteboardImg, width: 631, height: 320 } },
  "Video Trim & Crop": { image: { src: videoTrimCropImg, width: 1345, height: 853 } },
  "Kanban Board": { image: { src: kanbanBoardImg, width: 1914, height: 1024 } },
  "Meeting Summariser / Minutes Generator": { image: { src: meetingImg, width: 895, height: 468 } },
  "Windows Port Killer": { image: { src: portKillerImg, width: 1913, height: 1018 } },
  "Composition Marker": { image: { src: compositionMarkerImg, width: 919, height: 562 } },
  "Website Widget": { image: { src: websiteWidgetImg, width: 1151, height: 720 } },
  "Android PDF/Markdown Viewer App": { image: { src: pdfAppImg, width: 895, height: 710 } },
};

const LANDSCAPE_ASPECT = landscapeReferenceAspect(
  Object.values(PROJECT_VISUALS).flatMap((v) => (v.image ? [v.image] : [])),
);

export default function Projects() {
  const steps = personalProjects.map((project) => {
    const visual = PROJECT_VISUALS[project.name];
    const Icon = visual?.icon;
    const fit = visual?.image && imageFit(visual.image, LANDSCAPE_ASPECT, { x: 1.6, y: 1.4 });
    return (
      <div key={project.name} className={`hud-panel ${styles.stepCard}`}>
        <div className={styles.visual}>
          {visual?.image && (
            <img
              src={visual.image.src}
              alt=""
              width={visual.image.width}
              height={visual.image.height}
              className={`${styles.visualImage} ${fit?.className ?? ""}`}
              style={fit?.style}
            />
          )}
          {Icon && (
            <div className={styles.iconWrap}>
              <Icon />
            </div>
          )}
        </div>
        <div className={styles.body}>
          {/* <span className={`mono ${styles.index}`}>{String(i + 1).padStart(2, "0")}</span> */}
          <div className={styles.stepHead}>
            <h3 className={styles.name}>{project.name} {project.repo && (
              <>
                {"["}
                <a href={project.repo} target="_blank" className={styles.repoLink}>
                  Repo
                </a>
                {"]"}
              </>
            )} {project.playStore && (
              <>
                {"["}
                <a href={project.playStore} target="_blank" className={styles.repoLink}>
                  Play Store
                </a>
                {"]"}
              </>
            )}</h3>
            <span
              className="mono"
              style={isEndedPeriod(project.period) ? { color: "#ff5c66" } : undefined}
            >
              {project.period}
            </span>
          </div>
          <p className={styles.description}>{project.description}</p>
          <div className={styles.tags}>
            {project.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  });

  const header = (
    <div className="section-head">
      <span className="eyebrow">03 // Personal Projects</span>
      <h2 className="section-title">Built outside working hours.</h2>
    </div>
  );

  return (
    <SteppedSection id="projects" steps={steps} bgClassName={styles.bg} header={header} />
  );
}
