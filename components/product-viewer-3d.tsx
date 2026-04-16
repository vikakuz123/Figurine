"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

function Base() {
  return (
    <mesh position={[0, -0.95, 0]}>
      <cylinderGeometry args={[1.35, 1.55, 0.25, 32]} />
      <meshStandardMaterial color="#071022" />
    </mesh>
  );
}

function House({ accent }: { accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.5, 1.2, 1.2]} />
        <meshStandardMaterial color="#edf4ff" roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.05, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.25, 1.05, 4]} />
        <meshStandardMaterial color={accent} roughness={0.2} metalness={0.15} />
      </mesh>
      <mesh position={[0, -0.1, 0.61]}>
        <boxGeometry args={[0.34, 0.7, 0.05]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <Base />
    </group>
  );
}

function Cat({ accent }: { accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial color={accent} roughness={0.28} />
      </mesh>
      <mesh position={[0.78, 0.85, 0]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color="#edf4ff" roughness={0.32} />
      </mesh>
      <mesh position={[0.92, 1.28, 0.16]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.13, 0.28, 4]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0.92, 1.28, -0.16]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.13, 0.28, 4]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[-0.9, 0.7, 0]} rotation={[0.2, 0, 1.1]}>
        <torusGeometry args={[0.55, 0.09, 18, 100, Math.PI]} />
        <meshStandardMaterial color="#d8ebff" />
      </mesh>
      <Base />
    </group>
  );
}

function Chair({ accent }: { accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.15, 0.16, 1.1]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0, 1.05, -0.45]}>
        <boxGeometry args={[1.15, 1.7, 0.16]} />
        <meshStandardMaterial color="#edf4ff" />
      </mesh>
      {[
        [-0.42, -0.62, -0.38],
        [0.42, -0.62, -0.38],
        [-0.42, -0.62, 0.38],
        [0.42, -0.62, 0.38]
      ].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]}>
          <boxGeometry args={[0.12, 1.2, 0.12]} />
          <meshStandardMaterial color="#cfe6ff" />
        </mesh>
      ))}
      <Base />
    </group>
  );
}

function Lamp({ accent }: { accent: string }) {
  return (
    <group>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.78, 0.95, 0.16, 32]} />
        <meshStandardMaterial color="#edf4ff" />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.7, 16]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0, 1.75, 0]}>
        <coneGeometry args={[0.92, 1.05, 24, 1, true]} />
        <meshStandardMaterial color={accent} side={2} />
      </mesh>
      <mesh position={[0, 1.52, 0]}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial color="#fff6cc" emissive="#fff6cc" emissiveIntensity={0.65} />
      </mesh>
      <Base />
    </group>
  );
}

function Bunny({ accent }: { accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.68, 32, 32]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0, 0.98, 0]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#edf4ff" />
      </mesh>
      <mesh position={[-0.16, 1.72, 0]} rotation={[0.12, 0, 0.06]}>
        <capsuleGeometry args={[0.1, 0.72, 6, 12]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0.16, 1.72, 0]} rotation={[0.12, 0, -0.06]}>
        <capsuleGeometry args={[0.1, 0.72, 6, 12]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <Base />
    </group>
  );
}

function Mug({ accent }: { accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.6, 0.65, 1.1, 32]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <torusGeometry args={[0.5, 0.06, 16, 80]} />
        <meshStandardMaterial color="#edf4ff" />
      </mesh>
      <mesh position={[0.78, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.28, 0.08, 16, 80, Math.PI * 1.35]} />
        <meshStandardMaterial color="#d8ebff" />
      </mesh>
      <Base />
    </group>
  );
}

function Model({
  modelType,
  accent
}: {
  modelType: "house" | "cat" | "chair" | "lamp" | "bunny" | "mug";
  accent: string;
}) {
  switch (modelType) {
    case "cat":
      return <Cat accent={accent} />;
    case "chair":
      return <Chair accent={accent} />;
    case "lamp":
      return <Lamp accent={accent} />;
    case "bunny":
      return <Bunny accent={accent} />;
    case "mug":
      return <Mug accent={accent} />;
    default:
      return <House accent={accent} />;
  }
}

export function ProductViewer3D({
  modelType,
  accent
}: {
  modelType: "house" | "cat" | "chair" | "lamp" | "bunny" | "mug";
  accent: string;
}) {
  return (
    <div className="h-[360px] overflow-hidden rounded-[28px] border border-line bg-[radial-gradient(circle_at_top,rgba(62,118,255,0.28),transparent_40%),linear-gradient(180deg,#0b132b,#040816)]">
      <Canvas camera={{ position: [0, 1.5, 5], fov: 42 }}>
        <ambientLight intensity={1.8} />
        <directionalLight position={[3, 4, 2]} intensity={2.6} />
        <directionalLight position={[-2, 2, -2]} intensity={1.2} color="#7db6ff" />
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.35} floatIntensity={0.55}>
            <Model modelType={modelType} accent={accent} />
          </Float>
        </Suspense>
        <OrbitControls enablePan={false} minDistance={3.5} maxDistance={7} />
      </Canvas>
    </div>
  );
}
