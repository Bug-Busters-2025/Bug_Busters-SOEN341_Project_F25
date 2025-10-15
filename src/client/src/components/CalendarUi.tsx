import {
   memo,
   forwardRef,
   useState,
   useEffect,
   useMemo,
   useCallback,
   type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Event } from "@/data/events";
import {
   monthsOfYear,
   isToday,
   isSameDay,
   getDaysInMonth,
   toYmd,
   getFirstDayOfMonth,
   weekDaysAbreviated,
} from "@/utils/dateTimeUtils";

interface CalendarCardProps {
   date: Date;
   events: Event[];
   isToday: boolean;
   isInMonth: boolean;
   isSelected: boolean;
   setSelectedDate: (date: Date) => void;
}

const CalendarDayCard = memo(
   ({
      date,
      events,
      isToday,
      isInMonth,
      isSelected,
      setSelectedDate,
   }: CalendarCardProps) => {
      const hasEvents = events.length !== 0;
      return (
         <button
            onClick={() => setSelectedDate(date)}
            className={`aspect-square p-2 rounded-lg border transition-colors relative ${
               isToday ? "border-primary bg-primary/5" : "border-border"
            } ${isSelected ? "bg-accent" : ""} ${
               events.length !== 0
                  ? "hover:bg-accent cursor-pointer"
                  : "hover:bg-accent/50"
            }`}
         >
            <div className="flex flex-col h-full">
               <span
                  className={`text-sm font-medium ${
                     isToday ? "text-primary font-bold" : "text-foreground"
                  }`}
               >
                  {date.getDate()}
               </span>
               {hasEvents && (
                  <div className="flex-1 flex flex-col gap-0.5 mt-1 overflow-hidden">
                     {events.slice(0, 2).map((event) => (
                        <div
                           key={event.id}
                           className="text-[10px] leading-tight px-1 py-0.5 rounded bg-primary/20 text-primary truncate"
                        >
                           {event.title}
                        </div>
                     ))}
                     {events.length > 2 && (
                        <div className="text-[10px] text-muted-foreground">
                           +{events.length - 2} more
                        </div>
                     )}
                  </div>
               )}
            </div>
         </button>
      );
   }
);

interface CalendarProps {
   events: Event[];
}

const CalendarUi = forwardRef<HTMLDivElement, CalendarProps>(
   ({ events }: CalendarProps, ref) => {
      const [date, setDate] = useState<Date>(() => {
         let currDate = new Date();
         return new Date(
            currDate.getFullYear(),
            currDate.getMonth(),
            currDate.getDate()
         );
      });
      const [selectedDate, setSelectedDate] = useState<Date | null>(null);
      const [monthDays, setMonthDays] = useState<CalendarCardProps[]>([]);
      const [cellCount, setCellCount] = useState<number>(35);

      const eventsByDay = useMemo(() => {
         const m = new Map<string, Event[]>();
         for (const ev of events ?? []) {
            const k = toYmd(new Date(ev.event_date));

            if (!m.has(k)) m.set(k, []);
            m.get(k)!.push(ev);
         }
         return m;
      }, [events]);

      const handleDateClick = (increment: number): void => {
         setDate((prev) => {
            const next = new Date(prev);
            next.setMonth(prev.getMonth() + increment);
            return next;
         });
      };

      const handleDateSelection = useCallback((d: Date) => {
         setSelectedDate((prev) => (prev && isSameDay(prev, d) ? null : d));
      }, []);

      useEffect(() => {
         if (selectedDate) {
            console.log("selectedDate now:", selectedDate);
         }
      }, [selectedDate]);

      useEffect(() => {
         const first = getFirstDayOfMonth(date);
         const startWeekday = first.getDay();
         const dim = getDaysInMonth(date);

         const cells = startWeekday + dim <= 35 ? 35 : 42;
         setCellCount(cells);

         const startDate = new Date(first);
         startDate.setDate(1 - startWeekday);

         const days: CalendarCardProps[] = [];
         for (let i = 0; i < cells; i++) {
            const cellDate = new Date(startDate);
            cellDate.setDate(startDate.getDate() + i);

            const inMonth = cellDate.getMonth() === date.getMonth();
            const evts = eventsByDay.get(toYmd(cellDate)) ?? [];

            days.push({
               date: new Date(
                  cellDate.getFullYear(),
                  cellDate.getMonth(),
                  cellDate.getDate()
               ),
               events: evts,
               isToday: isToday(cellDate),
               isInMonth: inMonth,
               isSelected: selectedDate
                  ? isSameDay(cellDate, selectedDate)
                  : false,
               setSelectedDate: handleDateSelection,
            });
         }
         setMonthDays(days);
      }, [date, eventsByDay, selectedDate, handleDateSelection]);

      const getCalendarDayCard = (
         p: CalendarCardProps,
         i: number
      ): ReactNode => (
         <CalendarDayCard
            key={`${i}-${date.getFullYear()}-${date.getMonth()}`}
            {...p}
         />
      );

      return (
         <div ref={ref} className="flex flex-col p-6">
            <div className="w-full flex flex-row justify-center items-center gap-2">
               <button
                  className="p-2 border rounded-md hover:bg-accent/50 transition-colors"
                  title="decrement month"
                  onClick={() => handleDateClick(-1)}
               >
                  <ChevronLeft />
               </button>
               <div className="flex basis-1/3 justify-center items-center">
                  {`${monthsOfYear[date.getMonth()]} ${date.getFullYear()}`}
               </div>
               <button
                  className="p-2 border rounded-md hover:bg-accent/50 transition-colors"
                  title="increment month"
                  onClick={() => handleDateClick(1)}
               >
                  <ChevronRight />
               </button>
            </div>
            <div className="w-full grid grid-cols-7 pt-2 pb-2">
               {weekDaysAbreviated.map((d) => (
                  <div key={d} className="text-center">
                     {d}
                  </div>
               ))}
            </div>
            <div
               className={`w-full grid grid-cols-7 ${
                  cellCount === 42 ? "grid-rows-6" : "grid-rows-5"
               } gap-1`}
            >
               {monthDays.map((d, i) => getCalendarDayCard(d, i))}
            </div>
         </div>
      );
   }
);

export default memo(CalendarUi);
