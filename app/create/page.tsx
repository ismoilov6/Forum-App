"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    }
    getUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from("posts").insert([
      { title, content, user_id: user.id }
    ]);

    if (!error) {
      router.push("/");
    } else {
      alert("Xatolik yuz berdi: " + error.message);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors mb-6 inline-block">
        ← Bosh sahifaga qaytish
      </Link>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-white mb-6">Yangi savol berish</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Mavzu sarlavhasi</label>
            <input
              type="text"
              placeholder="Masalan: Next.js va Supabase ulanishida xatolik"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Savolingiz batafsil matni</label>
            <textarea
              placeholder="Muammo haqida va berilayotgan xatolikni batafsil yozing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors h-36"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
          >
            Chop etish
          </button>
        </form>
      </div>
    </main>
  );
}