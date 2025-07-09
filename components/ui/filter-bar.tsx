import React from "react";
import { Input } from "./input";
import { Label } from "./label";

export type FilterBarField =
  | {
      type: "input";
      key: string;
      label?: string;
      placeholder?: string;
      value: string;
      onChange: (value: string) => void;
      inputClassName?: string;
      labelClassName?: string;
    }
  | {
      type: "select";
      key: string;
      label?: string;
      placeholder?: string;
      value: string;
      onChange: (value: string) => void;
      options: { label: string; value: string }[];
      selectClassName?: string;
      labelClassName?: string;
    }
  | {
      type: "multiselect";
      key: string;
      label?: string;
      placeholder?: string;
      value: string[];
      onChange: (value: string[]) => void;
      options: { label: string; value: string }[];
      selectClassName?: string;
      labelClassName?: string;
    };

export interface FilterBarProps {
  fields: FilterBarField[];
  className?: string;
  children?: React.ReactNode; // For extra filter controls (e.g. button)
}

/**
 * A reusable filter/search bar that can render multiple fields (input, select, multiselect).
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  fields,
  className = "grid grid-cols-1 sm:grid-cols-2 gap-2",
  children,
}) => {
  return (
    <div className={className}>
      {fields.map((field) => {
        if (field.type === "input") {
          return (
            <div className="flex flex-col space-y-2" key={field.key}>
              {field.label && (
                <Label htmlFor={field.key} className={field.labelClassName}>{field.label}</Label>
              )}
              <Input
                id={field.key}
                placeholder={field.placeholder}
                value={field.value}
                onChange={e => field.onChange(e.target.value)}
                className={field.inputClassName}
              />
            </div>
          );
        }
        if (field.type === "select") {
          return (
            <div className="flex flex-col space-y-2" key={field.key}>
              {field.label && (
                <Label htmlFor={field.key} className={field.labelClassName}>{field.label}</Label>
              )}
              <select
                id={field.key}
                value={field.value}
                onChange={e => field.onChange(e.target.value)}
                className={field.selectClassName || "border rounded px-2 py-1"}
              >
                {field.placeholder && <option value="">{field.placeholder}</option>}
                {field.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          );
        }
        if (field.type === "multiselect") {
          return (
            <div className="flex flex-col space-y-2" key={field.key}>
              {field.label && (
                <Label htmlFor={field.key} className={field.labelClassName}>{field.label}</Label>
              )}
              <select
                id={field.key}
                multiple
                value={field.value}
                onChange={e => {
                  const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                  field.onChange(selected);
                }}
                className={field.selectClassName || "border rounded px-2 py-1"}
              >
                {field.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          );
        }
        return null;
      })}
      {children && <div className="flex items-end">{children}</div>}
    </div>
  );
};
