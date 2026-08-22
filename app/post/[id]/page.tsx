"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

interface Post {
  id: number;
  country: string;
  type: string;
  title: string;
  content: string;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  created_at: string;
}

export default function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const postId = resolvedParams.id;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPostAndComments = async () => {
    setLoading(true);
    
    const { data: postData } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (postData) setPost(postData);

    const { data: commentsData } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (commentsData) setComments(commentsData);

    setLoading(false);
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || !authorName) return alert("Ismingiz va javobingizni kiriting!");

    const { error } = await supabase.from("comments").insert([
      { post_id: postId, author: authorName, text: newComment }
    ]);

    if (error) {
      alert("Xatolik: " + error.message);
    } else {
      setNewComment("");
      fetchPostAndComments();
    }
  };

  if (loading) {
    return <main className="p-6 text-center text-black">Yuklanmoqda...</main>;
  }

  if (!post) {
    return (
      <main className="p-6 text-center text-black">
        <p>Savol topilmadi!</p>
        <Link href="/" className="text-blue-600 font-semibold hover:underline mt-2 inline-block">
          ← Ortga qaytish
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <Link href="/" className="inline-block text-sm text-blue-600 font-semibold hover:underline">
          ← Barcha savollarga qaytish
        </Link>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex gap-2 mb-3">
            <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold">
              {post.country}
            </span>
            <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-semibold">
              {post.type}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
          <p className="text-gray-700 mt-3 leading-relaxed">{post.content}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Javoblar ({comments.length})</h3>
          
          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm">Hozircha javoblar yo'q. Birinchi javobni qoldiring!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <span className="text-xs font-bold text-blue-600">{comment.author}</span>
                <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleAddComment} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-3">
          <h4 className="text-sm font-bold text-gray-800">O'z javobingizni qoldiring</h4>
          <input 
            type="text" 
            placeholder="Ismingiz yoki taxallusingiz"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea 
            rows={3}
            placeholder="Maslahatingiz yoki tajribangiz bilan bo'lishing..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Javobni yuborish
          </button>
        </form>

      </div>
    </main>
  );
}