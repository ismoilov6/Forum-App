"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hamjamiyat Savollari</h1>
          <p className="text-gray-500 text-sm mt-1">Dasturlash va texnologiyaga oid savol-javoblar</p>
        </div>
        <Link
          href="/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all"
        >
          + Yangi savol
        </Link>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl border-gray-200">
            <p className="text-gray-500 font-medium">Hali hech qanday savol berilmagan.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex justify-between items-start gap-4"
            >
              <div className="space-y-2 flex-1">
                <Link
                  href={`/post/${post.id}`}
                  className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                >
                  {post.title}
                </Link>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {post.content}
                </p>
                <div className="text-xs text-gray-400 pt-2">
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