import Link from "next/link";
import { Gamepad2, Monitor, Joystick, Package, Headphones, Trophy } from "lucide-react";

const iconMap = {
  playstation: Monitor,
  xbox: Joystick,
  nintendo: Gamepad2,
  gamepads: Joystick,
  accessories: Headphones,
  games: Package,
};

interface CategoryCardProps {
  name: string;
  slug: string;
  count?: number;
}

export const CategoryCard = ({ name, slug }: CategoryCardProps) => {
  // @ts-ignore
  const Icon = iconMap[slug as keyof typeof iconMap] || Package;

  return (
    <Link
      href={`/catalog/${slug}`}
      className="group relative flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-neutral-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10 w-16 h-16 mb-4 flex items-center justify-center rounded-2xl bg-neutral-50 group-hover:bg-primary/10 transition-colors">
        <Icon className="w-8 h-8 text-neutral-400 group-hover:text-primary transition-colors" />
      </div>
      
      <h3 className="relative z-10 text-sm font-bold text-neutral-800 group-hover:text-primary tracking-tight">
        {name}
      </h3>
    </Link>
  );
};
