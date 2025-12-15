"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-white dark:bg-slate-900">
      <BackNav />
      <Opening />
      <WhatThis />
      <WhyCare />
      <HowWorks />
      <WhatNext />
      <Ending />
    </main>
  );
}

function BackNav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="fixed top-8 left-8 z-[100]"
    >
      <Link
        href="/dashboard"
        className="text-black dark:text-white text-sm tracking-wider hover:tracking-widest transition-all duration-300 flex items-center gap-2"
      >
        <span>←</span> Back to home
      </Link>
    </motion.nav>
  );
}

function Opening() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 relative"
    >
      <motion.div style={{ opacity }} className="max-w-4xl">
        <h1 className="text-fluid-4xl font-bold tracking-tightest leading-compressed mb-12">
          Numbers
          <br />
          lie.
        </h1>
        <p className="text-fluid-base tracking-wide leading-spacious max-w-md">
          Points per game is an average.
          <br />
          An average hides everything interesting.
        </p>
      </motion.div>
    </section>
  );
}

function WhatThis() {
  return (
    <section className="min-h-screen flex items-start justify-end px-6 pt-32 pb-20">
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className="text-fluid-sm uppercase tracking-widest mb-8 text-black/40">
            What is this
          </p>

          <div className="space-y-8">
            <p className="text-fluid-xl font-light tracking-super-tight leading-tight-reading">
              A player doesn't score 23 points.
            </p>
            
            <p className="text-fluid-base leading-reading text-black/70 max-w-lg">
              They score 18, or 27, or 31.
              <br />
              <br />
              Sometimes 12.
              <br />
              Once, 45.
            </p>

            <p className="text-fluid-lg font-medium tracking-tight leading-tight-reading max-w-xl pt-8">
              This is a model that thinks in distributions,
              not averages.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function WhyCare() {
  return (
    <section className="min-h-screen flex items-center px-6 py-20">
      <div className="w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true, margin: "-150px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
        >
          <div className="lg:col-span-4">
            <p className="text-fluid-sm uppercase tracking-widest mb-4 text-black/40">
              Why should I care
            </p>
          </div>

          <div className="lg:col-span-8 space-y-12">
            <div>
              <p className="text-fluid-2xl font-bold tracking-tightest leading-compressed mb-4">
                Because variance
                <br />
                is signal.
              </p>
              <p className="text-fluid-base leading-reading text-black/60 max-w-xl">
                Not noise.
              </p>
            </div>

            <div className="border-l-2 border-black/10 pl-8 space-y-6">
              <p className="text-fluid-base leading-reading">
                When a player's floor is 8 points and their ceiling is 32,
                that tells you something about their role, their usage, their volatility.
              </p>
              
              <p className="text-fluid-base leading-reading text-black/70">
                It tells you when they're safe.
                <br />
                And when they're not.
              </p>
            </div>

            <p className="text-fluid-lg font-medium tracking-tight leading-tight-reading max-w-2xl pt-8">
              This model doesn't predict a number.
              <br />
              It predicts a shape.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HowWorks() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-black text-white">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-5xl space-y-24"
      >
        <div>
          <p className="text-fluid-sm uppercase tracking-widest mb-12 text-white/40">
            What happens if I keep going
          </p>

          <div className="space-y-16">
            <div>
              <h2 className="text-fluid-3xl font-bold tracking-tightest leading-compressed mb-8">
                Minutes determine everything.
              </h2>
              <p className="text-fluid-base leading-reading text-white/70 max-w-2xl">
                First, we predict playing time.
                <br />
                Not from averages—from lineup dynamics, rest patterns, and opponent pace.
              </p>
            </div>

            <div className="pl-12 border-l border-white/20 space-y-6">
              <p className="text-fluid-lg leading-reading">
                Then we model usage.
              </p>
              <p className="text-fluid-base leading-reading text-white/60 max-w-xl">
                How often they touch the ball.
                <br />
                How the offense moves when they're on the court.
                <br />
                Who else is playing.
              </p>
            </div>

            <div>
              <p className="text-fluid-xl font-medium tracking-tight leading-tight-reading max-w-2xl">
                Then we combine it into a probability distribution for every counting stat.
              </p>
              <p className="text-fluid-base leading-reading text-white/50 max-w-xl mt-6">
                Points. Rebounds. Assists.
                <br />
                Not as predictions.
                <br />
                As likelihoods.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-16 space-y-8">
          <div className="h-px bg-white/10"></div>
          <p className="text-fluid-base leading-reading text-white/50 max-w-2xl">
            The model is retrained before every slate.
            <br />
            It learns from mistakes.
            <br />
            It adjusts to drift.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

function WhatNext() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 py-32">
      <div className="max-w-4xl mx-auto w-full space-y-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className="text-fluid-sm uppercase tracking-widest mb-12 text-black/40">
            What happens if I stop
          </p>

          <div className="space-y-12">
            <p className="text-fluid-2xl font-bold tracking-tightest leading-compressed">
              You keep guessing.
            </p>

            <p className="text-fluid-base leading-reading text-black/60 max-w-xl">
              Or you check back when you're ready to think in probabilities
              instead of certainties.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          className="pt-16"
        >
          <InteractionZone />
        </motion.div>
      </div>
    </section>
  );
}

function InteractionZone() {
  const handleExplore = () => {
    // This would navigate to the predictions interface
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <motion.button
          onClick={handleExplore}
          className="group relative text-left"
          whileHover="hover"
        >
          <motion.div
            className="text-fluid-xl font-medium tracking-tight leading-tight-reading"
            variants={{
              hover: { x: 12 },
            }}
            transition={{ duration: 0.3 }}
          >
            See today's predictions
          </motion.div>
          <motion.div
            className="h-px bg-black mt-2 origin-left"
            variants={{
              hover: { scaleX: 1.1 },
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>
    </div>
  );
}

function Ending() {
  return (
    <section className="min-h-[60vh] flex items-end px-6 pb-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2 }}
        viewport={{ once: true, margin: "-50px" }}
        className="w-full max-w-7xl mx-auto"
      >
        <div className="border-t border-black/5 pt-12 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-2">
              <p className="text-fluid-sm text-black/30 tracking-wide">
                Built with intention.
              </p>
              <p className="text-fluid-sm text-black/20 tracking-wide">
                Not urgency.
              </p>
            </div>

            <div className="text-right space-y-1">
              <p className="text-fluid-sm text-black/30 tracking-wide">
                Model v1
              </p>
              <p className="text-fluid-sm text-black/20 tracking-wide font-mono">
                December 2025
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
