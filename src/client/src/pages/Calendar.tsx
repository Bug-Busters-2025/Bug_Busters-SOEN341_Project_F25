import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSavedEvents, type Event } from "@/data/events";
import {
   Calendar as CalendarIcon,
   MapPin,
   Clock,
   Users,
   BookmarkCheck,
   ArrowLeft,
   Trash2,
} from "lucide-react";

export default function Calendar() {
   const [savedEvents, setSavedEvents] = useState<Event[]>([]);

   useEffect(() => {
      loadSavedEvents();
   }, []);

   const loadSavedEvents = () => {
      setSavedEvents([...mockSavedEvents]);
   };

   const removeSavedEvent = (eventId: string) => {
      const index = mockSavedEvents.findIndex(event => event.id === eventId);
      if (index > -1) {
         mockSavedEvents.splice(index, 1);
         setSavedEvents([...mockSavedEvents]);
      }
   };

   const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
         weekday: "long",
         year: "numeric",
         month: "long",
         day: "numeric",
      });
   };

   const groupEventsByDate = () => {
      const grouped: { [key: string]: Event[] } = {};
      
      savedEvents.forEach(event => {
         const date = event.date;
         if (!grouped[date]) {
            grouped[date] = [];
         }
         grouped[date].push(event);
      });
      
      return grouped;
   };

   const groupedEvents = groupEventsByDate();

   return (
      <div className="min-h-screen bg-background p-6">
         <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
               <div className="flex-1">
                  <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                     My Event Calendar
                  </h1>
               </div>

               <Card className="mb-8">
               <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-lg">
                           <BookmarkCheck className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                           <p className="text-2xl font-bold text-foreground">
                              {savedEvents.length}
                           </p>
                           <p className="text-sm text-muted-foreground">
                              Saved Events
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                           <CalendarIcon className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                           <p className="text-2xl font-bold text-foreground">
                              {Object.keys(groupedEvents).length}
                           </p>
                           <p className="text-sm text-muted-foreground">
                              Event Days
                           </p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
            </div>


            {/* Calendar Events */}
            {savedEvents.length === 0 ? (
               <Card>
                  <CardContent className="py-16 text-center">
                     <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                     <h3 className="text-xl font-medium text-foreground mb-2">
                        No saved events yet
                     </h3>
                     <button   
                        className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                     >
                        <Link
                  to="/search">
                        Discover Events
                        </Link>
                     </button>
                  </CardContent>
               </Card>
            ) : (
               <div className="space-y-8">
                  {Object.entries(groupedEvents)
                     .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                     .map(([date, events]) => (
                        <div key={date} className="space-y-4">
                           <div className="flex items-center gap-4">
                              <div className="flex-shrink-0">
                                 <Card className="bg-primary text-primary-foreground min-w-[120px] text-center">
                                    <CardContent className="p-4">
                                       <div className="text-2xl font-bold">
                                          {new Date(date).getDate()}
                                       </div>
                                       <div className="text-sm uppercase tracking-wide">
                                          {new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                                       </div>
                                       <div className="text-xs text-primary-foreground/80">
                                          {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                                       </div>
                                    </CardContent>
                                 </Card>
                              </div>
                              <div>
                                 <h3 className="text-xl font-semibold text-foreground">
                                    {formatDate(date)}
                                 </h3>
                                 <p className="text-muted-foreground">
                                    {events.length} event{events.length !== 1 ? 's' : ''} scheduled
                                 </p>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-32">
                              {events.map((event) => (
                                 <Card key={event.id} className="group hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-4">
                                       <div className="flex justify-between items-start mb-3">
                                          <h4 className="text-lg font-semibold text-foreground pr-4">
                                             {event.title}
                                          </h4>
                                          <button
                                             onClick={() => removeSavedEvent(event.id)}
                                             className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-accent opacity-0 group-hover:opacity-100"
                                             title="Remove from calendar"
                                          >
                                             <Trash2 className="h-4 w-4" />
                                          </button>
                                       </div>
                                       
                                       <div className="space-y-2 text-sm text-muted-foreground">
                                          <div className="flex items-center gap-2">
                                             <Clock className="h-4 w-4 flex-shrink-0" />
                                             <span>{event.time}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                             <MapPin className="h-4 w-4 flex-shrink-0" />
                                             <span className="truncate">{event.location}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                             <Users className="h-4 w-4 flex-shrink-0" />
                                             <span>
                                                {event.currentAttendees}/
                                                {event.maxAttendees} attendees
                                             </span>
                                          </div>
                                       </div>

                                       <div className="mt-4 pt-3 border-t border-border/50">
                                          <p className="text-sm font-medium text-foreground">
                                             Organized by:{" "}
                                             <span className="text-primary">
                                                {event.organization}
                                             </span>
                                          </p>
                                       </div>

                                       <button className="w-full mt-4 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium">
                                          View Details
                                       </button>
                                    </CardContent>
                                 </Card>
                              ))}
                           </div>
                        </div>
                     ))}
               </div>
            )}
         </div>
      </div>
   );
}