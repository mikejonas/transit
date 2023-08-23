import React from "react";
import { FieldName, FieldValues, useFormContext } from "react-hook-form";

interface RangeSliderProps {
  min: number;
  max: number;
  name: FieldName<FieldValues>;
  value: number;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, name, value }) => {
  const { register } = useFormContext(); // Getting the register function from the form context

  return (
    <div>
      <div className="flex flex-row justify-between text-white mb-1">
        <div className="text-sm font-bold">Temperature:</div>
        <div className="text-sm font-bold text-right">{value}</div>
      </div>

      <input
        {...register(name, { valueAsNumber: true })}
        type="range"
        min={min}
        max={max}
        step="0.1"
        className="appearance-none w-full h-2 rounded-full bg-zinc-700 focus:outline-none focus:bg-zinc-600"
      />
    </div>
  );
};

export default RangeSlider;
