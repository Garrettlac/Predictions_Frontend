"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface UserProfile {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  birthday: string;
  last_username_change: string | null;
  theme: "light" | "dark" | "system";
  email_notifications: boolean;
  daily_alerts: boolean;
  performance_reports: boolean;
}

type Section = "profile" | "account" | "preferences" | "security";

export default function AccountPage() {
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyAlerts, setDailyAlerts] = useState(true);
  const [performanceReports, setPerformanceReports] = useState(false);

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    console.log('[AccountPage] handleThemeChange called with:', newTheme);
    console.log('[AccountPage] setTheme function:', setTheme);
    await setTheme(newTheme);
    setSuccess('Theme updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/get-started");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      try {
        setLoadingProfile(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id);

        if (error) {
          console.error("Error loading profile:", error);
          setError("Failed to load profile: " + error.message);
        } else if (data && data.length > 0) {
          const profileData = data[0];
          setProfile(profileData);
          setUsername(profileData.username);
          setFirstName(profileData.first_name);
          setLastName(profileData.last_name);
          
          // Load notification preferences
          setEmailNotifications(profileData.email_notifications ?? true);
          setDailyAlerts(profileData.daily_alerts ?? true);
          setPerformanceReports(profileData.performance_reports ?? false);

          // Check if user can change username (once a month)
          if (profileData.last_username_change) {
            const lastChange = new Date(profileData.last_username_change);
            const now = new Date();
            const daysSinceChange = (now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24);
            setCanChangeUsername(daysSinceChange >= 30);
          }
        } else {
          setError("Profile not found. Please contact support.");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    const updates: any = {
      first_name: firstName,
      last_name: lastName,
    };

    // Only update username if it changed and user is allowed
    if (username !== profile?.username) {
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
        .eq("id", user!.id);
      if (data && data.length > 0) setProfile(data[0]);
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "Your profile could not be loaded. This may be because your account was created before the profile system was set up."}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleSignOut}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
            <span>←</span> Back to Dashboard
          </Link>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            @{profile.username}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sticky top-24">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-3">Settings</h2>
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveSection("profile")}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeSection === "profile" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  Profile
                </button>
                <button 
                  onClick={() => setActiveSection("account")}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeSection === "account" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  Account
                </button>
                <button 
                  onClick={() => setActiveSection("preferences")}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeSection === "preferences" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  Preferences
                </button>
                <button 
                  onClick={() => setActiveSection("security")}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeSection === "security" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  Security
                </button>
              </nav>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSignOut}
                  className="w-full px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={activeSection}
            >
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                {activeSection === "profile" && "Profile Settings"}
                {activeSection === "account" && "Account Settings"}
                {activeSection === "preferences" && "Preferences"}
                {activeSection === "security" && "Security"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {activeSection === "profile" && "Manage your personal information and public profile"}
                {activeSection === "account" && "Manage your email and account settings"}
                {activeSection === "preferences" && "Customize your experience and notifications"}
                {activeSection === "security" && "Manage your password and security settings"}
              </p>
            </motion.div>

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
              >
                <span className="text-red-600 text-lg">⚠</span>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-900 mb-1">Error</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
              >
                <span className="text-green-600 text-lg">✓</span>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-green-900 mb-1">Success</h3>
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </motion.div>
            )}

            {/* Profile Section */}
            {activeSection === "profile" && (
              <>
                {/* Personal Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                      <p className="text-sm text-gray-600 mt-1">Update your personal details and how we contact you</p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  <div className="space-y-5">
                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                        {!canChangeUsername && (
                          <span className="ml-2 text-xs text-amber-600 font-normal">
                            (Can change once per month)
                          </span>
                        )}
                      </label>
                      {isEditing && canChangeUsername ? (
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Enter username"
                        />
                      ) : (
                        <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                          @{username}
                        </div>
                      )}
                    </div>

                    {/* First and Last Name - Side by side */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="First name"
                          />
                        ) : (
                          <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                            {firstName}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Last name"
                          />
                        ) : (
                          <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                            {lastName}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
                        {profile.email}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Manage email in Account settings</p>
                    </div>

                    {/* Birthday (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
                        {new Date(profile.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={handleSave}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
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
                        className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </motion.div>

                {/* Account Statistics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Account Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Member Since</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(profile.birthday).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Status</p>
                      <p className="text-sm font-semibold text-green-600">Active</p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {/* Account Section */}
            {activeSection === "account" && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Email Management</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Email</label>
                      <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                        {profile.email}
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      Change Email Address
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl border border-red-200 p-6"
                >
                  <h2 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h2>
                  <p className="text-sm text-gray-600 mb-4">Irreversible and destructive actions</p>
                  <button className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-300 hover:bg-red-50 rounded-lg transition-colors">
                    Delete Account
                  </button>
                </motion.div>
              </>
            )}

            {/* Preferences Section */}
            {activeSection === "preferences" && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Notification Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                        <p className="text-xs text-gray-500 mt-1">Receive updates about your predictions</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={emailNotifications}
                          onChange={(e) => {
                            setEmailNotifications(e.target.checked);
                            handleNotificationChange('email_notifications', e.target.checked);
                          }}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Daily Pick Alerts</p>
                        <p className="text-xs text-gray-500 mt-1">Get notified when new picks are available</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={dailyAlerts}
                          onChange={(e) => {
                            setDailyAlerts(e.target.checked);
                            handleNotificationChange('daily_alerts', e.target.checked);
                          }}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Performance Reports</p>
                        <p className="text-xs text-gray-500 mt-1">Weekly summary of your prediction performance</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={performanceReports}
                          onChange={(e) => {
                            setPerformanceReports(e.target.checked);
                            handleNotificationChange('performance_reports', e.target.checked);
                          }}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Display Preferences</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => handleThemeChange("light")}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            theme === "light" 
                              ? "border-blue-600 bg-blue-50" 
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">☀️</div>
                            <p className={`text-sm font-medium ${
                              theme === "light" ? "text-blue-700" : "text-gray-700"
                            }`}>Light</p>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => handleThemeChange("dark")}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            theme === "dark" 
                              ? "border-blue-600 bg-blue-50" 
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">🌙</div>
                            <p className={`text-sm font-medium ${
                              theme === "dark" ? "text-blue-700" : "text-gray-700"
                            }`}>Dark</p>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => handleThemeChange("system")}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            theme === "system" 
                              ? "border-blue-600 bg-blue-50" 
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">💻</div>
                            <p className={`text-sm font-medium ${
                              theme === "system" ? "text-blue-700" : "text-gray-700"
                            }`}>System</p>
                          </div>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {theme === "light" && "Using light mode"}
                        {theme === "dark" && "Using dark mode"}
                        {theme === "system" && "Matches your system preference"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {/* Security Section */}
            {activeSection === "security" && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Password</h2>
                  <p className="text-sm text-gray-600 mb-4">Update your password to keep your account secure</p>
                  <button className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Change Password
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Two-Factor Authentication</h2>
                  <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">Disabled</span>
                    <button className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Active Sessions</h2>
                  <p className="text-sm text-gray-600 mb-4">Manage devices where you're currently logged in</p>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Current Session</p>
                          <p className="text-xs text-gray-500 mt-1">Windows • Chrome • Your current session</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Active</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
