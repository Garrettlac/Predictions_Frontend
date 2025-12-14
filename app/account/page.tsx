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
  last_username_change: string | null;
}

export default function AccountPage() {
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [canChangeUsername, setCanChangeUsername] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/get-started");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    async function loadProfile() {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile(data);
          setUsername(data.username);
          setFirstName(data.first_name);
          setLastName(data.last_name);

          // Check if user can change username (once a month)
          if (data.last_username_change) {
            const lastChange = new Date(data.last_username_change);
            const now = new Date();
            const daysSinceChange = (now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24);
            setCanChangeUsername(daysSinceChange >= 30);
          }
        }
      }
    }

    loadProfile();
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setError("");
    setSuccess("");

    const updates: any = {
      first_name: firstName,
      last_name: lastName,
    };

    // Only update username if it changed and user is allowed
    if (username !== profile.username) {
      if (!canChangeUsername) {
        setError("You can only change your username once a month");
        return;
      }
      updates.username = username;
      updates.last_username_change = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user!.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      // Reload profile
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();
      if (data) setProfile(data);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

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
              <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 transition-colors">
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
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-black text-slate-900 mb-3">Account Settings</h1>
          <p className="text-xl text-slate-600">Manage your profile and preferences</p>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          <div className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username {!canChangeUsername && "(Cannot change for 30 days)"}
              </label>
              {isEditing && canChangeUsername ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-lg text-slate-900">@{username}</p>
              )}
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-lg text-slate-900">{firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-lg text-slate-900">{lastName}</p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <p className="text-lg text-slate-900">{profile.email}</p>
            </div>

            {/* Birthday (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Birthday</label>
              <p className="text-lg text-slate-900">
                {new Date(profile.birthday).toLocaleDateString()}
              </p>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setUsername(profile.username);
                  setFirstName(profile.first_name);
                  setLastName(profile.last_name);
                  setError("");
                  setSuccess("");
                }}
                className="px-6 py-3 bg-gray-200 text-slate-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </motion.div>

        {/* Sign Out Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Account Actions</h2>
          <button
            onClick={handleSignOut}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
    </main>
  );
}
