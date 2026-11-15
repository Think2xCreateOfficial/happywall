"use client";

import React, { useRef, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./AntigravityScene.module.css";

// Register the GSAP React plugin in browser environments
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

/**
 * AntigravityScene
 *
 * A high-performance, GPU-accelerated 3D antigravity wrapper component for the
 * Thanos Infinity Gauntlet. Simulates realistic weightless levitation physics,
 * cosmic Space Stone aura pulsing, a synchronized dynamic floor shadow, and
 * ambient zero-gravity cosmic dust particles.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - The Gauntlet component, image, or SVG to suspend
 * @param {boolean} [props.isActive=true] - Whether antigravity levitation is active
 * @param {string} [props.className] - Optional custom CSS class name for container
 * @param {number} [props.particleCount=14] - Number of cosmic dust specks (12-15)
 * @param {boolean} [props.showShadow=true] - Whether to render dynamic floor shadow
 * @param {boolean} [props.showParticles=true] - Whether to render zero-gravity particles
 * @param {number} [props.perspective=1000] - 3D CSS perspective depth in pixels
 */
export const AntigravityScene = forwardRef(function AntigravityScene(
  {
    children,
    isActive = true,
    className = "",
    particleCount = 14,
    showShadow = true,
    showParticles = true,
    perspective = 1000,
  },
  ref
) {
  const containerRef = useRef(null);
  const targetRef = useRef(null);
  const shadowRef = useRef(null);
  const auraRef = useRef(null);
  const particlesContainerRef = useRef(null);

  // Animation timeline tracking refs
  const floatTimelineRef = useRef(null);
  const shadowTimelineRef = useRef(null);
  const particleTweensRef = useRef([]);
  const isFirstRender = useRef(true);

  // Expose imperative control handle to parent
  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current,
    getTarget: () => targetRef.current,
    getShadow: () => shadowRef.current,
    getAura: () => auraRef.current,
  }));

  /**
   * GSAP Antigravity Physics Lifecycle using @gsap/react
   */
  useGSAP(
    () => {
      // Ensure target element is ready
      if (!targetRef.current) return;

      if (isActive) {
        // ------------------------------------------------------------------
        // 1. ACTIVATE WEIGHTLESS FLOATING PHYSICS
        // ------------------------------------------------------------------

        // Kill any existing landing / reset tweens
        gsap.killTweensOf([
          targetRef.current,
          shadowRef.current,
          auraRef.current,
        ]);

        // Create main floating timeline (infinite yoyo sine wave over 3.5s)
        const floatTl = gsap.timeline({
          repeat: -1,
          yoyo: true,
        });
        floatTimelineRef.current = floatTl;

        // Animate along y (-25px), rotationZ (1.5deg), and rotationY (4deg)
        floatTl.to(targetRef.current, {
          y: -25,
          rotationZ: 1.5,
          rotationY: 4,
          duration: 3.5,
          ease: "sine.inOut",
        });

        // Ambient cosmic Space Stone aura drop-shadow pulse (#3b82f6 / #9333ea)
        floatTl.to(
          targetRef.current,
          {
            filter:
              "drop-shadow(0 18px 32px rgba(59, 130, 246, 0.55)) drop-shadow(0 0 50px rgba(147, 51, 234, 0.42))",
            duration: 3.5,
            ease: "sine.inOut",
          },
          0
        );

        // Ambient radial cosmic aura element pulsing in sync
        if (auraRef.current) {
          gsap.to(auraRef.current, {
            opacity: 0.9,
            scale: 1,
            duration: 1.0,
            ease: "power2.out",
          });

          floatTl.to(
            auraRef.current,
            {
              scale: 1.2,
              opacity: 1,
              duration: 3.5,
              ease: "sine.inOut",
            },
            0
          );
        }

        // ------------------------------------------------------------------
        // 2. SYNCED DYNAMIC FLOOR SHADOW
        // ------------------------------------------------------------------
        if (showShadow && shadowRef.current) {
          const shadowTl = gsap.timeline({
            repeat: -1,
            yoyo: true,
          });
          shadowTimelineRef.current = shadowTl;

          // As gauntlet rises to y: -25:
          // Shadow shrinks (scaleX: 0.6), fades (opacity: 0.25), and blurs more (blur: 6px)
          shadowTl.to(shadowRef.current, {
            scaleX: 0.6,
            scaleY: 0.68,
            opacity: 0.25,
            filter: "blur(6px)",
            duration: 3.5,
            ease: "sine.inOut",
          });
        }

        // ------------------------------------------------------------------
        // 3. AMBIENT ZERO-GRAVITY DUST PARTICLES
        // ------------------------------------------------------------------
        if (showParticles && particlesContainerRef.current) {
          const specks = gsap.utils.toArray(
            `.${styles.dustSpeck}`,
            particlesContainerRef.current
          );

          // Clear previous particle tweens
          particleTweensRef.current.forEach((tw) => tw.kill());
          particleTweensRef.current = [];

          specks.forEach((speck) => {
            const startX = gsap.utils.random(-110, 110);
            const startY = gsap.utils.random(40, 100);
            const startScale = gsap.utils.random(0.4, 1.2);
            const targetOpacity = gsap.utils.random(0.35, 0.85);

            gsap.set(speck, {
              x: startX,
              y: startY,
              scale: startScale,
              opacity: 0,
            });

            // Smooth upward zero-gravity drift
            const tw = gsap.to(speck, {
              y: gsap.utils.random(-120, -180),
              x: `+=${gsap.utils.random(-25, 25)}`,
              opacity: 0,
              duration: gsap.utils.random(2.5, 4.8),
              delay: gsap.utils.random(0, 1.8),
              repeat: -1,
              ease: "none",
              onStart: () => {
                gsap.to(speck, { opacity: targetOpacity, duration: 0.45 });
              },
              onRepeat: () => {
                gsap.set(speck, {
                  x: gsap.utils.random(-110, 110),
                  y: gsap.utils.random(40, 100),
                  scale: gsap.utils.random(0.4, 1.2),
                  opacity: gsap.utils.random(0.35, 0.85),
                });
              },
            });

            particleTweensRef.current.push(tw);
          });
        }
      } else {
        // ------------------------------------------------------------------
        // 4. DEACTIVATION / NATURAL GROUNDING LANDING PHYSICS
        // ------------------------------------------------------------------

        // Kill active looping timelines
        if (floatTimelineRef.current) {
          floatTimelineRef.current.kill();
          floatTimelineRef.current = null;
        }
        if (shadowTimelineRef.current) {
          shadowTimelineRef.current.kill();
          shadowTimelineRef.current = null;
        }

        // Kill and fade out particles
        if (particleTweensRef.current.length > 0) {
          particleTweensRef.current.forEach((tw) => tw.kill());
          particleTweensRef.current = [];
        }
        if (particlesContainerRef.current) {
          const specks = gsap.utils.toArray(
            `.${styles.dustSpeck}`,
            particlesContainerRef.current
          );
          gsap.to(specks, { opacity: 0, duration: 0.35, ease: "power1.out" });
        }

        // Handle initial render when already inactive (no animation needed)
        if (isFirstRender.current) {
          gsap.set(targetRef.current, {
            y: 0,
            rotationZ: 0,
            rotationY: 0,
            filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4))",
          });
          if (shadowRef.current) {
            gsap.set(shadowRef.current, {
              scaleX: 1,
              scaleY: 1,
              opacity: 1,
              filter: "blur(3px)",
            });
          }
          if (auraRef.current) {
            gsap.set(auraRef.current, { opacity: 0, scale: 0.8 });
          }
          return;
        }

        // Smoothly land the Gauntlet back to grounded state over 1.2s
        gsap.to(targetRef.current, {
          y: 0,
          rotationZ: 0,
          rotationY: 0,
          filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4))",
          duration: 1.2,
          ease: "power2.out",
        });

        // Fade out Space Stone ambient aura
        if (auraRef.current) {
          gsap.to(auraRef.current, {
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            ease: "power2.out",
          });
        }

        // Restore floor shadow to full contact state
        if (showShadow && shadowRef.current) {
          gsap.to(shadowRef.current, {
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            filter: "blur(3px)",
            duration: 1.2,
            ease: "power2.out",
          });
        }
      }

      isFirstRender.current = false;
    },
    {
      scope: containerRef,
      dependencies: [isActive, showShadow, showParticles],
    }
  );

  return (
    <div
      ref={containerRef}
      className={`${styles.sceneContainer} ${className}`}
      style={{ perspective: `${perspective}px` }}
      data-antigravity-active={isActive ? "true" : "false"}
    >
      {/* Zero-Gravity Ambient Cosmic Dust Particles */}
      {showParticles && (
        <div
          ref={particlesContainerRef}
          className={styles.particlesContainer}
          aria-hidden="true"
        >
          {Array.from({ length: particleCount }).map((_, index) => (
            <div key={index} className={styles.dustSpeck} />
          ))}
        </div>
      )}

      {/* Floating Target Object with Cosmic Aura */}
      <div ref={targetRef} className={styles.floatingTarget}>
        {/* Ambient Space Stone Cosmic Glow Aura */}
        <div ref={auraRef} className={styles.cosmicAura} aria-hidden="true" />

        {/* Wrapped Children (Gauntlet / SVG / Element) */}
        {children}
      </div>

      {/* Dynamic Synced Floor Shadow */}
      {showShadow && (
        <div className={styles.shadowTrack} aria-hidden="true">
          <div ref={shadowRef} className={styles.dynamicShadow} />
        </div>
      )}
    </div>
  );
});

AntigravityScene.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  className: PropTypes.string,
  particleCount: PropTypes.number,
  showShadow: PropTypes.bool,
  showParticles: PropTypes.bool,
  perspective: PropTypes.number,
};

export default AntigravityScene;

