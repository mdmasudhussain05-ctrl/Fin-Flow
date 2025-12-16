"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

// A list of common icons to suggest
const commonIcons = [
  "Wallet", "Home", "Car", "Briefcase", "Film", "ShoppingCart", "Heart", "Book",
  "Utensils", "Coffee", "Gift", "Plane", "Bus", "Train", "Bike", "Building",
  "Banknote", "CreditCard", "PiggyBank", "Receipt", "Tag", "DollarSign", "Euro",
  "Calendar", "Bell", "Settings", "User", "BarChart3", "Scale", "Download",
  "Plus", "Edit", "Trash2", "Save", "X", "Eye", "EyeOff", "TrendingUp", "TrendingDown"
];

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = value ? (LucideIcons as any)[value] : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[180px] justify-between", className)}
        >
          {SelectedIcon ? (
            <SelectedIcon className="mr-2 h-4 w-4" />
          ) : (
            <LucideIcons.ImageIcon className="mr-2 h-4 w-4" />
          )}
          {value || "Select icon..."}
          <LucideIcons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search icon..." />
          <CommandList>
            <CommandEmpty>No icon found.</CommandEmpty>
            <CommandGroup>
              {commonIcons.map((iconName) => {
                const Icon = (LucideIcons as any)[iconName];
                return (
                  <CommandItem
                    key={iconName}
                    value={iconName}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Icon
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === iconName ? "opacity-100" : "opacity-40"
                      )}
                    />
                    {iconName}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}