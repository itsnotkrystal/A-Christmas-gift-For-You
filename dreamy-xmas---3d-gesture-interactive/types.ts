
export enum AppState {
  SPLASH = 'SPLASH',
  PLAYING = 'PLAYING',
}

export enum AnimationState {
  TREE = 'TREE',
  EXPLODE = 'EXPLODE'
}

export interface ParticleData {
  initialPosition: [number, number, number];
  targetPosition: [number, number, number];
  color: string;
  scale: number;
}

export interface GestureControl {
  mode: AnimationState;
  rotationX: number;
  rotationY: number;
  pointerPos: { x: number; y: number };
}
