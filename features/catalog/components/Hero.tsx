import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="relative w-full h-[600px] flex items-center overflow-hidden bg-secondary rounded-[40px] mt-6">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-transparent z-10" />
        <Image
          src="https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=2000"
          alt="Gaming Hero"
          fill
          className="object-cover object-right opacity-60"
          priority
        />
      </div>

      <div className="container relative z-20 px-12">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 rounded-full">
            Limited Edition
          </span>
          <h1 className="text-6xl font-black text-white leading-[1.1] mb-6">
            Погрузитесь в мир <br /> <span className="text-primary italic">новых</span> впечатлений
          </h1>
          <p className="text-lg text-neutral-400 mb-10 max-w-lg leading-relaxed">
            Откройте для себя новейшие консоли Xbox, PlayStation и Nintendo с быстрой доставкой и гарантией качества.
          </p>
          <div className="flex gap-4">
            <Link href="/catalog">
              <Button size="lg" className="rounded-2xl">
                Смотреть каталог
              </Button>
            </Link>
            <Link href="/catalog/xbox">
              <Button variant="outline" size="lg" className="rounded-2xl border-white/20 text-white hover:bg-white hover:text-black">
                Xbox Series X
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
