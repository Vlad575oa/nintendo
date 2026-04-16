import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ArrowLeft, Clock, User, Share2, Bookmark, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post) return {};

  return {
    title: `${post.metaTitle || post.title} | Nintendo Shop`,
    description: post.metaDesc || post.excerpt,
    alternates: {
      canonical: `/blog/${params.slug}`
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });

  if (!post) notFound();

  const relatedPosts = await prisma.post.findMany({
    where: { 
      isPublished: true,
      NOT: { id: post.id }
    },
    take: 2,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <article className="bg-white min-h-screen pt-40 pb-32">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-3 text-neutral-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-all mb-12 group">
            <div className="w-8 h-8 rounded-full border border-neutral-100 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
              <ArrowLeft size={14} />
            </div>
            Назад в блог
          </Link>

          {/* Premium Header */}
          <header className="space-y-10 mb-20 text-center md:text-left">
            <div className="flex justify-center md:justify-start">
               <span className="px-5 py-2 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                 {post.category || "Материал"}
               </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-secondary tracking-tighter leading-[0.95] uppercase italic font-black">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-10 text-neutral-400 font-bold">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center shadow-sm">
                  <User size={20} className="text-primary" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] uppercase tracking-widest opacity-50 font-black">Автор команды</span>
                  <span className="text-secondary text-sm font-black">Nintendo Expert</span>
                </div>
              </div>

              <div className="flex items-center gap-3 border-l border-neutral-100 pl-10 h-10">
                <Clock size={18} className="text-primary" />
                <span className="text-sm">~6 мин чтения</span>
              </div>

              <div className="flex items-center gap-3 border-l border-neutral-100 pl-10 h-10">
                <span className="text-sm">{format(new Date(post.createdAt), 'dd MMMM yyyy', { locale: ru })}</span>
              </div>
            </div>
          </header>
        </div>

        {/* Cinematic Main Image */}
        <div className="container max-w-6xl px-0 md:px-4 mb-24">
          <div className="relative aspect-[21/9] md:rounded-[60px] overflow-hidden shadow-[0_64px_128px_-16px_rgba(0,0,0,0.15)] group">
            <img 
              src={post.image || "/images/placeholder.jpg"} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt={post.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Content with Custom Prose */}
          <div className="prose prose-neutral prose-xl max-w-none 
            prose-h2:text-4xl prose-h2:font-black prose-h2:text-secondary prose-h2:tracking-tighter prose-h2:mt-20 prose-h2:mb-8 prose-h2:uppercase prose-h2:italic
            prose-h3:text-2xl prose-h3:font-black prose-h3:text-secondary prose-h3:mb-6
            prose-p:text-neutral-500 prose-p:font-medium prose-p:leading-relaxed prose-p:mb-10 text-lg md:text-xl
            prose-li:text-neutral-500 prose-li:font-medium prose-li:mb-2
            prose-strong:text-secondary prose-strong:font-black
            prose-img:rounded-[50px] prose-img:shadow-2xl prose-img:my-16
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-8 prose-blockquote:rounded-r-3xl prose-blockquote:font-black prose-blockquote:text-secondary
          ">
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
          </div>

          {/* Interactive Footer */}
          <footer className="mt-32 pt-12 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex gap-4">
              <button className="flex items-center gap-3 px-8 py-4 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-900 transition-all shadow-xl shadow-secondary/20 active:scale-95">
                  <Share2 size={16} /> Поделиться
              </button>
              <button className="w-14 h-14 border border-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-primary hover:border-primary transition-all active:scale-95">
                  <Bookmark size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] cursor-pointer hover:opacity-70 transition-opacity">
                  <MessageCircle size={18} />
                  <span>Обсудить (12)</span>
               </div>
               <div className="h-4 w-[1px] bg-neutral-100" />
               <div className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.2em]">
                  ID публикации: #{post.id}
               </div>
            </div>
          </footer>

          {/* Related Material */}
          {relatedPosts.length > 0 && (
            <div className="mt-40 space-y-12">
               <h4 className="text-2xl font-black text-secondary uppercase tracking-tighter italic">Читайте также</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {relatedPosts.map(rel => (
                   <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group space-y-6">
                      <div className="aspect-[16/9] rounded-[32px] overflow-hidden shadow-lg border border-neutral-100">
                        <img src={rel.image || ""} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <h5 className="text-xl font-black text-secondary group-hover:text-primary transition-colors leading-tight">{rel.title}</h5>
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
