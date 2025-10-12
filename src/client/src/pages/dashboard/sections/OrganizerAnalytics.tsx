import { useRef, useState, useEffect } from "react";
import 
{
   ClipboardList,
   Calendar, 
   Users,
   User, 
   TrendingUp,
   Trash,
   PenLine
} 
from "../../../../node_modules/lucide-react";
import AnalyticsCard from "@/components/dashboard/organizer/AnalyticsCard";
import AnalyticsSection from "@/components/dashboard/organizer/AnalyticsSection";
import EventOverviewCard from "@/components/ui/EventOverviewCard";
import CalendarUi from "@/components/CalendarUi";
import { type Event } from "@/data/events";
import EventCard from "@/components/ui/EventCard";

export const mockEvents: Event[] = [
   {
      id: "1",
      title: "Tech Conference 2025",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      event_date: "2025-10-15",
      time: "09:00",
      location: "Convention Center, Montreal",
      category: "Technology",
      organizer: "Tech Society",
      imageUrl:
         "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
      ticket_type: "free",
      ticket_capacity: 500,
      remaining_tickets: 234,
   },
   {
      id: "2",
      title: "Music Festival",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      event_date: "2025-10-20",
      time: "18:00",
      location: "Parc Jean-Drapeau, Montreal",
      category: "Music",
      organizer: "Music Club",
      imageUrl:
         "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop",
      ticket_type: "free",
      ticket_capacity: 2000,
      remaining_tickets: 1500,
   },
   {
      id: "3",
      title: "Study Group - Calculus",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      event_date: "2025-10-12",
      time: "14:00",
      location: "Library Room 301",
      category: "Academic",
      organizer: "Math Society",
      imageUrl:
         "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop",
      ticket_type: "paid",
      ticket_capacity: 20,
      remaining_tickets: 12,
   },
   {
      id: "4",
      title: "Basketball Tournament",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      event_date: "2025-10-18",
      time: "10:00",
      location: "Gymnasium",
      category: "Sports",
      organizer: "Athletics Department",
      imageUrl:
         "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=200&fit=crop",
      ticket_type: "paid",
      ticket_capacity: 64,
      remaining_tickets: 45,
   },
   {
      id: "5",
      title: "Art Exhibition Opening",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      event_date: "2025-10-14",
      time: "17:00",
      location: "Art Gallery",
      category: "Arts",
      organizer: "Fine Arts Club",
      imageUrl:
         "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=200&fit=crop",
      ticket_type: "free",
      ticket_capacity: 100,
      remaining_tickets: 67,
   },
   {
      id: "6",
      title: "Career Fair",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      event_date: "2025-10-25",
      time: "10:00",
      location: "Student Center",
      category: "Career",
      organizer: "Career Services",
      imageUrl:
         "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=200&fit=crop",
      ticket_type: "free",
      ticket_capacity: 300,
      remaining_tickets: 180,
   },
   {
      id: "7",
      title: "Environmental Workshop",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      event_date: "2025-10-16",
      time: "13:00",
      location: "Environmental Science Building",
      category: "Environment",
      organizer: "Green Club",
      imageUrl:
         "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop",
      ticket_type: "paid",
      ticket_capacity: 50,
      remaining_tickets: 23,
   },
   {
      id: "8",
      title: "Dance Workshop",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      event_date: "2025-10-22",
      time: "19:00",
      location: "Dance Studio",
      category: "Arts",
      organizer: "Dance Society",
      imageUrl:
         "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=200&fit=crop",
      ticket_type: "free",
      ticket_capacity: 30,
      remaining_tickets: 18,
   },
];

export default function OrganizerAnalytics () {
   const calendarRef = useRef<HTMLDivElement | null>(null);
   const [calendarHeight, setCalendarHeight] = useState(0);

  // Measure once on mount
   useEffect(() => {
      if (calendarRef.current) {
         setCalendarHeight(calendarRef.current.clientHeight);
      }
   }, []);

  // Keep height in sync with resizes
   useEffect(() => {
      if (!calendarRef.current) return;
      const ro = new ResizeObserver(([entry]) => {
         setCalendarHeight(entry.contentRect.height);
      });
      ro.observe(calendarRef.current);
      return () => ro.disconnect();
   }, []);

   return (
      <div 
         id="dsh-org-analytics" 
         className="h-full w-full flex flex-col p-6 md:p-10 gap-10">
         <div className="flex flex-col justify-left">
               <h1 className="text-3xl font-bold tracking-tigh">My Analytics</h1>
               <p className="text-muted-foreground">Track performance and insights for your events</p>
         </div>
         <div className="w-full flex flex-row justify-around pd-6">
               <AnalyticsCard 
                  title="Total Events"
                  icon={<ClipboardList/>}
                  analytic="53">
                  <span className="text-green-500">+12%</span> from last month
               </AnalyticsCard>
               <AnalyticsCard 
                  title="Avg Attendees/Event"
                  icon={<Users/>}
                  analytic="150">
                  <span className="text-red-500">-1%</span> from last month
               </AnalyticsCard>
               <AnalyticsCard 
                  title="Total Attendees"
                  icon={<TrendingUp/>}
                  analytic="7950">
                  <span className="text-green-500">+21%</span> from last month
               </AnalyticsCard>
               <AnalyticsCard 
                  title="Total Subscribers"
                  icon={<User/>}
                  analytic="$1000">
                  <span className="text-green-500">+2%</span> from last month
               </AnalyticsCard>
         </div>
         <hr className="border-t-3 border"/>
         <AnalyticsSection
               title="Upcoming Events"
               subtitle="Your scheduled events for the next 30 days"
               sectionId="upcoming-events"
               icon={<Calendar/>}>
               <div className="flex flex-row w-full">
                  <div className="w-2/3">
                     <CalendarUi 
                        ref={calendarRef} 
                        events={mockEvents}/>
                  </div>
                  <div 
                     className="space-y-4 flex-1 border rounded-md p-6 overflow-auto"
                     style={{ maxHeight: calendarHeight ?? undefined }}>
                     {mockEvents.length !== 0 ? mockEvents.map((e) => (
                           <EventOverviewCard 
                              key={e.id}
                              event={e}/>
                     )) : 
                     (
                        <p>you have no events in your timeline</p>
                     )}
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
               icon={<User/>}>
                  <div className="">
                     
                  </div>
         </AnalyticsSection>
      </div>
   )
}