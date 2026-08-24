import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { CanvasTexture } from "three";

import CanvasLoader from "../Loader";
import CanvasErrorBoundary from "../CanvasErrorBoundary";
import { isWebGLAvailable } from "../../utils/webgl";
import { useCoarsePointer } from "../../utils/useCoarsePointer";

// Region of the body texture holding the eyes, in texture pixels.
const EYE_PATCH = { x: 500, y: 650, width: 250, height: 150 };

const Computers = ({ isMobile }) => {
  const computer = useGLTF("/lost_programer/scene.gltf");
  computer.scene.traverse((child) => {
    const positionAttribute = child.geometry?.attributes?.position;
    const hasTextureCoordinates = child.geometry?.attributes?.uv;

    if (child.isMesh && positionAttribute?.count > 10000 && !hasTextureCoordinates) {
      child.visible = false;
    }
  });

  useEffect(() => {
    computer.scene.traverse((child) => {
      if (!child.isMesh) return;

      if (child.name.startsWith("hair")) {
        child.material = child.material.clone();
        child.material.color.set("#0b0b0b");
        child.material.map = null;
        child.material.needsUpdate = true;
      }

      const texture = child.material?.map;
      const image = texture?.image;
      if (!image || child.material?.name !== "body") return;

      // Whether this is a decoded HTMLImageElement or an ImageBitmap, and
      // whether it has dimensions yet, varies by browser. Reading pixels from a
      // zero-sized canvas throws, and an exception here would escape into React
      // and take the page down, so the recolour is strictly best-effort.
      const width = image.width || image.naturalWidth || 0;
      const height = image.height || image.naturalHeight || 0;
      if (!width || !height) return;

      // Clamp the eye patch to the texture so the read can never run past it.
      const x = Math.min(EYE_PATCH.x, Math.max(0, width - 1));
      const y = Math.min(EYE_PATCH.y, Math.max(0, height - 1));
      const patchWidth = Math.min(EYE_PATCH.width, width - x);
      const patchHeight = Math.min(EYE_PATCH.height, height - y);
      if (patchWidth <= 0 || patchHeight <= 0) return;

      try {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return;

        context.drawImage(image, 0, 0);

        const eyeRegion = context.getImageData(x, y, patchWidth, patchHeight);
        for (let index = 0; index < eyeRegion.data.length; index += 4) {
          const red = eyeRegion.data[index];
          const green = eyeRegion.data[index + 1];
          const blue = eyeRegion.data[index + 2];

          if (blue > red * 1.15 && blue > green * 1.05) {
            eyeRegion.data[index] = 92;
            eyeRegion.data[index + 1] = 52;
            eyeRegion.data[index + 2] = 24;
          }
        }

        context.putImageData(eyeRegion, x, y);
        const recoloredTexture = new CanvasTexture(canvas);
        recoloredTexture.flipY = texture.flipY;
        child.material = child.material.clone();
        child.material.map = recoloredTexture;
        child.material.needsUpdate = true;
      } catch (error) {
        // Keep the original texture. A missed recolour is not worth a blank page.
        console.warn("Eye recolour skipped:", error);
      }
    });
  }, [computer]);

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
      <primitive
        object={computer.scene}
        scale={isMobile ? 2.0 : 3.2}
        // The camera sits off to one side, so a world-space offset that reads as
        // centered on a wide viewport swings far right in portrait, where the
        // horizontal field of view is much narrower. z = -0.714 puts the model
        // bounding-box centre on the camera axis, centering it at any aspect.
        position={isMobile ? [-2, -0, -0.714] : [-2, 0, -0.714]}
        rotation={[0,-0.55,0]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const isTouch = useCoarsePointer();
  // Probed once, after the hooks above so the hook order never changes.
  const [webglSupported] = useState(isWebGLAvailable);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  // Without WebGL the hero keeps its heading and copy, just no model.
  if (!webglSupported) return null;

  return (
    <CanvasErrorBoundary>
    <Canvas
      aria-hidden='true'
      frameloop={shouldReduceMotion ? "demand" : "always"}
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      {/* The outer boundary cannot see errors thrown inside the canvas tree,
          because react-three-fiber renders it through its own reconciler. This
          one catches a failed model load and drops the model rather than
          letting the error escape and blank the page. */}
      <CanvasErrorBoundary>
        <Suspense fallback={<CanvasLoader />}>
          {/* Not rendered on touch at all. OrbitControls calls preventDefault
              on the pointer events it handles, which cancels scrolling no
              matter what touch-action says, and this canvas fills the screen
              on a phone. Leaving it out is the only way a swipe here reaches
              the page. Desktop keeps click-drag as before. */}
          {!isTouch && (
            <OrbitControls
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          )}
          <Computers isMobile={isMobile} />
        </Suspense>
      </CanvasErrorBoundary>

      <Preload all />
    </Canvas>
    </CanvasErrorBoundary>
  );
};

export default ComputersCanvas;