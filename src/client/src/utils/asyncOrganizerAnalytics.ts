// src/helpers/events.ts
import axios from "axios";
import type { Event } from "@/types/event";
import type { TicketType } from "@/types/tickets";
import { getFormattedTime } from "@/utils/dateTimeUtils";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1/events",
  withCredentials: true,
});


type OrganizerEventApi = Omit<Event, "ticket_type" | "time"> & {
  ticket_type: string;
  organizer_email: string;
};

const mapApiToEvent = (e: OrganizerEventApi): Event => ({
  id: e.id,
  title: e.title,
  description: e.description,
  event_date: e.event_date,
  location: e.location,
  organizer_name: e.organizer_name,
  organizer_id: e.organizer_id,
  category: e.category,
  ticket_capacity: e.ticket_capacity,
  ticket_type: e.ticket_type as TicketType,
  imageUrl: e.imageUrl,
  remaining_tickets: e.remaining_tickets,
  status: e.status,
  time: getFormattedTime(e.event_date)
});


export async function getOrganizerEvents(organizerId: number): Promise<Event[]> {
    try {
        const res = await api.get<OrganizerEventApi[]>(`/organizer/${organizerId}`);
        return res.data.map(mapApiToEvent);
    } catch (err: any) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
            return [];
        }
        console.error("Error fetching organizer events:", err?.message ?? err);
        throw err;
    }
  }