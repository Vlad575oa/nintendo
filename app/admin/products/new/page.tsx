"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  Save,
  ChevronRight,
  Info
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    priceOld: "",
    category: "PlayStation 5",
    metaTitle: "",
    metaDesc: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setImages(prev => [...prev, ...newFiles]);
    
    // Create previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    if (!formData.name || !formData.price) {
        alert("Заполните название и цену!");
        return;
    }

    setIsUploading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("priceOld", formData.priceOld);
    data.append("category", formData.category);
    data.append("metaTitle", formData.metaTitle);
    data.append("metaDesc", formData.metaDesc);
    
    images.forEach(image => {
        data.append("images", image);
    });

    try {
        const res = await fetch("/api/admin/products", {
            method: "POST",
            body: data,
        });

        if (res.ok) {
            alert("Товар успешно добавлен!");
            router.push("/admin");
            router.refresh();
        } else {
            const error = await res.json();
            alert("Ошибка: " + error.error);
        }
    } catch (err) {
        alert("Ошибка при отправке данных");
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="bg-white border-b border-neutral-100 py-6 px-12 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="p-3 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors">
              <ArrowLeft size={20} className="text-neutral-500" />
            </Link>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Админ-панель <ChevronRight size={10} /> Товары
              </div>
              <h1 className="text-2xl font-black text-secondary">Добавление товара</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
                onClick={() => router.back()}
                className="px-6 py-3 bg-white border border-neutral-200 text-neutral-500 font-black rounded-2xl hover:bg-neutral-50 transition-all"
            >
              Отмена
            </button>
            <button 
                onClick={onSubmit}
                disabled={isUploading}
                className="px-8 py-3 bg-primary text-white font-black rounded-2xl flex items-center gap-2 shadow-xl shadow-red-500/20 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isUploading ? "Загрузка..." : "Опубликовать"}
            </button>
          </div>
        </div>
      </div>

      <div className="container py-12 px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-10 rounded-[40px] border border-neutral-100 shadow-sm space-y-8">
            <h2 className="text-xl font-black text-secondary flex items-center gap-2">
              <Info size={18} className="text-primary" /> Основная информация
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Название товара</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleInputChange}
                  placeholder="Например: Sony PlayStation 5 Pro"
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-primary/20 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Описание</label>
                <textarea 
                  name="description" value={formData.description} onChange={handleInputChange}
                  rows={6} placeholder="Опишите преимущества..."
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-[32px] text-sm font-medium focus:bg-white outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Цена (руб)</label>
                  <input 
                    type="number" name="price" value={formData.price} onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-bold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Старая цена</label>
                  <input 
                    type="number" name="priceOld" value={formData.priceOld} onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-bold outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-10 rounded-[40px] border border-neutral-100 shadow-sm">
            <h2 className="text-xl font-black text-secondary mb-8 flex items-center gap-2">
              <Upload size={18} className="text-blue-500" /> Медиа файлы
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviews.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-100 group">
                  <img src={img} className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                </div>
              ))}
              {imagePreviews.length < 10 && (
                <label className="aspect-square border-2 border-dashed border-neutral-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50">
                  <input type="file" multiple className="hidden" onChange={handleUpload} accept="image/*" />
                  <Plus size={20} className="text-neutral-400" />
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-2">Добавить фото</span>
                </label>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[40px] border border-neutral-100 shadow-sm space-y-6">
            <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Категория</label>
                <select 
                    name="category" value={formData.category} onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-bold outline-none"
                >
                    <option>PlayStation 5</option>
                    <option>Xbox Series</option>
                    <option>Nintendo Switch</option>
                    <option>Аксессуары</option>
                </select>
            </div>
          </section>
          <section className="bg-secondary p-8 rounded-[40px] text-white space-y-6">
            <h3 className="font-black tracking-tight">SEO Оптимизация</h3>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black opacity-40">Meta Title</label>
                    <input name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black opacity-40">Meta Description</label>
                    <textarea name="metaDesc" value={formData.metaDesc} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none resize-none h-24" />
                </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
