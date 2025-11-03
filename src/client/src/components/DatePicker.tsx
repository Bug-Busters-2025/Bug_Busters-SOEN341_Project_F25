"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
   value?: string;
   onChange: (date: string | undefined) => void;
   placeholder?: string;
   className?: string;
}

export function DatePicker({
   value,
   onChange,
   placeholder = "Pick a date",
   className,
}: DatePickerProps) {
   const parseLocalDate = (dateString: string): Date => {
      const [year, month, day] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day);
   };

   const [date, setDate] = React.useState<Date | undefined>(
      value ? parseLocalDate(value) : undefined
   );

   React.useEffect(() => {
      if (value) {
         setDate(parseLocalDate(value));
      } else {
         setDate(undefined);
      }
   }, [value]);

   const handleDateSelect = (selectedDate: Date | undefined) => {
      setDate(selectedDate);
      onChange(selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined);
   };

   const handleReset = (e: React.MouseEvent<HTMLElement>) => {
      setDate(undefined);
      onChange(undefined);
      e.preventDefault();
   };

   return (
      <Popover>
         <PopoverTrigger asChild>
            <div className={cn("relative", className)}>
               <Button
                  type="button"
                  variant="outline"
                  mode="input"
                  placeholder={!date}
                  className="w-full justify-start text-left font-normal"
               >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>{placeholder}</span>}
               </Button>
               {date && (
                  <Button
                     type="button"
                     variant="dim"
                     size="sm"
                     className="absolute top-1/2 right-1 -translate-y-1/2 h-6 w-6 p-0"
                     onClick={handleReset}
                  >
                     <X className="h-3 w-3" />
                  </Button>
               )}
            </div>
         </PopoverTrigger>
         <PopoverContent className="w-auto p-0" align="start">
            <Calendar
               mode="single"
               selected={date}
               onSelect={handleDateSelect}
               autoFocus
               initialFocus
            />
         </PopoverContent>
      </Popover>
   );
}
