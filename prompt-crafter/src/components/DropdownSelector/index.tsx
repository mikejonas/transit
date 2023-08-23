import { LLM_Models } from "../../data";
import React from "react";

interface DropdownSelectorProps {
  label: string;
  options: LLM_Models[];
  value: LLM_Models;
  onChange: (value: LLM_Models) => void;
}

const DropdownSelector: React.FC<DropdownSelectorProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  return (
    <div className="text-white py-2">
      <label htmlFor="selector" className="text-sm mb-2 font-bold block">
        {label}
      </label>
      <div className="relative">
        <select
          onChange={(e) => onChange(e.target.value as LLM_Models)}
          id="selector"
          value={value}
          className="w-full appearance-none bg-zinc-700 text-white rounded px-3 py-2 focus:outline-none focus:bg-zinc-600"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option.replace("-", " ")}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-300">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M6.293 9.293a1 1 0 0 1 1.414 0L10 11.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DropdownSelector;
