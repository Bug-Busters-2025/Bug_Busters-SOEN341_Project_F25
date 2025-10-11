import { useState } from "react";
import axios from "axios";
import { ImageUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


interface CreateEventModalProps
{
    open: boolean,
    onClose: () => void
}

export default function CreateEventModal({open, onClose} : CreateEventModalProps) {

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
    if (!open) return null;
    const validateImageUrl = async (url: string): Promise<boolean> => {
        const imagePattern = /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i;
        if (!imagePattern.test(url)) return false;
      
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


        const capacity = parseInt(form.ticket_capacity);
        if (isNaN(capacity) || capacity <= 0) {
            setMessage("Ticket capacity must be a valid number.");
            return;
        }
        if (form.imageUrl) {
            const validImage = await validateImageUrl(form.imageUrl);
            console.log("Image validation result:", validImage)
            if (!validImage) {
              setMessage("Please provide a valid image URL that can be loaded.");
              return;
            }
          }


        if ( !form.title || !form.description || !form.category || !form.eventDate || !form.location || !form.ticket_capacity ) {
            setMessage("Please fill in all required fields.");
            return;
        }
        try {
            const res = await axios.post("/api/events", {...form, ticket_capacity: parseInt(form.ticket_capacity)});

            setMessage ("Event created successfully!");
            onClose();

            setForm(
                {
                    title: "",
                    description: "",
                    category: "",
                    imageUrl: "",
                    eventDate: "",
                    location: "",
                    ticket_capacity: "",
                    ticket_type:"Free",
                
                });
                 }catch(err)
                {
                    console.log(err);
                    setMessage("Error creating event. Please try again.");
                }
            
        };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-background p-6 rounded-xl shadow-lg w-[500px] border relative">

                <Button onClick={onClose} className="absolute top-3 right-3 rounded-full hover:bg-accent/50">
                <X className="h-5 w-5"></X>
                </Button>

                <h2 className= "text-xl font-semibold mb-4 ">Create Event</h2>
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
                     <option value="Music">Music</option>
                     <option value="Tech">Tech</option>
                     <option value="Sports">Sports</option>
                     <option value="Networking">Networking</option>
                     <option value="Workshop">Workshop</option>
                     <option value="Social">Social</option>
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
                    Create
                </Button>

                </div>
            </div>
        </div>



    );



}