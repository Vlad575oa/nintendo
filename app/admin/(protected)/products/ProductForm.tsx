"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Trash2, Plus, Save, Info, Tag, Settings2,
  Search, Layers, ChevronDown, Package, Upload,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
}

interface Attribute {
  key: string;
  value: string;
}

export interface VariantRow {
  id?: number;
  slug: string;
  color: string;
  memory: string;
  price: string;
  priceOld: string;
  stock: string;
  inStock: boolean;
  images: string[];
  newImages: File[];
  newPreviews: string[];
  _deleted: boolean;
}

interface SharedForm {
  id?: number;
  name: string;
  description: string;
  categoryId: string;
  brand: string;
  isNew: boolean;
  isSale: boolean;
  metaTitle: string;
  metaDesc: string;
}

interface ProductFormProps {
  categories: Category[];
  sourceProductName?: string;
  initial?: Partial<SharedForm>;
  initialAttrs?: Attribute[];
  initialVariants?: Omit<VariantRow, "_deleted">[];
}

const COLOR_OPTIONS = [
  "Белый", "Чёрный", "Серый", "Синий", "Красный", "Жёлтый",
  "Коралловый", "Бирюзовый", "Зелёный", "Розовый", "Фиолетовый",
  "Золотой", "Серебристый", "Белый/Чёрный", "Белый/Красный",
];

const MEMORY_OPTIONS = [
  "32 ГБ", "64 ГБ", "128 ГБ", "256 ГБ", "512 ГБ",
  "825 ГБ", "1024 ГБ", "2048 ГБ",
];

const COLOR_ATTR_KEYS = ["Цвет"];
const MEMORY_ATTR_KEYS = ["Накопитель", "Объём", "Объем"];

const EMPTY_VARIANT: VariantRow = {
  slug: "", color: "", memory: "", price: "", priceOld: "", stock: "10",
  inStock: true, images: [], newImages: [], newPreviews: [], _deleted: false,
};

const inputCls = "w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold text-[#111827] placeholder:text-neutral-300 outline-none focus:bg-white focus:border-primary/30 transition-all";
const labelCls = "block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5";

const calcOtherPrice = (price: string) => {
  const n = parseFloat(price);
  if (!n || isNaN(n)) return "";
  return String(Math.round(n * 1.13));
};

