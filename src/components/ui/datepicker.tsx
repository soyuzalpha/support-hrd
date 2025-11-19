"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface DateTimePickerProps {
  date: Date | string | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  includeTime?: boolean;
  timeFormat?: "12" | "24";
  disabled?: boolean;
}

export function DateTimePicker({
  date,
  onChange,
  placeholder = "Pilih tanggal",
  includeTime = false,
  timeFormat = "24",
  disabled = false,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Helper: pastikan kita punya Date instance atau undefined
  const toDate = (d: Date | string | undefined): Date | undefined => {
    if (!d) return undefined;
    if (d instanceof Date) return isNaN(d.getTime()) ? undefined : d;
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  };

  const initialDate = toDate(date);

  const [timeValue, setTimeValue] = React.useState(() => {
    if (initialDate && includeTime) {
      return format(initialDate, "HH:mm");
    }
    return "00:00";
  });

  // Sync waktu kalau prop `date` berubah
  React.useEffect(() => {
    const d = toDate(date);
    if (d && includeTime) {
      setTimeValue(format(d, "HH:mm"));
    }
  }, [date, includeTime]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onChange(undefined);
      return;
    }

    const existing = toDate(date);
    const newDate = new Date(selectedDate);

    if (includeTime) {
      // jika ada existing date -> preserve jam/menit
      if (existing) {
        newDate.setHours(existing.getHours(), existing.getMinutes(), existing.getSeconds(), existing.getMilliseconds());
      } else {
        // kalau belum ada existing date, gunakan timeValue
        const [hours, minutes] = timeValue.split(":").map(Number);
        const validHours = Number.isFinite(hours) && !Number.isNaN(hours) ? hours : 0;
        const validMinutes = Number.isFinite(minutes) && !Number.isNaN(minutes) ? minutes : 0;
        newDate.setHours(validHours, validMinutes, 0, 0);
      }
      // jangan otomatis tutup kalau includeTime: biar user bisa adjust time lalu Apply
      onChange(newDate);
    } else {
      // date only -> set dan tutup popover
      onChange(newDate);
      setOpen(false);
    }
  };

  const handleTimeChange = (time: string) => {
    setTimeValue(time);

    // update langsung jika sudah ada date
    const existing = toDate(date);
    if (existing) {
      const [hours, minutes] = time.split(":").map(Number);
      if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
        const newDate = new Date(existing);
        newDate.setHours(hours, minutes, 0, 0);
        onChange(newDate);
      }
    }
  };

  const handleApply = () => {
    if (includeTime) {
      // kalau belum ada date, buat date baru (sekarang) dan set time dari timeValue
      const base = toDate(date) || new Date();
      const [hours, minutes] = timeValue.split(":").map(Number);
      const newDate = new Date(base);
      if (!Number.isNaN(hours)) newDate.setHours(hours);
      if (!Number.isNaN(minutes)) newDate.setMinutes(minutes);
      onChange(newDate);
    }
    setOpen(false);
  };

  const formatDisplayDate = (d: Date) => {
    if (includeTime) {
      if (timeFormat === "12") {
        return format(d, "dd-MM-yyyy hh:mm a");
      }
      return format(d, "dd-MM-yyyy HH:mm");
    }
    return format(d, "dd-MM-yyyy");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={`justify-start text-left font-normal ${!initialDate ? "text-muted-foreground" : ""}`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {initialDate ? formatDisplayDate(initialDate) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>

      {/* PopoverContent: aku sarankan pakai avoidCollisions supaya otomatis pindah kalau kekurangan ruang */}
      <PopoverContent className="w-auto p-0 z-50" align="start" side="bottom" sideOffset={6} avoidCollisions>
        <div className="p-3">
          <Calendar mode="single" selected={initialDate} onSelect={handleDateSelect} initialFocus />

          {includeTime && (
            <>
              <Separator className="my-3" />
              <div className="space-y-2">
                <Label htmlFor="time-input" className="text-sm font-medium">
                  Waktu
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="time-input"
                    type="time"
                    value={timeValue}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button onClick={handleApply} className="w-full mt-3" size="sm">
                  Terapkan
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Export backward compatible DatePicker
export function DatePicker({
  date,
  onChange,
  placeholder = "Pilih tanggal",
}: {
  date: Date | string | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}) {
  return <DateTimePicker date={date} onChange={onChange} placeholder={placeholder} includeTime={false} />;
}
