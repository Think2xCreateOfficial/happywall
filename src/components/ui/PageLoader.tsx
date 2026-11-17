"use client";

import React from "react";
import styles from "./PageLoader.module.css";

interface PageLoaderProps {
  fullScreen?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ fullScreen = true }) => {
  return (
    <div
      className={fullScreen ? styles.loaderContainer : "flex flex-col items-center justify-center p-8"}
      role="status"
      aria-label="Loading Happy Wall"
      aria-live="polite"
    >
      <div className={styles.loader} />
      <div className={styles.brandIdentifier} aria-hidden="true">
        <span className={styles.brandTitle}>Happy Wall</span>
        <span className={styles.brandTagline}>Posters · Personality</span>
      </div>
      <span className="sr-only">Loading Happy Wall...</span>
    </div>
  );
};

export default PageLoader;
