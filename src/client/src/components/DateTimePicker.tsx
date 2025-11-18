"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
   value?: string;
   onChange: (dateTime: string) => void;
   placeholder?: string;
   className?: string;
}

export function DateTimePicker({
   value,
   onChange,
   placeholder = "Pick a date and time",
   className,
}: DateTimePickerProps) {
   const parseDateTime = (
      dateTimeString: string
   ): { date: Date; time: string } | null => {
      if (!dateTimeString) return null;
      try {
         const [datePart, timePart] = dateTimeString.split("T");
         if (!datePart || !timePart) return null;

         const [year, month, day] = datePart.split("-").map(Number);
         const [hours, minutes] = timePart.split(":").map(Number);

         const date = new Date(year, month - 1, day, hours || 0, minutes || 0);
         const time = timePart || "00:00";

         return { date, time };
      } catch {
         return null;
      }
   };

   const [date, setDate] = React.useState<Date | undefined>(
      value ? parseDateTime(value)?.date : undefined
   );
   const [time, setTime] = React.useState<string>(
      value ? parseDateTime(value)?.time || "12:00" : "12:00"
   );

   React.useEffect(() => {
      if (value) {
         const parsed = parseDateTime(value);
         if (parsed) {
            setDate(parsed.date);
            setTime(parsed.time);
         }
      } else {
         setDate(undefined);
         setTime("12:00");
      }
   }, [value]);

   const handleDateSelect = (selectedDate: Date | undefined) => {
      setDate(selectedDate);
      if (selectedDate) {
         const dateStr = format(selectedDate, "yyyy-MM-dd");
         onChange(`${dateStr}T${time}`);
      }
   };

   const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = e.target.value;
      setTime(newTime);
      if (date) {
         const dateStr = format(date, "yyyy-MM-dd");
         onChange(`${dateStr}T${newTime}`);
      }
   };

   const displayValue = date
      ? `${format(date, "PPP")} at ${time}`
      : placeholder;

   return (
      <div className={cn("space-y-2", className)}>
         <Popover>
            <PopoverTrigger asChild>
               <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
               >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {displayValue}
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
               <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  autoFocus
                  initialFocus
                  disabled={(date) => {
                     const today = new Date();
                     today.setHours(0, 0, 0, 0);
                     return date < today;
                  }}
               />
            </PopoverContent>
         </Popover>
         {date && (
            <div className="flex items-center gap-2 text-muted-foreground">
               <Clock className="h-4 w-4 flex-shrink-0" />
               <Label
                  htmlFor="time"
                  className="text-sm font-medium text-foreground"
               >
                  Time:
               </Label>
               <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  className="w-full"
               />
            </div>
         )}
      </div>
   );
}
