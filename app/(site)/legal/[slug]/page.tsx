import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { Metadata } from "next";

interface LegalPageProps {
  params: {
    slug: string;
  };
}

interface Content {
  title: string;
  description: string;
  sections: { title: string; text: string[] }[];
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

  return (
    <div className="bg-white min-h-screen pt-12 pb-24 px-4 overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <article>
          <h1 className="text-4xl font-black mb-12 tracking-tight text-secondary">{pageContent.title}</h1>
          <div className="space-y-10">
            {pageContent.sections.map((section, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="text-xl font-bold text-secondary">{section.title}</h2>
                {section.text.map((t, i) => (
                  <p key={i} className="text-neutral-600 leading-relaxed font-medium">
                    {t}
                  </p>
                ))}
              </section>
            ))}
          </div>
          
          <div className="mt-20 pt-10 border-t border-neutral-100 text-neutral-400 text-sm">
            Дата последнего обновления: «16» апреля 2026 г.
          </div>
        </article>
      </div>
    </div>
  );
}
