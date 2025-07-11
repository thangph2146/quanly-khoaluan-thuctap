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
import { Loader2 } from "lucide-react"

export interface GroupedComboboxOption {
    label: string;
    options: ComboboxOption[];
}

type ComboboxOptions = (ComboboxOption | GroupedComboboxOption)[];

interface MultipleComboboxProps {
    options: ComboboxOptions;
    selectedOptions?: ComboboxOption[];
    value?: (string | number)[];
    onChange: (value: (string | number)[]) => void;
    inputValue?: string;
    onInputChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    isLoading?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const isGroupedOption = (option: ComboboxOption | GroupedComboboxOption): option is GroupedComboboxOption => {
    return 'options' in option;
}

export function MultipleCombobox({ 
    options, 
    selectedOptions, 
    value = [], 
    onChange, 
    inputValue, 
    onInputChange, 
    placeholder, 
    disabled, 
    isLoading,
    onOpenChange
}: MultipleComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  const handleSelect = (selectedValue: string | number) => {
    const newValues = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue]
    onChange(newValues)
    // Keep focus in the input after selecting
    inputRef.current?.focus()
  }

  const renderOption = (option: ComboboxOption) => {
    const isSelected = value.includes(option.value)
    return (
      <CommandItem
        key={String(option.value)}
        value={option.label}
        onSelect={() => handleSelect(option.value)}
      >
        <Check
          className={cn(
            "mr-2 h-4 w-4",
            isSelected ? "opacity-100" : "opacity-0",
          )}
        />
        {option.label}
      </CommandItem>
    )
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between min-h-10 h-auto"
        >
          <div className="flex gap-1 flex-wrap">
            {selectedOptions && selectedOptions.length > 0 ? (
              selectedOptions.map(option => (
                <Badge
                  variant="secondary"
                  key={String(option.value)}
                  className="mr-1"
                >
                  {option.label}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground font-normal">
                {placeholder || "Select options"}
              </span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            ref={inputRef}
            value={inputValue}
            onValueChange={onInputChange}
            placeholder={"Search..."}
            disabled={isLoading}
          />
          <CommandList>
            {isLoading ? (
              <div className="p-2 flex justify-center items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                <CommandEmpty>No results found.</CommandEmpty>
                {options.map((option, index) => {
                    if (isGroupedOption(option)) {
                        return (
                            <CommandGroup key={index} heading={option.label}>
                                {option.options.map(renderOption)}
                            </CommandGroup>
                        )
                    }
                    return renderOption(option as ComboboxOption);
                })}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 