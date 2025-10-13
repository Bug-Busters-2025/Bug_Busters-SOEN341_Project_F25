// export interface Ticket {
//     id: number;
//     event_id: number;
//     user_id: number;
//     status: "claimed" | "waitlisted";
//     checked_in: boolean;
//     created_at: string;
// }

export type TicketStatus = "claimed" | "waitlisted";
export type TicketType = "free" | "paid";

export interface Ticket {
  id: number;                // ticket_id
  status: TicketStatus;
  checkedIn: boolean;
  createdAt: string;

  eventId: number;
  title: string;
  date: string;
  category: string;
  imageUrl: string;
  location: string | null;
  capacity: number;
  remaining: number;
  type: TicketType;

  organizerId: number;
  organizerName: string;
  organizerEmail: string;
}


export type ApiRow = {
  ticket_id: number;
  status: "claimed" | "waitlisted";
  checked_in: 0 | 1;
  ticket_created_at: string;

  event_id: number;
  event_title: string;
  event_category: string;
  event_imageUrl: string;
  event_date: string;
  location: string | null;
  ticket_capacity: number;
  remaining_tickets: number;
  ticket_type: "free" | "paid";

  organizer_id: number;
  organizer_name: string;
  organizer_email: string;
};

export const toTicket = (r: ApiRow): Ticket => ({
  id: r.ticket_id,
  status: r.status,
  checkedIn: r.checked_in === 1,
  createdAt: r.ticket_created_at,

  eventId: r.event_id,
  title: r.event_title,
  date: r.event_date,
  category: r.event_category,
  imageUrl: r.event_imageUrl,
  location: r.location,
  capacity: r.ticket_capacity,
  remaining: r.remaining_tickets,
  type: r.ticket_type,

  organizerId: r.organizer_id,
  organizerName: r.organizer_name,
  organizerEmail: r.organizer_email,
});