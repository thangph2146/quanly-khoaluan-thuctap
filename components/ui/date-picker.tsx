"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DatePickerProps {
  value?: string | Date | undefined;
  onChange?: (date: string | undefined) => void;
  placeholder?: string;
  label?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  label = "Date",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  // Accept value as string (yyyy-MM-dd) or Date
  const initialDate = React.useMemo(() => {
    if (!value) return undefined;
    if (typeof value === 'string') {
      // Parse yyyy-MM-dd as local date
      const [y, m, d] = value.split('-').map(Number);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m - 1, d);
      }
      // fallback: try Date parse
      return new Date(value);
    }
    return value;
  }, [value]);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(initialDate);
  const date = value !== undefined ? initialDate : internalDate;

  const handleSelect = (date: Date | undefined) => {
    if (onChange) {
      if (date) {
        // Always emit yyyy-MM-dd (local date, no timezone)
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        onChange(`${yyyy}-${mm}-${dd}`);
      } else {
        onChange(undefined);
      }
    } else {
      setInternalDate(date);
    }
    setOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <Label htmlFor="date-picker" className="px-1">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker"
            className="w-full justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : placeholder}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
