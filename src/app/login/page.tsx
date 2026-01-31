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
    setMessage("登録成功！このままログインしてね");
  };

  const login = async () => {
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMessage("ログイン失敗：" + error.message);
    router.replace("/");
  };

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">ログイン</h1>

      <div className="mt-6 flex flex-col gap-2 max-w-sm">
        <input
          className="border px-3 py-2"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border px-3 py-2"
          placeholder="パスワード（6文字以上）"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex gap-2">
          <button className="border px-3 py-2" onClick={login}>
            ログイン
          </button>
          <button className="border px-3 py-2" onClick={signup}>
            新規登録
          </button>
        </div>

        {message && <p className="mt-2">{message}</p>}
      </div>
    </main>
  );
}
