"use client";
import { Slider } from "@/components/ui/slider";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { useAuth } from "@/contexts/auth.context";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface AttributeSliderProps {
  title: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  gradientFrom: string;
  gradientTo: string;
  colorText: string;
}

export default function AttributeSlider({
  title,
  description,
  value,
  onChange,
  colorText,
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
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <h3 className="text-xs sm:text-base font-semibold mr-2">{title}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${getColor()}`}
        >
          <Badge className={`bg-${colorText}`}> {localValue?.toFixed(2) || 0}</Badge>
        </motion.div>
      </div>
      <motion.div whileTap={{ scale: 0.98 }}>
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
          color={`bg-${colorText}`}
          className="w-full"
        />
      </motion.div>
    </div>
  );
}
