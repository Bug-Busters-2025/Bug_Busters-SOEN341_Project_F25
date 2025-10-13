import { useState, useEffect } from "react";
import {
   Plus,
   ClipboardList,
   Pencil,
   FileSpreadsheet,
   Trash2,
   MapPin,
   Clock,
} from "lucide-react";
import AnalyticsSection from "@/components/dashboard/organizer/AnalyticsSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EventModal from "@/components/dashboard/organizer/EventModal";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

interface eventData {
   id: number;
   title: string;
   description: string;
   category: string;
   imageUrl: string;
   event_date: string;
   location: string;
   ticket_capacity: number;
   remaining_tickets: number;
   ticket_type: string;
}

export default function Events() {
   const [open, setOpen] = useState(false);
   const [events, setEvents] = useState<eventData[]>([]);
   const [editEvent, setEditEvent] = useState<eventData | null>(null);
   const { getToken } = useAuth();
   const [organizerId, setOrganizerId] = useState<number | null>(null);

   const fetchOrganizerId = async () => {
      try {
         const token = await getToken();
         const res = await axios.get("http://localhost:3000/api/v1/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
         });
         setOrganizerId(res.data.id);
      } catch (error) {
         console.error("❌ Error fetching organizer ID:", error);
      }
   };

   const fetchEvents = async (organizerId: number) => {
      try {
         const response = await axios.get(
            `http://localhost:3000/api/v1/events/organizer/${organizerId}`
         );
         const now = new Date();
         const upcomingEvents = response.data.filter((event: any) => {
            const eventDate = new Date(event.event_date.replace(" ", "T"));
            return eventDate >= now;
         });

         setEvents(upcomingEvents);
      } catch (error) {
         console.log("error fetch events", error);
      }
   };
   useEffect(() => {
      fetchOrganizerId();
   }, []);
   useEffect(() => {
      if (organizerId) {
         fetchEvents(organizerId);
      }
   }, [organizerId]);

   const handleEventCreated = async () => {
      if (organizerId) await fetchEvents(organizerId);
      setOpen(false);
   };
   const handleEventUpdated = async () => {
      if (organizerId) await fetchEvents(organizerId);
      setEditEvent(null);
      setOpen(false);
   };
   const handleEdit = (event: eventData) => {
      setEditEvent(event);
      setOpen(true);
   };
   const handleDelete = (eventId: number) => {
      if (confirm("Are you sure you want to delete this event?")) {
         axios
            .delete(`http://localhost:3000/api/v1/events/${eventId}`)
            .then(() => {
               setEvents(events.filter((event) => event.id !== eventId));
            })
            .catch((error) => {
               console.log("error deleting event", error);
            });
      }
   };
   const handleExport = async (eventId: number) => {
      try {
         const token = await getToken();

         const res = await axios.get(
            `http://localhost:3000/api/v1/events/${eventId}/export`,
            {
               responseType: "blob",
               headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
         );

         const url = window.URL.createObjectURL(new Blob([res.data]));
         const a = document.createElement("a");
         a.href = url;
         a.download = `attendees_event_${eventId}.csv`;
         document.body.appendChild(a);
         a.click();
         a.remove();
         window.URL.revokeObjectURL(url);

         console.log(`Exported attendees for event ${eventId}`);
      } catch (err) {
         console.error("Error exporting CSV:", err);
         alert("You are not authorized to export this event’s attendee list.");
      }
   };

   return (
      <div className="h-full w-full flex flex-col p-6 md:p-10 gap-6 bg-gradient-to-br from-background via-muted/20 to-background overflow-auto">
         <AnalyticsSection
            title={
               <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                     <span>My Events ({events.length})</span>
                  </div>
               </div>
            }
            subtitle={
               <div className="flex items-center gap-2">
                  <Button
                     size="lg"
                     className="gap-2 shadow-md hover:shadow-lg transition-all"
                     onClick={() => setOpen(true)}
                  >
                     <Plus className="h-4 w-4" />
                     Create Event
                  </Button>
               </div>
            }
            sectionId="my-events"
            icon={<ClipboardList className="h-6 w-6" />}
         >
            <div className="space-y-6">
               <EventModal
                  open={open}
                  onClose={() => {
                     setOpen(false);
                     setEditEvent(null);
                  }}
                  onEventCreated={handleEventCreated}
                  onEventUpdated={handleEventUpdated}
                  eventData={editEvent}
                  isEditMode={!!editEvent}
               />
               {events.length === 0 ? (
                  <div className="text-center py-16 rounded-lg border border-dashed border-border/50 bg-muted/20">
                     <ClipboardList className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                     <p className="text-lg font-medium text-muted-foreground mb-2">
                        No events yet
                     </p>
                     <p className="text-sm text-muted-foreground mb-4">
                        Create your first event to get started
                     </p>
                     <Button onClick={() => setOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Your First Event
                     </Button>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                     {events.map((event) => (
                        <div
                           key={event.id}
                           className="group hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-primary/50 bg-card backdrop-blur-sm overflow-hidden rounded-xl relative"
                        >
                           <div className="relative h-52 overflow-hidden">
                              <img
                                 src={event.imageUrl}
                                 alt={event.title}
                                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                              {/* Action buttons */}
                              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                 <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-9 w-9 shadow-lg backdrop-blur-sm bg-background/90 hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => handleEdit(event)}
                                 >
                                    <Pencil className="h-4 w-4" />
                                 </Button>
                                 <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-9 w-9 shadow-lg backdrop-blur-sm bg-background/90 hover:bg-green-500 hover:text-white"
                                    onClick={() => handleExport(event.id)}
                                 >
                                    <FileSpreadsheet className="h-4 w-4" />
                                 </Button>
                                 <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-9 w-9 shadow-lg backdrop-blur-sm bg-background/90 hover:bg-destructive hover:text-destructive-foreground"
                                    onClick={() => handleDelete(event.id)}
                                 >
                                    <Trash2 className="h-4 w-4" />
                                 </Button>
                              </div>

                              {/* Ticket type badge */}
                              <div className="absolute top-3 left-3">
                                 <Badge
                                    variant={
                                       event.ticket_type === "free"
                                          ? "default"
                                          : "secondary"
                                    }
                                    className={`${
                                       event.ticket_type === "free"
                                          ? "bg-green-500/90 hover:bg-green-500 text-white"
                                          : "bg-blue-500/90 hover:bg-blue-500 text-white"
                                    } backdrop-blur-sm shadow-lg capitalize`}
                                 >
                                    {event.ticket_type}
                                 </Badge>
                              </div>
                           </div>

                           <div className="p-5 space-y-3">
                              <div className="space-y-2">
                                 <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                                       {event.title}
                                    </h3>
                                 </div>
                                 <Badge
                                    variant="outline"
                                    className="text-xs capitalize"
                                 >
                                    {event.category}
                                 </Badge>
                              </div>

                              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                 {event.description}
                              </p>

                              <div className="pt-3 space-y-2 border-t border-border/50">
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-medium">
                                       {new Date(
                                          event.event_date
                                       ).toLocaleDateString("en-US", {
                                          weekday: "short",
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                       })}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span className="line-clamp-1">
                                       {event.location}
                                    </span>
                                 </div>
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                 <div className="text-sm">
                                    <span className="text-muted-foreground">
                                       Capacity:{" "}
                                    </span>
                                    <span className="font-semibold">
                                       {event.ticket_capacity}
                                    </span>
                                 </div>
                                 <div className="text-sm">
                                    <span className="text-muted-foreground">
                                       Available:{" "}
                                    </span>
                                    <span
                                       className={`font-semibold ${
                                          event.remaining_tickets < 10
                                             ? "text-destructive"
                                             : "text-green-500"
                                       }`}
                                    >
                                       {event.remaining_tickets}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </AnalyticsSection>
      </div>
   );
}
