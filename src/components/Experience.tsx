'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Stars, useScroll } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense, useEffect } from 'react';
import { HyperObject } from './HyperObject';
import { Overlay } from './Overlay';
import { useStore } from '@/store/useStore';

function ScrollManager() {
  const scroll = useScroll();
  const setScrollOffset = useStore((state) => state.setScrollOffset);
  
  useFrame(() => {
    setScrollOffset(scroll.offset);
  });
  return null;
}

export default function Experience() {
  return (
    <div className="h-screen w-full bg-black">
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 35 }}
      >
        <color attach="background" args={['#020205']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffcc00" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4400ff" />
        
        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <ScrollControls pages={5} damping={0.2}>
            <HyperObject />
            <ScrollManager />
          </ScrollControls>

          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
          </EffectComposer>
        </Suspense>
      </Canvas>
      <Overlay />
    </div>
  );
}
