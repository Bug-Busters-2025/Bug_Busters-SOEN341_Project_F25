export interface Event {
   id: string;
   title: string;
   description: string;
   date: string;
   time: string;
   location: string;
   category: string;
   organization: string;
   imageUrl?: string;
   maxAttendees: number;
   currentAttendees: number;
}

export const mockEvents: Event[] = [
   {
      id: "1",
      title: "Tech Conference 2025",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "2025-10-15",
      time: "09:00",
      location: "Convention Center, Montreal",
      category: "Technology",
      organization: "Tech Society",
      imageUrl:
         "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
      maxAttendees: 500,
      currentAttendees: 234,
   },
   {
      id: "2",
      title: "Music Festival",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "2025-10-20",
      time: "18:00",
      location: "Parc Jean-Drapeau, Montreal",
      category: "Music",
      organization: "Music Club",
      imageUrl:
         "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop",
      maxAttendees: 2000,
      currentAttendees: 1500,
   },
   {
      id: "3",
      title: "Study Group - Calculus",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "2025-10-12",
      time: "14:00",
      location: "Library Room 301",
      category: "Academic",
      organization: "Math Society",
      imageUrl:
         "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop",
      maxAttendees: 20,
      currentAttendees: 12,
   },
   {
      id: "4",
      title: "Basketball Tournament",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "2025-10-18",
      time: "10:00",
      location: "Gymnasium",
      category: "Sports",
      organization: "Athletics Department",
      imageUrl:
         "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=200&fit=crop",
      maxAttendees: 64,
      currentAttendees: 45,
   },
   {
      id: "5",
      title: "Art Exhibition Opening",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "2025-10-14",
      time: "17:00",
      location: "Art Gallery",
      category: "Arts",
      organization: "Fine Arts Club",
      imageUrl:
         "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=200&fit=crop",
      maxAttendees: 100,
      currentAttendees: 67,
   },
   {
      id: "6",
      title: "Career Fair",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "2025-10-25",
      time: "10:00",
      location: "Student Center",
      category: "Career",
      organization: "Career Services",
      imageUrl:
         "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=200&fit=crop",
      maxAttendees: 300,
      currentAttendees: 180,
   },
   {
      id: "7",
      title: "Environmental Workshop",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "2025-10-16",
      time: "13:00",
      location: "Environmental Science Building",
      category: "Environment",
      organization: "Green Club",
      imageUrl:
         "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop",
      maxAttendees: 50,
      currentAttendees: 23,
   },
   {
      id: "8",
      title: "Dance Workshop",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "2025-10-22",
      time: "19:00",
      location: "Dance Studio",
      category: "Arts",
      organization: "Dance Society",
      imageUrl:
         "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=200&fit=crop",
      maxAttendees: 30,
      currentAttendees: 18,
   },
];

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
      date: "2025-10-12",
      time: "09:00",
      location: "Convention Center, Montreal",
      category: "Technology",
      organization: "Tech Society",
      imageUrl:
         "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
      maxAttendees: 500,
      currentAttendees: 234,
   },
   {
      id: "2",
      title: "Music Festival",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "2025-10-20",
      time: "18:00",
      location: "Parc Jean-Drapeau, Montreal",
      category: "Music",
      organization: "Music Club",
      imageUrl:
         "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop",
      maxAttendees: 2000,
      currentAttendees: 1500,
   },
   {
      id: "3",
      title: "Study Group - Calculus",
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "2025-10-12",
      time: "14:00",
      location: "Library Room 301",
      category: "Academic",
      organization: "Math Society",
      imageUrl:
         "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop",
      maxAttendees: 20,
      currentAttendees: 12,
   },
   
];
