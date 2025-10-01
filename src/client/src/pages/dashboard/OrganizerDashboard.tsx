import React, {useState, useEffect} from "react";
import AttendeeExportSection from "./sections/AttendeeDownload";
import { useUser } from "@clerk/clerk-react";




export default function OrganizerDashboard() {

     
    const [events, setEvents] = useState([]);

    useEffect(()=> {
        
        //Getting organizer events
      
       
        fetch(`/api/events/organizer/1`)
          .then(res => res.json())
          .then(data => setEvents(data))
          .catch(err => console.error("Failed to load events:", err));
      }, []
    
    
    );
    

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Organizer Dashboard</h1>

      <AttendeeExportSection events={events} />
    </div>
  );
}