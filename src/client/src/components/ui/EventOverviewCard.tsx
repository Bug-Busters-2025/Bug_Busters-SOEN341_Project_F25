import {memo} from "react";
import {
    Users,
    MapPin,
    Clock
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getDayOfWeek } from "@/utils/dateTime";
import { type Event } from "@/data/events";

interface EventOverviewProp {
    event: Event
}

function EventOverviewCard({event} : EventOverviewProp) {
    return (
        <div className="w-full flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
            <div className="flex flex-col items-center justify-center min-w-[60px] p-3 rounded-lg bg-primary/10">
                <span className="text-xs font-medium text-muted-foreground uppercase">
                    {getDayOfWeek(event.date)}
                </span>
                <span className="text-2xl font-bold text-primary">{new Date(event.date).getDate()}</span>
                <span className="text-xs text-muted-foreground">
                {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                </span>
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-balance leading-tight">{event.title}</h3>
                <Badge className="bg-chart-1 text-white" variant="secondary">
                    Status
                </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <Clock className="size-4" />
                    <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Users className="size-4" />
                    <span>{event.currentAttendees}/{event.maxAttendees} attendees</span>
                </div>
            </div>
            <div>
                <Badge variant="outline" className="text-xs">
                    {event.category}
                </Badge>
            </div>
            </div>
        </div>
    );
}

export default memo(EventOverviewCard);