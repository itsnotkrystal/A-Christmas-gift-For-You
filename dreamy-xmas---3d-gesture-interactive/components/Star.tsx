
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { AnimationState } from '../types';
import { COLORS, TREE_PARAMS } from '../constants';

interface Props {
  animationState: AnimationState;
}

export const Star: React.FC<Props> = ({ animationState }) => {
  const meshRef = useRef<THREE.Group>(null);
  const targetY = TREE_PARAMS.height / 2 + 0.8;

  useFrame((state) => {
    if (meshRef.current) {
      const targetPos = animationState === AnimationState.TREE 
        ? new THREE.Vector3(0, targetY, 0)
        : new THREE.Vector3(0, 20, 0);
      
      meshRef.current.position.lerp(targetPos, 0.08);
      meshRef.current.rotation.y += 0.03;
    }
  });

  return (
    <group ref={meshRef}>
      <Float speed={5} rotationIntensity={0.8} floatIntensity={0.5}>
        <group>
          {/* Main Star Body - Overlapping Octahedrons for a more "starry" look */}
          <mesh>
            <octahedronGeometry args={[0.7, 0]} />
            <meshStandardMaterial 
              color={COLORS.star} 
              emissive={COLORS.star} 
              emissiveIntensity={15} 
              toneMapped={false}
            />
          </mesh>
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial 
              color={COLORS.star} 
              emissive={COLORS.star} 
              emissiveIntensity={10} 
              toneMapped={false}
            />
          </mesh>
          
          <pointLight color={COLORS.star} intensity={8} distance={6} decay={2} />
          
          <Sparkles 
            count={60} 
            scale={2.5} 
            size={6} 
            speed={0.6} 
            opacity={1} 
            color={COLORS.star} 
          />
        </group>
      </Float>
    </group>
  );
};
