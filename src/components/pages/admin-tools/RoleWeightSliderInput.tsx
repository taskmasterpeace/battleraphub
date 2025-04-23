import React from "react";
import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/contexts/auth.context";

interface RoleWeightInputProps {
  label: string;
  color: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}

const RoleWeightSliderInput: React.FC<RoleWeightInputProps> = ({
  label,
  color,
  description,
  value,
  onChange,
}) => {
  const { user } = useAuth();
  const userId = user?.id;
  const debouncedOnChange = React.useMemo(
    () =>
      debounce((value: number) => {
        if (!userId) return null;
        onChange(value);
      }, 500),
    [onChange, userId],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      const clampedValue = Math.min(Math.max(newValue, 1), 10);
      onChange(clampedValue);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${color}`}></div>
          {label}
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="1"
            max="10"
            step="1"
            value={value}
            onChange={handleInputChange}
            className="w-20"
            onBlur={(e) => {
              const val = Number.parseFloat(e.target.value);
              if (isNaN(val)) {
                onChange(0);
              } else if (val > 10) {
                onChange(10);
              }
            }}
          />
          <span className="text-sm text-gray-400">× weight</span>
        </div>
      </div>
      <Slider
        min={1}
        max={10}
        step={1}
        value={[value]}
        onValueChange={(values) => debouncedOnChange(values[0])}
        className="`bg-gradient-to-r from-gray-700"
      />
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
};

export default RoleWeightSliderInput;
