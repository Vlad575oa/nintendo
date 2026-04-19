"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative w-full h-[600px] md:h-[720px] rounded-[40px] overflow-hidden bg-neutral-900 group mb-12">
      {/* Background with subtle animation */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000 group-hover:scale-100 opacity-60"
        style={{ 
          backgroundImage: `url('/images/blog/switch-2-complete-review.webp')`,
        }}
      />
      
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-8 md:p-20 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/30">
              New Era 2026
            </span>
            <div className="h-[1px] w-12 bg-white/20" />
            <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
              Pre-order Available
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter mb-8 italic uppercase">
            Nintendo <span className="text-primary tracking-normal not-italic">Switch 2</span><br />
            Next Generation
          </h1>

          <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed mb-10 max-w-xl">
            Погрузитесь в будущее гейминга с обновленной производительностью, 
            4K-графикой и эксклюзивными проектами Nintendo.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link 
              href="/catalog/consoles" 
              className="px-8 h-16 bg-white text-black rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 group/btn"
            >
              Оформить предзаказ 
              <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
            </Link>
            <Link 
              href="/blog/switch-2-complete-review"
              className="px-8 h-16 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all duration-300"
            >
              Полный обзор
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Glowing Elements */}
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
    </section>
  );
};
