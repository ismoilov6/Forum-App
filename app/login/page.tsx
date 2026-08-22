"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert("Xatolik: " + error.message);
      else alert("Ro‘yxatdan o‘tdingiz! Endi kirishingiz mumkin.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("Xatolik: " + error.message);
      else router.push("/");
    }
    setLoading(false);
  };

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          {isSignUp ? "Ro‘yxatdan o‘tish" : "Tizimga kirish"}
        </h1>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Parol</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Yuklanmoqda..." : isSignUp ? "Akkaunt yaratish" : "Kirish"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400 border-t border-gray-800 pt-4">
          {isSignUp ? "Akkauntingiz bormi?" : "Akkauntingiz yo‘qmi?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-400 hover:underline font-medium"
          >
            {isSignUp ? "Kirish" : "Ro‘yxatdan o‘tish"}
          </button>
        </div>
      </div>
    </main>
  );
}