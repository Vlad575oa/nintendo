import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck, FileText, Info, AlertTriangle } from "lucide-react";

interface LegalPageProps {
  params: {
    slug: string;
  };
}

interface Content {
  title: string;
  description: string;
  takeaways?: string[];
  sections: { title: string; text: string[]; warning?: boolean }[];
}

function getContent(slug: string): Content | null {
  try {
    const filePath = path.join(process.cwd(), "content/legal", `${slug}.json`);
    if (!fs.existsSync(filePath)) return null;
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const pageContent = getContent(params.slug);
  if (!pageContent) return {};

  return {
    title: `${pageContent.title} | Nintendo Shop`,
    description: pageContent.description,
    alternates: {
      canonical: `/legal/${params.slug}`
    }
  };
}

export default function LegalPage({ params }: LegalPageProps) {
  const pageContent = getContent(params.slug);

  if (!pageContent) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageContent.title,
    "description": pageContent.description,
    "publisher": {
      "@type": "Organization",
      "name": "Nintendo Shop",
      "logo": {
        "@type": "ImageObject",
        "url": "/images/logo.png"
      }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container relative z-10 max-w-5xl">
        {/* Breadcrumbs - Rule 6.2 Compliance */}
        <nav className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link href="/" className="text-[10px] font-black uppercase text-neutral-400 hover:text-primary transition-colors">Главная</Link>
          <ChevronRight size={10} className="text-neutral-300 shrink-0" />
          <span className="text-[10px] font-black uppercase text-neutral-500">Юридический центр</span>
          <ChevronRight size={10} className="text-neutral-300 shrink-0" />
          <span className="text-[10px] font-black uppercase text-secondary dark:text-white">{pageContent.title}</span>
        </nav>

        {/* Elite Header - Magnetic Voice */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
              Official Document
            </span>
            <div className="h-[1px] w-12 bg-neutral-100 dark:bg-white/10" />
            <span className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Transparency First
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-secondary dark:text-white leading-[0.95] tracking-tighter uppercase italic mb-8">
            {pageContent.title}
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed max-w-2xl">
            {pageContent.description}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <article className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-md rounded-[48px] p-8 md:p-12 border border-white/10">
              <div className="space-y-12">
                {pageContent.sections.map((section, idx) => (
                  <section key={idx} className="space-y-6">
                    <h2 className={`text-xl font-black uppercase tracking-tight flex items-center gap-3 ${section.warning ? "text-primary" : "text-secondary dark:text-white"}`}>
                      {section.warning && <AlertTriangle size={20} />}
                      {section.title}
                    </h2>
                    <div className="space-y-5">
                      {section.text.map((t, i) => (
                        <p key={i} className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium text-sm">
                          {t}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-20 pt-10 border-t border-neutral-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                <span className="text-neutral-400 text-[10px] font-black uppercase tracking-widest">
                  Последнее обновление: 18 апреля 2026
                </span>
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Версия для печати
                </button>
              </div>
            </article>
          </div>

          {/* Sidebar - Pro Tip & Key Takeaways */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Key Takeaways Card */}
            {pageContent.takeaways && (
              <div className="p-8 bg-secondary dark:bg-neutral-900 rounded-[40px] shadow-2xl shadow-black/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ShieldCheck size={120} className="text-white" />
                </div>
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6 relative z-10">Главное за 30 секунд</h4>
                <ul className="space-y-4 relative z-10">
                  {pageContent.takeaways.map((item, i) => (
                    <li key={i} className="flex gap-3 text-xs font-bold text-white/80 leading-snug items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Support Card */}
            <div className="p-8 bg-primary/10 border border-primary/20 rounded-[40px] backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                <Info className="text-white" size={24} />
              </div>
              <h4 className="text-secondary dark:text-white font-black uppercase text-sm mb-3">Нужна помощь?</h4>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs font-medium leading-relaxed mb-6">
                Если у вас возникли вопросы по тексту оферты или другим документам, наша служба поддержки готова прояснить любой пункт.
              </p>
              <Link 
                href="/contacts"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:gap-3 transition-all"
              >
                Связаться с юристом <ChevronRight size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
