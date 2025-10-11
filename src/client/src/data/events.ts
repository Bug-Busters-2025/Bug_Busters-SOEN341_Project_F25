export interface Event {
   id: string;
   title: string;
   description: string;
   event_date: string;
   location: string;
   organizer: string;
   organizer_id?: string;
   category: string;
   ticket_capacity: number;
   ticket_type: "free" | "paid";
   imageUrl: string;
   remaining_tickets: number;
   time: string;
}

export const categories = [
   "All",
   "Technology",
   "Music",
   "Academic",
   "Sports",
   "Arts",
   "Career",
   "Environment",
];

export const organizations = [
   "All",
   "Tech Society",
   "Music Club",
   "Math Society",
   "Athletics Department",
   "Fine Arts Club",
   "Career Services",
   "Green Club",
   "Dance Society",
];
