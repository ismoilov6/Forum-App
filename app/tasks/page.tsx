"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchTasks() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);

      const { data } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setTasks(data);
      setLoading(false);
    }
    fetchTasks();
  }, [router]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title,
          description,
          due_date: dueDate || null,
          priority,
          user_id: user.id,
        },
      ])
      .select();

    if (!error && data) {
      setTasks([data[0], ...tasks]);
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("low");
    } else {
      alert("Xatolik: " + error?.message);
    }
  };

  const handleStatusChange = async (id: number, currentStatus: string) => {
    const nextStatusMap: Record<string, string> = {
      todo: "in_progress",
      in_progress: "done",
      done: "todo",
    };
    const nextStatus = nextStatusMap[currentStatus] || "todo";

    const { error } = await supabase
      .from("tasks")
      .update({ status: nextStatus })
      .eq("id", id);

    if (!error) {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)));
    } else {
      alert("Statusni yangilashda xatolik: " + error.message);
    }
  };

  const handleDeleteTask = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (!error) {
      setTasks(tasks.filter((t) => t.id !== id));
    } else {
      alert("O'chirishda xatolik: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Task Manager</h1>
        <Link href="/" className="text-xs text-gray-400 hover:text-white underline">
          ← Forumga qaytish
        </Link>
      </div>

      <form onSubmit={handleAddTask} className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8 space-y-3">
        <input
          type="text"
          placeholder="Yangi vazifa sarlavhasi..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          required
        />
        <textarea
          placeholder="Tavsif yoki batafsil ma'lumot (ixtiyoriy)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 h-20"
        />

        <div className="flex flex-wrap gap-4 items-center pt-1">
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Muddati (Deadline)</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="p-2 bg-gray-950 border border-gray-800 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Muhimlik darajasi</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="p-2 bg-gray-950 border border-gray-800 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="low">Past (Low)</option>
              <option value="medium">O'rta (Medium)</option>
              <option value="high">Yuqori (High)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors mt-2"
        >
          + Vazifa qo'shish
        </button>
      </form>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl text-center text-gray-400 text-sm">
            Hozircha hech qanday vazifa yo'q.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold text-sm ${task.status === "done" ? "line-through text-gray-500" : "text-white"}`}>
                    {task.title}
                  </h3>
                  {task.priority === "high" && (
                    <span className="text-[10px] bg-red-900/50 text-red-300 border border-red-800 px-1.5 py-0.5 rounded">
                      High
                    </span>
                  )}
                  {task.priority === "medium" && (
                    <span className="text-[10px] bg-yellow-900/50 text-yellow-300 border border-yellow-800 px-1.5 py-0.5 rounded">
                      Medium
                    </span>
                  )}
                </div>
                {task.description && <p className="text-xs text-gray-400 mt-1">{task.description}</p>}
                {task.due_date && (
                  <div className="text-[11px] text-blue-400 mt-2">
                    Muddat: {new Date(task.due_date).toLocaleDateString("uz-UZ")}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleStatusChange(task.id, task.status)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-all ${
                    task.status === "done"
                      ? "bg-green-600/20 text-green-400 border-green-600/30"
                      : task.status === "in_progress"
                      ? "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
                      : "bg-gray-800 text-gray-300 border-gray-700"
                  }`}
                >
                  {task.status === "todo" && "To Do"}
                  {task.status === "in_progress" && "In Progress"}
                  {task.status === "done" && "Done ✓"}
                </button>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600 hover:text-white text-xs px-2.5 py-1.5 rounded-lg transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}