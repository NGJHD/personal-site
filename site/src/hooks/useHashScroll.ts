import { useEffect } from "react";

/**
 * `history.scrollRestoration` is "manual" (set in index.html, see the comment
 * there for why), so the two things the browser's restoration got right are now
 * ours to do: landing on the right section when the page is opened at a #hash,
 * and following the hash on back/forward.
 *
 * Both have to run after React has painted. At the moment the browser would
 * have restored, #root is still empty — the document is exactly one viewport
 * tall and there is no section to scroll to yet.
 *
 * Clicking a nav link is deliberately left alone: that is an ordinary fragment
 * navigation the browser still performs itself, animated per
 * `scroll-behavior: smooth`. Only history traversal needs us, which is why this
 * listens for `popstate` rather than `hashchange` — the latter also fires on
 * those clicks, and would replace the smooth scroll with a jump.
 */
export function useHashScroll() {
  useEffect(() => {
    // "instant" rather than the default "auto": "auto" defers to
    // `scroll-behavior: smooth`, which would animate a first paint or a Back
    // press from wherever the page happens to be sitting.
    function goToHash() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (target) target.scrollIntoView({ behavior: "instant" });
      else window.scrollTo({ top: 0, behavior: "instant" });
    }

    goToHash();
    window.addEventListener("popstate", goToHash);
    return () => window.removeEventListener("popstate", goToHash);
  }, []);
}
