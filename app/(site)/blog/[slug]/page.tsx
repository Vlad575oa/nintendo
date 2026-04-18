import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ArrowLeft, Clock, User, Share2, Bookmark, MessageCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { marked } from "marked";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nintendo-shop.ru";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post) return {};

  const title = `${post.metaTitle || post.title} | Блог Nintendo Shop`;
  const description = post.metaDesc || post.excerpt || "";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/blog/${params.slug}`
    },
    openGraph: {
      title,
      description,
      images: post.image ? [{ url: post.image }] : [],
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.image ? [post.image] : [],
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });

  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || "",
    "image": post.image ? [post.image] : [],
    "datePublished": post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Nintendo Media Team",
      "url": baseUrl,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Nintendo Shop",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/favicon.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
  };

  const relatedPosts = await prisma.post.findMany({
    where: { 
      isPublished: true,
      NOT: { id: post.id }
    },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <article className="bg-[#fcfcfd] min-h-screen pt-12 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="container">
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          {/* Minimal Breadcrumbs */}
          <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">
             <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
             <ChevronRight size={10} />
             <Link href="/blog" className="hover:text-primary transition-colors">Блог</Link>
             <ChevronRight size={10} />
             <span className="text-neutral-500 truncate max-w-[200px]">{post.category || "Материал"}</span>
          </div>

          <Link href="/blog" className="inline-flex items-center gap-3 text-neutral-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-all mb-8 group">
            <div className="w-8 h-8 rounded-full border border-neutral-100 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
              <ArrowLeft size={14} />
            </div>
            К списку статей
          </Link>

          {/* Premium Refined Header */}
          <header className="space-y-6 mb-12">
            <div className="flex items-center gap-3">
               <span className="px-3 py-1 bg-primary text-white rounded-md text-[9px] font-black uppercase tracking-widest">
                 {post.category || "Материал"}
               </span>
               <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                  <Clock size={12} className="text-primary" />
                  ~6 мин чтения
               </div>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-secondary tracking-tight leading-[1.1] uppercase italic">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 py-6 border-y border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden">
                   <img src="https://i.pravatar.cc/100?img=12" alt="author" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-secondary text-xs font-black uppercase tracking-widest">Nintendo Media Team</span>
                  <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em]">{format(new Date(post.createdAt), 'dd MMMM yyyy', { locale: ru })}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                 <button className="p-2.5 rounded-xl border border-neutral-100 bg-white hover:bg-neutral-50 transition-colors text-neutral-400">
                    <Share2 size={16} />
                 </button>
                 <button className="p-2.5 rounded-xl border border-neutral-100 bg-white hover:bg-neutral-50 transition-colors text-neutral-400">
                    <Bookmark size={16} />
                 </button>
              </div>
            </div>
          </header>
        </div>

        {/* Cinematic Main Image */}
        <div className="max-w-5xl mx-auto mb-16 px-0 md:px-4">
          <div className="relative aspect-video md:aspect-[21/9] md:rounded-[40px] overflow-hidden shadow-2xl group transition-transform duration-700 hover:scale-[1.01]">
            <img 
              src={post.image || "/images/placeholder.jpg"} 
              className="w-full h-full object-cover" 
              alt={post.title}
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-0">
          {/* Content with Custom Prose */}
          <div className="prose prose-neutral prose-base max-w-none 
            prose-h2:text-2xl prose-h2:font-black prose-h2:text-secondary prose-h2:tracking-tight prose-h2:mt-10 prose-h2:mb-4 prose-h2:uppercase prose-h2:italic
            prose-h3:text-lg prose-h3:font-black prose-h3:text-secondary prose-h3:mb-3
            prose-p:text-neutral-600 prose-p:font-medium prose-p:leading-relaxed prose-p:mb-6 text-sm md:text-base
            prose-li:text-neutral-600 prose-li:font-medium prose-li:mb-2
            prose-strong:text-secondary prose-strong:font-black
            prose-img:rounded-[24px] prose-img:shadow-xl prose-img:my-8
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:font-black prose-blockquote:text-secondary prose-blockquote:not-italic
          ">
            <div dangerouslySetInnerHTML={{ __html: marked(post.content) as string }} />
          </div>

          {/* Social Proof & Interactive Footer */}
          <footer className="mt-20 pt-10 border-t border-neutral-100">
            <div className="bg-white p-8 rounded-[32px] border border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
               <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-2 text-center md:text-left">Было полезно?</p>
                  <div className="flex items-center gap-6 text-xl">
                      <button className="hover:scale-125 transition-transform">🔥</button>
                      <button className="hover:scale-125 transition-transform">🤩</button>
                      <button className="hover:scale-125 transition-transform">🤔</button>
                      <button className="hover:scale-125 transition-transform">👾</button>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                     <p className="text-xs font-black text-secondary">Поделись инсайдом</p>
                     <p className="text-[10px] text-neutral-400 font-bold">1.2k репостов за неделю</p>
                  </div>
                  <button className="flex items-center gap-3 px-6 py-3.5 bg-primary text-white rounded-[18px] font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 active:scale-95">
                      <Share2 size={14} /> Отправить другу
                  </button>
               </div>
            </div>
          </footer>

          {/* Related Material */}
          {relatedPosts.length > 0 && (
            <div className="mt-32 space-y-10">
               <div className="flex items-center justify-between">
                  <h4 className="text-xl font-black text-secondary uppercase tracking-tight italic">Вам может понравиться</h4>
                  <Link href="/blog" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Все статьи</Link>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {relatedPosts.map(rel => (
                   <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group flex flex-col">
                      <div className="aspect-video rounded-2xl overflow-hidden shadow-sm border border-neutral-100 mb-4">
                        <img src={rel.image || ""} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <h5 className="text-sm font-black text-secondary group-hover:text-primary transition-colors leading-tight line-clamp-2">{rel.title}</h5>
                   </Link>
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

