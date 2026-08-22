import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <nav className="border-b border-gray-800 bg-gray-900 p-4 mb-6">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Link href="/" className="font-bold text-xl text-white">
              ForumApp
            </Link>
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded-lg text-sm transition-all"
            >
              Login / Sign Up
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}