import { useRef, useState, useEffect, useMemo } from "react";
import { ClipboardList, Trash, Calendar, Users, TrendingUp, PenLine } from "lucide-react";
import AnalyticsCard from "@/components/dashboard/organizer/AnalyticsCard";
import AnalyticsSection from "@/components/dashboard/organizer/AnalyticsSection";
import EventCard from "@/components/ui/EventCard";
import EventOverviewCard from "@/components/ui/EventOverviewCard";
import CalendarUi from "@/components/CalendarUi";
import { type Event } from "@/data/events";
import { type TicketSummary } from "@/types/tickets";
import { useUserId } from "@/hooks/useUserId";
import axios, { type AxiosResponse } from "axios";


const calculateCurrentMonthAttendees = (events: Event[]): [number, string] => { 
    const now = new Date();
    const currMonth = now.getMonth(); 
    const currYear = now.getFullYear(); 
    const prevMonthDate = new Date(now);

    prevMonthDate.setMonth(now.getMonth() - 1); 
    const prevMonth = prevMonthDate.getMonth(); 
    const prevYear = prevMonthDate.getFullYear(); 

    const isCurrentMonth = (date: Date): boolean => date.getMonth() === currMonth && date.getFullYear() === currYear; 
    const isPreviousMonth = (date: Date): boolean => date.getMonth() === prevMonth && date.getFullYear() === prevYear; 

    const currentMonthAttendees = events 
        .filter(event => isCurrentMonth(new Date(event.event_date)))
        .reduce((acc, curr) => acc + (curr.ticket_capacity - curr.remaining_tickets), 0);
    
    const prevMonthAttendees = events
        .filter(event => isPreviousMonth(new Date(event.event_date)))
        .reduce((acc, curr) => acc + (curr.ticket_capacity - curr.remaining_tickets), 0);
    
    let percentageChange = "N/A"; 
    if (prevMonthAttendees > 0) { 
        const diff = currentMonthAttendees - prevMonthAttendees;
        const percent = (diff / prevMonthAttendees) * 100;
        percentageChange = (percent >= 0 ? '+' : '') + percent.toFixed(1) + '%'; 
    } else if (currentMonthAttendees > 0 && prevMonthAttendees === 0) { 
        percentageChange = "+100%"; 
    } 
    return [currentMonthAttendees, percentageChange]; 
}

const calculateAverageAttendees = (events: Event[]): [number, string] => { 
    const now = new Date(); 
    const currMonth = now.getMonth(); 
    const currYear = now.getFullYear();
    const prevMonthDate = new Date(now); 
    
    prevMonthDate.setMonth(now.getMonth() - 1); 
    const prevMonth = prevMonthDate.getMonth(); 
    const prevYear = prevMonthDate.getFullYear(); 
    
    const isTargetMonth = (date: Date, month: number, year: number): boolean => date.getMonth() === month && date.getFullYear() === year; 
    const getMonthStats = (month: number, year: number) => { 
        const monthEvents = events.filter(event => isTargetMonth(new Date(event.event_date), month, year) ); 
        const totalAttendees = monthEvents.reduce((acc, curr) => acc + (curr.ticket_capacity - curr.remaining_tickets), 0); 
        const eventCount = monthEvents.length; 
        const average = eventCount > 0 ? totalAttendees / eventCount : 0; 
        return { average, eventCount }; 
    }; 

    const currStats = getMonthStats(currMonth, currYear); 
    const prevStats = getMonthStats(prevMonth, prevYear); 
    const currentMonthAverage = parseFloat(currStats.average.toFixed(1)); 
    const prevMonthAverage = prevStats.average; 
    
    let percentageChange = "N/A"; 
    if (prevMonthAverage > 0) { 
        const diff = currentMonthAverage - prevMonthAverage; 
        const percent = (diff / prevMonthAverage) * 100; percentageChange = (percent >= 0 ? '+' : '') + percent.toFixed(1) + '%'; 
    } else if (currentMonthAverage > 0 && prevMonthAverage === 0) { 
        percentageChange = "+100%"; 
    } return [currentMonthAverage, percentageChange]; 
} 

