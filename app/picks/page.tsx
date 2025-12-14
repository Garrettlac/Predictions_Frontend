"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import type { User } from "@supabase/supabase-js";

export default function PicksPage() {
  const { isAuthenticated, user, signOut, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to load, then check if authenticated
    if (!loading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      <Header user={user} signOut={signOut} />
      <PicksGrid />
    </main>
  );
}

function Header({ user, signOut }: { user: User | null; signOut: () => Promise<void> }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium text-gray-700 hover:text-black transition-colors flex items-center gap-2"
        >
          <span>←</span> Back
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-1/2 -translate-x-1/2"
        >
          <h1 className="text-xl font-black tracking-tight">Today's Picks</h1>
          <p className="text-xs text-gray-500 text-center">December 14, 2025</p>
        </motion.div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {user?.email}
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>
    </header>
  );
}

function PicksGrid() {
  const [filter, setFilter] = useState<"all" | "high" | "medium">("all");

  const predictions = [
    { player: "Luka Dončić", stat: "PTS", line: 32.5, prob: 73, team: "DAL", matchup: "vs PHX", confidence: "high" },
    { player: "Nikola Jokić", stat: "REB", line: 11.5, prob: 68, team: "DEN", matchup: "@ LAL", confidence: "high" },
    { player: "Damian Lillard", stat: "AST", line: 7.5, prob: 61, team: "MIL", matchup: "vs CHI", confidence: "medium" },
    { player: "Jayson Tatum", stat: "PTS", line: 27.5, prob: 71, team: "BOS", matchup: "@ NYK", confidence: "high" },
    { player: "Anthony Davis", stat: "REB", line: 10.5, prob: 66, team: "LAL", matchup: "vs DEN", confidence: "high" },
    { player: "Tyrese Haliburton", stat: "AST", line: 9.5, prob: 59, team: "IND", matchup: "@ ATL", confidence: "medium" },
    { player: "Giannis Antetokounmpo", stat: "PTS", line: 30.5, prob: 64, team: "MIL", matchup: "vs CHI", confidence: "medium" },
    { player: "Kevin Durant", stat: "PTS", line: 26.5, prob: 69, team: "PHX", matchup: "@ DAL", confidence: "high" },
    { player: "Joel Embiid", stat: "REB", line: 10.5, prob: 62, team: "PHI", matchup: "vs CLE", confidence: "medium" },
  ];

  const filteredPredictions = predictions.filter(p => {
    if (filter === "all") return true;
    if (filter === "high") return p.confidence === "high";
    if (filter === "medium") return p.confidence === "medium";
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 flex items-center gap-4"
      >
        <span className="text-sm font-medium text-gray-600">Filter:</span>
        <div className="flex gap-2">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="All Picks"
            count={predictions.length}
          />
          <FilterButton
            active={filter === "high"}
            onClick={() => setFilter("high")}
            label="High Confidence"
            count={predictions.filter(p => p.confidence === "high").length}
          />
          <FilterButton
            active={filter === "medium"}
            onClick={() => setFilter("medium")}
            label="Medium Confidence"
            count={predictions.filter(p => p.confidence === "medium").length}
          />
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPredictions.map((prediction, idx) => (
          <PredictionCard key={`${prediction.player}-${prediction.stat}`} prediction={prediction} delay={idx * 0.05} />
        ))}
      </div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 p-8 bg-white rounded-2xl shadow-lg border border-gray-200"
      >
        <h3 className="text-lg font-bold mb-4">Today's Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatBox label="Total Picks" value={predictions.length} />
          <StatBox label="Avg Confidence" value={`${Math.round(predictions.reduce((acc, p) => acc + p.prob, 0) / predictions.length)}%`} />
          <StatBox label="High Confidence" value={predictions.filter(p => p.confidence === "high").length} />
        </div>
      </motion.div>
    </div>
  );
}

function FilterButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        active
          ? "bg-slate-900 text-white"
          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
      }`}
    >
      {label} <span className="opacity-60">({count})</span>
    </button>
  );
}

function PredictionCard({ prediction, delay }: { prediction: any; delay: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-300 relative overflow-hidden"
    >
      {/* Confidence Badge */}
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          prediction.confidence === "high"
            ? "bg-blue-100 text-blue-700"
            : "bg-slate-100 text-slate-700"
        }`}>
          {prediction.confidence === "high" ? "🔥 High" : "Medium"}
        </span>
      </div>

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-bold">
            {prediction.team}
          </span>
          <span className="text-xs text-gray-500">{prediction.matchup}</span>
        </div>
        <h3 className="text-xl font-bold">{prediction.player}</h3>
      </div>

      {/* Stat Line */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black">{prediction.stat}</span>
          <span className="text-gray-600">over</span>
          <span className="text-2xl font-black text-blue-700">{prediction.line}</span>
        </div>
      </div>

      {/* Probability */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Probability</span>
          <span className="text-2xl font-black">{prediction.prob}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-slate-600 to-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: isHovered ? `${prediction.prob}%` : "0%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Hover State - Additional Info */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-gray-200"
        >
          <p className="text-xs text-gray-500">
            Based on minutes projection, usage rate, and matchup analysis
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
