"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      // User session'ni olish
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);

      // Savol ma'lumotlarini olish
      const { data: postData } = await supabase.from("posts").select("*").eq("id", id).single();
      if (postData) setPost(postData);

      // Javoblarni olish
      const { data: answersData } = await supabase.from("answers").select("*").eq("post_id", id).order("created_at", { ascending: true });
      if (answersData) setAnswers(answersData);
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

  if (!post) return <div className="p-5 text-center">Yuklanmoqda...</div>;

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Javoblar ({answers.length})</h2>
        <div className="space-y-3 mb-6">
          {answers.length === 0 ? (
            <p className="text-gray-500">Hali javoblar yoʻq. Birinchi boʻlib javob bering!</p>
          ) : (
            answers.map((ans) => (
              <div key={ans.id} className="p-3 bg-gray-50 rounded border">
                <p className="text-gray-800">{ans.content}</p>
              </div>
            ))
          )}
        </div>

        {user ? (
          <form onSubmit={handleAddAnswer} className="space-y-3">
            <textarea
              placeholder="Javobingizni yozing..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full p-2 border rounded h-24"
              required
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Javob yozish
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-600">
            Javob berish uchun iltimos tizimga kiring.
          </p>
        )}
      </section>
    </main>
  );
}