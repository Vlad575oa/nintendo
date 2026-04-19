"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Save, Search, Eye, EyeOff } from "lucide-react";

interface PostFormProps {
  initial?: {
    id?: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    isPublished: boolean;
    metaTitle: string;
    metaDesc: string;
  };
}

const defaultInitial: PostFormProps["initial"] = {
  title: "", slug: "", excerpt: "", content: "", image: "",
  category: "Статья", isPublished: false, metaTitle: "", metaDesc: "",
};

const inputCls = "w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold text-[#111827] placeholder:text-neutral-300 outline-none focus:bg-white focus:border-primary/30 transition-all";
const labelCls = "block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5";

export const PostForm = ({ initial = defaultInitial }: PostFormProps) => {
  const router = useRouter();
  const isEdit = !!initial.id;
  const [form, setForm] = useState({ ...defaultInitial, ...initial });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initial.image ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.content) {
      setError("Заполните заголовок и текст статьи");
      return;
    }
    setSaving(true);
    setError("");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("excerpt", form.excerpt);
    fd.append("content", form.content);
    fd.append("category", form.category);
    fd.append("isPublished", String(form.isPublished));
    fd.append("metaTitle", form.metaTitle);
    fd.append("metaDesc", form.metaDesc);
    if (imageFile) fd.append("image", imageFile);
    else if (form.image) fd.append("imageUrl", form.image);

    const url = isEdit ? `/api/admin/posts/${initial.id}` : "/api/admin/posts";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, body: fd });
      if (res.ok) {
        router.push("/admin/posts");
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error ?? "Ошибка");
      }
    } catch {
      setError("Ошибка соединения");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <header className="bg-white border-b border-neutral-100 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="w-9 h-9 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-[#111827] transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Блог / {isEdit ? "Редактирование" : "Новая статья"}</p>
            <h1 className="text-lg font-black text-[#111827] leading-tight">{form.title || "Без названия"}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-500 text-sm font-black rounded-xl hover:bg-neutral-50 transition-all"
          >
            {preview ? <EyeOff size={14} /> : <Eye size={14} />}
            {preview ? "Редактор" : "Превью"}
          </button>
          <button
            onClick={() => { set("isPublished", false); handleSubmit(); }}
            disabled={saving}
            className="px-4 py-2 bg-white border border-neutral-200 text-neutral-500 text-sm font-black rounded-xl hover:bg-neutral-50 transition-all disabled:opacity-60"
          >
            Черновик
          </button>
          <button
            onClick={() => { set("isPublished", true); handleSubmit(); }}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-black rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-60"
          >
            <Save size={14} />
            {saving ? "Сохранение..." : "Опубликовать"}
          </button>
        </div>
      </header>

      {error && (
        <div className="mx-8 mt-4 bg-red-50 border border-red-200 text-red-600 text-sm font-bold px-5 py-3 rounded-xl">{error}</div>
      )}

      <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <div className="xl:col-span-2 space-y-5">
          <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-5">
            <div>
              <label className={labelCls}>Заголовок *</label>
              <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Лучшие игры 2026 года" />
            </div>
            <div>
              <label className={labelCls}>Анонс / Краткое описание</label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="Краткое описание для превью и SEO"
              />
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <label className={`${labelCls} mb-0`}>Текст статьи *</label>
              <span className="text-[10px] text-neutral-400 font-bold">Markdown поддерживается</span>
            </div>
            {preview ? (
              <div
                className="prose prose-sm max-w-none min-h-[400px] p-4 bg-neutral-50 rounded-xl"
                dangerouslySetInnerHTML={{ __html: form.content.replace(/\n/g, "<br>") }}
              />
            ) : (
              <textarea
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono text-[#111827] placeholder:text-neutral-300 outline-none focus:bg-white focus:border-primary/30 transition-all resize-none"
                rows={20}
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder={"# Заголовок\n\nНачните писать статью..."}
              />
            )}
          </section>
        </div>

        <div className="space-y-5">
          <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-black text-[#111827]">Настройки</h2>
            <div>
              <label className={labelCls}>Категория</label>
              <select className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
                {["Статья", "Обзор", "Гайд", "Новость", "Советы"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm font-bold text-neutral-600">Опубликовать сейчас</span>
              <button
                type="button"
                onClick={() => set("isPublished", !form.isPublished)}
                className={`w-11 h-6 rounded-full transition-all relative ${form.isPublished ? "bg-primary" : "bg-neutral-200"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.isPublished ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </label>
          </section>

          <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-black text-[#111827]">Обложка</h2>
            <div
              onClick={() => fileRef.current?.click()}
              className="aspect-video border-2 border-dashed border-neutral-200 rounded-xl overflow-hidden cursor-pointer hover:border-primary/30 transition-colors relative group"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload size={24} className="text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-neutral-400">
                  <Upload size={24} />
                  <p className="text-xs font-bold">Выбрать изображение</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </section>

          <section className="bg-[#111827] rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              <Search size={15} className="text-neutral-400" /> SEO
            </h2>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1.5">Meta Title</label>
              <input
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white placeholder:text-neutral-600 outline-none"
                value={form.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1.5">Meta Description</label>
              <textarea
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white placeholder:text-neutral-600 outline-none resize-none"
                rows={3}
                value={form.metaDesc}
                onChange={(e) => set("metaDesc", e.target.value)}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
