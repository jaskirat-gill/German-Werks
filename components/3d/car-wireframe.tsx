'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function createCarGeometry() {
  const points: THREE.Vector3[] = [];
  const addLine = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
    points.push(new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2));
  };

  // Body profile (right side) — AMG GT proportions: long hood, low cabin, fastback
  const bodyProfile = [
    [-2.0, 0.0], [-1.8, 0.0], [-1.7, 0.3], [-1.5, 0.6], [-1.2, 0.85],
    [-0.6, 1.05], [0.0, 1.15], [0.3, 1.2], [0.6, 1.2], [1.0, 1.15],
    [1.3, 1.05], [1.5, 0.85], [1.6, 0.6], [1.7, 0.3], [1.8, 0.0], [2.0, 0.0],
  ];

  // Draw body profile on both sides (z = +-0.5)
  for (let side = -1; side <= 1; side += 2) {
    const z = side * 0.5;
    for (let i = 0; i < bodyProfile.length - 1; i++) {
      addLine(
        bodyProfile[i]![0]!, bodyProfile[i]![1]!, z,
        bodyProfile[i + 1]![0]!, bodyProfile[i + 1]![1]!, z
      );
    }
  }

  // Cross-members connecting sides
  const crossPoints = [0, 2, 4, 6, 8, 10, 12, 14];
  for (const idx of crossPoints) {
    const p = bodyProfile[idx]!;
    addLine(p[0]!, p[1]!, -0.5, p[0]!, p[1]!, 0.5);
  }

  // Roof / cabin outline
  const roofProfile = [
    [-0.2, 1.2], [0.0, 1.35], [0.3, 1.38], [0.6, 1.35], [0.9, 1.25], [1.1, 1.1],
  ];
  for (let side = -1; side <= 1; side += 2) {
    const z = side * 0.4;
    for (let i = 0; i < roofProfile.length - 1; i++) {
      addLine(
        roofProfile[i]![0]!, roofProfile[i]![1]!, z,
        roofProfile[i + 1]![0]!, roofProfile[i + 1]![1]!, z
      );
    }
  }
  // Roof cross-members
  for (const p of roofProfile) {
    addLine(p[0]!, p[1]!, -0.4, p[0]!, p[1]!, 0.4);
  }

  // A-pillar and C-pillar
  for (let side = -1; side <= 1; side += 2) {
    const z = side * 0.45;
    addLine(-0.2, 1.15, z, -0.1, 1.3, z);  // A-pillar
    addLine(1.0, 1.1, z, 1.1, 1.05, z);     // C-pillar
  }

  // Lower body line (side skirt)
  for (let side = -1; side <= 1; side += 2) {
    addLine(-1.5, 0.15, side * 0.5, 1.5, 0.15, side * 0.5);
  }

  // Door line
  for (let side = -1; side <= 1; side += 2) {
    addLine(0.4, 1.2, side * 0.5, 0.4, 0.15, side * 0.5);
  }

  // Hood line
  for (let side = -1; side <= 1; side += 2) {
    addLine(-1.2, 0.85, side * 0.45, -0.2, 1.05, side * 0.45);
  }

  return points;
}

function createWheelGeometry(cx: number, radius: number) {
  const points: THREE.Vector3[] = [];
  const addLine = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
    points.push(new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2));
  };

  // Wheel circles on both sides
  const segments = 24;
  for (let side = -1; side <= 1; side += 2) {
    const z = side * 0.55;
    for (let i = 0; i < segments; i++) {
      const a1 = (i / segments) * Math.PI * 2;
      const a2 = ((i + 1) / segments) * Math.PI * 2;
      addLine(
        cx + Math.cos(a1) * radius, Math.sin(a1) * radius, z,
        cx + Math.cos(a2) * radius, Math.sin(a2) * radius, z
      );
    }
    // Spokes
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      addLine(cx, 0, z, cx + Math.cos(a) * radius * 0.7, Math.sin(a) * radius * 0.7, z);
    }
    // Hub circle
    for (let i = 0; i < segments; i++) {
      const a1 = (i / segments) * Math.PI * 2;
      const a2 = ((i + 1) / segments) * Math.PI * 2;
      const r = radius * 0.25;
      addLine(
        cx + Math.cos(a1) * r, Math.sin(a1) * r, z,
        cx + Math.cos(a2) * r, Math.sin(a2) * r, z
      );
    }
  }
  // Axle connecting both sides
  addLine(cx, 0, -0.55, cx, 0, 0.55);

  return points;
}

export function CarWireframe() {
  const groupRef = useRef<THREE.Group>(null);

  const { bodyGeometry, frontWheelGeometry, rearWheelGeometry } = useMemo(() => {
    const bodyPoints = createCarGeometry();
    const bodyGeo = new THREE.BufferGeometry().setFromPoints(bodyPoints);

    const frontPoints = createWheelGeometry(-1.3, 0.28);
    const frontGeo = new THREE.BufferGeometry().setFromPoints(frontPoints);

    const rearPoints = createWheelGeometry(1.3, 0.28);
    const rearGeo = new THREE.BufferGeometry().setFromPoints(rearPoints);

    return { bodyGeometry: bodyGeo, frontWheelGeometry: frontGeo, rearWheelGeometry: rearGeo };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Car body wireframe */}
      <lineSegments geometry={bodyGeometry}>
        <lineBasicMaterial color="#C0C0C0" opacity={0.45} transparent />
      </lineSegments>

      {/* Front wheel */}
      <lineSegments geometry={frontWheelGeometry}>
        <lineBasicMaterial color="#C0C0C0" opacity={0.3} transparent />
      </lineSegments>

      {/* Rear wheel */}
      <lineSegments geometry={rearWheelGeometry}>
        <lineBasicMaterial color="#C0C0C0" opacity={0.3} transparent />
      </lineSegments>

      {/* Headlight glow */}
      <mesh position={[-1.75, 0.5, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#CC2936" opacity={0.15} transparent />
      </mesh>
      <pointLight position={[-1.8, 0.5, 0]} color="#CC2936" intensity={0.5} distance={3} />

      {/* Taillight glow */}
      <mesh position={[1.85, 0.4, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#CC2936" opacity={0.2} transparent />
      </mesh>
      <pointLight position={[1.9, 0.4, 0]} color="#CC2936" intensity={0.3} distance={2} />

      {/* Ground underglow */}
      <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 1.5]} />
        <meshBasicMaterial color="#CC2936" opacity={0.04} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Mercedes star (front grille) */}
      <group position={[-1.65, 0.7, 0]}>
        <mesh>
          <ringGeometry args={[0.06, 0.07, 24]} />
          <meshBasicMaterial color="#C0C0C0" opacity={0.3} transparent side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Exhaust tips */}
      <mesh position={[2.0, 0.1, -0.2]}>
        <ringGeometry args={[0.03, 0.05, 12]} />
        <meshBasicMaterial color="#C0C0C0" opacity={0.2} transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[2.0, 0.1, 0.2]}>
        <ringGeometry args={[0.03, 0.05, 12]} />
        <meshBasicMaterial color="#C0C0C0" opacity={0.2} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
