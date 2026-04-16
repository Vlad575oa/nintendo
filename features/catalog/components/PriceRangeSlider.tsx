"use client";

import * as Slider from "@radix-ui/react-slider";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChangeMin: (v: number) => void;
  onChangeMax: (v: number) => void;
}

export const PriceRangeSlider = ({
  min,
  max,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
}: PriceRangeSliderProps) => {
  return (
    <div className="py-4 px-1">
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full"
        style={{ height: 24 }}
        value={[valueMin, valueMax]}
        min={min}
        max={max}
        step={100}
        minStepsBetweenThumbs={10}
        onValueChange={([newMin, newMax]) => {
          onChangeMin(newMin);
          onChangeMax(newMax);
        }}
      >
        <Slider.Track className="relative grow rounded-full h-[3px] bg-neutral-100">
          <Slider.Range className="absolute rounded-full h-full bg-primary" />
        </Slider.Track>

        <Slider.Thumb className="block w-[22px] h-[22px] bg-white border-[2.5px] border-primary rounded-full shadow-[0_2px_10px_rgba(230,0,18,0.28)] focus:outline-none hover:scale-110 active:scale-95 transition-transform cursor-grab active:cursor-grabbing" />
        <Slider.Thumb className="block w-[22px] h-[22px] bg-white border-[2.5px] border-primary rounded-full shadow-[0_2px_10px_rgba(230,0,18,0.28)] focus:outline-none hover:scale-110 active:scale-95 transition-transform cursor-grab active:cursor-grabbing" />
      </Slider.Root>
    </div>
  );
};
