"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);

      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (data) setMyPosts(data);
      setLoading(false);
    }
    fetchUserData();
  }, [router]);

  const handleDeletePost = async (id: number) => {
    if (!confirm("Ushbu savolni o'chirishni xohlaysizmi?")) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) {
      setMyPosts(myPosts.filter((post) => post.id !== id));
    } else {
      alert("O'chirishda xatolik: " + error.message);
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
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Foydalanuvchi Profil Paneli</h1>
        <p className="text-sm text-gray-400">Email: <span className="text-white">{user.email}</span></p>
        <p className="text-xs text-gray-500 mt-1">ID: {user.id}</p>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">Mening Savollarim ({myPosts.length})</h2>

      <div className="space-y-4">
        {myPosts.length === 0 ? (
          <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl text-center text-gray-400 text-sm">
            Siz hali hech qanday savol berganingiz yo'q.
          </div>
        ) : (
          myPosts.map((post) => (
            <div
              key={post.id}
              className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex justify-between items-center gap-4"
            >
              <div className="space-y-1 flex-1">
                <Link href={`/post/${post.id}`} className="text-lg font-bold text-white hover:text-blue-400 transition-colors">
                  {post.title}
                </Link>
                <p className="text-xs text-gray-500">
                  {new Date(post.created_at).toLocaleDateString("uz-UZ")}
                </p>
              </div>
              <button
                onClick={() => handleDeletePost(post.id)}
                className="bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600 hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
              >
                O'chirish
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}