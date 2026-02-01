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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return setMessage("ログイン失敗：" + error.message);
    router.replace("/");
  };

  return (
    <main className="min-h-screen bg-slate-50 grid place-items-center px-4">
      <section className="w-full max-w-md rounded-2xl border bg-white shadow-sm p-6 text-slate-900">
        {/* 見出し：opacity を強制的に 100% */}
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 opacity-100 !opacity-100">
          ログイン
        </h1>

        {/* 説明文 */}
        <p className="mt-1 text-sm text-slate-700 opacity-100">
          メールアドレスとパスワードでログインできます
        </p>

        <div className="mt-6 space-y-4">
          {/* メールアドレス */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 opacity-100">
              メールアドレス
            </label>
            <input
              className="
                w-full
                rounded-xl
                border border-slate-200
                bg-white
                px-4 py-3
                text-sm
                text-slate-900
                placeholder:text-slate-400
                opacity-100
                outline-none
                focus:ring-2 focus:ring-slate-900/20
              "
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {/* パスワード */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 opacity-100">
              パスワード
            </label>
            <input
              className="
                w-full
                rounded-xl
                border border-slate-200
                bg-white
                px-4 py-3
                text-sm
                text-slate-900
                placeholder:text-slate-400
                opacity-100
                outline-none
                focus:ring-2 focus:ring-slate-900/20
              "
              placeholder="6文字以上"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {/* ボタン */}
          <div className="pt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 opacity-100"
              onClick={login}
            >
              ログイン
            </button>

            <button
              type="button"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 opacity-100"
              onClick={signup}
            >
              新規登録
            </button>
          </div>

          {/* メッセージ */}
          {message && (
            <p
              className={`pt-2 text-sm opacity-100 ${
                message.startsWith("登録成功")
                  ? "text-emerald-700"
                  : "text-red-600"
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
