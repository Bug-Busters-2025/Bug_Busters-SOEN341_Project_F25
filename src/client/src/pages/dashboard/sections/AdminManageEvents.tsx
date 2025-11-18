import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import AnalyticsSection from "@/components/dashboard/organizer/AnalyticsSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

interface EventRow {
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
  organizer_name: string;
  organizer_email: string;
  status?: string;
}

export default function AdminManageEvents() {
  const { getToken } = useAuth();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await axios.get("http://localhost:3000/api/v1/events/admin/all", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const published = (res.data as EventRow[]).filter(
        (e) => (e.status ?? "published").toLowerCase() !== "archived"
      );
      setEvents(published);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveEvent = async (eventId: number, eventTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${eventTitle}"? This will hide it from public view.`
    );
    if (!confirmed) return;

    setRemovingId(eventId);
    setError(null);
    try {
      const token = await getToken();
      await axios.patch(
        `http://localhost:3000/api/v1/events/${eventId}/status`,
        { status: "archived" },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      toast.success("Event removed", {
        description: `"${eventTitle}" has been removed from public view`,
      });
      await fetchEvents();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to remove event");
      toast.error("Failed to remove event");
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-full w-full flex flex-col p-6 md:p-10 gap-6 bg-gradient-to-br from-background via-muted/20 to-background overflow-auto">
      <AnalyticsSection
        icon={<Calendar className="w-4 h-4" />}
        title={<span>Manage Events ({events.length})</span>}
        subtitle={
          <span className="text-sm text-muted-foreground">
            Moderate and remove events from public view
          </span>
        }
        sectionId="admin-manage-events"
      >
        {error && (
          <div className="border border-destructive/40 bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 rounded-lg border border-dashed border-border/50 bg-muted/20">
            <Calendar className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="group hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/50 bg-card backdrop-blur-sm overflow-hidden rounded-xl relative"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={event.imageUrl || "https://via.placeholder.com/400x200"}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                  <div className="absolute top-3 right-3">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-9 w-9 shadow-lg backdrop-blur-sm bg-background/90 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveEvent(event.id, event.title)}
                      disabled={removingId === event.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="absolute top-3 left-3">
                    <Badge
                      variant={event.ticket_type === "free" ? "default" : "secondary"}
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
                    <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <Badge variant="outline" className="text-xs capitalize">
                      {event.category}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="pt-3 space-y-2 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{formatDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.remaining_tickets}/{event.ticket_capacity} spots left
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50">
                    <p className="text-sm font-medium text-foreground">
                      Organized by: <span className="text-primary">{event.organizer_name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{event.organizer_email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AnalyticsSection>
    </div>
  );
}
