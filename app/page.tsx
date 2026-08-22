"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Hamjamiyat Savollari</h1>
          <p className="text-gray-400 text-sm mt-1">Dasturlash va texnologiyaga oid savol-javoblar</p>
        </div>
        <Link
          href="/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all"
        >
          + Yangi savol
        </Link>
      </div>

      {/* Search Input Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Savollarni qidirish (sarlavha yoki matn bo'yicha)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 bg-gray-900 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl border-gray-800">
            <p className="text-gray-400 font-medium">
              {searchQuery ? "Qidiruvga mos savollar topilmadi." : "Hali hech qanday savol berilmagan."}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-5 bg-gray-900 border border-gray-800 rounded-xl shadow-sm hover:border-gray-700 transition-all flex justify-between items-start gap-4"
            >
              <div className="space-y-2 flex-1">
                <Link
                  href={`/post/${post.id}`}
                  className="text-lg font-bold text-white hover:text-blue-400 transition-colors line-clamp-1"
                >
                  {post.title}
                </Link>
                <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                  {post.content}
                </p>
                <div className="text-xs text-gray-500 pt-2">
                  {new Date(post.created_at).toLocaleDateString("uz-UZ")}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}