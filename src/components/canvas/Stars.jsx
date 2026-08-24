import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as random from "maath/random/dist/maath-random.esm";

import { isWebGLAvailable } from "../../utils/webgl";

// Must be a multiple of 3 (x, y, z per point) or the trailing point is NaN,
// which makes THREE.BufferGeometry.computeBoundingSphere() report NaN radius.
const STAR_COUNT = 5001;

const Stars = (props) => {
  const ref = useRef();
  const shouldReduceMotion = useReducedMotion();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(STAR_COUNT), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    if (shouldReduceMotion || !ref.current) return;

    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color='#f272c8'
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  // Purely decorative, so without WebGL it just goes away.
  if (!isWebGLAvailable()) return null;

  return (
    <div
      aria-hidden='true'
      className='w-full h-auto absolute inset-0 z-[-1]'
    >
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
