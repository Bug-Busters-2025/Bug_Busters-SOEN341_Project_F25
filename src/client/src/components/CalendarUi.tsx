import { memo, useState, useEffect, useMemo, type ReactNode } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
    ChevronLeft,
    ChevronRight,
    Circle
} from "lucide-react";
import type { Event } from "@/data/events";
import { Badge } from "./ui/badge";
import {
    daysOfWeek,
    monthsOfYear,
    isSameDay,
    daysInMonth,
    toYmd
} from "@/utils/dateTime"

interface CalendarCardProps {
    day: number,
    events: Array<Event>,
    isInMonth: boolean,
    isCurrentDate: boolean,
    highlight: boolean
}

const CalendarDayCard = memo(( {day, events, isInMonth, isCurrentDate, highlight} : CalendarCardProps ) => {
    
    return (
        <Card className="w-full h-full">
            <CardHeader className="justify-center items-center">
                {isCurrentDate ? <Circle fill="red"/> : <></>}
                {day}
            </CardHeader>
            <CardContent>
                
            </CardContent>
        </Card>
    )
});

interface CalendarProps {
    events : Array<Event>
}

const displayedCalendarDays : number = 35;

function CalendarUi( {events} : CalendarProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [monthDays, setMonthDays] = useState<CalendarCardProps[]>([]);
    const [cellCount, setCellCount] = useState<number>(35);

    const eventsByDay = useMemo(() => {
        const m = new Map<string, Event[]>();
        for (const ev of events ?? []) {
            const k = toYmd(new Date(ev.date));

            if (!m.has(k)) m.set(k, []);
                m.get(k)!.push(ev);
        }
        return m;
      }, [events]);

    useEffect(() => {
        const first = new Date(date.getFullYear(), date.getMonth(), 1);
        const startWeekday = first.getDay(); // 0..6 (Sun..Sat)
        const dim = daysInMonth(date.getFullYear(), date.getMonth());
    
        const cells = startWeekday + dim <= 35 ? 35 : 42;
        setCellCount(cells);
    
        const startDate = new Date(first);
        startDate.setDate(1 - startWeekday);
    
        const today = new Date();
        const days: CalendarCardProps[] = [];
        for (let i = 0; i < cells; i++) {
            const cellDate = new Date(startDate);
            cellDate.setDate(startDate.getDate() + i);
        
            const inMonth = cellDate.getMonth() === date.getMonth();
            const evts = eventsByDay.get(toYmd(cellDate)) ?? [];
        
            days.push({
                day: cellDate.getDate(),
                events: evts,
                isInMonth: inMonth,
                isCurrentDate: isSameDay(cellDate, today),
                highlight: false,
            });
        }
        setMonthDays(days);
      }, [date, eventsByDay]);

    const handleDateClick = (increment: number): void => {
        setDate(prev => {
            const next = new Date(prev);
            next.setMonth(prev.getMonth() + increment);
            return next;
        });
    };

    const getCalendarDayCard = (p: CalendarCardProps, i: number): ReactNode => (
        <CalendarDayCard
          key={`${i}-${date.getFullYear()}-${date.getMonth()}`}
          {...p}
        />
    );

    return (
        <div className="flex flex-col p-6">
            <div className="w-full flex flex-row justify-center items-center gap-2">
                <button
                    className="p-2 border rounded-md hover:bg-accent/50 transition-colors"
                    title="decrement month"
                    onClick={() => handleDateClick(-1)}>
                    <ChevronLeft />
                </button>
                <div className="flex basis-1/3 justify-center items-center">
                    {`${monthsOfYear[date.getMonth()]} ${date.getFullYear()}`}
                </div>
                <button
                    className="p-2 border rounded-md hover:bg-accent/50 transition-colors"
                    title="increment month"
                    onClick={() => handleDateClick(1)}>
                    <ChevronRight />
                </button>
            </div>
            <div className="w-full grid grid-cols-7 pt-2 pb-2">
                {daysOfWeek.map(d => (
                    <div key={d} className="text-center">
                        {d}
                    </div>
                ))}
            </div>
            <div className={`w-full grid grid-cols-7 ${cellCount === 42 ? "grid-rows-6" : "grid-rows-5"} gap-1`}>
                {monthDays.map((d, i) => getCalendarDayCard(d, i))}
            </div>
        </div>
    );
}

export default CalendarUi;