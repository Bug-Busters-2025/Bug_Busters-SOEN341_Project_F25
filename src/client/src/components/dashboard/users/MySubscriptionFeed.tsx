import { 
    useState, 
    useCallback,
    useEffect
} from "react"
import type { OrganizerSummary } from "@/types/subscription";


export interface mySubscriptionFeedProps {
    events: Event[],
    organizers: OrganizerSummary,

}

function OrgnanizersSlider() {

}

export default function MySubscriptionFeed({events, organizers} : mySubscriptionFeedProps) {
    const [ selectedOrg , setSelectedOrg ] = useState<Number>(-1); // negative will signify select all
    
    useEffect(() => {

    }, [])

    return (
        <div className="w-full h-full space-y-6 p-6 flex flex-col ">
            <div className="">

            </div>
            <div className="">

            </div>
        </div>
    );
}