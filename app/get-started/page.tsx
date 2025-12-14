"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function GetStartedPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    router.push("/dashboard");
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex">
      {/* Back to home */}
      <Link
        href="/"
        className="fixed top-8 left-8 text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors z-50"
      >
        <span>←</span> Back to home
      </Link>

      {/* Left side - Features (3/4) */}
      <div className="w-3/4 p-12 flex flex-col justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-black text-white mb-6 leading-tight">
              Start Making{" "}
              <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Smarter Picks
              </span>
            </h1>
            <p className="text-xl text-white/70 mb-12">
              Access advanced NBA predictions powered by probabilistic modeling and real-time data.
            </p>
          </motion.div>

          {/* Feature list - 2 rectangles */}
          <div className="space-y-4">
            {[
              {
                icon: "📊",
                title: "Probability Distributions",
                description: "See the full range of outcomes, not just averages"
              },
              {
                icon: "🎯",
                title: "Real-Time Predictions",
                description: "Instant updates based on lineups and matchups"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="flex items-center gap-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="text-5xl">{feature.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{feature.title}</h3>
                  <p className="text-white/60">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Sign in/Sign up (1/4) */}
      <div className="w-1/4 bg-slate-950/50 backdrop-blur-xl border-l border-white/10 flex flex-col justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Toggle between sign in and sign up */}
          <div className="flex gap-2 mb-8 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                !isSignUp
                  ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                isSignUp
                  ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {!isSignUp ? <SignInForm /> : <SignUpForm />}
        </motion.div>
      </div>
    </main>
  );
}

function SignInForm() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn(emailOrUsername, password);
    
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Sign in failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-white/90 mb-2">
          Email or Username
        </label>
        <input
          id="email"
          type="text"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="email@example.com or username"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-white/90 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30"
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </motion.button>
    </form>
  );
}

function SignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!firstName || !lastName || !username || !birthday) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    const result = await signUp(email, password, {
      email,
      username,
      firstName,
      lastName,
      birthday,
    });
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } else {
      setError(result.error || "Sign up failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="block text-xs font-semibold text-white/90 mb-1">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="John"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-xs font-semibold text-white/90 mb-1">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Doe"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email-signup" className="block text-xs font-semibold text-white/90 mb-1">
          Email
        </label>
        <input
          id="email-signup"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="username" className="block text-xs font-semibold text-white/90 mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="johndoe23"
        />
      </div>

      <div>
        <label htmlFor="birthday" className="block text-xs font-semibold text-white/90 mb-1">
          Birthday
        </label>
        <input
          id="birthday"
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all [color-scheme:dark]"
        />
      </div>

      <div>
        <label htmlFor="password-signup" className="block text-xs font-semibold text-white/90 mb-1">
          Password
        </label>
        <input
          id="password-signup"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-xs font-semibold text-white/90 mb-1">
          Confirm
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-xs"
        >
          Account created! Redirecting...
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </motion.button>
    </form>
  );
}