const calculateCurrentMonthEventCount = (events: Event[]): [number, string] => {

    console.log(events.length)
    const now = new Date(); 
    const currMonth = now.getMonth(); 
    const currYear = now.getFullYear(); 
    const prevMonthDate = new Date(now);
    
    prevMonthDate.setMonth(now.getMonth() - 1); 
    const prevMonth = prevMonthDate.getMonth();
    const prevYear = prevMonthDate.getFullYear();

    const isTargetMonth = (date: Date, month: number, year: number): boolean => date.getMonth() === month && date.getFullYear() === year; 
    const currentMonthEventCount = events
        .filter(event => isTargetMonth(new Date(event.event_date), currMonth, currYear) ).length; 
    const previousMonthEventCount = events
        .filter(event => isTargetMonth(new Date(event.event_date), prevMonth, prevYear) ).length; 
    
    console.log(currentMonthEventCount)
    console.log(previousMonthEventCount)

    let percentageChange = "N/A"; 
    if (previousMonthEventCount > 0) { 
        const diff = currentMonthEventCount - previousMonthEventCount; 
        const percent = (diff / previousMonthEventCount) * 100; percentageChange = (percent >= 0 ? '+' : '') + percent.toFixed(1) + '%'; 
    } else if (currentMonthEventCount > 0 && previousMonthEventCount === 0) { 
        percentageChange = "+100%"; 
    }
    return [currentMonthEventCount, percentageChange]; 
}

