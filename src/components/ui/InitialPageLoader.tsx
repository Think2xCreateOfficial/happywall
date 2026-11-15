"use client";

import React, { useEffect, useState } from "react";
import styles from "./PageLoader.module.css";

export const InitialPageLoader: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(true);
  const [fading, setFading] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const dismissLoader = () => {
      setFading(true);
      timer = setTimeout(() => {
        setMounted(false);
      }, 250);
    };

    // Fast dismiss: Dismiss as soon as component mounts on client,
    // with a maximum ceiling of 300ms so the user is NEVER blocked by slow network assets.
    const maxWaitTimer = setTimeout(dismissLoader, 300);

    if (document.readyState === "complete" || document.readyState === "interactive") {
      const frame = requestAnimationFrame(dismissLoader);
      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(maxWaitTimer);
        clearTimeout(timer);
      };
    } else {
      document.addEventListener("DOMContentLoaded", dismissLoader, { once: true });
      window.addEventListener("load", dismissLoader, { once: true });
      return () => {
        document.removeEventListener("DOMContentLoaded", dismissLoader);
        window.removeEventListener("load", dismissLoader);
        clearTimeout(maxWaitTimer);
        clearTimeout(timer);
      };
    }
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`${styles.loaderContainer} ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden={fading}
      role="status"
      aria-label="Loading Happy Walls"
    >
      <div className={styles.loader} />
      <div className={styles.brandIdentifier} aria-hidden="true">
        <span className={styles.brandTitle}>Happy Walls</span>
        <span className={styles.brandTagline}>Posters · Personality</span>
      </div>
      <span className="sr-only">Loading Happy Walls...</span>
    </div>
  );
};
