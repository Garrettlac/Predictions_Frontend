"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface UserProfile {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  birthday: string;
}

interface UserStats {
  active_predictions: number;
  total_predictions: number;
  successful_predictions: number;
  roi_percentage: number;
}

interface UserPick {
  id: string;
  player_name: string;
  stat_type: string;
  prediction_value: number;
  actual_value: number | null;
  status: string;
  game_date: string;
}

export default function DashboardPage() {
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentPicks, setRecentPicks] = useState<UserPick[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    async function loadData() {
      if (user) {
        // Load profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Load stats
        const { data: statsData } = await supabase
          .from("user_stats")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (statsData) {
          setStats(statsData);
        }

        // Load recent picks
        const { data: picksData } = await supabase
          .from("user_picks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (picksData) {
          setRecentPicks(picksData);
        }

        setLoadingData(false);
      }
    }

    loadData();
  }, [user]);

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const winRate = stats && stats.total_predictions > 0
    ? ((stats.successful_predictions / stats.total_predictions) * 100).toFixed(1)
    : "0.0";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              NBA Props
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/dashboard" className="text-slate-700 font-semibold hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/picks" className="text-slate-600 hover:text-blue-600 transition-colors">
                Today's Picks
              </Link>
              <Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">
                How It Works
              </Link>
            </nav>
          </div>
          
          <Link href="/account" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
            Account
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-black text-slate-900 mb-3">
            Welcome back, {profile?.first_name || "User"}!
          </h1>
          <p className="text-xl text-slate-600">
            Here's your personalized NBA predictions dashboard
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Active Predictions", value: stats?.active_predictions || 0, icon: "📊" },
            { label: "Win Rate", value: `${winRate}%`, icon: "🎯" },
            { label: "ROI", value: `${stats?.roi_percentage?.toFixed(1) || "0.0"}%`, icon: "📈" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{stat.icon}</span>
                <span className="text-3xl font-black text-slate-900">{stat.value}</span>
              </div>
              <p className="text-slate-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/picks">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
              >
                View Today's Picks →
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-6 bg-slate-100 text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all"
              >
                Learn How It Works →
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Recent Picks */}
        {recentPicks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Picks</h2>
            <div className="space-y-3">
              {recentPicks.map((pick) => (
                <div
                  key={pick.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{pick.player_name}</p>
                    <p className="text-sm text-slate-600">
                      {pick.stat_type}: {pick.prediction_value}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        pick.status === "won"
                          ? "bg-green-100 text-green-700"
                          : pick.status === "lost"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {pick.status.charAt(0).toUpperCase() + pick.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
