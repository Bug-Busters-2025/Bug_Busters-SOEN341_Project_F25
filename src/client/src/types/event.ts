export interface Event {
   id: number;
   title: string;
   description: string;
   event_date: string;
   location: string;
   organizer: string;
   organizer_id?: number;
   category: string;
   ticket_capacity: number;
   ticket_type: "free" | "paid";
   imageUrl: string;
   remaining_tickets: number;
   time: string;
}

export interface EventWithOrganizer extends Event {
   organizer_name: string;
   organizer_email: string;
}
