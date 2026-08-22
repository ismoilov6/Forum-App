"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

interface Post {
  id: number;
  country: string;
  type: string;
  title: string;
  content: string;
  created_at: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("Germaniya");
  const [type, setType] = useState("O'qish");
  const [content, setContent] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Xatolik:", error.message);
    } else if (data) {
      setPosts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("Iltimos, barcha maydonlarni to'ldiring!");

    const { error } = await supabase.from("posts").insert([
      { country, type, title, content }
    ]);

    if (error) {
      alert("Xatolik yuz berdi: " + error.message);
    } else {
      setTitle("");
      setContent("");
      fetchPosts();
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="bg-blue-600 text-white p-6 rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold">Chet El Muloqot Platformasi</h1>
          <p className="text-sm mt-1 text-blue-100">Savol bering, tajriba ulashing va vatandoshlarni toping!</p>
        </header>

        <form onSubmit={handleAddPost} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Yangi savol berish</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Mamlakat</label>
              <select 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm bg-gray-50"
              >
                <option value="Germaniya">Germaniya</option>
                <option value="Janubiy Koreya">Janubiy Koreya</option>
                <option value="AQSh">AQSh</option>
                <option value="Buyuk Britaniya">Buyuk Britaniya</option>
                <option value="Yaponiya">Yaponiya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Yo'nalish</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm bg-gray-50"
              >
                <option value="O'qish">O'qish</option>
                <option value="Ishlash">Ishlash</option>
                <option value="Sayohat">Sayohat</option>
                <option value="Viza">Viza</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Savol sarlavhasi</label>
            <input 
              type="text" 
              placeholder="Masalan: Viza olish uchun qanday hujjatlar kerak?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Batafsil ma'lumot</label>
            <textarea 
              rows={3}
              placeholder="Vaziyatingizni batafsil yozing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm bg-gray-50"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Savolni e'lon qilish
          </button>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">So'nggi savollar</h2>
          {loading ? (
            <p className="text-gray-500 text-sm">Savollar yuklanmoqda...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500 text-sm">Hozircha hech qanday savol yo'q. Birinchi savolni siz bering!</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                    {post.country}
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                    {post.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{post.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{post.content}</p>
                
                <div className="mt-4 flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                  <span>{new Date(post.created_at).toLocaleDateString("uz-UZ")}</span>
                  <Link 
                    href={`/post/${post.id}`}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Javob berish
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}