"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-xs font-black text-neutral-400 hover:text-secondary uppercase tracking-widest mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Назад к входу
        </Link>

        <div className="bg-white rounded-[32px] border border-neutral-100 p-8 md:p-10">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-secondary mb-2">Письмо отправлено</h2>
              <p className="text-neutral-400 font-bold text-sm max-w-xs mx-auto">
                Если аккаунт с адресом <strong className="text-secondary">{email}</strong> существует, вы получите письмо с инструкциями.
              </p>
              <Link
                href="/auth/login"
                className="inline-block mt-6 text-primary font-black text-sm hover:underline"
              >
                Вернуться к входу
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Mail size={22} className="text-primary" />
                </div>
                <h1 className="text-2xl font-black text-secondary mb-2">Восстановление пароля</h1>
                <p className="text-sm font-bold text-neutral-400">
                  Введите email от вашего аккаунта — мы пришлём ссылку для сброса пароля.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Email</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ivan@mail.ru"
                    className="w-full bg-neutral-50 rounded-2xl px-5 py-4 text-sm font-bold text-secondary placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-12 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  Отправить ссылку
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
