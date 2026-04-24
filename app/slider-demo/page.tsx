import { Slider } from "@/components/ui/Slider";

export const metadata = {
  title: "Slider Demo | Gameshop24",
  description: "Testing the premium slider component",
};

export default function SliderDemoPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-xl space-y-20">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Slider <span className="text-primary">Component</span>
          </h1>
          <p className="text-neutral-500 font-bold uppercase text-xs tracking-[0.3em]">
            Premium UI Interaction
          </p>
        </div>

        <div className="p-12 rounded-[2.5rem] bg-zinc-950 border border-white/5 shadow-2xl space-y-12">
          <section className="space-y-2">
            <Slider 
              label="Volume Level" 
              defaultValue={[50]} 
              max={100} 
              step={1}
            />
          </section>

          <section className="space-y-2">
            <Slider 
              label="Price Range" 
              defaultValue={[2500]} 
              max={10000} 
              step={10}
              suffix="₽"
            />
          </section>

          <section className="space-y-2">
            <Slider 
              label="Free Movement (No Step)" 
              defaultValue={[0.5]} 
              max={1} 
              step={0.001}
            />
          </section>
        </div>

        <div className="flex justify-center gap-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <div className="w-2 h-2 rounded-full bg-primary/20" />
        </div>
      </div>
    </main>
  );
}
