import { useState } from "react";
import axios from "axios";
import { ImageUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";


interface CreateEventModalProps
{
    open: boolean;
    onClose: () => void;
    onEventCreated?: () => void;
    onEventUpdated?: () => void;
    eventData?: any;
    isEditMode?: boolean;

}

export default function CreateEventModal({open, onClose, onEventCreated, onEventUpdated, eventData, isEditMode = false} : CreateEventModalProps) {

    const [message,setMessage] =   useState<string | null>(null);
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        imageUrl: "",
        eventDate: "",
        location: "",
        ticket_capacity: "",
        ticket_type:"Free",
    });
    const toLocalDate = (s: string) => new Date(s.replace(" ", "T"))

    useEffect(() => {
        if (eventData) {
          setForm({
            title: eventData.title,
            description: eventData.description,
            category: eventData.category ,
            imageUrl: eventData.imageUrl,
            eventDate: eventData.event_date?.slice(0, 16),
            location: eventData.location,
            ticket_capacity: eventData.ticket_capacity?.toString(),
            ticket_type: eventData.ticket_type,
          });
        }
      }, [eventData]);
      useEffect(() => {
        if (!open) {
          setMessage(null);
          if (!isEditMode) {
            setForm({
              title: "",
              description: "",
              category: "",
              imageUrl: "",
              eventDate: "",
              location: "",
              ticket_capacity: "",
              ticket_type: "Free",
            });
          }
        }
      }, [open, isEditMode]);
    if (!open) return null;
    const validateImageUrl = async (url: string): Promise<boolean> => {
      
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        });
      };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({...form, [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async () => {

        if ( !form.title || !form.description || !form.category || !form.eventDate || !form.location || !form.ticket_capacity ) {
            setMessage("Please fill in all required fields.");
            return;
        }
        const capacity = parseInt(form.ticket_capacity);
        if (isNaN(capacity) || capacity <= 0) {
            setMessage("Ticket capacity must be a valid number.");
            return;
        }
            if (form.imageUrl){
                const validImage = await validateImageUrl(form.imageUrl);
            if (!validImage) {
              setMessage("Please provide a valid image URL that can be loaded.");
              return;
                }
            }
            // Date Validation
            const eventDateObj = new Date(form.eventDate);
            const now = new Date();

            if (!isEditMode && eventDateObj <= now) {
                setMessage("Event date must be in the future.");
                return;
            }
            if (isEditMode && eventData?.event_date) {
                const originalEventDate = new Date(eventData.event_date);
                const oneDayBefore = new Date(originalEventDate.getTime() - 24 * 60 * 60 * 1000);
                if (now >= oneDayBefore) {
                    setMessage("Edits are not allowed within 24 hours of the event.");
                    return;
                  }
            }
            const formattedDate = form.eventDate.replace("T", " ") + ":00";
        
          
        try {
            if (isEditMode && eventData?.id)
            {

                const newCapacity = parseInt(form.ticket_capacity);
                const oldCapacity = eventData.ticket_capacity;
                const remaining = eventData.remaining_tickets;

                const sold = oldCapacity - remaining;
                if (newCapacity < sold) {
                    setMessage(`Capacity cannot be lower than ${sold} (tickets already sold).`);
                    return;
                    }
                await axios.put(`http://localhost:3000/event/${eventData.id}`, {
                    title: form.title,
                    description: form.description,
                    category: form.category,
                    imageUrl: form.imageUrl,
                    event_date: formattedDate, 
                    location: form.location,
                    ticket_capacity: parseInt(form.ticket_capacity),
                    remaining_tickets: remaining + (newCapacity - oldCapacity),
                    ticket_type: form.ticket_type,
                  });
                setMessage("Event updated successfully!");
                onEventUpdated?.();
            }
            else {
                const res = await axios.post("http://localhost:3000/event", {
                    title: form.title,
                    description: form.description,
                    category: form.category,
                    imageUrl: form.imageUrl,
                    event_date: formattedDate,
                    location: form.location,
                    ticket_capacity: parseInt(form.ticket_capacity),
                    remaining_tickets: parseInt(form.ticket_capacity),
                    ticket_type: form.ticket_type,
                  });
                onEventCreated?.();
            }
            onClose();
        } catch (error) {
            console.error("Error creating/updating event:", error);
            setMessage("An error occurred. Please try again.");
            
        };
    }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-background p-6 rounded-xl shadow-lg w-[500px] border relative">

                <Button onClick={onClose} className="absolute top-3 right-3 rounded-full hover:bg-accent/50">
                <X className="h-5 w-5"></X>
                </Button>

                <h2 className= "text-xl font-semibold mb-4 ">{isEditMode ? "Edit Event" : "Create Event"}</h2>
                <div className="flex flex-col gap-3">
                    <Input 
                     name="title"
                     placeholder="Event Title"
                     value = {form.title}
                     onChange={handleChange}
                     />
                    <textarea
                     name="description"
                     placeholder="Event description "
                     value={form.description}
                     onChange={handleChange}
                     rows={3}
                    className="border border-border rounded-md p-2 text-sm bg-background
                     text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"/>

                    <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="
                    w-full border border-border rounded-md bg-card text-foreground px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary
                    transition-all duration-200
                    ">
                     <option value="">Select a category</option>
                     <option value="Technology">Technology</option>
                     <option value="Music">Music</option>
                     <option value="Academic">Academic</option>
                     <option value="Sports">Sports</option>
                     <option value="Arts">Arts</option>
                     <option value="Career">Career</option>
                     <option value="Environment">Environment</option>
                     </select>
                     
                    <Input 
                     name="imageUrl"
                     placeholder="Image URL"
                     value={form.imageUrl}
                     onChange={handleChange}
                     />
                     <div className="space-y-2">
                     <label
                     htmlFor="event_date"
                     className="text-sm font-medium text-foreground pl-2"
                     >
                     Event Date & Time
                     </label>

                     <Input
                     type="datetime-local"
                     name="eventDate"
                     value={form.eventDate}
                     onChange={handleChange}
                     />
                     </div>
         
                   <Input
                     name="location"
                     placeholder="Location "
                     value={form.location}
                     onChange={handleChange}
                   />
         
                   <Input
                     type="number"
                     name="ticket_capacity"
                     placeholder="Ticket capacity "
                     value={form.ticket_capacity}
                     onChange={handleChange}
                     className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                   />
                    
                     <select
                     id="ticket_type"
                     name="ticket_type"
                     value={form.ticket_type}
                     onChange={handleChange}
                     className="
                        w-full
                        border
                        border-border
                        rounded-md
                        bg-card
                        text-foreground
                        px-3
                        py-2
                        :outline-none
                        focus:ring-2
                        focus:ring-primary
                        focus:ring-offset-1
                        hover:border-primary
                        transition-all
                        duration-20
                        "
                >
                  <option value="">Select a ticket type</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                  </select>

                  {message && (
                 <p className="text-sm center text-red-500 text-center mt-3">{message}</p>
                     )}
                 <Button
                    variant="primary"
                    onClick={handleSubmit}
                    className="px-4 py-2">
                    {isEditMode ? "Save Changes" : "Create"}
                </Button>

                </div>
            </div>
        </div>



    );



}