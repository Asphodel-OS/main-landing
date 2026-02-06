'use client';

import { useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';

export function Overlay() {
  const offset = useStore((state) => state.scrollOffset);
  const annotations = useStore((state) => state.annotations);
  
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);

  // Refs for annotation boxes
  const annoRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (section1Ref.current) section1Ref.current.style.opacity = (smoothStep(offset, 0, 0.05) * (1 - smoothStep(offset, 0.15, 0.2))).toString();
    if (section2Ref.current) section2Ref.current.style.opacity = (smoothStep(offset, 0.25, 0.35) * (1 - smoothStep(offset, 0.45, 0.5))).toString();
    if (section3Ref.current) section3Ref.current.style.opacity = (smoothStep(offset, 0.55, 0.65) * (1 - smoothStep(offset, 0.75, 0.8))).toString();
    if (section4Ref.current) section4Ref.current.style.opacity = (smoothStep(offset, 0.85, 0.95)).toString();
  }, [offset]);

  const annotationList = [
    { 
      id: 'Primordial Creativity',
      title: 'Primordial Creativity', 
      text: 'Asphodel Studios began as a cloud of raw ideas, swirling in the digital void before taking form.'
    },
    { 
      id: 'The Ignition',
      title: 'The Ignition', 
      text: 'Our core values provide the gravitational pull and energy that powers every project we ignite.'
    },
    { 
      id: 'Sustainable Growth',
      title: 'Sustainable Growth', 
      text: 'We cultivate digital ecosystems that are built to last, nurturing them from molten ideas to lush worlds.'
    },
    { 
      id: 'Total Innovation',
      title: 'Total Innovation', 
      text: 'The final stage of our process: a complete, all-encompassing structure that captures every drop of potential.'
    }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-10 text-white font-sans">
      {/* Main Sections */}
      <Section innerRef={section1Ref} top="20%" left="10%">
        <h1 className="text-6xl font-bold mb-4">Asphodel Studios</h1>
        <p className="text-xl text-zinc-400 max-w-md">
          From the primordial dust of creativity, we forge the future of digital experiences.
        </p>
      </Section>

      <Section innerRef={section2Ref} top="40%" right="10%" align="right">
        <h2 className="text-4xl font-bold mb-4">Ignition</h2>
        <p className="text-xl text-zinc-400 max-w-md">
          Our core values burn bright, providing the energy and vision for every project we undertake.
        </p>
      </Section>

      <Section innerRef={section3Ref} top="60%" left="10%">
        <h2 className="text-4xl font-bold mb-4">Cultivation</h2>
        <p className="text-xl text-zinc-400 max-w-md">
          We build sustainable ecosystems, nurturing ideas until they become thriving digital worlds.
        </p>
      </Section>

      <Section innerRef={section4Ref} top="50%" left="50%" center>
        <h2 className="text-4xl font-bold mb-4 text-center">The Dyson Sphere</h2>
        <p className="text-xl text-zinc-400 max-w-lg text-center">
          A complete, all-encompassing solution. We surround your brand with a structure of pure innovation.
        </p>
      </Section>

      {/* Annotation Blurbs (HUD Style) */}
      {annotationList.map((anno) => {
        const data = annotations[anno.id];
        return (
          <div
            key={anno.id}
            className="absolute transition-all duration-300 flex flex-col items-start w-72"
            style={{ 
              transform: 'translate(-50%, -50%)', 
              left: data ? `${data.x}%` : '50%', 
              top: data ? `${data.y}%` : '50%',
              opacity: data?.visible ? 1 : 0,
              pointerEvents: data?.visible ? 'auto' : 'none'
            }}
          >
            <div className="p-5 bg-black/80 backdrop-blur-2xl border border-white/20 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <h3 className="text-pink-500 text-xs font-bold uppercase tracking-[0.25em] mb-3 border-b border-pink-500/30 pb-2">
                {anno.title}
              </h3>
              <p className="text-white/90 text-[11px] leading-relaxed font-light tracking-wide">
                {anno.text}
              </p>
            </div>
            <div className="w-2.5 h-2.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 absolute top-0 left-0 shadow-[0_0_10px_white]" />
          </div>
        );
      })}

      {/* Scroll Indicator */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 opacity-50 animate-bounce">
        <p className="text-sm uppercase tracking-widest">Scroll to Evolve</p>
      </div>
    </div>
  );
}

function Section({ children, innerRef, top, left, right, align = 'left', center = false }: any) {
  return (
    <section
      ref={innerRef}
      className="absolute transition-opacity duration-500"
      style={{
        opacity: 0,
        top,
        left,
        right,
        transform: center ? 'translate(-50%, -50%)' : 'none',
        textAlign: align as any,
      }}
    >
      <div className="p-8 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10">
        {children}
      </div>
    </section>
  );
}

function smoothStep(x: number, min: number, max: number) {
  if (x <= min) return 0;
  if (x >= max) return 1;
  x = (x - min) / (max - min);
  return x * x * (3 - 2 * x);
}
