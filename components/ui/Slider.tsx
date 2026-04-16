"use client";

import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

/**
 * Premium Nintendo-style Slider component
 * Supports single and multiple thumbs for range selection
 */
interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label?: string;
  suffix?: string;
  showValueLabel?: boolean;
}

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, label, suffix, showValueLabel = true, value, defaultValue, onValueChange, ...props }, ref) => {
  // Sync internal state with props for better interaction feedback
  const [internalValues, setInternalValues] = React.useState<number[]>(
    (value as number[]) || (defaultValue as number[]) || [0]
  );

  // Update internal state when controlled value prop changes
  React.useEffect(() => {
    if (value) {
      setInternalValues(value as number[]);
    }
  }, [value]);

  const handleValueChange = (newValues: number[]) => {
    setInternalValues(newValues);
    onValueChange?.(newValues);
  };

  return (
    <div className="w-full space-y-4 py-2">
      {/* Label and Value Header */}
      {(label || showValueLabel) && (
        <div className="flex justify-between items-end mb-1">
          {label && (
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
              {label}
            </span>
          )}
          {showValueLabel && (
            <span className="text-xl font-black text-secondary tabular-nums leading-none">
              {internalValues.length === 1 ? (
                <span>{internalValues[0]}{suffix && <span className="ml-0.5 text-sm text-neutral-400 font-bold uppercase">{suffix}</span>}</span>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{internalValues[0]}</span>
                  <span className="text-neutral-300">—</span>
                  <span>{internalValues[1]}</span>
                  {suffix && <span className="ml-0.5 text-sm text-neutral-400 font-bold uppercase">{suffix}</span>}
                </div>
              )}
            </span>
          )}
        </div>
      )}
      
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center group py-4",
          className
        )}
        value={value ? (value as number[]) : internalValues}
        onValueChange={handleValueChange}
        step={props.step ?? 1}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-neutral-100 border border-neutral-200/50">
          <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-primary to-orange-600 shadow-[0_0_15px_rgba(230,0,18,0.3)] transition-all duration-300 group-active:duration-0" />
        </SliderPrimitive.Track>
        
        {/* Render as many thumbs as there are values */}
        {internalValues.map((_, i) => (
          <SliderPrimitive.Thumb 
            key={i} 
            className="block h-6 w-6 rounded-full border-[5px] border-white bg-primary shadow-[0_4px_12px_rgba(230,0,18,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all cursor-grab active:cursor-grabbing hover:scale-115 active:scale-90" 
          />
        ))}
      </SliderPrimitive.Root>
      
      {/* Optional decorative track markers for premium feel */}
      {!label && (
        <div className="flex justify-between px-1 pointer-events-none opacity-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-0.5 h-1 bg-neutral-900 rounded-full" />
          ))}
        </div>
      )}
    </div>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;
