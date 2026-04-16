"use client";

import { Slider } from "@/components/ui/Slider";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChangeMin: (v: number) => void;
  onChangeMax: (v: number) => void;
}

/**
 * Premium Price Range Slider for the Catalog Sidebar
 * Integrates the global premium Slider component with smooth movement
 */
export const PriceRangeSlider = ({
  min,
  max,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
}: PriceRangeSliderProps) => {
  return (
    <div className="px-1">
      <Slider
        min={min}
        max={max}
        value={[valueMin, valueMax]}
        onValueChange={([newMin, newMax]) => {
          onChangeMin(newMin);
          onChangeMax(newMax);
        }}
        // "Free" movement: step 1 for price range up to 200k is very smooth
        step={1}
        // Minimal distance between thumbs to prevent overlap
        minStepsBetweenThumbs={1000} 
        showValueLabel={false}
        className="py-2"
      />
    </div>
  );
};
