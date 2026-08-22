"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("uploads").getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
    } catch (error: any) {
      alert("Rasm yuklashda xatolik: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("Avval tizimga kiring!");
      return;
    }

    const finalContent = imageUrl 
      ? `${content}\n\n![Rasm](${imageUrl})`
      : content;

    const { error } = await supabase.from("posts").insert([
      {
        title,
        content: finalContent,
        user_id: session.user.id,
      },
    ]);

    if (!error) {
      router.push("/");
    } else {
      alert("Savol yaratishda xatolik: " + error.message);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Yangi Savol Yaratish</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 border border-gray-800 p-6 rounded-xl">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Sarlavha</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Batafsil matn (Markdown yordamida)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500 h-32"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Rasm biriktirish (Ixtiyoriy)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />
          {uploading && <p className="text-xs text-yellow-400 mt-1">Rasm yuklanmoqda...</p>}
          {imageUrl && (
            <div className="mt-2">
              <p className="text-xs text-green-400 mb-1">Rasm biriktirildi ✓</p>
              <img src={imageUrl} alt="Uploaded preview" className="h-24 rounded-lg border border-gray-800 object-cover" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          Savolni Chop Etish
        </button>
      </form>
    </main>
  );
}