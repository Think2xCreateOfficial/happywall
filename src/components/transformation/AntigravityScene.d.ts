import React from "react";

export interface AntigravitySceneProps {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
  particleCount?: number;
  showShadow?: boolean;
  showParticles?: boolean;
  perspective?: number;
}

export interface AntigravitySceneHandle {
  getContainer: () => HTMLDivElement | null;
  getTarget: () => HTMLDivElement | null;
  getShadow: () => HTMLDivElement | null;
  getAura: () => HTMLDivElement | null;
}

export declare const AntigravityScene: React.ForwardRefExoticComponent<
  AntigravitySceneProps & React.RefAttributes<AntigravitySceneHandle>
>;

export default AntigravityScene;

