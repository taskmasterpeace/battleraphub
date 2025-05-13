"use client";
import { Slider } from "@/components/ui/slider";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { useAuth } from "@/contexts/auth.context";

interface AttributeSliderProps {
  title: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  gradientFrom: string;
  gradientTo: string;
}

export default function AttributeSlider({
  title,
  description,
  value,
  onChange,
  // gradientFrom,
  // gradientTo,
}: AttributeSliderProps) {
  const [localValue, setLocalValue] = useState(value);
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedChangeRef = useRef(
    debounce((val: number) => {
      onChange(val);
    }, 500),
  );

  useEffect(() => {
    const debouncedChange = debouncedChangeRef.current;
    return () => {
      debouncedChange.cancel();
    };
  }, []);

  // Get color based on value
  const getColor = () => {
    if (localValue < 3) return "text-destructive";
    if (localValue < 5) return "text-orange-500";
    if (localValue < 7) return "text-yellow-500";
    if (localValue < 9) return "text-success";
    return "text-emerald-500";
  };

  return (
    <div className="bg-background rounded-lg p-4 border border-border">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <h3 className="font-semibold mr-2">{title}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className={`px-2 py-1 bg-accent rounded-full text-sm font-medium ${getColor()}`}>
          {localValue?.toFixed(2) || 0}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <Slider
        min={0}
        max={10}
        step={0.1}
        value={[localValue]}
        onValueChange={(values) => {
          if (!userId) return null;
          const newVal = values[0];
          setLocalValue(newVal);
          debouncedChangeRef.current(newVal);
        }}
        className="w-full"
      />
    </div>
  );
}