export default function OrganizerAnalytics() {
   const calendarRef = useRef<HTMLDivElement | null>(null);
   const { userId, loading: userLoading } = useUserId();
   const [myOrgEvents, setMyOrgEvents] = useState<Event[]>([]);
   const [loading, setLoading] = useState(true);
   const sectionRef = useRef<HTMLDivElement | null>(null)
   const [sectionWidth, setSectionWidth] = useState<number>(0);

   const [currentMonthEventCount, setCurrentMonthEventCount] = useState<number>(0);
   const [countChange, setCountChange] = useState<string>("N/A");

   const [currentMonthAverage, setCurrentMonthAverage] = useState<number>(0);
   const [averageChange, setAverageChange] = useState<string>("N/A");

   const [currentMonthAttendees, setCurrentMonthAttendees] = useState<number>(0);
   const [attendeesChange, setAttendeesChange] = useState<string>("N/A");

   const [ticketSummaries, setTicketSummaries] = useState<Record<string, TicketSummary>>({});
   const [summariesLoading, setSummariesLoading] = useState<boolean>(false);

   useEffect(() => {
      const fetchData = async () => {
         if (!userId) return;

         try {
            const [myOrgEvensRes] = await Promise.all([
               axios.get(`http://localhost:3000/api/v1/events/organizer/${userId}`),
            ]);
            setMyOrgEvents(myOrgEvensRes.data);
         } catch (error) {
            console.error("Error fetching data:", error);
         } finally {
            setLoading(false)
         }
      };

      fetchData();
   }, [userId]);

   useEffect(() => {
      const [count, countPct] = calculateCurrentMonthEventCount(myOrgEvents);
      const [avg, avgPct] = calculateAverageAttendees(myOrgEvents);
      const [att, attPct] = calculateCurrentMonthAttendees(myOrgEvents);

      setCurrentMonthEventCount(count);
      setCountChange(countPct);
      setCurrentMonthAverage(avg);
      setAverageChange(avgPct);
      setCurrentMonthAttendees(att);
      setAttendeesChange(attPct);
   }, [myOrgEvents]);

   useEffect(() => {
      const sectionElement = sectionRef.current;
      if (!sectionElement) return;

      const observer = new ResizeObserver(entries => {
         const newWidth = entries[0].contentRect.width;
         if (newWidth !== sectionWidth) {
               setSectionWidth(newWidth);
         }
      });

      observer.observe(sectionElement);
      return () => {
         observer.unobserve(sectionElement);
      };
   }, [sectionWidth]);

   useEffect((): (() => void) => {
      if (!myOrgEvents || myOrgEvents.length === 0) {
         setTicketSummaries({});
         return () => {};
      }

      let cancelled = false;
      const fetchSummaries = async (): Promise<void> => {
         try {
            setSummariesLoading(true);

            const requests: Promise<readonly [string, TicketSummary | undefined]>[] = myOrgEvents.map(
               (ev): Promise<readonly [string, TicketSummary | undefined]> =>
               axios.get<unknown, AxiosResponse<TicketSummary>>(
                  `http://localhost:3000/api/v1/events/${ev.id}/tickets/summary`
               )
               .then((r): readonly [string, TicketSummary] => [ev.id, r.data])
               .catch((): readonly [string, undefined] => [ev.id, undefined])
            );

            const pairs: Array<readonly [string, TicketSummary | undefined]> = await Promise.all(requests);
            if (cancelled) return;

            const dict: Record<string, TicketSummary> = {};
            for (const [id, data] of pairs) {
               if (data) dict[id] = data;
            }
            setTicketSummaries(dict);
         } finally {
            if (!cancelled) setSummariesLoading(false);
         }
      };

      void fetchSummaries();
      return () => {
         cancelled = true;
      };
   }, [myOrgEvents]);

   const revSortedEvents = useMemo(() => {
      return [...myOrgEvents].sort((a, b) => new Date(b.event_date as any).getTime() - new Date(a.event_date as any).getTime());
   }, [myOrgEvents]);
      
   const trendFrom = (s: string): "up" | "down" | "neutral" =>
      s.includes("+") ? "up" : s.includes("-") ? "down" : "neutral";

   return (
      <div
         id="dsh-org-analytics"
         className="h-full w-full flex flex-col p-6 md:p-10 gap-10 bg-gradient-to-br from-background via-muted/20 to-background overflow-auto"
      >
         <div className="flex flex-col justify-left space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-secondary-foreground">
               My Analytics
            </h1>
            <p className="text-muted-foreground text-lg">
               Track performance and insights for your events
            </p>
         </div>

         <div className="flex flex-row justify-center gap-15">
            <AnalyticsCard
               title="Total Events"
               icon={<ClipboardList className="h-5 w-5 text-secondary-foreground"/>}
               analytic={currentMonthEventCount}
               trend={trendFrom(countChange)}
            >
               <span className="text-green-500 font-semibold">{countChange}</span> from last month
            </AnalyticsCard>
            <AnalyticsCard
               title="Avg Attendees/Event"
               icon={<Users className="h-5 w-5 text-secondary-foreground" />}
               analytic={currentMonthAverage}
               trend={trendFrom(averageChange)}
            >
               <span className="text-red-500 font-semibold">{averageChange}</span> from last month
            </AnalyticsCard>
            <AnalyticsCard
               title="Total Attendees"
               icon={<TrendingUp className="h-5 w-5 text-secondary-foreground"/>}
               analytic={currentMonthAttendees}
               trend={trendFrom(attendeesChange)}
            >
               <span className="text-green-500 font-semibold">{attendeesChange}</span> from last month
            </AnalyticsCard>
         </div>
         <AnalyticsSection
            title="Upcoming Events"
            subtitle="Your scheduled events for the next 30 days"
            sectionId="upcoming-events"
            icon={<Calendar className="h-6 w-6" />}
         >
            <div ref={sectionRef} className="flex flex-col lg:flex-row w-full gap-6">
               <div className="w-full lg:w-2/3">
                  <div className="rounded-lg border border-border/50 p-4 bg-card/50 backdrop-blur-sm">
                     {loading ? (
                        <div className="flex items-center justify-center h-96">
                           <p className="text-muted-foreground">
                              Loading events...
                           </p>
                        </div>
                     ) : (
                        <CalendarUi ref={calendarRef} events={myOrgEvents} />
                     )}
                  </div>
               </div>
               <div className="flex-1">
                  <div className="rounded-lg border border-border/50 p-6 bg-card/50 backdrop-blur-sm h-full">
                     <div className="mb-4">
                        <h3 className="text-lg font-semibold text-foreground">
                           Upcoming Events
                        </h3>
                        <p className="text-sm text-muted-foreground">
                           Scroll to see all events
                        </p>
                     </div>
                     <div
                        className="space-y-3 overflow-y-auto pr-2"
                        style={{ maxHeight: "500px" }}
                     >
                        {loading ? (
                           <p className="text-center text-muted-foreground py-8">
                              Loading events...
                           </p>
                        ) : revSortedEvents.length !== 0 ? (
                            revSortedEvents.map((e) => (
                              <EventOverviewCard key={e.id} event={e} />
                           ))
                        ) : (
                           <p className="text-center text-muted-foreground py-8">
                              You have no events in your timeline
                           </p>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </AnalyticsSection>
         <AnalyticsSection
            title="My Events"
            subtitle="Manage your events"
            sectionId="my-events"
            icon={<ClipboardList/>}
        >
        <div 
            className="space-x-4 flex flex-row flex-nowrap overflow-x-auto"
            style={{width: `${sectionWidth}px`}}>
            {revSortedEvents.length !== 0 && revSortedEvents.map((event, index) => {
               const summary = ticketSummaries[event.id];
               const issued = summary ? summary.claimed : (event.ticket_capacity - event.remaining_tickets);
               return (
                  <EventCard 
                     key={event.id}
                     event={event}
                     index={index}
                     className="min-w-[300px] md:min-w-[350px]"
                     showOrganizer={false}>
                     <div className="flex flex-col gap-1 text-sm">
                        <div className="flex justify-between">
                           <span className="opacity-70">Issued</span>
                           <span>{summariesLoading && !summary ? "…" : issued}</span>
                        </div>
                     </div>
                </EventCard>
               )
            })}
            </div>
        </AnalyticsSection>
      </div>
   );
}
