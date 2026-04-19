"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, Float, OrbitControls, useGLTF } from "@react-three/drei";

function ModelAsset({ modelPath }: { modelPath: string }) {
  const gltf = useGLTF(modelPath);

  return (
    <Center>
      <primitive object={gltf.scene.clone()} />
    </Center>
  );
}

function Scene({ modelPath }: { modelPath: string }) {
  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight position={[3, 4, 2]} intensity={2.6} />
      <directionalLight position={[-2, 2, -2]} intensity={1.2} color="#7db6ff" />
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.35}>
        <ModelAsset modelPath={modelPath} />
      </Float>
      <OrbitControls enablePan={false} minDistance={2.5} maxDistance={8} />
    </>
  );
}

export function ProductViewer3D({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="h-[360px] overflow-hidden rounded-[28px] border border-line bg-[radial-gradient(circle_at_top,rgba(62,118,255,0.28),transparent_40%),linear-gradient(180deg,#0b132b,#040816)]">
      <Canvas camera={{ position: [2.8, 1.8, 4.4], fov: 42 }}>
        <Suspense fallback={null}>
          <Scene modelPath={modelUrl} />
        </Suspense>
      </Canvas>
    </div>
  );
}