const normalizeSlug = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const ProductForm = ({
  categories,
  sourceProductName,
  initial = {},
  initialAttrs,
  initialVariants,
}: ProductFormProps) => {
  const router = useRouter();
  const isEdit = !!initial.id;
  const isVariant = !!sourceProductName;

  const rootCategories = categories.filter((c) => !c.parentId);

  const initRootId = (() => {
    if (!initial.categoryId) return null;
    const cat = categories.find((c) => String(c.id) === initial.categoryId);
    if (!cat) return null;
    return cat.parentId ?? cat.id;
  })();

  const [selectedRootId, setSelectedRootId] = useState<number | null>(initRootId);
  const subCategories = selectedRootId
    ? categories.filter((c) => c.parentId === selectedRootId)
    : [];

  const [form, setForm] = useState<SharedForm>({
    name: initial.name ?? "",
    description: initial.description ?? "",
    categoryId: initial.categoryId ?? "",
    brand: initial.brand ?? "",
    isNew: initial.isNew ?? false,
    isSale: initial.isSale ?? false,
    metaTitle: initial.metaTitle ?? "",
    metaDesc: initial.metaDesc ?? "",
  });

  const [attrs, setAttrs] = useState<Attribute[]>(initialAttrs ?? []);
  const [variants, setVariants] = useState<VariantRow[]>(
    initialVariants
      ? initialVariants.map((v) => ({ ...v, _deleted: false }))
      : [{ ...EMPTY_VARIANT }]
  );
  const [saving, setSaving] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [error, setError] = useState("");

  const variantFileRef = useRef<HTMLInputElement>(null);
  const currentVariantIdx = useRef<number>(-1);

  const set = (key: keyof SharedForm, val: any) =>
    setForm((p) => ({ ...p, [key]: val }));

  // Attrs
  const addAttr = () => setAttrs((p) => [...p, { key: "", value: "" }]);
  const removeAttr = (idx: number) => setAttrs((p) => p.filter((_, i) => i !== idx));
  const setAttr = (idx: number, field: "key" | "value", val: string) =>
    setAttrs((p) => p.map((a, i) => (i === idx ? { ...a, [field]: val } : a)));

  // Variants
  const addVariant = () => setVariants((p) => [...p, { ...EMPTY_VARIANT }]);
  const deleteVariant = (idx: number) => {
    setVariants((p) =>
      p.map((v, i) => (i === idx ? { ...v, _deleted: true } : v))
    );
  };
  const setVariant = (idx: number, key: keyof VariantRow, val: any) =>
    setVariants((p) => p.map((v, i) => (i === idx ? { ...v, [key]: val } : v)));

  const openImagePicker = (idx: number) => {
    currentVariantIdx.current = idx;
    variantFileRef.current?.click();
  };

  const handleVariantImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = currentVariantIdx.current;
    if (idx < 0) return;
    const files = Array.from(e.target.files ?? []);
    setVariants((p) =>
      p.map((v, i) =>
        i === idx
          ? {
              ...v,
              newImages: [...v.newImages, ...files],
              newPreviews: [
                ...v.newPreviews,
                ...files.map((f) => URL.createObjectURL(f)),
              ],
            }
          : v
      )
    );
    e.target.value = "";
  };

  const removeVariantExistingImage = (vIdx: number, url: string) =>
    setVariants((p) =>
      p.map((v, i) =>
        i === vIdx ? { ...v, images: v.images.filter((u) => u !== url) } : v
      )
    );

  const removeVariantNewImage = (vIdx: number, imgIdx: number) =>
    setVariants((p) =>
      p.map((v, i) =>
        i === vIdx
          ? {
              ...v,
              newImages: v.newImages.filter((_, j) => j !== imgIdx),
              newPreviews: v.newPreviews.filter((_, j) => j !== imgIdx),
            }
          : v
      )
    );

  const handleSubmit = async () => {
    if (!form.name || !form.categoryId) {
      setError("Заполните название и категорию");
      return;
    }
    const active = variants.filter((v) => !v._deleted);
    if (active.length === 0) {
      setError("Добавьте хотя бы один вариант");
      return;
    }
    if (active.some((v) => !v.price)) {
      setError("Укажите цену для всех вариантов");
      return;
    }
    if (active.some((v) => !normalizeSlug(v.slug))) {
      setError("Slug обязателен для каждого варианта");
      return;
    }
    const slugs = active.map((v) => normalizeSlug(v.slug));
    if (new Set(slugs).size !== slugs.length) {
      setError("Slug вариантов должны быть уникальными");
      return;
    }

    setSaving(true);
    setError("");

    const sharedAttrsBase = attrs.filter(
      (a) =>
        a.key &&
        !COLOR_ATTR_KEYS.includes(a.key) &&
        !MEMORY_ATTR_KEYS.includes(a.key)
    );

    try {
      // Delete removed variants
      for (const v of variants.filter((v) => v._deleted && v.id)) {
        await fetch(`/api/admin/products/${v.id}`, { method: "DELETE" });
      }

      // Create/update active variants
      for (const v of active) {
        const variantAttrs = [
          ...sharedAttrsBase,
          ...(v.color ? [{ key: "Цвет", value: v.color }] : []),
          ...(v.memory ? [{ key: "Накопитель", value: v.memory }] : []),
        ];

        const data = new FormData();
        data.append("name", form.name);
        data.append("description", form.description);
        // Send raw rubles — API handles ×100 conversion
        data.append("price", v.price);
        data.append("priceOld", v.priceOld || String(Math.round(parseFloat(v.price) * 1.13)));
        data.append("categoryId", form.categoryId);
        data.append("brand", form.brand);
        data.append("color", v.color);
        data.append("inStock", String(v.inStock));
        data.append("isNew", String(form.isNew));
        data.append("isSale", String(form.isSale));
        data.append("stock", v.stock);
        data.append("metaTitle", form.metaTitle);
        data.append("metaDesc", form.metaDesc);
        data.append("attributes", JSON.stringify(variantAttrs));
        data.append("slug", normalizeSlug(v.slug));

        if (v.id) {
          data.append("existingImages", JSON.stringify(v.images));
          v.newImages.forEach((f) => data.append("images", f));
          const res = await fetch(`/api/admin/products/${v.id}`, {
            method: "PUT",
            body: data,
          });
          if (!res.ok) {
            const d = await res.json();
            throw new Error(d.error ?? "Ошибка обновления");
          }
        } else {
          v.newImages.forEach((f) => data.append("images", f));
          const res = await fetch("/api/admin/products", {
            method: "POST",
            body: data,
          });
          if (!res.ok) {
            const d = await res.json();
            throw new Error(d.error ?? "Ошибка создания");
          }
        }
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const activeVariants = variants.filter((v) => !v._deleted);

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      {/* Top bar */}
      <header className="bg-white border-b border-neutral-100 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="w-9 h-9 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-[#111827] transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              Товары / {isEdit ? "Редактирование" : isVariant ? "Новый вариант" : "Новый товар"}
            </p>
            <h1 className="text-lg font-black text-[#111827] leading-tight">
              {isEdit ? form.name || "—" : isVariant ? "Добавить вариант" : "Добавить товар"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-white border border-neutral-200 text-neutral-500 text-sm font-black rounded-xl hover:bg-neutral-50 transition-all"
          >
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

      {isVariant && (
        <div className="mx-8 mt-4 bg-blue-50 border border-blue-200 px-5 py-4 rounded-xl flex items-start gap-3">
          <Layers size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-black text-blue-700 mb-0.5">Создание варианта товара</p>
            <p className="text-xs font-bold text-blue-500">
              Источник: <span className="text-blue-700">«{sourceProductName}»</span>
            </p>
            <p className="text-[11px] text-blue-400 font-bold mt-1">
              Атрибут <b>Платформа</b> сохранён — вариант автоматически привяжется к группе.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-8 mt-4 bg-red-50 border border-red-200 text-red-600 text-sm font-bold px-5 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Left — shared info */}
        <div className="xl:col-span-2 space-y-5">
          {/* Basic info */}
          <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-black text-[#111827] flex items-center gap-2">
              <Info size={15} className="text-primary" /> Основная информация
            </h2>
            <div>
              <label className={labelCls}>Название товара *</label>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Xbox Series S"
              />
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
            <div>
              <label className={labelCls}>Бренд</label>
              <input
                className={inputCls}
                value={form.brand}
                onChange={(e) => set("brand", e.target.value)}
                placeholder="Microsoft"
              />
            </div>
          </section>

          {/* Variants table */}
          <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-black text-[#111827] flex items-center gap-2">
                <Package size={15} className="text-orange-500" /> Варианты товара
              </h2>
              <button
                onClick={addVariant}
                className="flex items-center gap-1.5 text-xs font-black text-primary hover:text-red-700 transition-colors"
              >
                <Plus size={13} /> Добавить вариант
              </button>
            </div>

            <div className="space-y-4">
              {activeVariants.map((v, displayIdx) => {
                const realIdx = variants.indexOf(v);
                const allImages = [...v.images, ...v.newPreviews];
                return (
                  <div
                    key={realIdx}
                    className="border border-neutral-100 rounded-2xl p-4 bg-neutral-50/50 space-y-4"
                  >
                    {/* Row header */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                        Вариант {displayIdx + 1}
                      </span>
                      {activeVariants.length > 1 && (
                        <button
                          onClick={() => deleteVariant(realIdx)}
                          className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 text-red-400 hover:bg-red-100 transition-colors flex items-center justify-center"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>

                    {/* Slug */}
                    <div>
                      <label className={labelCls}>Slug (URL) *</label>
                      <input
                        className={inputCls}
                        value={v.slug}
                        onChange={(e) => setVariant(realIdx, "slug", normalizeSlug(e.target.value))}
                        placeholder="sony-playstation-5-pro-2tb"
                      />
                      <p className="text-[10px] text-neutral-400 font-bold mt-1">
                        /catalog/…/<span className="text-neutral-600">{normalizeSlug(v.slug) || "slug"}</span>
                      </p>
                    </div>

                    {/* Color + Memory */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Цвет</label>
                        <div className="relative">
                          <select
                            className={inputCls + " appearance-none pr-9"}
                            value={v.color}
                            onChange={(e) => setVariant(realIdx, "color", e.target.value)}
                          >
                            <option value="">Не указан</option>
                            {COLOR_OPTIONS.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Память</label>
                        <div className="relative">
                          <select
                            className={inputCls + " appearance-none pr-9"}
                            value={v.memory}
                            onChange={(e) => setVariant(realIdx, "memory", e.target.value)}
                          >
                            <option value="">Не указана</option>
                            {MEMORY_OPTIONS.map((m) => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        </div>
                      </div>
                    </div>

                    {/* Price + Stock */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className={labelCls}>Цена наличные (руб) *</label>
                        <input
                          type="number"
                          className={inputCls}
                          value={v.price}
                          onChange={(e) => {
                            const price = e.target.value;
                            setVariants((p) =>
                              p.map((row, i) =>
                                i === realIdx
                                  ? { ...row, price, priceOld: calcOtherPrice(price) }
                                  : row
                              )
                            );
                          }}
                          placeholder="38990"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Другие способы (+13%)</label>
                        <input
                          type="number"
                          className={inputCls}
                          value={v.priceOld}
                          onChange={(e) => setVariant(realIdx, "priceOld", e.target.value)}
                          placeholder="44059"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Склад</label>
                        <input
                          type="number"
                          className={inputCls}
                          value={v.stock}
                          onChange={(e) => setVariant(realIdx, "stock", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* InStock toggle */}
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-bold text-neutral-600">В наличии</span>
                      <button
                        type="button"
                        onClick={() => setVariant(realIdx, "inStock", !v.inStock)}
                        className={`w-11 h-6 rounded-full transition-all relative ${v.inStock ? "bg-primary" : "bg-neutral-200"}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${v.inStock ? "left-[22px]" : "left-0.5"}`} />
                      </button>
                    </label>

                    {/* Images */}
                    <div>
                      <label className={labelCls}>Фотографии</label>
                      <div className="flex flex-wrap gap-2">
                        {v.images.map((url) => (
                          <div key={url} className="group relative w-16 h-16 rounded-xl overflow-hidden border border-neutral-100 bg-neutral-50">
                            <img src={url} alt="" className="w-full h-full object-contain p-1" />
                            <button
                              onClick={() => removeVariantExistingImage(realIdx, url)}
                              className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={8} />
                            </button>
                          </div>
                        ))}
                        {v.newPreviews.map((url, imgIdx) => (
                          <div key={imgIdx} className="group relative w-16 h-16 rounded-xl overflow-hidden border border-blue-200 bg-blue-50">
                            <img src={url} alt="" className="w-full h-full object-contain p-1" />
                            <button
                              onClick={() => removeVariantNewImage(realIdx, imgIdx)}
                              className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={8} />
                            </button>
                          </div>
                        ))}
                        {allImages.length < 10 && (
                          <button
                            onClick={() => openImagePicker(realIdx)}
                            className="w-16 h-16 border-2 border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center gap-1 text-neutral-400 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all"
                          >
                            <Upload size={14} />
                            <span className="text-[8px] font-black uppercase">Фото</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <input
              ref={variantFileRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleVariantImages}
            />
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
            <p className="text-[10px] text-neutral-400 font-bold mb-4">
              Цвет и память указываются в вариантах выше. Здесь — всё остальное (Платформа, Процессор и т.д.)
            </p>

            {attrs.length === 0 ? (
              <div className="border-2 border-dashed border-neutral-100 rounded-xl py-10 text-center">
                <Settings2 size={28} className="mx-auto mb-2 text-neutral-200" />
                <p className="text-xs text-neutral-400 font-bold">Нет характеристик</p>
                <button onClick={addAttr} className="mt-3 text-xs font-black text-primary">
                  + Добавить первую
                </button>
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
                      placeholder="Платформа"
                    />
                    <input
                      value={a.value}
                      onChange={(e) => setAttr(idx, "value", e.target.value)}
                      className={inputCls}
                      placeholder="Xbox Series S"
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
          {/* Category */}
          <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-black text-[#111827] flex items-center gap-2">
              <Tag size={15} className="text-orange-500" /> Категория и статус
            </h2>

            <div className="space-y-3">
              <div>
                <label className={labelCls}>Платформа / Бренд *</label>
                <div className="relative">
                  <select
                    className={inputCls + " appearance-none pr-9"}
                    value={selectedRootId ?? ""}
                    onChange={(e) => {
                      const rootId = e.target.value ? Number(e.target.value) : null;
                      setSelectedRootId(rootId);
                      const hasSubs = rootId
                        ? categories.some((c) => c.parentId === rootId)
                        : false;
                      set("categoryId", !hasSubs && rootId ? String(rootId) : "");
                    }}
                  >
                    <option value="">Выберите платформу</option>
                    {rootCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
              </div>
              {subCategories.length > 0 && (
                <div>
                  <label className={labelCls}>Подкатегория *</label>
                  <div className="relative">
                    <select
                      className={inputCls + " appearance-none pr-9"}
                      value={form.categoryId}
                      onChange={(e) => set("categoryId", e.target.value)}
                    >
                      <option value="">Выберите подкатегорию</option>
                      {subCategories.map((c) => (
                        <option key={c.id} value={String(c.id)}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-1">
              {[
                { key: "isNew", label: "Метка «Новинка»" },
                { key: "isSale", label: "Метка «Акция»" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-bold text-neutral-600 group-hover:text-[#111827] transition-colors">
                    {label}
                  </span>
                  <button
                    type="button"
                    onClick={() => set(key as keyof SharedForm, !(form as any)[key])}
                    className={`w-11 h-6 rounded-full transition-all relative ${(form as any)[key] ? "bg-primary" : "bg-neutral-200"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${(form as any)[key] ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </label>
              ))}
            </div>
          </section>

          {/* SEO */}
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
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1.5">
                  Meta Title
                </label>
                <input
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white placeholder:text-neutral-600 outline-none focus:border-white/20"
                  value={form.metaTitle}
                  onChange={(e) => set("metaTitle", e.target.value)}
                  placeholder="SEO заголовок"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1.5">
                  Meta Description
                </label>
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

          {isEdit && initial.id && (
            <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">
                Варианты в группе
              </p>
              <p className="text-xs font-bold text-neutral-500">
                {activeVariants.length} вариант(ов) будет сохранено
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
