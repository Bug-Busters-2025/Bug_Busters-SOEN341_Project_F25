import {
   useState, 
   useEffect, 
   useMemo,
} from "react";
import { 
   ClipboardList, 
   Users, 
   TrendingUp 
} from "lucide-react";
import { useUserId } from "@/hooks/useUserId";

import AnalyticsCard from "@/components/dashboard/organizer/AnalyticsCard";
import AnalyticsSection from "@/components/dashboard/organizer/AnalyticsSection";
import EventCard from "@/components/ui/EventCard";

import { type Event } from "@/types/event";
import type { UserSummary } from "@/types/subscription";
import { getOrganizerEvents } from "@/utils/asyncOrganizerAnalytics";
import { getOrganizerFollowers } from "@/utils/asyncOrganizerSubscription";
import { 
   calculateOrganizerAnalyticsStats,
   percentChange,
   type OrganizerAnalyticsStats 
} from "@/utils/organizerStatsCalculator";


export default function OrganizerAnalytics() {
   const { userId, loading: userLoading } = useUserId();
   const [loading, setLoading] = useState(true);

   const [myOrgEvents, setMyOrgEvents] = useState<Event[]>([]);
   const [followers, setFollowers] = useState<UserSummary[]>([]);

   useEffect(() => {
      if (userLoading || !userId) return;
  
      let cancelled = false;
  
      const loadData = async () => {
         try {
            setLoading(true);
            const [events, followersRes] = await Promise.all([
               getOrganizerEvents(userId),
               getOrganizerFollowers(userId),
            ]);

            if (cancelled) return;
            setMyOrgEvents(events);
            setFollowers(followersRes.followers);
         } catch (err) {
            console.error("Error loading organizer analytics data:", err);
            if (!cancelled) {
               setMyOrgEvents([]);
               setFollowers([]);
            }
         } finally {
            if (!cancelled) {
               setLoading(false);
            }
         }
      };
  
      loadData();
      return () => {
        cancelled = true;
      };
   }, [userId, userLoading]);

   const analyticsStats: OrganizerAnalyticsStats | null = useMemo(() => {
      if (myOrgEvents.length === 0 && followers.length === 0) {
        return null;
      }
      return calculateOrganizerAnalyticsStats(myOrgEvents, followers);
   }, [myOrgEvents, followers]);

   const eventsChange = analyticsStats ? percentChange(
      analyticsStats.eventsLastMonth,
      analyticsStats.eventsThisMonth
   ) : "N/A";

   const ticketsChange = analyticsStats ? percentChange(
      analyticsStats.ticketsIssuedLastMonth,
      analyticsStats.ticketsIssuedThisMonth
   ) : "N/A";

   const participationChange = analyticsStats ? percentChange(
      analyticsStats.participationLastMonth,
      analyticsStats.participationThisMonth
   ) : "N/A";

   const totalSubscribersChange = analyticsStats ? percentChange(
         analyticsStats.prevMonthTotalSubscribers,
         analyticsStats.totalSubscribers
   ) : "N/A";

   const newSubscribersChange = analyticsStats ? percentChange(
      analyticsStats.lastMonthNewSubscribers,
      analyticsStats.currentMonthNewSubscribers
   ) : "N/A";
        
   const trendFrom = (s: string): "up" | "down" | "neutral" =>
      s.includes("+") ? "up" : s.includes("-") ? "down" : "neutral";

   const revSortedEvents = useMemo(() =>
      [...myOrgEvents].sort((a, b) =>
         new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      ),[myOrgEvents]
   );

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
               Track performance and insights for account
            </p>
         </div>
         {loading ? (
            <div className="flex items-center justify-center h-96">
               <p className="text-muted-foreground">
                  Loading events...
               </p>
            </div>
         ) : (
         <>
            <AnalyticsSection
               title="Events Overview"
               subtitle="High-level view of your events activity"
               sectionId="events-overview"
               icon={<ClipboardList className="h-6 w-6" />}
            >
               <div className="w-full px-4 md:px-8">
                  <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-6">
                     <AnalyticsCard
                        title="Total Events"
                        analytic={analyticsStats?.totalEvents ?? 0}
                        trend={trendFrom(eventsChange)}
                     >
                        {eventsChange} vs last month
                     </AnalyticsCard>
                     <AnalyticsCard
                        title="Events This Month"
                        analytic={analyticsStats?.eventsThisMonth ?? 0}
                        trend="neutral"
                     >
                        This month
                     </AnalyticsCard>
                     <AnalyticsCard
                        title="Events Last Month"
                        analytic={analyticsStats?.eventsLastMonth ?? 0}
                     >
                        Last month
                     </AnalyticsCard>
                  </div>
               </div>
            </AnalyticsSection>
            <AnalyticsSection
               title="Subscribers"
               subtitle="Track your audience growth"
               sectionId="subscriptions"
               icon={<Users className="h-6 w-6" />}
            >
               <div className="w-full px-4 md:px-8">
                  <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-6">
                     <AnalyticsCard
                        title="Total Subscribers"
                        analytic={analyticsStats?.totalSubscribers ?? 0}
                        trend={trendFrom(totalSubscribersChange)}
                     >
                        {totalSubscribersChange} vs end of last month
                     </AnalyticsCard>
                     <AnalyticsCard
                        title="New Subscribers This Month"
                        analytic={analyticsStats?.currentMonthNewSubscribers ?? 0}
                        trend={trendFrom(newSubscribersChange)}
                     >
                        {newSubscribersChange} vs last month
                     </AnalyticsCard>
                     <AnalyticsCard
                        title="New Subscribers Last Month"
                        analytic={analyticsStats?.lastMonthNewSubscribers ?? 0}
                     >
                        Joined last month
                     </AnalyticsCard>
                  </div>
               </div>
            </AnalyticsSection>
            <AnalyticsSection
               title="Tickets"
               subtitle="Tickets issued across your events"
               sectionId="tickets"
               icon={<ClipboardList className="h-6 w-6" />}
            >
               <div className="w-full px-4 md:px-8">
                  <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-6">
                     <AnalyticsCard
                        title="Total Tickets Issued"
                        analytic={analyticsStats?.totalTicketsIssued ?? 0}
                        trend={trendFrom(ticketsChange)}
                     >
                        {ticketsChange} vs last month
                     </AnalyticsCard>
                     <AnalyticsCard
                        title="Tickets Issued This Month"
                        analytic={analyticsStats?.ticketsIssuedThisMonth ?? 0}
                        trend="neutral"
                     >
                        This month
                     </AnalyticsCard>
                     <AnalyticsCard
                        title="Tickets Issued Last Month"
                        analytic={analyticsStats?.ticketsIssuedLastMonth ?? 0}
                     >
                        Last month
                     </AnalyticsCard>
                  </div>
               </div>
            </AnalyticsSection>
            <AnalyticsSection
               title="Participation"
               subtitle="Actual attendees across your events"
               sectionId="participation"
               icon={<TrendingUp className="h-6 w-6" />}
            >
               <div className="w-full px-4 md:px-8">
                  <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-6">
                     <AnalyticsCard
                        title="Total Participation"
                        analytic={analyticsStats?.totalParticipation ?? 0}
                        trend={trendFrom(participationChange)}
                     >
                        {participationChange} vs last month
                     </AnalyticsCard>
                     <AnalyticsCard
                        title="Participation This Month"
                        analytic={analyticsStats?.participationThisMonth ?? 0}
                        trend="neutral"
                     >
                        This month
                     </AnalyticsCard>
                     <AnalyticsCard
                        title="Participation Last Month"
                        analytic={analyticsStats?.participationLastMonth ?? 0}
                     >
                        Last month
                     </AnalyticsCard>
                  </div>
               </div>
            </AnalyticsSection>
            <AnalyticsSection
               title="My Events"
               subtitle="Manage your events"
               sectionId="my-events"
               icon={<ClipboardList />}
            >
               <div className="w-full px-4 md:px-8">
                  <div className="mx-auto max-w-5xl">
                     <div className="space-x-4 flex flex-row flex-nowrap overflow-x-auto pb-2">
                        {revSortedEvents.length !== 0 &&
                           revSortedEvents.map((event, index) => {
                              const ticketsIssued = event.ticket_capacity - event.remaining_tickets;
                              const attendanceRate = event.ticket_capacity > 0
                                 ? (ticketsIssued / event.ticket_capacity) * 100
                                 : 0;

                              return (
                                 <EventCard
                                    key={event.id}
                                    event={event}
                                    index={index}
                                    className="min-w-[300px] md:min-w-[350px] shrink-0"
                                    showOrganizer={false}
                                 >
                                    <div className="flex flex-col gap-1 text-xs md:text-sm text-muted-foreground w-full">
                                       <div className="flex items-center justify-between">
                                          <span>Tickets issued</span>
                                          <span className="font-medium">
                                             {ticketsIssued} / {event.ticket_capacity}
                                          </span>
                                       </div>
                                       <div className="flex items-center justify-between">
                                          <span>Remaining</span>
                                          <span className="font-medium">
                                             {event.remaining_tickets}
                                          </span>
                                       </div>
                                       <div className="flex items-center justify-between">
                                          <span>Attendance rate</span>
                                          <span className="font-medium">
                                             {attendanceRate.toFixed(1)}%
                                          </span>
                                       </div>
                                    </div>
                                 </EventCard>
                              );
                           })}
                     </div>
                  </div>
               </div>
            </AnalyticsSection>
         </>
         )}
      </div>
   );
}