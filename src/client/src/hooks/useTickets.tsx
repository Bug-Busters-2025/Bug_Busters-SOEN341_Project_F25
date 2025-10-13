import { useState, useEffect } from "react";
import { type Ticket, type ApiRow, toTicket } from "@/types/tickets";

export const useTickets = (userId: number) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const loadTickets = async () => {
        const res = await fetch(`/api/v1/tickets/user/${userId}`);
        const data: ApiRow[] = await res.json();
        const newOnes = data.map(toTicket);
        setTickets(prev => [...prev, ...newOnes]);
    };

    useEffect(() => {
        setTickets([]);
        loadTickets();
    }, [userId]);

    return { tickets, loadTickets };
};