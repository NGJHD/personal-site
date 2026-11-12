import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

const isVideoSrc = (src: string) => VIDEO_EXT.test(src);

type MediaProps = {
  src: string;
  width: number;
  height: number;
  alt?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Renders an <img>, or a muted looping <video> with native controls (play/pause,
 * seekbar) when `src` is a video file.
 *
 * Videos only play while on screen, so a carousel of them doesn't decode every
 * clip at once. If the viewer pauses a video themselves it stays paused when it
 * scrolls back into view.
 *
 * `controls` is toggled on only while the video is visible rather than set in
 * JSX: Chrome lays out its native control bar once, at whatever size it sees
 * while the element is hidden (a parked, opacity-0 carousel card), and never
 * re-measures when the card slides in - leaving a bar half the video's width.
 * Re-adding the attribute on entry makes Chrome build the bar at the real size.
 */
export default function Media({ src, width, height, alt = "", className, style }: MediaProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const autoPausing = useRef(false);
  const video = isVideoSrc(src);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onPause = () => {
      if (autoPausing.current) autoPausing.current = false;
      else userPaused.current = true;
    };
    const onPlay = () => {
      userPaused.current = false;
    };
    el.addEventListener("pause", onPause);
    el.addEventListener("play", onPlay);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.controls = true;
          if (!userPaused.current) el.play().catch(() => {});
        } else {
          el.controls = false;
          if (!el.paused) {
            autoPausing.current = true;
            el.pause();
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      el.removeEventListener("pause", onPause);
      el.removeEventListener("play", onPlay);
    };
  }, [src]);

  if (!video) {
    return (
      <img src={src} alt={alt} width={width} height={height} className={className} style={style} />
    );
  }

  return (
    <video
      ref={ref}
      src={src}
      width={width}
      height={height}
      className={className}
      style={style}
      aria-label={alt || undefined}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      controlsList="nodownload noplaybackrate noremoteplayback"
    />
  );
}
