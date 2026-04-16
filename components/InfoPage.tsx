import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { Metadata } from "next";

interface InfoPageProps {
  slug: string;
  template?: "default" | "legal";
}

interface Content {
  title: string;
  description: string;
  sections: { title: string; text: string[] }[];
}

function getContent(slug: string): Content | null {
  try {
    const filePath = path.join(process.cwd(), "content/pages", `${slug}.json`);
    if (!fs.existsSync(filePath)) return null;
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    return null;
  }
}

export function generateInfoMetadata(slug: string): Metadata {
  const pageContent = getContent(slug);
  if (!pageContent) return {};

  return {
    title: `${pageContent.title} | Nintendo Shop`,
    description: pageContent.description,
    alternates: {
      canonical: `/${slug}`
    }
  };
}

export const InfoPage = ({ slug }: { slug: string }) => {
  const pageContent = getContent(slug);

  if (!pageContent) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen py-32 px-4 mt-10">
      <div className="max-w-3xl mx-auto">
        <article>
          <div className="mb-12 space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full text-primary text-[10px] font-black uppercase tracking-widest">
              NINTENDO SHOP
            </div>
            <h1 className="text-5xl font-black tracking-tight text-secondary">{pageContent.title}</h1>
          </div>
          <div className="space-y-12">
            {pageContent.sections.map((section, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="text-2xl font-black text-secondary">{section.title}</h2>
                <div className="space-y-4">
                  {section.text.map((t, i) => (
                    <p key={i} className="text-neutral-500 leading-relaxed font-medium text-lg">
                      {t}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};
