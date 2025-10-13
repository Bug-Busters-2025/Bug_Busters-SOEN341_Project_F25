import { useRef, useState, useEffect } from "react";
import { ClipboardList, Calendar, Users, User, TrendingUp } from "lucide-react";
import AnalyticsCard from "@/components/dashboard/organizer/AnalyticsCard";
import AnalyticsSection from "@/components/dashboard/organizer/AnalyticsSection";
import EventOverviewCard from "@/components/ui/EventOverviewCard";
import CalendarUi from "@/components/CalendarUi";
import { type Event } from "@/data/events";
import axios from "axios";

export default function OrganizerAnalytics() {
   const calendarRef = useRef<HTMLDivElement | null>(null);
   const [events, setEvents] = useState<Event[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchEvents = async () => {
         try {
            setLoading(true);
            const response = await axios.get(
               "http://localhost:3000/api/v1/events"
            );
            const transformedEvents: Event[] = response.data.map(
               (event: any) => ({
                  id: event.id.toString(),
                  title: event.title,
                  description: event.description,
                  event_date: event.event_date.split(" ")[0],
                  location: event.location,
                  category: event.category,
                  organizer: event.organizer_name || "Unknown",
                  imageUrl:
                     event.image_url ||
                     "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
                  ticket_type: event.ticket_type,
                  ticket_capacity: event.ticket_capacity,
                  remaining_tickets: event.remaining_tickets,
               })
            );
            setEvents(transformedEvents);
         } catch (error) {
            console.error("Error fetching events:", error);
            setEvents([]);
         } finally {
            setLoading(false);
         }
      };

      fetchEvents();
   }, []);

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
               analytic={events.length}
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
                        ) : events.length !== 0 ? (
                           events.map((e) => (
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
         {/* <AnalyticsSection
               title="My Events"
               subtitle="Manage your events"
               sectionId="my-events"
               icon={<ClipboardList/>}>
                  <div className="w-full space-x-4 flex flex-row overflow-auto">
                     {mockEvents.map((event, index) => (
                        <EventCard 
                           key={event.id}
                           event={event}
                           index={index}>
                           <div className="flex flex-row items-center justify-center gap-2">
                              <button className="p-2 border rounded-md hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] font-medium cursor-pointer">
                                 {<Trash/>}
                              </button>
                              <button className="flex p-2 flex-row border rounded-md items-center justify-center gap-2 hover:bg-primary/90  transition-all duration-200 active:scale-[0.98] font-medium cursor-pointer">
                                 {<PenLine/>}
                                 Edit
                              </button>
                           </div>
                        </EventCard>
                     ))}
                  </div>
         </AnalyticsSection> */}
         <AnalyticsSection
            title="My Subscribers"
            subtitle="View your subscriber list"
            sectionId="my-subscibers"
            icon={<User className="h-6 w-6" />}
         >
            <div className="rounded-lg border border-border/50 p-8 bg-card/50 backdrop-blur-sm text-center">
               <p className="text-muted-foreground">
                  Subscriber management coming soon...
               </p>
            </div>
         </AnalyticsSection>
      </div>
   );
}
