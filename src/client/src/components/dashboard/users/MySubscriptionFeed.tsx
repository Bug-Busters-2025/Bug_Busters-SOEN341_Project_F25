import { 
    useState,
    useMemo
} from "react"
import { useOutletContext } from "react-router";
import { 
    Card, 
    CardContent,  
} from "@/components/ui/card";
import type { SubscriptionContextType } from "@/types/subscription";
import EventCard from "@/components/ui/EventCard";


export default function MySubscriptionFeed() {
    const { events, organizers } = 
        useOutletContext<SubscriptionContextType>();
    
    const [ selectedOrg , setSelectedOrg ] = useState<number>(-1); // negative will signify select all
    
    const isEventPassed = (eventDate: string): boolean => {
        return new Date(eventDate) < new Date();
    };

    const handleClick = (orgId: number) => {
        setSelectedOrg(prevId => prevId === orgId ? -1 : orgId);
    }

    const filteredEvents = useMemo(() => {
        if (selectedOrg === -1) {
            return events;
        }
        return events.filter(event => event.organizer_id === selectedOrg);
    }, [events, selectedOrg]);

    return (
        <div className="w-full h-full space-y-6 p-6 flex flex-col items-center">
            <div className="w-full justify-between">
                <div className="flex flex-row overflow-x-auto space-x-2 p-4">
                    <Card 
                        className={`min-w-[150px] cursor-pointer ${selectedOrg === -1 ? 'ring-2 ring-primary border-primary' : ''}`}
                        onClick={() => handleClick(-1)}
                    >
                        <CardContent className="p-3 flex flex-col justify-center items-center text-center">
                            <span className="text-sm font-bold">All Organizers</span>
                            <span className="text-xs text-neutral-400">{events.length} Events</span>
                        </CardContent>
                    </Card>
                    {organizers.map(org => {
                        const orgEventCount = events.filter(e => e.organizer_id === org.organizer_id).length;
                        const isSelected = selectedOrg === org.organizer_id;
                        
                        return (
                            <Card 
                                key={org.organizer_id} 
                                className={`min-w-[150px] cursor-pointer ${isSelected ? 'ring-2 ring-primary border-primary' : 'hover:ring-1 hover:ring-white/50'}`} 
                                onClick={() => handleClick(org.organizer_id)}
                            >
                                <CardContent className="p-3 flex flex-col justify-center text-center">
                                    <span className="text-sm font-medium">{org.organizer_name}</span>
                                    <span className="text-xs text-neutral-400">{orgEventCount} Events</span>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
            <div className="w-full flex-1 rounded-md border p-4 overflow-y-auto">
                {filteredEvents.length === 0 ? (
                    <p className="text-center text-neutral-500 py-10">
                        {selectedOrg === -1 
                            ? "No events found from any followed organizers." 
                            : `No events found for Organizer: ${organizers.find(o => o.organizer_id === selectedOrg)?.organizer_name}.`
                        }
                    </p>
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredEvents.map((event, idx) => (
                            <EventCard 
                                key={event.id}
                                index={idx}
                                event={event} 
                                showOrganizer={false}
                                className={isEventPassed(event.event_date) ? "opacity-50" : ""}
                            >
                                <div>
                                    <span className="text-xs text-neutral-400">
                                        {new Date(event.event_date).toLocaleDateString()}
                                    </span>
                                </div>
                            </EventCard>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}