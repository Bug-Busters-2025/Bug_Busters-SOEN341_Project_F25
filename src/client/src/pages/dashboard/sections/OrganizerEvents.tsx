import { useState, useEffect } from "react";
import { Plus , ClipboardList, Pencil, FileSpreadsheet} from "lucide-react";
import AnalyticsSection from "@/components/dashboard/organizer/AnalyticsSection";
import { Button } from "@/components/ui/button";
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
      try
      {
        const response = await axios.get(`http://localhost:3000/api/v1/events/organizer/${organizerId}`);
        const now = new Date();
        const upcomingEvents = response.data.filter((event: any) => {
          const eventDate = new Date(event.event_date.replace(" ", "T"));
          return eventDate >= now;
        });
    
        setEvents(upcomingEvents);
      }
        catch (error)
        {
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
      
      const handleEventCreated = async() => {
        if (organizerId) await fetchEvents(organizerId);
        setOpen(false);
        
      };
      const handleEventUpdated = async() => {
        if (organizerId) await fetchEvents(organizerId);
          setEditEvent(null);
          setOpen(false);
      }
      const handleEdit = (event: eventData) => {
        setEditEvent(event);
        setOpen(true);
      }
      const handleDelete = (eventId: number) => {

        if (confirm("Are you sure you want to delete this event?"))
        {
          axios.delete(`http://localhost:3000/api/v1/events/${eventId}`)
          .then(() => {
            setEvents(events.filter(event => event.id !== eventId));
          })
          .catch((error) => {
            console.log("error deleting event", error);
          });
        }
      }
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
    <AnalyticsSection
        title=
        {
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <span>My Events</span>
            </div>

          <Button
            variant="primary"
            size="icon"
            className=" h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setOpen(true)}
          >
            <Plus className="!h-4 !w-4" />
          </Button>
        </div>
        }
        subtitle="Manage your events"
        sectionId="my-events"
        icon={<ClipboardList/>}>
          <div className="space-y-4">
            <EventModal open={open} onClose={() => {setOpen(false); setEditEvent(null);}} 
            onEventCreated={handleEventCreated}
            onEventUpdated={handleEventUpdated}
            eventData={editEvent}
            isEditMode={!!editEvent}/>
            {events.length === 0 ? (
          <p className="text-center text-muted-foreground">
            You haven’t created any events yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-border/50 hover:border-border bg-card/50 backdrop-blur-sm overflow-hidden rounded-lg relative"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                  {/* Edit + Delete buttons */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 hover:bg-primary/10"
                      onClick={() => handleEdit(event)}
                    >
                      <Pencil className="h-4 w-4 text-primary" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 hover:bg-green-100"
                      onClick={() => handleExport(event.id)}
                    >
    <FileSpreadsheet className="h-4 w-4 text-green-600" />
  </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 hover:bg-destructive/10"
                      onClick={() => handleDelete(event.id)}
                    >
                      ✕
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">
                    {event.title}
                  </h3>
                  <span
                    className="text-xs font-medium bg-muted px-2 py-0.5 rounded-full text-foreground/70 capitalize"
                    >
                    {event.category}
                     </span>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {new Date(event.event_date).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        event.ticket_type === "free"
                          ? "bg-green-200 text-green-800"
                          : "bg-blue-200 text-blue-800"
                      }`}
                    >
                      {event.ticket_type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

          </div>
    </AnalyticsSection>
 



)

}

