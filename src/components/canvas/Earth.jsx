import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";

import CanvasLoader from "../Loader";
import CanvasErrorBoundary from "../CanvasErrorBoundary";

const Earth = () => {
  const earth = useGLTF("/gaming_laptop/scene.gltf");

  return (
    <mesh>
    <hemisphereLight intensity={0.15} groundColor='black' />
    <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
    <primitive object={earth.scene} scale={0.015} position-y={0} rotation-y={0} />
    </mesh>
  );
};

const EarthCanvas = () => {
  const shouldReduceMotion = useReducedMotion();
  const wrapRef = useRef(null);
  const [onScreen, setOnScreen] = useState(false);

  // This sits at the foot of a very long page. Without a visibility gate it
  // would render every frame while the visitor reads the top of the site.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "200px" }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const spinning = onScreen && !shouldReduceMotion;

  return (
    <div ref={wrapRef} className='w-full h-full'>
      <CanvasErrorBoundary>
        <Canvas
          aria-hidden='true'
          shadows
          // autoRotate only advances on rendered frames, so demand mode would
          // leave it stalled. Off-screen and reduced motion both park it.
          frameloop={spinning ? "always" : "demand"}
          dpr={[1, 2]}
          gl={{ preserveDrawingBuffer: true }}
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [-4, 3, 6],
          }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <OrbitControls
              autoRotate={spinning}
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
            <Earth />

            <Preload all />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};

export default EarthCanvas;
