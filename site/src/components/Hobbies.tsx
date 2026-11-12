import { hobbies, isEndedPeriod } from "../data/resume";
import { richText } from "../lib/richText";
import { imageFit, landscapeReferenceAspect } from "../lib/imageFit";
import SteppedSection from "./SteppedSection";
import Media from "./Media";
import styles from "./Hobbies.module.css";
import photographyGrid from "../assets/images/hobby-photography.jpg";
import pcBuild1 from "../assets/images/hobby-pc-build-1.jpg";
import moviesGrid from "../assets/images/hobby-movies.jpg";
import aiFilm from "../assets/images/hobby-aifilm.mp4";
import aiArt from "../assets/images/hobby-aiart.jpg";
import reading from "../assets/images/hobby-reading.webp";
import morningDailyBrief from "../assets/images/darrens_daily_blue_1280x720.mp4";
import eveningDailyBrief from "../assets/images/premarket_report_1280x720.mp4";

type HobbyVisual = {
  image: { src: string; width: number; height: number };
  alt: string;
  // How far the image may scale past its natural size. Defaults to DEFAULT_SCALE.
  scaleY?: number;
  scaleX?: number;
};

const DEFAULT_SCALE = 1.8;

const HOBBY_VISUALS: Record<string, HobbyVisual> = {  
  "AI Filmmaking with ComfyUI": {
    image: { src: aiFilm, width: 1916, height: 1017 },
    alt: "AI Filmmaking",
  },
  "Morning Daily Brief": {
    image: { src: morningDailyBrief, width: 1280, height: 720 },
    alt: "Morning Daily Brief",
  },
  "Evening Daily Brief": {
    image: { src: eveningDailyBrief, width: 1280, height: 720 },
    alt: "Evening Daily Brief",
  },
  "Generative Art with ComfyUI": {
    image: { src: aiArt, width: 1811, height: 1080 },
    alt: "Generative Art",
  },
  "Reading": {
    image: { src: reading, width: 1280, height: 720 },
    alt: "Reading",
  },
  "Photography": {
    image: { src: photographyGrid, width: 1894, height: 945 },
    alt: "Photography samples",
  },
  "Watching Movies": {
    image: { src: moviesGrid, width: 1811, height: 1080 },
    alt: "Watching Movies",
  },
  "Build / Overclock Computers": {
    image: { src: pcBuild1, width: 1894, height: 791 },
    alt: "PC build",
  },
};

const LANDSCAPE_ASPECT = landscapeReferenceAspect(
  Object.values(HOBBY_VISUALS).map((v) => v.image),
);

export default function Hobbies() {
  const steps = hobbies.map((hobby) => {
    const visual = HOBBY_VISUALS[hobby.name];
    const fit =
      visual &&
      imageFit(visual.image, LANDSCAPE_ASPECT, {
        x: visual.scaleX ?? DEFAULT_SCALE,
        y: visual.scaleY ?? DEFAULT_SCALE,
      });
    return (
      <div key={hobby.name} className={`hud-panel ${styles.stepCard}`}>
        {visual && (
          <div className={styles.stepFigure}>
            <Media
              src={visual.image.src}
              alt={visual.alt}
              width={visual.image.width}
              height={visual.image.height}
              className={`${styles.wideImage} ${fit?.className ?? ""}`}
              style={fit?.style}
            />
          </div>
        )}
        <div className={styles.stepText}>
          <div className={styles.stepHead}>
            <h3 className={styles.name}>{hobby.name}</h3>
            <span
              className="mono"
              style={isEndedPeriod(hobby.period) ? { color: "#ff5c66" } : undefined}
            >
              {hobby.period}
            </span>
          </div>
          <p className={styles.description}>{richText(hobby.description)}</p>
        </div>
      </div>
    );
  });

  const header = (
    <div className="section-head">
      <span className="eyebrow">05 // Hobbies</span>
      <h2 className="section-title">Off the clock.</h2>
    </div>
  );

  return <SteppedSection id="hobbies" steps={steps} bgClassName={styles.bg} header={header} />;
}
