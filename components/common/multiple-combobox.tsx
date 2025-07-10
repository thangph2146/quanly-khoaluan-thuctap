"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
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
import { ComboboxOption } from "./combobox"

interface MultipleComboboxProps {
    options: ComboboxOption[];
    value?: (string | number)[];
    onChange: (value: (string | number)[]) => void;
    onInputChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    isLoading?: boolean;
}

export function MultipleCombobox({ 
    options, 
    value = [], 
    onChange, 
    onInputChange, 
    placeholder, 
    disabled, 
    isLoading 
}: MultipleComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (selectedValue: string | number) => {
    const newValues = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue]
    onChange(newValues)
  }

  const selectedOptions = options.filter((option) => value.includes(option.value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-auto"
                disabled={disabled}
                onClick={() => setOpen(!open)}
                type="button"
            >
                <div className="flex gap-1 flex-wrap">
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map(option => (
                            <Badge
                                key={option.value}
                                variant="secondary"
                                className="mr-1"
                            >
                                {option.label}
                            </Badge>
                        ))
                    ) : (
                        <span className="text-muted-foreground">{placeholder ?? "Chọn..."}</span>
                    )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
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
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
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