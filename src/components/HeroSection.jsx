import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroSection() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/40 to-slate-950" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-6 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-cyan-300 text-xs font-medium">
            Digital Identity · Fintech · Modern · Futuristic
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            AI Requirements Analyst
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            Upload your High-Level Design. I will parse, analyze, and summarize it. On your confirmation, I will generate a concise set of Epics & Features with detailed, meaningful User Stories.
          </p>
        </div>
      </div>
    </section>
  );
}
