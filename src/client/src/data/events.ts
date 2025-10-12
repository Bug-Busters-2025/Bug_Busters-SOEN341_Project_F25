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

export const mockSavedEvents: Event[] = [
   {
      id: "1",
      title: "Tech Conference 2025",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      event_date: "2025-10-12",
      time: "09:00",
      location: "Convention Center, Montreal",
      category: "Technology",
      organizer: "Tech Society",
      imageUrl:
         "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
      ticket_capacity: 500,
      remaining_tickets: 234,
      ticket_type: "free",
   },
   {
      id: "2",
      title: "Music Festival",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      event_date: "2025-10-20",
      time: "18:00",
      location: "Parc Jean-Drapeau, Montreal",
      category: "Music",
      organizer: "Music Club",
      imageUrl:
         "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop",
      ticket_capacity: 2000,
      remaining_tickets: 1500,
      ticket_type: "free",
   },
   {
      id: "3",
      title: "Study Group - Calculus",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      event_date: "2025-10-12",
      time: "14:00",
      location: "Library Room 301",
      category: "Academic",
      organizer: "Math Society",
      imageUrl:
         "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop",
      ticket_capacity: 20,
      remaining_tickets: 12,
      ticket_type: "paid",
   },
   
];
