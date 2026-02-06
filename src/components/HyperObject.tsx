'use client';

import { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, Float, Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStore } from '@/store/useStore';

export function HyperObject() {
  const scroll = useScroll();
  const updateAnnotation = useStore((state) => state.updateAnnotation);
  const { camera } = useThree();

  const nebulaRef = useRef<THREE.Points>(null);
  const starRef = useRef<THREE.Group>(null);
  const starMeshRef = useRef<THREE.Mesh>(null);
  const planetRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const diskRef = useRef<THREE.Points>(null);
  const dysonInnerRef = useRef<THREE.Mesh>(null);
  const dysonPanelsRef = useRef<THREE.Group>(null);
  const dysonOuterRef = useRef<THREE.Group>(null);

  const annotations = useMemo(() => [
    { 
      stage: 'nebula', 
      pos: new THREE.Vector3(2.5, 2.5, 0), 
      target: new THREE.Vector3(0, 0, 0),
      title: 'Primordial Creativity', 
      offsetRange: [0, 0.2] 
    },
    { 
      stage: 'star', 
      pos: new THREE.Vector3(-3.5, 2, 0), 
      target: new THREE.Vector3(0, 0, 0),
      title: 'The Ignition', 
      offsetRange: [0.3, 0.45] 
    },
    { 
      stage: 'planet', 
      pos: new THREE.Vector3(3.5, -2, 0), 
      target: new THREE.Vector3(0, 0, 0),
      title: 'Sustainable Growth', 
      offsetRange: [0.55, 0.75] 
    },
    { 
      stage: 'dyson', 
      pos: new THREE.Vector3(-3, -2.5, 0), 
      target: new THREE.Vector3(0, 0, 0),
      title: 'Total Innovation', 
      offsetRange: [0.85, 1.0] 
    },
  ], []);

  // Nebula particles
  const particles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color1 = new THREE.Color('#442288');
    const color2 = new THREE.Color('#ff00aa');

    for (let i = 0; i < count; i++) {
      const r = Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    return { positions, colors };
  }, []);

  const diskParticles = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 2] = r * Math.sin(theta);
    }
    return positions;
  }, []);

  // GSAP Timeline for scroll-driven evolution
  const tl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    tl.current = gsap.timeline({ paused: true });

    // Nebula Evolution
    tl.current.to(nebulaRef.current!.scale, { x: 0.2, y: 0.2, z: 0.2, duration: 0.25 }, 0);
    tl.current.to(nebulaRef.current!.material, { opacity: 0, duration: 0.1 }, 0.15);

    // Star Evolution
    tl.current.fromTo(starRef.current!.scale, { x: 0, y: 0, z: 0 }, { x: 2, y: 2, z: 2, duration: 0.2 }, 0.15);
    tl.current.to(starRef.current!.scale, { x: 0.4, y: 0.4, z: 0.4, duration: 0.25 }, 0.45);

    // Disk Evolution
    tl.current.fromTo(diskRef.current!.material, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.35);
    tl.current.to(diskRef.current!.material, { opacity: 0, duration: 0.15 }, 0.55);

    // Planet Evolution
    tl.current.fromTo(planetRef.current!.scale, { x: 0, y: 0, z: 0 }, { x: 0.3, y: 0.3, z: 0.3, duration: 0.15 }, 0.45);

    // Dyson Sphere Evolution
    tl.current.fromTo(dysonInnerRef.current!.scale, { x: 0, y: 0, z: 0 }, { x: 1.6, y: 1.6, z: 1.6, duration: 0.1 }, 0.75);
    tl.current.fromTo(dysonPanelsRef.current!.scale, { x: 0, y: 0, z: 0 }, { x: 0.9, y: 0.9, z: 0.9, duration: 0.1 }, 0.8);
    tl.current.fromTo(dysonOuterRef.current!.scale, { x: 0, y: 0, z: 0 }, { x: 0.9, y: 0.9, z: 0.9, duration: 0.1 }, 0.85);

  }, []);

  useFrame((state, delta) => {
    const offset = scroll.offset;
    const time = state.clock.getElapsedTime();

    // Update GSAP timeline progress
    if (tl.current) {
      tl.current.progress(offset);
    }

    // Continuous animations (rotations)
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y += delta * 0.05;
      nebulaRef.current.rotation.z += delta * 0.02;
    }
    if (starRef.current) starRef.current.rotation.y += delta * 0.5;
    if (diskRef.current) diskRef.current.rotation.y += delta * 0.2;

    if (planetRef.current) {
      const orbitRadius = 1.1;
      const orbitSpeed = -time * 0.5;
      const x = Math.cos(orbitSpeed) * orbitRadius;
      const z = Math.sin(orbitSpeed) * orbitRadius;
      planetRef.current.position.set(x, 0, z);
      planetRef.current.rotation.y += delta * 1;

      const perspectiveFactor = THREE.MathUtils.mapLinear(z, -orbitRadius, orbitRadius, 0.4, 1.6);
      const baseScale = tl.current ? (tl.current.targets().find((t: any) => t === planetRef.current?.scale) as any)?.x || 0 : 0;
      // Note: Since we use GSAP for base scale, we might need to multiply it here
      // But for simplicity in this refactor, let's just use the current scale and apply perspective
      planetRef.current.scale.multiplyScalar(perspectiveFactor / (planetRef.current.scale.x / (baseScale || 0.001)));
      // Correction: Let's just manually set it for now to avoid complex math in useFrame
      const pScale = THREE.MathUtils.lerp(0, 0.3, THREE.MathUtils.smoothstep(offset, 0.45, 0.6));
      planetRef.current.scale.setScalar(pScale * perspectiveFactor);

      // Color transition logic (keep in useFrame for now as it's complex for GSAP)
      if (planetMeshRef.current) {
        const material = planetMeshRef.current.material as THREE.MeshStandardMaterial;
        const colorProgress = THREE.MathUtils.smoothstep(offset, 0.5, 0.75);
        const red = new THREE.Color('#ff4400');
        const blue = new THREE.Color('#2266cc');
        const green = new THREE.Color('#22cc66');
        if (colorProgress < 0.5) {
          material.color.lerpColors(red, blue, colorProgress * 2);
          material.emissive.lerpColors(red, new THREE.Color('#000000'), colorProgress * 2);
        } else {
          material.color.lerpColors(blue, green, (colorProgress - 0.5) * 2);
          material.emissive.set('#000000');
        }
      }
    }

    if (dysonInnerRef.current) dysonInnerRef.current.rotation.y += delta * 0.2;
    if (dysonPanelsRef.current) dysonPanelsRef.current.rotation.y -= delta * 0.1;
    if (dysonOuterRef.current) {
      dysonOuterRef.current.rotation.y += delta * 0.05;
      dysonOuterRef.current.rotation.x += delta * 0.02;
    }

    // Update Annotations
    annotations.forEach((anno) => {
      const isVisible = offset >= anno.offsetRange[0] && offset <= anno.offsetRange[1];
      const targetPos = (anno.stage === 'planet' && planetRef.current) ? planetRef.current.position.clone() : anno.target.clone();
      
      const screenPos = anno.pos.clone().project(camera);
      const x = (screenPos.x * 0.5 + 0.5) * 100;
      const y = (screenPos.y * -0.5 + 0.5) * 100;

      updateAnnotation(anno.title, { x, y, visible: isVisible });
    });
  });

  return (
    <group>
      <Points ref={nebulaRef} positions={particles.positions} colors={particles.colors}>
        <PointMaterial transparent vertexColors size={0.08} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </Points>

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={starRef}>
          <Sphere ref={starMeshRef} args={[1, 32, 32]}>
            <MeshDistortMaterial color="#ffaa00" emissive="#ff4400" emissiveIntensity={5} distort={0.4} speed={2} roughness={0} />
          </Sphere>
          <Sphere args={[1.2, 32, 32]}>
            <meshStandardMaterial color="#ffcc00" transparent opacity={0.2} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
          </Sphere>
        </group>
      </Float>

      <Points ref={diskRef} positions={diskParticles}>
        <PointMaterial transparent size={0.05} sizeAttenuation depthWrite={false} color="#ffaa44" blending={THREE.AdditiveBlending} />
      </Points>

      <group ref={planetRef}>
        <Sphere ref={planetMeshRef} args={[0.8, 32, 32]}>
          <meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={2} roughness={0.8} metalness={0.2} flatShading />
        </Sphere>
        <Sphere args={[0.85, 32, 32]}>
          <meshStandardMaterial color="#44aaff" transparent opacity={0.3} side={THREE.BackSide} />
        </Sphere>
        <group>
          {[...Array(5)].map((_, i) => (
            <mesh key={i} position={[Math.cos(i * 2) * 1.2, Math.sin(i * 2) * 0.2, Math.sin(i * 2) * 1.2]}>
              <boxGeometry args={[0.05, 0.05, 0.05]} />
              <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={2} />
            </mesh>
          ))}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.4, 0.01, 16, 32]} />
            <meshStandardMaterial color="#555555" />
          </mesh>
        </group>
        {[...Array(30)].map((_, i) => {
          const phi = Math.acos(-1 + (2 * i) / 30);
          const theta = Math.sqrt(30 * Math.PI) * phi;
          const h = Math.random() * 0.2 + 0.05;
          return (
            <group key={i} position={[0.8 * Math.sin(phi) * Math.cos(theta), 0.8 * Math.sin(phi) * Math.sin(theta), 0.8 * Math.cos(phi)]} rotation={[0, theta, phi]}>
              <mesh position={[0, h/2, 0]}>
                <boxGeometry args={[0.08, h, 0.08]} />
                <meshStandardMaterial color={i % 5 === 0 ? "#ffdd00" : "#ffffff"} emissive={i % 5 === 0 ? "#ffaa00" : "#000000"} emissiveIntensity={2} />
              </mesh>
            </group>
          );
        })}
      </group>

      <group>
        <mesh ref={dysonInnerRef}>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial color="#000000" emissive="#ff00ff" emissiveIntensity={2} wireframe />
        </mesh>
        <group ref={dysonPanelsRef}>
          {[...Array(24)].map((_, i) => (
            <group key={i} rotation={[i * 0.5, i * 0.8, i * 0.2]}>
              <mesh position={[0, 0, 0.9]}>
                <boxGeometry args={[0.2, 0.01, 0.3]} />
                <meshStandardMaterial color="#000000" metalness={1} roughness={0.1} />
                <mesh position={[0, 0.01, 0]}>
                  <boxGeometry args={[0.15, 0.005, 0.05]} />
                  <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={5} />
                </mesh>
              </mesh>
            </group>
          ))}
        </group>
        <group ref={dysonOuterRef}>
          <mesh>
            <icosahedronGeometry args={[0.9, 1]} />
            <meshStandardMaterial color="#000000" roughness={0.1} metalness={0.9} flatShading />
          </mesh>
          <mesh scale={0.98}>
            <icosahedronGeometry args={[0.9, 1]} />
            <meshStandardMaterial color="#000000" emissive="#ff00ff" emissiveIntensity={4} wireframe />
          </mesh>
          <Sphere args={[0.25, 16, 16]}>
            <meshStandardMaterial color="#ffaa00" emissive="#ff4400" emissiveIntensity={10} />
          </Sphere>
        </group>
      </group>

      {annotations.map((anno, i) => (
        <AnnotationLine key={i} position={anno.pos} target={anno.stage === 'planet' && planetRef.current ? planetRef.current.position : anno.target} visible={offset >= anno.offsetRange[0] && offset <= anno.offsetRange[1]} />
      ))}
    </group>
  );
}

function AnnotationLine({ position, target, visible }: { position: THREE.Vector3, target: THREE.Vector3, visible: boolean }) {
  const lineRef = useRef<THREE.BufferGeometry>(null);
  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.setFromPoints([position, target]);
    }
  });
  return (
    <line visible={visible}>
      <bufferGeometry ref={lineRef} />
      <lineBasicMaterial color="white" transparent opacity={0.5} depthTest={false} />
    </line>
  );
}
