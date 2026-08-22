import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <nav className="border-b p-4 mb-6">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Link href="/" className="font-bold text-xl">ForumApp</Link>
            <Link href="/login" className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">
              Login / Sign Up
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}