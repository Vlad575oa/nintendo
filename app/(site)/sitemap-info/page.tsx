import Link from "next/link";

export default function SitemapInfoPage() {
  const sections = [
    {
      title: "Каталог",
      links: [
        { name: "PlayStation 5", href: "/catalog/playstation" },
        { name: "Xbox Series", href: "/catalog/xbox" },
        { name: "Nintendo Switch", href: "/catalog/nintendo" },
        { name: "Аксессуары", href: "/catalog/accessories" },
        { name: "Игры", href: "/catalog/games" },
      ]
    },
    {
      title: "Покупателям",
      links: [
        { name: "О компании", href: "/about" },
        { name: "Доставка и оплата", href: "/delivery" },
        { name: "Гарантия", href: "/warranty" },
        { name: "Контакты", href: "/contacts" },
      ]
    },
    {
      title: "Юридическая информация",
      links: [
        { name: "Публичная оферта", href: "/legal/offer" },
        { name: "Политика конфиденциальности", href: "/legal/privacy" },
        { name: "Условия использования", href: "/legal/terms" },
        { name: "Файлы Cookie", href: "/legal/cookies" },
      ]
    }
  ];

  return (
    <div className="bg-white min-h-screen py-32 px-4">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-black mb-16 tracking-tight">Карта сайта</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {sections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400">
                {section.title}
              </h2>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-lg font-bold text-secondary hover:text-primary transition-colors"
                    >
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
