"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // Savolni olib kelish
      const { data: postData } = await supabase
        .from("posts")
        .select(`*, profiles(email)`)
        .eq("id", id)
        .single();
      if (postData) setPost(postData);

      // Javoblarni olib kelish
      const { data: answersData } = await supabase
        .from("answers")
        .select(`*, profiles(email)`)
        .eq("post_id", id)
        .order("created_at", { ascending: true });
      if (answersData) setAnswers(answersData);
    }
    fetchData();
  }, [id]);

  const handleAddAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Javob yozish uchun tizimga kiring!");
      return;
    }

    const { error } = await supabase.from("answers").insert([
      {
        content: newAnswer,
        post_id: id,
        user_id: user.id,
      },
    ]);

    if (!error) {
      setNewAnswer("");
      window.location.reload(); // Sahifani yangilash
    }
  };

  if (!post) return <div className="text-center text-white mt-10">Yuklanmoqda...</div>;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-blue-400 hover:underline mb-6 inline-block">
        ← Bosh sahifaga qaytish
      </Link>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">{post.title}</h1>
        <div className="text-xs text-gray-500 mb-6">
          Muallif: {post.profiles?.email || "Noma'lum"} • {new Date(post.created_at).toLocaleDateString('uz-UZ')}
        </div>
        
        {/* ReactMarkdown orqali rasm va matnni formatlash */}
        <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
          <ReactMarkdown
            components={{
              img: ({node, ...props}) => <img {...props} className="max-w-full h-auto rounded-lg my-4 border border-gray-700" alt="post image" />,
              a: ({node, ...props}) => <a {...props} className="text-blue-400 hover:underline" target="_blank" />,
              p: ({node, ...props}) => <p {...props} className="mb-4" />
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Javoblar ({answers.length})</h2>
        <div className="space-y-4">
          {answers.map((answer) => (
            <div key={answer.id} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-300">{answer.content}</p>
              <div className="text-[11px] text-gray-500 mt-2">
                {answer.profiles?.email || "Noma'lum"} • {new Date(answer.created_at).toLocaleTimeString('uz-UZ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {user ? (
        <form onSubmit={handleAddAnswer} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 h-24 mb-3"
            placeholder="O'z fikringiz yoki javobingizni yozing..."
            required
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm transition-colors">
            Javob qoldirish
          </button>
        </form>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-400 mb-2">Javob yozish uchun ro'yxatdan o'ting</p>
          <Link href="/login" className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Tizimga kirish
          </Link>
        </div>
      )}
    </main>
  );
}