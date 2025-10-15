import { useState, useEffect } from "react";
import { type Ticket, type ApiRow, toTicket } from "@/types/tickets";
export const useTickets = (userId: number) => {
   const [tickets, setTickets] = useState<Ticket[]>([]);

   const loadTickets = async () => {
      console.log("Fetching tickets for user:", userId);

      if (!userId) {
         console.warn("No userId provided");
         return;
      }

      try {
         const url = `http://localhost:3000/api/v1/users/tickets/${userId}`;
         console.log("Request URL:", url);
         const res = await fetch(url);

         console.log("Response status:", res.status, res.statusText);

         if (!res.ok) {
            const text = await res.text();

            return;
         }

         const rawText = await res.text();
         console.log("Raw response text:", rawText);

         try {
            const data = JSON.parse(rawText);
            console.log("Parsed JSON:", data);
            setTickets(data.map(toTicket));
         } catch (parseErr) {}
      } catch (err) {
         console.error("useTickets error:", err);
      }
   };

   useEffect(() => {
      loadTickets();
   }, [userId]);

   return { tickets, loadTickets };
};
