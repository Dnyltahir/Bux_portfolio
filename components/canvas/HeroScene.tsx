"use client";

import { Float } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const ACCENT = "#ff4b1f";
const DEPTH = 44;

type SceneProps = {
  /** False while the hero is scrolled out of view: the render loop stops. */
  active: boolean;
  /** True when the visitor prefers reduced motion: a single static frame is drawn. */
  reducedMotion: boolean;
};

/** Geometry for the Bux mark, drawn on the logo's own 200-unit grid and centred on the origin. */
function createGeometry() {
  // The B: a square stem with two half-circle bowls, extruded into a solid.
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(100, 0);
  shape.absarc(100, 50, 50, -Math.PI / 2, Math.PI / 2, false);
  shape.absarc(100, 150, 50, -Math.PI / 2, Math.PI / 2, false);
  shape.lineTo(0, 200);
  shape.closePath();

  const letter = new THREE.ExtrudeGeometry(shape, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: 4,
    bevelSize: 4,
    bevelSegments: 4,
    curveSegments: 32,
  });
  letter.translate(-100, -100, -DEPTH / 2);

  const dot = new THREE.SphereGeometry(25, 48, 32);

  // Construction grid: a 2 × 2 square grid and its circle, as line segments.
  const points: number[] = [];
  for (const v of [-100, 0, 100]) {
    points.push(v, -100, 0, v, 100, 0);
    points.push(-100, v, 0, 100, v, 0);
  }
  const segments = 96;
  for (let i = 0; i < segments; i += 1) {
    const a = (i / segments) * Math.PI * 2;
    const b = ((i + 1) / segments) * Math.PI * 2;
    points.push(Math.cos(a) * 100, Math.sin(a) * 100, 0, Math.cos(b) * 100, Math.sin(b) * 100, 0);
  }
  const grid = new THREE.BufferGeometry();
  grid.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));

  return { letter, dot, grid };
}

function createMaterials() {
  return {
    letter: new THREE.MeshStandardMaterial({ color: "#f4f4f2", roughness: 0.32, metalness: 0.12 }),
    dot: new THREE.MeshStandardMaterial({ color: ACCENT, roughness: 0.35, emissive: ACCENT, emissiveIntensity: 0.25 }),
    grid: new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.22 }),
  };
}

function Mark({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const time = useRef(0);
  const viewportWidth = useThree((state) => state.viewport.width);

  const geometry = useMemo(createGeometry, []);
  const materials = useMemo(createMaterials, []);

  // Free GPU resources when the scene unmounts.
  useEffect(() => {
    return () => {
      Object.values(geometry).forEach((item) => item.dispose());
      Object.values(materials).forEach((item) => item.dispose());
    };
  }, [geometry, materials]);

  // Track the pointer across the whole window, so the mark responds even while the cursor is over the headline.
  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  useFrame((_, delta) => {
    const target = group.current;
    if (!target || reducedMotion) return;
    time.current += delta;
    const idle = Math.sin(time.current * 0.4) * 0.28;
    target.rotation.y = THREE.MathUtils.lerp(target.rotation.y, pointer.current.x * 0.6 + idle, 0.06);
    target.rotation.x = THREE.MathUtils.lerp(target.rotation.x, pointer.current.y * 0.3, 0.06);
  });

  // Shrink the mark on narrow (portrait) viewports so it always fits.
  const scale = 0.0105 * Math.min(1, viewportWidth / 3.2);

  return (
    <Float enabled={!reducedMotion} speed={1.4} rotationIntensity={0.12} floatIntensity={0.6} floatingRange={[-0.08, 0.08]}>
      <group ref={group} scale={scale} rotation={reducedMotion ? [0.12, -0.5, 0] : [0, 0, 0]}>
        <mesh geometry={geometry.letter} material={materials.letter} />
        <mesh geometry={geometry.dot} material={materials.dot} position={[75, -75, 0]} />
        <lineSegments geometry={geometry.grid} material={materials.grid} position={[0, 0, -DEPTH / 2]} />
      </group>
    </Float>
  );
}

/** The interactive 3D Bux mark. Transparent background: the parent supplies the gradient behind it. */
export default function HeroScene({ active, reducedMotion }: SceneProps) {
  const frameloop = reducedMotion ? "demand" : active ? "always" : "never";

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7], fov: 32 }}
      frameloop={frameloop}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} />
      <pointLight position={[-4, -2, 3]} intensity={40} color={ACCENT} />
      <Suspense fallback={null}>
        <Mark reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
