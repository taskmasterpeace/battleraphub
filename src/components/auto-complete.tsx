import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, CircleUser } from "lucide-react";
import { Command } from "cmdk";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AutoCompleteOption {
  id: string | number;
  name?: string;
  avatar?: string;
}

interface AutoCompleteProps<T extends AutoCompleteOption> {
  placeholderText: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  options: T[];
  selectedOption?: T;
  setSelectedOption?: (value: T) => void;
}

const AutoComplete = <T extends AutoCompleteOption>({
  placeholderText,
  searchQuery,
  setSearchQuery,
  options,
  selectedOption,
  setSelectedOption,
}: AutoCompleteProps<T>) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {placeholderText}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder="Search item..."
            className="h-9"
            value={searchQuery}
            onValueChange={(value) => setSearchQuery(value)}
          />
          <CommandList>
            <CommandEmpty>No battler found.</CommandEmpty>
            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    setSelectedOption?.(item);
                    setSearchQuery("");
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {item.avatar ? (
                      <Image
                        src={item.avatar || "/image/default-avatar-img.jpg"}
                        alt={item.name || ""}
                        width={24}
                        height={24}
                        className="rounded-full !w-[24px] !h-[24px] object-cover"
                      />
                    ) : (
                      <CircleUser className="w-full h-full" />
                    )}

                    {item.name}
                  </div>
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedOption?.id === item.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AutoComplete;
