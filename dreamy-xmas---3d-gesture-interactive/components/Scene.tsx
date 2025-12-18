
import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  ContactShadows, 
  PerspectiveCamera, 
  Float 
} from '@react-three/drei';
import { 
  EffectComposer, 
  Bloom, 
  Vignette 
} from '@react-three/postprocessing';
import * as THREE from 'three';
import { InstancedTree } from './InstancedTree';
import { Star } from './Star';
import { SpiralRibbon } from './SpiralRibbon';
import { AnimationState } from '../types';
import { COLORS } from '../constants';

interface SceneProps {
  isGestureEnabled: boolean;
}

export const Scene: React.FC<SceneProps> = ({ isGestureEnabled }) => {
  const [animationState, setAnimationState] = useState<AnimationState>(AnimationState.TREE);
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.SpotLight>(null);

  // Toggle state on click anywhere
  const handleClick = (e: any) => {
    if (e.target.tagName !== 'CANVAS') return;
    setAnimationState(prev => prev === AnimationState.TREE ? AnimationState.EXPLODE : AnimationState.TREE);
  };

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }

    if (lightRef.current) {
      lightRef.current.intensity = 15 + Math.sin(state.clock.elapsedTime * 2) * 5;
    }
  });

  return (
    <>
      <color attach="background" args={[COLORS.bg]} />
      <fog attach="fog" args={[COLORS.bg, 10, 50]} />
      
      <ambientLight intensity={0.2} />
      <Environment preset="city" />
      
      {/* Warm gold rim light to match the ornaments */}
      <spotLight
        ref={lightRef}
        position={[10, 10, -10]}
        angle={0.15}
        penumbra={1}
        intensity={20}
        color={COLORS.ornament2}
        castShadow
      />
      
      <pointLight position={[0, -2, 0]} intensity={2} color={COLORS.star} />

      <group ref={groupRef} onClick={handleClick}>
        <InstancedTree animationState={animationState} />
        <SpiralRibbon animationState={animationState} />
        <Star animationState={animationState} />
      </group>

      <ContactShadows 
        position={[0, -4.5, 0]} 
        opacity={0.4} 
        scale={20} 
        blur={2} 
        far={4.5} 
      />

      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.5} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.4} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
};
