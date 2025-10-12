import {memo, type ReactNode} from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    Trash,
    Pencil
} from "lucide-react";
import { type Event } from "@/data/events";
import { formatDate } from "@/utils/dateTimeUtils";

interface eventCardProps {
    event: Event,
    index: number
    children: ReactNode
}

memo(function OrganizerOptions() {
    return (
        <div className="w-full flex flex-row">
            <button className="bg-primary text-primary-foreground py-2.5 px-4 rounded-md hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] font-medium cursor-pointer">
                <Trash/>
            </button>
            <button className="flex flex-row bg-primary text-primary-foreground py-2.5 px-4 rounded-md hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] font-medium cursor-pointer">
                Edit
                <Pencil/>
            </button>
        </div>
    );
});

function EventCard({event, index, children} : eventCardProps) {
    return (
        <Card
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-border/50 hover:border-border bg-card/50 backdrop-blur-sm overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms` }}>
            <div className="relative h-48 overflow-hidden">
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/90 text-primary-foreground backdrop-blur-sm">
                        {event.category}
                    </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                    <CardTitle className="text-lg text-foreground drop-shadow-md">
                        {event.title}
                    </CardTitle>
                </div>
            </div>
            <CardContent className="p-4 flex flex-col h-full">
                <CardDescription className="text-sm mb-2 flex-1">
                    {event.description.length > 150
                    ? `${event.description.substring(0, 150)}...`
                    : event.description}
                </CardDescription>
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                        {formatDate(event.event_date)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                        {event.location}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <span>
                        {event.ticket_capacity-event.remaining_tickets}/
                        {event.ticket_capacity} attendees
                        </span>
                    </div>
                </div>
                <div className="mb-4 pt-2 border-t border-border/50">
                    <p className="text-sm font-medium text-foreground">
                        Organized by:{" "}
                        <span className="text-primary">
                        {event.organizer}
                        </span>
                    </p>
                </div>
                {children}
            </CardContent>
        </Card>
    );
}

export default memo(EventCard);