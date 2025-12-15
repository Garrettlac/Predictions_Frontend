"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-white">
      <FloatingNav />
      <Hero />
      <InteractiveProbability />
      <VisualConcept />
      <PlayfulCTA />
    </main>
  );
}

function FloatingNav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="fixed top-8 right-8 z-50 mix-blend-difference"
    >
      <Link
        href="/about"
        className="text-white text-sm tracking-wider hover:tracking-widest transition-all duration-300"
      >
        How it works
      </Link>
    </motion.nav>
  );
}

function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgb(100, 116, 139) 0%, 
            rgb(71, 85, 105) 15%, 
            rgb(51, 65, 85) 30%, 
            rgb(30, 41, 59) 50%, 
            rgb(15, 23, 42) 70%, 
            rgb(248, 250, 252) 100%)`,
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(to right, black 1px, transparent 1px),
            linear-gradient(to bottom, black 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-6xl pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pb-6"
        >
          <h1 className="text-fluid-4xl md:text-[12vw] font-black tracking-tighter leading-[1.2] mb-4 overflow-visible">
            <span className="inline-block">
              <motion.span
                className="inline-block"
                animate={{
                  rotateX: [0, 10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Stop
              </motion.span>
            </span>
            <br />
            <span className="inline-block px-2 pb-6 overflow-visible relative z-50">
              <motion.span
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-slate-600 via-blue-700 to-slate-800 relative z-50"
                style={{ perspective: 1000 }}
                animate={{
                  rotateY: [0, 10, 0],
                }}
                transition={{
                  duration: 3,
                  delay: 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Guessing
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-fluid-lg md:text-3xl font-light tracking-tight max-w-3xl mx-auto"
          >
            NBA predictions that think in{" "}
            <span className="font-bold italic text-blue-700">probabilities</span>,
            not{" "}
            <span className="line-through opacity-50">averages</span>
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/get-started">
            <motion.button
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-slate-900 text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-blue-900/50 transition-shadow"
            >
              See today's picks
            </motion.button>
          </Link>

          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-6xl"
          >
            👇
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function InteractiveProbability() {
  const [hoverValue, setHoverValue] = useState(50);
  const [probability, setProbability] = useState(50);
  const [yPosition, setYPosition] = useState(50);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setHoverValue(percentage);
    
    // Calculate probability based on bell curve (normal distribution)
    // Peak is at 50%, falls off on both sides
    const distance = Math.abs(percentage - 50);
    const prob = Math.round(100 * Math.exp(-Math.pow(distance / 25, 2)));
    setProbability(prob);
    
    // Calculate Y position to follow the bell curve
    // The curve peaks at center (low Y) and rises at edges (high Y)
    const curveHeight = 20 + (80 * Math.exp(-Math.pow(distance / 25, 2)));
    setYPosition(100 - curveHeight);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-gray-50">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-fluid-3xl font-black tracking-tight mb-6 text-center">
            Not <span className="text-slate-600">"23.4 PPG"</span>
          </h2>
          <p className="text-fluid-xl text-center mb-16 text-gray-600 max-w-2xl mx-auto">
            But <span className="font-bold text-blue-700">"a full probability distribution"</span>
          </p>

          <div
            className="relative h-80 bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl shadow-2xl overflow-hidden cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Background grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `
                  linear-gradient(to right, white 1px, transparent 1px),
                  linear-gradient(to bottom, white 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }} />
            </div>

            {/* Distribution curve */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path
                d="M 0 100 Q 25 80, 50 20 T 100 100"
                fill="url(#curveGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 0.4 : 0.2 }}
              />
              <motion.path
                d="M 0 100 Q 25 80, 50 20 T 100 100"
                stroke="#3b82f6"
                strokeWidth="0.5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1e40af" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Interactive cursor line */}
            {isHovering && (
              <motion.div
                className="absolute top-0 bottom-0 w-0.5 bg-white/50"
                style={{ left: `${hoverValue}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
            
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <motion.div
                animate={{
                  scale: isHovering ? 1.05 : 1,
                }}
                className="text-center"
              >
                <motion.div className="text-7xl font-black text-white drop-shadow-2xl mb-2">
                  {probability}%
                </motion.div>
                <div className="text-white/60 text-sm font-medium mb-1 whitespace-nowrap">
                  Probability at this threshold
                </div>
                <div className="text-white/90 text-xl mt-2 font-medium whitespace-nowrap">
                  {isHovering ? "Slide to explore outcomes" : "Hover to interact"}
                </div>
              </motion.div>
            </div>

            {/* Bottom axis labels */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6 text-white/40 text-xs font-mono">
              <span>10</span>
              <span>15</span>
              <span>20</span>
              <span className="text-white/80 font-bold">23</span>
              <span>25</span>
              <span>30</span>
              <span>35</span>
            </div>
          </div>

          <p className="text-center mt-8 text-gray-500 text-lg">
            Every point value has a probability. This is variance.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function VisualConcept() {
  const stats = [
    { label: "Points", value: 23, color: "from-slate-500 to-slate-700" },
    { label: "Rebounds", value: 8, color: "from-blue-500 to-blue-700" },
    { label: "Assists", value: 6, color: "from-teal-500 to-teal-700" },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-black text-white">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-fluid-3xl font-black tracking-tight mb-6 text-center">
            Every player is a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-slate-500">
              distribution
            </span>
          </h2>
          <p className="text-fluid-lg text-center mb-20 text-white/60 max-w-2xl mx-auto">
            Not a single number. A shape.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <DistributionCard key={stat.label} stat={stat} delay={idx * 0.2} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DistributionCard({ stat, delay }: { stat: any; delay: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [randomHeights, setRandomHeights] = useState<number[]>([]);

  // Generate random heights when component mounts and when hovered
  useEffect(() => {
    generateRandomHeights();
  }, []);

  const generateRandomHeights = () => {
    const heights = [];
    for (let i = 0; i < 15; i++) {
      const distance = Math.abs(i - 7);
      // Base bell curve with randomization
      const base = 100 - distance * distance * 1.5;
      const randomFactor = 0.7 + Math.random() * 0.6; // Random between 0.7 and 1.3
      heights.push(Math.max(20, base * randomFactor));
    }
    setRandomHeights(heights);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    generateRandomHeights();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all"
    >
      <h3 className="text-2xl font-bold mb-8">{stat.label}</h3>

      <div className="relative h-40 flex items-end justify-center gap-1">
        {[...Array(15)].map((_, i) => {
          const height = randomHeights[i] || 50;

          return (
            <motion.div
              key={i}
              className={`w-full bg-gradient-to-t ${stat.color} rounded-t-lg`}
              animate={{
                height: isHovered ? `${height}%` : `${height * 0.6}%`,
              }}
              transition={{
                delay: i * 0.05,
                duration: 0.4,
                ease: "easeOut",
              }}
            />
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          {stat.value}
        </div>
      </div>
    </motion.div>
  );
}

function LivePreview() {
  const predictions = [
    { player: "Luka Dončić", stat: "PTS", line: 32.5, prob: 73, team: "DAL" },
    { player: "Nikola Jokić", stat: "REB", line: 11.5, prob: 68, team: "DEN" },
    { player: "Damian Lillard", stat: "AST", line: 7.5, prob: 61, team: "MIL" },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <motion.div
              animate={{
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block text-6xl mb-6"
            >
              🏀
            </motion.div>
            <h2 className="text-fluid-3xl font-black tracking-tight mb-4">
              Today's Top Picks
            </h2>
            <p className="text-fluid-base text-gray-600">
              Live predictions, updated every morning
            </p>
          </div>

          <div className="space-y-4">
            {predictions.map((pred, idx) => (
              <PredictionCard key={pred.player} prediction={pred} delay={idx * 0.15} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 bg-gradient-to-r from-slate-700 to-blue-700 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-slate-500/50 transition-shadow"
            >
              See Full Slate
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function PredictionCard({ prediction, delay }: { prediction: any; delay: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-bold">
              {prediction.team}
            </span>
            <h3 className="text-2xl font-bold">{prediction.player}</h3>
          </div>
          <div className="text-gray-600 text-lg">
            {prediction.stat} <span className="font-bold">O {prediction.line}</span>
          </div>
        </div>

        <div className="relative">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
              animate={{
                strokeDashoffset: isHovered
                  ? 2 * Math.PI * 40 * (1 - prediction.prob / 100)
                  : 2 * Math.PI * 40,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-black">{prediction.prob}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PlayfulCTA() {
  const [shapes, setShapes] = useState<Array<{left: string; top: string; duration: number; delay: number; xOffset: number}>>([]);

  useEffect(() => {
    // Generate random values only on client to avoid hydration mismatch
    setShapes([...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 10 + Math.random() * 10,
      delay: Math.random() * 5,
      xOffset: Math.random() * 40 - 20
    })));
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden bg-gradient-to-br from-slate-100 via-gray-100 to-blue-100">
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {shapes.map((shape, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full opacity-20"
            style={{
              background: `linear-gradient(135deg, 
                ${["#64748b", "#475569", "#334155", "#1e293b", "#0f172a"][i % 5]}, 
                ${["#3b82f6", "#2563eb", "#1d4ed8", "#0ea5e9", "#0284c7"][i % 5]})`,
              left: shape.left,
              top: shape.top,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, shape.xOffset, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              delay: shape.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-fluid-4xl font-black tracking-tighter mb-8"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundImage:
                "linear-gradient(90deg, #334155, #475569, #3b82f6, #1e40af, #334155)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Ready to stop
            <br />
            leaving it to luck?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-fluid-xl mb-16 text-gray-700"
          >
            Probabilities beat hunches.
            <br />
            Every single time.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/picks">
              <motion.button
                whileHover={{ scale: 1.1, rotate: -2 }}
                whileTap={{ scale: 0.9 }}
                className="px-16 py-8 bg-black text-white text-2xl font-black rounded-full shadow-2xl hover:shadow-black/30 transition-shadow relative overflow-hidden group"
              >
                <span className="relative z-10">Get Started</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-slate-700 to-blue-700"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>

            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-lg font-medium text-gray-700 hover:text-black transition-colors underline decoration-2 underline-offset-4"
              >
                Learn more about the model
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


