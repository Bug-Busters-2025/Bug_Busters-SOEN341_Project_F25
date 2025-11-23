import { type TicketType } from "./tickets";

export type EventApiStatus = "PUBLISHED" | "DELETED" | string;

export interface Event {
   id: number;
   title: string;
   description: string;
   event_date: string;
   location: string;
   organizer_name: string;
   organizer_id?: number;
   category: string;
   ticket_capacity: number;
   ticket_type: TicketType;
   imageUrl: string;
   remaining_tickets: number;
   status?: EventApiStatus;
   time: string;
}

export interface EventWithOrganizer extends Event {
   organizer_name: string;
   organizer_email: string;
}