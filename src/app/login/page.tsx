"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const signup = async () => {
    setMessage("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return setMessage("登録失敗：" + error.message);
    setMessage("登録成功！このままログインしてください");
  };

  const login = async () => {
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMessage("ログイン失敗：" + error.message);
    router.replace("/");
  };

  return (
    <main className="min-h-screen bg-slate-50 grid place-items-center px-4">
      <section className="w-full max-w-md rounded-2xl border bg-white shadow-sm p-6">
        <h1 className="text-2xl font-semibold tracking-tight">ログイン</h1>
        <p className="mt-1 text-sm text-slate-500">
          メールアドレスとパスワードでログインできます
        </p>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">メールアドレス</label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">パスワード</label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
              placeholder="6文字以上"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="pt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
              onClick={login}
            >
              ログイン
            </button>

            <button
              type="button"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={signup}
            >
              新規登録
            </button>
          </div>

          {message && (
            <p
              className={`pt-2 text-sm ${
                message.startsWith("登録成功") ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
