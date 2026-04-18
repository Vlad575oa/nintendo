import Link from "next/link";
import { ChevronRight, Map, Compass, Shield, ShoppingBag } from "lucide-react";

export default function SitemapInfoPage() {
  const sections = [
    {
      title: "Каталог",
      icon: ShoppingBag,
      links: [
        { name: "Nintendo Switch", href: "/catalog/nintendo" },
        { name: "PlayStation 5", href: "/catalog/playstation" },
        { name: "Xbox Series", href: "/catalog/xbox" },
        { name: "Retro Gaming", href: "/catalog/retro" },
        { name: "Аксессуары", href: "/catalog/accessories" },
      ]
    },
    {
      title: "Центр поддержки",
      icon: Compass,
      links: [
        { name: "О компании", href: "/about" },
        { name: "Блог игромана", href: "/blog" },
        { name: "Доставка и оплата", href: "/info/delivery" },
        { name: "Гарантия 360°", href: "/info/guarantee" },
        { name: "FAQ / Вопросы", href: "/faq" },
        { name: "Контакты", href: "/contacts" },
      ]
    },
    {
      title: "Легальные данные",
      icon: Shield,
      links: [
        { name: "Публичная оферта", href: "/legal/offer" },
        { name: "Конфиденциальность", href: "/legal/privacy" },
        { name: "Условия использования", href: "/legal/terms" },
        { name: "Файлы Cookie", href: "/legal/cookies" },
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="container relative z-10 max-w-6xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link href="/" className="text-[10px] font-black uppercase text-neutral-400 hover:text-primary transition-colors">Главная</Link>
          <ChevronRight size={10} className="text-neutral-300 shrink-0" />
          <span className="text-[10px] font-black uppercase text-secondary dark:text-white">Карта сайта</span>
        </nav>

        {/* Elite Header */}
        <header className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-[0.2em] animate-in slide-in-from-left duration-500">
              Site Navigation
            </span>
            <div className="h-[1px] w-12 bg-neutral-100 dark:bg-white/10" />
            <span className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">
              All Roads to Victory
            </span>
          </div>
          <h1 className="text-4xl md:text-8xl font-black text-secondary dark:text-white leading-[0.9] tracking-tighter uppercase italic mb-8">
            Карта навигации:<br /> 
            <span className="text-primary not-italic text-3xl md:text-5xl">всё под контролем</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div key={section.title} className="p-10 bg-white/40 dark:bg-white/[0.03] backdrop-blur-md rounded-[48px] border border-white/10 hover:border-primary/20 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <section.icon size={150} />
              </div>
              
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-10 flex items-center gap-3 relative z-10">
                <section.icon size={16} /> {section.title}
              </h2>

              <ul className="space-y-5 relative z-10">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-base md:text-lg font-black text-secondary dark:text-white hover:text-primary hover:translate-x-2 transition-all flex items-center gap-2 group/item"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
