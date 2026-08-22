"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);

      const { data: postData } = await supabase.from("posts").select("*").eq("id", id).single();
      if (postData) setPost(postData);

      const { data: answersData } = await supabase
        .from("answers")
        .select("*")
        .eq("post_id", id)
        .order("created_at", { ascending: true });
      if (answersData) setAnswers(answersData);

      setLoading(false);
    }
    fetchData();
  }, [id]);

  const handleAddAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Javob yozish uchun avval login qiling!");
      return;
    }

    const { data, error } = await supabase
      .from("answers")
      .insert([{ post_id: id, content: newAnswer, user_id: user.id }])
      .select();

    if (!error && data) {
      setAnswers([...answers, data[0]]);
      setNewAnswer("");
    } else {
      alert("Xatolik: " + error?.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12 text-gray-400">
        Savol topilmadi. <Link href="/" className="text-blue-400 underline">Bosh sahifaga qaytish</Link>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors mb-4 inline-block">
        ← Barcha savollarga qaytish
      </Link>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 shadow-sm">
        <h1 className="text-2xl font-bold text-white mb-3 leading-snug">{post.title}</h1>
        <p className="text-gray-300 whitespace-pre-line leading-relaxed text-sm">{post.content}</p>
        <div className="text-xs text-gray-500 mt-4 border-t border-gray-800 pt-3">
          Chop etilgan vaqti: {new Date(post.created_at).toLocaleDateString("uz-UZ")}
        </div>
      </div>

      <section>
        <h2 className="text-lg font-bold text-white mb-4">Javoblar ({answers.length})</h2>

        <div className="space-y-3 mb-8">
          {answers.length === 0 ? (
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-gray-400 text-sm">
              Hali javoblar yo‘q. Birinchi bo‘lib javob bering!
            </div>
          ) : (
            answers.map((ans) => (
              <div key={ans.id} className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                <p className="text-gray-200 text-sm whitespace-pre-line leading-relaxed">{ans.content}</p>
                <div className="text-[11px] text-gray-500 mt-2">
                  {new Date(ans.created_at).toLocaleDateString("uz-UZ")}
                </div>
              </div>
            ))
          )}
        </div>

        {user ? (
          <form onSubmit={handleAddAnswer} className="space-y-3 bg-gray-900 border border-gray-800 p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-200">Javobingizni yozing</h3>
            <textarea
              placeholder="Fikr yoki yechimingizni ulashing..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors h-28"
              required
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Javobni chop etish
            </button>
          </form>
        ) : (
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl text-center text-sm text-gray-400">
            Javob berish uchun iltimos{" "}
            <Link href="/login" className="text-blue-400 underline hover:text-blue-300">
              tizimga kiring
            </Link>
            .
          </div>
        )}
      </section>
    </main>
  );
}