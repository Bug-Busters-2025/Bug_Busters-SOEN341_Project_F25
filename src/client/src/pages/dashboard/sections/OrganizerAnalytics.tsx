import { useRef, useState, useEffect, useMemo } from "react";
import { ClipboardList, User, Calendar, Users, TrendingUp } from "lucide-react";
import AnalyticsCard from "@/components/dashboard/organizer/AnalyticsCard";
import AnalyticsSection from "@/components/dashboard/organizer/AnalyticsSection";
import EventCard from "@/components/ui/EventCard";
import EventOverviewCard from "@/components/ui/EventOverviewCard";
import CalendarUi from "@/components/CalendarUi";
import { type Event } from "@/data/events";
import { useUserId } from "@/hooks/useUserId";
import axios from "axios";

export default function OrganizerAnalytics() {
    const calendarRef = useRef<HTMLDivElement | null>(null);
    const { userId, loading: userLoading } = useUserId();
    const [myOrgEvents, setMyOrgEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef<HTMLDivElement | null>(null)
    const [sectionWidth, setSectionWidth] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;

            try {
                const [myOrgEvensRes] = await Promise.all([
                // axios.get(`http://localhost:3000/api/v1/events/${userId}`),
                axios.get(`http://localhost:3000/api/v1/events/organizer/${userId}`),
                ]);
                
                // setMyEvents(myEventsRes.data);
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


    const revSortedEvents = useMemo(() => {
        return [...myOrgEvents].sort((a, b) => new Date(a.event_date as any).getTime() - new Date(b.event_date as any).getTime());
    }, [myOrgEvents]);
        

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

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnalyticsCard
               title="Total Events"
               icon={
                  <ClipboardList className="h-5 w-5 text-secondary-foreground" />
               }
               analytic={revSortedEvents.length}
               trend="up"
            >
               <span className="text-green-500 font-semibold">+12%</span> from
               last month
            </AnalyticsCard>
            <AnalyticsCard
               title="Avg Attendees/Event"
               icon={<Users className="h-5 w-5 text-secondary-foreground" />}
               analytic={150}
               trend="down"
            >
               <span className="text-red-500 font-semibold">-1%</span> from last
               month
            </AnalyticsCard>
            <AnalyticsCard
               title="Total Attendees"
               icon={
                  <TrendingUp className="h-5 w-5 text-secondary-foreground" />
               }
               analytic={7950}
               trend="up"
            >
               <span className="text-green-500 font-semibold">+21%</span> from
               last month
            </AnalyticsCard>
            <AnalyticsCard
               title="Total Subscribers"
               icon={<User className="h-5 w-5 text-secondary-foreground" />}
               analytic={1000}
               trend="up"
            >
               <span className="text-green-500 font-semibold">+2%</span> from
               last month
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
        <div className="space-x-4 flex flex-row flex-nowrap overflow-x-auto"
             style={{width: `${sectionWidth}px`}}>
            {revSortedEvents.length !== 0 && revSortedEvents.map((event, index) => (
                <EventCard 
                    key={event.id}
                    event={event}
                    index={index}
                    className="min-w-[300px] md:min-w-[350px]"
                    showOrganizer={false}>
                    <div className={"flex flex-row items-center justify-center gap-2"}>
                        <span>{``}</span>
                    </div>
                </EventCard>
                ))}
            </div>
        </AnalyticsSection>
      </div>
   );
}
