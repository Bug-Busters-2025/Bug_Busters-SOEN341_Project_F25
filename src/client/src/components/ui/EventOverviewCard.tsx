import { memo } from "react";
import { Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDayOfWeek } from "@/utils/dateTimeUtils";
import { type Event } from "@/data/events";

interface EventOverviewProp {
   event: Event;
}

function EventOverviewCard({ event }: EventOverviewProp) {
   return (
      <div className="w-full flex gap-1 p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors overflow-hidden">
         <div className="flex flex-col items-center justify-center min-w-[60px] p-1 rounded-lg bg-primary/10">
            <span className="text-xs font-medium text-muted-foreground uppercase">
               {getDayOfWeek(event.event_date)}
            </span>
            <span className="text-2xl font-bold text-primary">
               {new Date(event.event_date).getDate()}
            </span>
            <span className="text-xs text-muted-foreground">
               {new Date(event.event_date).toLocaleDateString("en-US", {
                  month: "short",
               })}
            </span>
         </div>
         <div className="flex-1">
            <div className="flex mb-1 items-start justify-between gap-2">
               <h3 className="font-semibold text-balance leading-tight">
                  {event.title}
               </h3>
               <Badge
                  variant="default"
                  className={`${
                     event.ticket_type === "paid"
                        ? "bg-yellow-700/80 text-white"
                        : "bg-green-700/80 text-white"
                  }`}
               >
                  {event.ticket_type === "paid" ? "Paid" : "Free"}
               </Badge>
            </div>
            <div className="flex flex-row gap-1 text-sm text-muted-foreground">
               <div className="flex items-center gap-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                  <MapPin className="size-4" />
                  <span>{event.location}</span>
               </div>
            </div>
            <div className="flex flex-row gap-1 text-sm text-muted-foreground">
               <div className="flex items-center gap-0.5">
                  <Users className="size-4" />
                  <span>
                     {event.ticket_capacity - event.remaining_tickets}/
                     {event.ticket_capacity} attendees
                  </span>
               </div>
               <Badge variant="outline" className="text-xs">
                  {event.category}
               </Badge>
            </div>
         </div>
      </div>
   );
}

export default memo(EventOverviewCard);
