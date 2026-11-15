import { gsap } from "gsap";

export function initHeroAnimation(container: HTMLElement | null) {
  if (!container) return;

  // Check reduced motion preference (WCAG AA accessibility)
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    gsap.set(
      container.querySelectorAll(
        ".hero-badge, .hero-headline-line, .hero-subtext, .hero-cta-group, .hero-split-panel-0, .hero-split-panel-1, .hero-split-panel-2, .hero-split-frame-glow"
      ),
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        clearProps: "all",
      }
    );
    return;
  }

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    // Initial states: Text & CTA
    gsap.set(".hero-badge", { opacity: 0, y: -20 });
    gsap.set(".hero-headline-line", { opacity: 0, y: 30 });
    gsap.set(".hero-subtext", { opacity: 0, y: 20 });
    gsap.set(".hero-cta-group", { opacity: 0, y: 20 });

    // Initial states: Split Panels (Sequential Assembly)
    // Panel 0 (Left): primed to reveal first
    gsap.set(".hero-split-panel-0", { opacity: 0, x: -35, scale: 0.95 });
    // Panel 1 (Center): hidden, waiting for step 2
    gsap.set(".hero-split-panel-1", { opacity: 0, y: -35, scale: 0.92 });
    // Panel 2 (Right): hidden, waiting for step 3
    gsap.set(".hero-split-panel-2", { opacity: 0, x: 35, scale: 0.95 });
    // Ambient backlight glow
    gsap.set(".hero-split-frame-glow", { opacity: 0, scale: 0.85 });

    // Timeline choreography
    tl.to(".hero-badge", {
      opacity: 1,
      y: 0,
      duration: 0.6,
    })
      .to(
        ".hero-headline-line",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
        },
        "-=0.3"
      )
      .to(
        ".hero-subtext",
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        "-=0.4"
      )
      .to(
        ".hero-cta-group",
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.3"
      )
      // --- SPLIT POSTER SEQUENTIAL ASSEMBLY (ATTENTION-GRABBING ENTRANCE) ---
      // STEP 1: Initial Left Panel reveals first
      .to(
        ".hero-split-panel-0",
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.1"
      )
      // STEP 2: Center Panel animates in next with a hero drop snap
      .to(
        ".hero-split-panel-1",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: "back.out(1.2)",
        },
        "+=0.4"
      )
      // STEP 3: Right Panel animates in final, locking the full 1920x1080 artwork together
      .to(
        ".hero-split-panel-2",
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "+=0.4"
      )
      // FINALE: Ambient backlight glow blooms to celebrate completed triptych
      .to(
        ".hero-split-frame-glow",
        {
          opacity: 0.7,
          scale: 1.05,
          duration: 0.7,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .to(
        ".hero-split-frame-glow",
        {
          opacity: 0.25,
          scale: 1,
          duration: 1.2,
          ease: "power2.inOut",
        }
      );
  }, container);

  return () => ctx.revert();
}
