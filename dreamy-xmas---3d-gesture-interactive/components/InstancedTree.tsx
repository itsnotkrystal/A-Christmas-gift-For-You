
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AnimationState } from '../types';
import { COLORS, COUNTS, TREE_PARAMS } from '../constants';

interface InstancedTreeProps {
  animationState: AnimationState;
}

const dummy = new THREE.Object3D();

export const InstancedTree: React.FC<InstancedTreeProps> = ({ animationState }) => {
  const meshRefLeaves = useRef<THREE.InstancedMesh>(null);
  const meshRefBalls = useRef<THREE.InstancedMesh>(null);
  const meshRefGifts = useRef<THREE.InstancedMesh>(null);

  const data = useMemo(() => {
    const leafData = Array.from({ length: COUNTS.leaves }).map((_, i) => {
      const t = i / COUNTS.leaves;
      const h = t * TREE_PARAMS.height;
      const radiusAtH = (1 - t) * TREE_PARAMS.baseRadius;
      const angle = Math.random() * Math.PI * 2;
      const treePos = new THREE.Vector3(
        Math.cos(angle) * radiusAtH * (0.8 + Math.random() * 0.4),
        h - TREE_PARAMS.height / 2,
        Math.sin(angle) * radiusAtH * (0.8 + Math.random() * 0.4)
      );
      const explodePos = new THREE.Vector3((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30);
      return { treePos, explodePos, currentPos: explodePos.clone(), scale: 0.1 + Math.random() * 0.2, color: Math.random() > 0.5 ? COLORS.leaf1 : COLORS.leaf2 };
    });

    const ballData = Array.from({ length: COUNTS.balls }).map((_, i) => {
      const t = i / COUNTS.balls;
      const h = t * TREE_PARAMS.height;
      const radiusAtH = (1 - t) * TREE_PARAMS.baseRadius;
      const angle = Math.random() * Math.PI * 2;
      const treePos = new THREE.Vector3(Math.cos(angle) * radiusAtH, h - TREE_PARAMS.height / 2, Math.sin(angle) * radiusAtH);
      const explodePos = new THREE.Vector3((Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35);
      // Fixed: Using COLORS.ornament2 instead of non-existent COLORS.orn2
      return { treePos, explodePos, currentPos: explodePos.clone(), scale: 0.12 + Math.random() * 0.08, color: COLORS.ornament2 };
    });

    const giftData = Array.from({ length: COUNTS.gifts }).map((_, i) => {
      const t = i / COUNTS.gifts;
      const h = t * TREE_PARAMS.height;
      const radiusAtH = (1 - t) * TREE_PARAMS.baseRadius;
      const angle = Math.random() * Math.PI * 2;
      const treePos = new THREE.Vector3(Math.cos(angle) * radiusAtH, h - TREE_PARAMS.height / 2, Math.sin(angle) * radiusAtH);
      const explodePos = new THREE.Vector3((Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35);
      // Fixed: Using COLORS.ornament1 instead of non-existent COLORS.orn1
      return { treePos, explodePos, currentPos: explodePos.clone(), scale: 0.15 + Math.random() * 0.1, color: COLORS.ornament1 };
    });

    return { leafData, ballData, giftData };
  }, []);

  useFrame((state) => {
    const lerpFactor = 0.05;

    if (meshRefLeaves.current) {
      data.leafData.forEach((d, i) => {
        const target = animationState === AnimationState.TREE ? d.treePos : d.explodePos;
        d.currentPos.lerp(target, lerpFactor);
        dummy.position.copy(d.currentPos);
        dummy.scale.setScalar(d.scale);
        dummy.rotation.set(state.clock.elapsedTime * 0.5, i * 0.1, 0);
        dummy.updateMatrix();
        meshRefLeaves.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRefLeaves.current.instanceMatrix.needsUpdate = true;
    }

    if (meshRefBalls.current) {
      data.ballData.forEach((d, i) => {
        const target = animationState === AnimationState.TREE ? d.treePos : d.explodePos;
        d.currentPos.lerp(target, lerpFactor);
        dummy.position.copy(d.currentPos);
        dummy.scale.setScalar(d.scale);
        dummy.rotation.set(i * 0.2, state.clock.elapsedTime * 0.3, i * 0.5);
        dummy.updateMatrix();
        meshRefBalls.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRefBalls.current.instanceMatrix.needsUpdate = true;
    }

    if (meshRefGifts.current) {
      data.giftData.forEach((d, i) => {
        const target = animationState === AnimationState.TREE ? d.treePos : d.explodePos;
        d.currentPos.lerp(target, lerpFactor);
        dummy.position.copy(d.currentPos);
        dummy.scale.setScalar(d.scale);
        dummy.rotation.set(0, state.clock.elapsedTime * 0.2 + i, 0);
        dummy.updateMatrix();
        meshRefGifts.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRefGifts.current.instanceMatrix.needsUpdate = true;
    }
  });

  useEffect(() => {
    if (meshRefLeaves.current) {
      data.leafData.forEach((d, i) => meshRefLeaves.current!.setColorAt(i, new THREE.Color(d.color)));
      meshRefLeaves.current.instanceColor!.needsUpdate = true;
    }
    if (meshRefBalls.current) {
      data.ballData.forEach((d, i) => meshRefBalls.current!.setColorAt(i, new THREE.Color(COLORS.ornament2)));
      meshRefBalls.current.instanceColor!.needsUpdate = true;
    }
    if (meshRefGifts.current) {
      data.giftData.forEach((d, i) => meshRefGifts.current!.setColorAt(i, new THREE.Color(COLORS.ornament1)));
      meshRefGifts.current.instanceColor!.needsUpdate = true;
    }
  }, [data]);

  return (
    <group>
      <instancedMesh ref={meshRefLeaves} args={[undefined, undefined, COUNTS.leaves]} frustumCulled={false}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial metalness={0.4} roughness={0.6} />
      </instancedMesh>

      <instancedMesh ref={meshRefBalls} args={[undefined, undefined, COUNTS.balls]} frustumCulled={false}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial metalness={0.9} roughness={0.1} />
      </instancedMesh>

      <instancedMesh ref={meshRefGifts} args={[undefined, undefined, COUNTS.gifts]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial metalness={0.5} roughness={0.4} />
      </instancedMesh>
    </group>
  );
};
