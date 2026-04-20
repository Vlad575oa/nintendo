"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Trash2, Plus, Save, Info, Tag, Settings2, Search } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Attribute {
  key: string;
  value: string;
}

interface ProductFormProps {
  categories: Category[];
  initial?: {
    id?: number;
    name: string;
    slug: string;
    description: string;
    price: string;
    priceOld: string;
    categoryId: string;
    brand: string;
    color: string;
    inStock: boolean;
    isNew: boolean;
    isSale: boolean;
    stock: string;
    images: string[];
    attributes: Attribute[];
    metaTitle: string;
    metaDesc: string;
  };
}

const defaultInitial: ProductFormProps["initial"] = {
  name: "", slug: "", description: "", price: "", priceOld: "",
  categoryId: "", brand: "", color: "", inStock: true, isNew: false,
  isSale: false, stock: "10", images: [], attributes: [], metaTitle: "", metaDesc: "",
};

const inputCls = "w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold text-[#111827] placeholder:text-neutral-300 outline-none focus:bg-white focus:border-primary/30 transition-all";
const labelCls = "block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5";

export const ProductForm = ({ categories, initial = defaultInitial }: ProductFormProps) => {
  const router = useRouter();
  const isEdit = !!initial.id;

  const [form, setForm] = useState({ ...defaultInitial, ...initial });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [attrs, setAttrs] = useState<Attribute[]>(initial.attributes ?? []);
  const [saving, setSaving] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setNewImages((p) => [...p, ...files]);
    setNewPreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeExistingImage = (url: string) => {
    setRemovedImages((p) => [...p, url]);
    set("images", form.images.filter((i) => i !== url));
  };

  const removeNewImage = (idx: number) => {
    setNewImages((p) => p.filter((_, i) => i !== idx));
    setNewPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const addAttr = () => setAttrs((p) => [...p, { key: "", value: "" }]);
  const removeAttr = (idx: number) => setAttrs((p) => p.filter((_, i) => i !== idx));
  const setAttr = (idx: number, field: "key" | "value", val: string) =>
    setAttrs((p) => p.map((a, i) => (i === idx ? { ...a, [field]: val } : a)));

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.categoryId) {
      setError("Заполните название, цену и категорию");
      return;
    }
    setSaving(true);
    setError("");

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("priceOld", form.priceOld);
    data.append("categoryId", form.categoryId);
    data.append("brand", form.brand);
    data.append("color", form.color);
    data.append("inStock", String(form.inStock));
    data.append("isNew", String(form.isNew));
    data.append("isSale", String(form.isSale));
    data.append("stock", form.stock);
    data.append("metaTitle", form.metaTitle);
    data.append("metaDesc", form.metaDesc);
    data.append("attributes", JSON.stringify(attrs.filter((a) => a.key)));
    data.append("existingImages", JSON.stringify(form.images));
    newImages.forEach((f) => data.append("images", f));

    const url = isEdit ? `/api/admin/products/${initial.id}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, body: data });
      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error ?? "Ошибка сохранения");
      }
    } catch {
      setError("Ошибка соединения");
    } finally {
      setSaving(false);
    }
  };

  const allImages = [...form.images, ...newPreviews];

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      {/* Top bar */}
      <header className="bg-white border-b border-neutral-100 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="w-9 h-9 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-[#111827] transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              Товары / {isEdit ? "Редактирование" : "Новый товар"}
            </p>
            <h1 className="text-lg font-black text-[#111827] leading-tight">{isEdit ? form.name || "—" : "Добавить товар"}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="px-4 py-2 bg-white border border-neutral-200 text-neutral-500 text-sm font-black rounded-xl hover:bg-neutral-50 transition-all">
            Отмена
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-black rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-60"
          >
            <Save size={14} />
            {saving ? "Сохранение..." : isEdit ? "Сохранить" : "Опубликовать"}
          </button>
        </div>
      </header>

      {error && (
        <div className="mx-8 mt-4 bg-red-50 border border-red-200 text-red-600 text-sm font-bold px-5 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Left — main content */}
        <div className="xl:col-span-2 space-y-5">
          {/* Basic info */}
          <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-black text-[#111827] flex items-center gap-2">
              <Info size={15} className="text-primary" /> Основная информация
            </h2>
            <div>
              <label className={labelCls}>Название товара *</label>
              <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Sony PlayStation 5 Pro 2TB" />
            </div>
            <div>
              <label className={labelCls}>Описание</label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={6}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Полное описание товара..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Цена (руб) *</label>
                <input type="number" className={inputCls} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="69990" />
              </div>
              <div>
                <label className={labelCls}>Старая цена (руб)</label>
                <input type="number" className={inputCls} value={form.priceOld} onChange={(e) => set("priceOld", e.target.value)} placeholder="79990" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Бренд</label>
                <input className={inputCls} value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Sony" />
              </div>
              <div>
                <label className={labelCls}>Цвет</label>
                <input className={inputCls} value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="Black" />
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
            <h2 className="text-sm font-black text-[#111827] flex items-center gap-2 mb-5">
              <Upload size={15} className="text-blue-500" /> Фотографии товара
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {form.images.map((url) => (
                <div key={url} className="group relative aspect-square rounded-xl overflow-hidden border border-neutral-100 bg-neutral-50">
                  <img src={url} alt="" className="w-full h-full object-contain p-1" />
                  <button
                    onClick={() => removeExistingImage(url)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
              {newPreviews.map((url, idx) => (
                <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-blue-200 bg-blue-50">
                  <img src={url} alt="" className="w-full h-full object-contain p-1" />
                  <button
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={10} />
                  </button>
                  <span className="absolute bottom-1 left-1 text-[8px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-black">Новое</span>
                </div>
              ))}
              {allImages.length < 10 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center gap-1.5 text-neutral-400 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <Plus size={20} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Добавить</span>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
            <p className="text-[10px] text-neutral-400 font-bold mt-3">Загрузите до 10 фото. Первое фото — главное.</p>
          </section>

          {/* Characteristics */}
          <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-black text-[#111827] flex items-center gap-2">
                <Settings2 size={15} className="text-purple-500" /> Характеристики
              </h2>
              <button
                onClick={addAttr}
                className="flex items-center gap-1.5 text-xs font-black text-primary hover:text-red-700 transition-colors"
              >
                <Plus size={13} /> Добавить строку
              </button>
            </div>

            {attrs.length === 0 ? (
              <div className="border-2 border-dashed border-neutral-100 rounded-xl py-10 text-center">
                <Settings2 size={28} className="mx-auto mb-2 text-neutral-200" />
                <p className="text-xs text-neutral-400 font-bold">Нет характеристик</p>
                <button onClick={addAttr} className="mt-3 text-xs font-black text-primary">+ Добавить первую</button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_1fr_32px] gap-2 mb-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 px-1">Параметр</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 px-1">Значение</p>
                </div>
                {attrs.map((a, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_1fr_32px] gap-2">
                    <input
                      value={a.key}
                      onChange={(e) => setAttr(idx, "key", e.target.value)}
                      className={inputCls}
                      placeholder="Например: Процессор"
                    />
                    <input
                      value={a.value}
                      onChange={(e) => setAttr(idx, "value", e.target.value)}
                      className={inputCls}
                      placeholder="AMD Ryzen 5"
                    />
                    <button
                      onClick={() => removeAttr(idx)}
                      className="w-8 h-[42px] rounded-xl bg-red-50 border border-red-100 text-red-400 hover:bg-red-100 transition-colors flex items-center justify-center"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right — sidebar */}
        <div className="space-y-5">
          {/* Category + status */}
          <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-black text-[#111827] flex items-center gap-2">
              <Tag size={15} className="text-orange-500" /> Категория и статус
            </h2>
            <div>
              <label className={labelCls}>Категория *</label>
              <select
                className={inputCls}
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
              >
                <option value="">Выберите категорию</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Количество на складе</label>
              <input type="number" className={inputCls} value={form.stock} onChange={(e) => set("stock", e.target.value)} />
            </div>
            <div className="space-y-3 pt-1">
              {[
                { key: "inStock", label: "В наличии" },
                { key: "isNew", label: "Метка «Новинка»" },
                { key: "isSale", label: "Метка «Акция»" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-bold text-neutral-600 group-hover:text-[#111827] transition-colors">{label}</span>
                  <button
                    type="button"
                    onClick={() => set(key, !(form as any)[key])}
                    className={`w-11 h-6 rounded-full transition-all relative ${(form as any)[key] ? "bg-primary" : "bg-neutral-200"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${(form as any)[key] ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </label>
              ))}
            </div>
          </section>

          {/* SEO toggle */}
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-sm font-black text-[#111827] flex items-center gap-2">
              <Search size={15} className="text-neutral-400" /> SEO настройки
            </h2>
            <button
              type="button"
              onClick={() => setShowSEO(!showSEO)}
              className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
            >
              {showSEO ? "Скрыть" : "Настроить"}
            </button>
          </div>

          {showSEO && (
            <section className="bg-[#111827] rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1.5">Meta Title</label>
                <input
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white placeholder:text-neutral-600 outline-none focus:border-white/20"
                  value={form.metaTitle}
                  onChange={(e) => set("metaTitle", e.target.value)}
                  placeholder="SEO заголовок"
                />
                <p className="text-[9px] text-neutral-600 font-bold mt-2">Если пусто, будет использовано название товара</p>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1.5">Meta Description</label>
                <textarea
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white placeholder:text-neutral-600 outline-none resize-none"
                  rows={4}
                  value={form.metaDesc}
                  onChange={(e) => set("metaDesc", e.target.value)}
                  placeholder="Краткое SEO описание"
                />
              </div>
            </section>
          )}

          {isEdit && (
            <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Slug (ЧПУ)</p>
              <p className="text-sm font-bold text-neutral-600 break-all">{form.slug}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
