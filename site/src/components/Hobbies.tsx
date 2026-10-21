import { hobbies, isEndedPeriod } from "../data/resume";
import { imageFit, landscapeReferenceAspect } from "../lib/imageFit";
import SteppedSection from "./SteppedSection";
import styles from "./Hobbies.module.css";
import photographyGrid from "../assets/images/hobby-photography.jpg";
import pcBuild1 from "../assets/images/hobby-pc-build-1.jpg";
import moviesGrid from "../assets/images/hobby-movies.jpg";
import aiFilm from "../assets/images/hobby-aifilm.webp";
import aiArt from "../assets/images/hobby-aiart.jpg";

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
  "Generative Art with ComfyUI": {
    image: { src: aiArt, width: 1811, height: 1080 },
    alt: "Generative Art",
  },
  Photography: {
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
            <img
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
          <p className={styles.description}>{hobby.description}</p>
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
