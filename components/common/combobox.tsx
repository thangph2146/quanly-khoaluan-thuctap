"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
    value: string | number;
    label: string;
}

interface ComboboxProps {
    options: ComboboxOption[];
    value?: string | number | null;
    onChange: (value: string | number | null) => void;
    onInputChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    isLoading?: boolean;
    allowClear?: boolean;
}

export function Combobox({ options, value, onChange, onInputChange, placeholder, disabled, isLoading, allowClear }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const selectedOption = options.find((option) => option.value === value)

  const handleClear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              disabled={disabled}
              type="button"
            >
              {selectedOption?.label ?? placeholder ?? "Chọn..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
            {allowClear && value && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={handleClear}
                    type="button"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command filter={() => 1}>
          <CommandInput 
            placeholder={placeholder ?? "Tìm kiếm..."} 
            onValueChange={onInputChange}
            disabled={disabled}
          />
          <CommandList>
            {isLoading && <div className="p-2 text-center text-sm">Đang tải...</div>}
            {!isLoading && <CommandEmpty>Không tìm thấy.</CommandEmpty>}
            <CommandGroup>
              {!isLoading && options.map((option) => (
                <CommandItem
                  key={String(option.value)}
                  value={String(option.value)}
                  onSelect={(currentValue: string) => {
                    const selectedOpt = options.find(opt => String(opt.value) === currentValue);
                    if (selectedOpt) {
                      onChange(selectedOpt.value);
                    }
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 