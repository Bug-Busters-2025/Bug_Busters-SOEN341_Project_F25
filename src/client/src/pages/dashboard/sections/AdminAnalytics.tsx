import { useRef, useState, useEffect, useMemo } from "react";
import {
   ClipboardList,
   Calendar,
   Users,
   TrendingUp,
   Ticket,
} from "lucide-react";
import AnalyticsCard from "@/components/dashboard/organizer/AnalyticsCard";
import AnalyticsSection from "@/components/dashboard/organizer/AnalyticsSection";
import EventOverviewCard from "@/components/ui/EventOverviewCard";
import CalendarUi from "@/components/CalendarUi";
import { type Event } from "@/types/event";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

type Summary = {
   events: number;
   tickets: number;
   participationRate: number;
};

type ParticipationPoint = {
   date: string;
   eventTitle: string;
   issued: number;
   checkedIn: number;
};

export default function AdminAnalytics() {
   const calendarRef = useRef<HTMLDivElement | null>(null);
   const [events, setEvents] = useState<Event[]>([]);
   const [loading, setLoading] = useState(true);
   const [selectedEventId, setSelectedEventId] = useState<string>("all");

   const [summary, setSummary] = useState<Summary | null>(null);
   const [trend, setTrend] = useState<ParticipationPoint[]>([]);
   const [loadingStats, setLoadingStats] = useState(true);

   const { getToken } = useAuth();

   useEffect(() => {
      const fetchEvents = async () => {
         try {
            setLoading(true);
            const token = await getToken();
            const eventsRes = await axios.get(
               "http://localhost:3000/api/v1/events/admin/all",
               {
                  headers: token ? { Authorization: `Bearer ${token}` } : {},
               }
            );

            const transformedEvents: Event[] = eventsRes.data.map(
               (event: any) => ({
                  id: event.id.toString(),
                  title: event.title,
                  description: event.description,
                  event_date: (event.event_date || "").toString().split(" ")[0],
                  location: event.location,
                  category: event.category,
                  organizer: event.organizer_name || "Unknown",
                  imageUrl:
                     event.imageUrl ||
                     "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=630&fit=crop",
                  ticket_type: event.ticket_type,
                  ticket_capacity: event.ticket_capacity,
                  remaining_tickets: event.remaining_tickets,
               })
            );

            setEvents(transformedEvents);
         } catch {
            setEvents([]);
         } finally {
            setLoading(false);
         }
      };

      fetchEvents();
   }, [getToken]);

   useEffect(() => {
      const fetchStats = async () => {
         try {
            setLoadingStats(true);

            const summaryUrl =
               selectedEventId === "all"
                  ? "http://localhost:3000/api/v1/analytics/summary"
                  : `http://localhost:3000/api/v1/analytics/summary?event_id=${selectedEventId}`;

            const trendUrl =
               selectedEventId === "all"
                  ? "http://localhost:3000/api/v1/analytics/participation"
                  : `http://localhost:3000/api/v1/analytics/participation?event_id=${selectedEventId}`;

            const [summaryRes, trendRes] = await Promise.all([
               axios.get(summaryUrl),
               axios.get(trendUrl),
            ]);

            setSummary(summaryRes.data as Summary);
            setTrend(trendRes.data as ParticipationPoint[]);
         } catch {
            setSummary({ events: 0, tickets: 0, participationRate: 0 });
            setTrend([]);
         } finally {
            setLoadingStats(false);
         }
      };

      fetchStats();
   }, [selectedEventId]);

   const totals = useMemo(() => {
      const totalIssued = trend.reduce((a, b) => a + (b.issued || 0), 0);
      const totalCheckedIn = trend.reduce((a, b) => a + (b.checkedIn || 0), 0);
      const eventCount = summary?.events ?? 0;
      const avgPerEvent =
         eventCount > 0 ? Math.round(totalCheckedIn / eventCount) : 0;
      return { totalIssued, totalCheckedIn, avgPerEvent };
   }, [trend, summary]);

   const participationPct = useMemo(
      () => ((summary?.participationRate ?? 0) * 100).toFixed(2),
      [summary]
   );

   return (
      <div
         id="dsh-admin-analytics"
         className="h-full w-full flex flex-col p-6 md:p-10 gap-10 bg-gradient-to-br from-background via-muted/20 to-background overflow-auto"
      >
         <div className="flex flex-col justify-left space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
               <div>
                  <h1 className="text-4xl font-bold tracking-tight text-secondary-foreground">
                     Platform Analytics
                  </h1>
                  <p className="text-muted-foreground text-lg">
                     Track performance and insights across all events
                  </p>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className="text-sm font-medium text-foreground whitespace-nowrap">
                     Filter by event:
                  </label>
                  <Select
                     value={selectedEventId}
                     onValueChange={setSelectedEventId}
                  >
                     <SelectTrigger className="w-full sm:w-[250px]">
                        <SelectValue placeholder="Select an event" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        {events.map((event) => (
                           <SelectItem key={event.id} value={event.id}>
                              {event.title}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnalyticsCard
               title="Total Events"
               icon={
                  <ClipboardList className="h-5 w-5 text-secondary-foreground" />
               }
               analytic={loadingStats ? 0 : summary?.events ?? 0}
               trend="up"
            >
               <span className="text-green-500 font-semibold">+12%</span> from
               last month
            </AnalyticsCard>

            <AnalyticsCard
               title="Avg Attendees/Event"
               icon={<Users className="h-5 w-5 text-secondary-foreground" />}
               analytic={loadingStats ? 0 : totals.avgPerEvent}
               trend="neutral"
            >
               est. based on check-ins
            </AnalyticsCard>

            <AnalyticsCard
               title="Total Attendees (est.)"
               icon={
                  <TrendingUp className="h-5 w-5 text-secondary-foreground" />
               }
               analytic={loadingStats ? 0 : totals.totalCheckedIn}
               trend="up"
            >
               {participationPct}% participation
            </AnalyticsCard>

            <AnalyticsCard
               title="Total Tickets Issued"
               icon={<Ticket className="h-5 w-5 text-secondary-foreground" />}
               analytic={
                  loadingStats ? 0 : summary?.tickets ?? totals.totalIssued
               }
               trend="neutral"
            >
               all statuses
            </AnalyticsCard>
         </div>

         <AnalyticsSection
            title="Participation Trend"
            subtitle="Your daily tickets vs. check-ins by event"
            sectionId="participation-trend"
            icon={<TrendingUp className="h-6 w-6" />}
         >
            <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm overflow-x-auto">
               <table className="w-full text-sm">
                  <thead className="text-muted-foreground">
                     <tr className="border-b border-border/50">
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Event</th>
                        <th className="text-right p-3">Tickets</th>
                        <th className="text-right p-3">Checked-in</th>
                        <th className="text-right p-3">%</th>
                     </tr>
                  </thead>
                  <tbody>
                     {loadingStats && (
                        <tr>
                           <td className="p-3" colSpan={5}>
                              Loading…
                           </td>
                        </tr>
                     )}
                     {!loadingStats && trend.length === 0 && (
                        <tr>
                           <td
                              className="p-3 text-muted-foreground"
                              colSpan={5}
                           >
                              No data yet
                           </td>
                        </tr>
                     )}
                     {!loadingStats &&
                        trend.map((d, i) => {
                           const pct =
                              d.issued > 0
                                 ? Math.round((d.checkedIn / d.issued) * 100)
                                 : 0;
                           return (
                              <tr
                                 key={`${d.date}-${d.eventTitle}-${i}`}
                                 className="border-t border-border/30"
                              >
                                 <td className="p-3">
                                    {new Date(d.date).toLocaleDateString(
                                       undefined,
                                       {
                                          year: "numeric",
                                          month: "short",
                                          day: "2-digit",
                                       }
                                    )}
                                 </td>
                                 <td className="p-3">
                                    <span className="inline-flex items-center gap-2">
                                       <span className="h-2 w-2 rounded-full bg-primary/70" />
                                       {d.eventTitle}
                                    </span>
                                 </td>
                                 <td className="p-3 text-right">{d.issued}</td>
                                 <td className="p-3 text-right">
                                    {d.checkedIn}
                                 </td>
                                 <td className="p-3 text-right">{pct}%</td>
                              </tr>
                           );
                        })}
                  </tbody>
               </table>
            </div>
         </AnalyticsSection>

         <AnalyticsSection
            title="All Events"
            subtitle="All events across the platform"
            sectionId="upcoming-events"
            icon={<Calendar className="h-6 w-6" />}
         >
            <div className="flex flex-col lg:flex-row w-full gap-6">
               <div className="w-full lg:w-2/3">
                  <div className="rounded-lg border border-border/50 p-4 bg-card/50 backdrop-blur-sm">
                     {loading ? (
                        <div className="flex items-center justify-center h-96">
                           <p className="text-muted-foreground">
                              Loading events...
                           </p>
                        </div>
                     ) : (
                        <CalendarUi ref={calendarRef} events={events} />
                     )}
                  </div>
               </div>
               <div className="flex-1">
                  <div className="rounded-lg border border-border/50 p-6 bg-card/50 backdrop-blur-sm h-full">
                     <div className="mb-4">
                        <h3 className="text-lg font-semibold text-foreground">
                           All Events
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
                        ) : events.length !== 0 ? (
                           events.map((e) => (
                              <EventOverviewCard key={e.id} event={e} />
                           ))
                        ) : (
                           <p className="text-center text-muted-foreground py-8">
                              No events found
                           </p>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </AnalyticsSection>
      </div>
   );
}
