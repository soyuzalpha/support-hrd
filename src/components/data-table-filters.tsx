"use client";

import * as React from "react";
import type { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconFilter, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export type FilterType = "text" | "select" | "number" | "date" | "boolean";

export interface FilterConfig {
  id: string;
  label: string;
  type: FilterType;
  options?: { label: string; value: string }[]; // For select type
  placeholder?: string;
}

interface DataTableFiltersProps {
  columns: Column<any>[];
  filterConfigs: FilterConfig[];
  onFilterChange?: (filters: Record<string, any>) => void;
}

function FilterInput({
  config,
  value,
  onChange,
}: {
  config: FilterConfig;
  value?: any;
  onChange: (value: any) => void;
}) {
  switch (config.type) {
    case "text":
      return (
        <Input
          placeholder={config.placeholder || "Enter text..."}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
      );

    case "number":
      return (
        <Input
          type="number"
          placeholder={config.placeholder || "Enter number..."}
          value={value || ""}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
          className="w-full"
        />
      );

    case "date":
      return <Input type="date" value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full" />;

    case "select":
      return (
        <Select value={value || ""} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={config.placeholder || "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {config.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "boolean":
      return (
        <Select value={value || ""} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      );

    default:
      return null;
  }
}

export function DataTableFilters({ columns, filterConfigs, onFilterChange }: DataTableFiltersProps) {
  const [filters, setFilters] = React.useState<Record<string, any>>({});
  const [activeFiltersCount, setActiveFiltersCount] = React.useState(0);

  // Update active filters count
  React.useEffect(() => {
    const count = Object.values(filters).filter((v) => v !== "" && v !== null && v !== undefined).length;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleFilterChange = (filterId: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }));
    onFilterChange?.({
      ...filters,
      [filterId]: value,
    });
  };

  const handleResetFilters = () => {
    setFilters({});
    onFilterChange?.({});
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("relative", activeFiltersCount > 0 && "border-blue-500 bg-blue-50 dark:bg-blue-950")}
        >
          <IconFilter className="h-4 w-4" />
          <span className="hidden lg:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <span className={cn("ml-2 px-2 py-0.5 text-xs font-semibold rounded-full", "bg-blue-500 ")}>
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-xs">Filters</h4>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-6 px-2 text-xs">
                <IconX className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {filterConfigs.map((config) => (
              <div key={config.id} className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{config.label}</label>
                <FilterInput
                  config={config}
                  value={filters[config.id]}
                  onChange={(value) => handleFilterChange(config.id, value)}
                />
              </div>
            ))}
          </div>

          {filterConfigs.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No filters available</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
