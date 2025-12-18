
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AnimationState } from '../types';
import { COLORS, COUNTS, TREE_PARAMS } from '../constants';

interface Props {
  animationState: AnimationState;
}

const dummy = new THREE.Object3D();

export const SpiralRibbon: React.FC<Props> = ({ animationState }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    return Array.from({ length: COUNTS.spiral }).map((_, i) => {
      const t = i / COUNTS.spiral;
      const h = t * TREE_PARAMS.height;
      const radiusAtH = (1 - t) * (TREE_PARAMS.baseRadius + 0.2); // Slightly outside tree
      const angle = t * Math.PI * 2 * TREE_PARAMS.spiralRotations;
      
      const treePos = new THREE.Vector3(
        Math.cos(angle) * radiusAtH,
        h - TREE_PARAMS.height / 2,
        Math.sin(angle) * radiusAtH
      );

      const explodePos = new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      );

      return {
        treePos,
        explodePos,
        currentPos: explodePos.clone(),
        scale: 0.03 + Math.random() * 0.05
      };
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const lerpFactor = 0.04;
      particles.forEach((p, i) => {
        const target = animationState === AnimationState.TREE ? p.treePos : p.explodePos;
        p.currentPos.lerp(target, lerpFactor);
        
        dummy.position.copy(p.currentPos);
        dummy.scale.setScalar(p.scale);
        dummy.rotation.set(0, i * 0.1, 0);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNTS.spiral]}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={COLORS.spiral} emissive={COLORS.spiral} emissiveIntensity={1} />
    </instancedMesh>
  );
};
