import { useState, useMemo, useEffect } from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { categories, organizations } from "@/data/events";
import { DatePicker } from "@/components/DatePicker";
import {
   Calendar,
   MapPin,
   Users,
   Clock,
   Search as SearchIcon,
   Filter,
   BookmarkCheck,
   Bookmark,
} from "lucide-react";
import type { EventWithOrganizer } from "@/types/event";
import axios from "axios";

export default function Search() {
   const [selectedCategory, setSelectedCategory] = useState<string>("All");
   const [selectedOrganization, setSelectedOrganization] =
      useState<string>("All");
   const [selectedDate, setSelectedDate] = useState<string>("");
   const [searchQuery, setSearchQuery] = useState<string>("");
   const [events, setEvents] = useState<EventWithOrganizer[]>([]);
   const [savedEvents, setSavedEvents] = useState<EventWithOrganizer[]>([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const [eventsRes, savedRes] = await Promise.all([
               axios.get("http://localhost:3000/events"),
               // here we are getting the saved events for the user id 1 since we have no auth yet
               axios.get("http://localhost:3000/events/1"),
            ]);

            setEvents(eventsRes.data);
            setSavedEvents(savedRes.data);
         } catch (error) {
            console.error("Error fetching data:", error);
         }
      };

      fetchData();
   }, []);

   const filteredEvents = useMemo(() => {
      return events.filter((event) => {
         if (selectedDate && event.event_date !== selectedDate) {
            return false;
         }
         if (
            selectedCategory !== "All" &&
            event.category !== selectedCategory
         ) {
            return false;
         }
         if (
            selectedOrganization !== "All" &&
            event.organizer_name !== selectedOrganization
         ) {
            return false;
         }

         if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
               event.title.toLowerCase().includes(query) ||
               event.description.toLowerCase().includes(query) ||
               event.location.toLowerCase().includes(query)
            );
         }

         return true;
      });
   }, [
      events,
      selectedDate,
      selectedCategory,
      selectedOrganization,
      searchQuery,
   ]);

   const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
         weekday: "long",
         year: "numeric",
         month: "long",
         day: "numeric",
      });
   };

   const clearFilters = () => {
      setSelectedCategory("All");
      setSelectedOrganization("All");
      setSelectedDate("");
      setSearchQuery("");
   };

   const handleSaveEvent = async (event: EventWithOrganizer) => {
      try {
         // here we are saving the event to the db with the user id 1 since we have no auth yet
         const response = await axios.post("http://localhost:3000/save-event", {
            user_id: 1,
            event_id: event.id,
         });
         if (response.status === 200) {
            setSavedEvents((prev) =>
               prev.some((e) => e.id === event.id) ? prev : [...prev, event]
            );
         }
      } catch (error) {
         console.error("Error saving event:", error);
      }
   };

   const handleDeleteEvent = async (event: EventWithOrganizer) => {
      try {
         const response = await axios.delete(
            "http://localhost:3000/delete-event",
            {
               data: { user_id: 1, event_id: event.id },
            }
         );
         if (response.status === 200) {
            if (response.status === 200) {
               setSavedEvents((prev) => prev.filter((e) => e.id !== event.id));
            }
         }
      } catch (error) {
         console.error("Error deleting event:", error);
      }
   };

   return (
      <div className="min-h-screen bg-background p-6">
         <div className="max-w-7xl mx-auto">
            <div className="mb-8 animate-in fade-in-0 slide-in-from-top-4 duration-700">
               <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Discover Amazing Events
               </h1>
               <p className="text-lg text-muted-foreground">
                  Find events that interest you and connect with your campus
                  community
               </p>
            </div>

            <Card className="mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-400">
               <CardHeader>
                  <div className="flex items-center justify-between">
                     <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-primary" />
                        <span>Find Your Perfect Event</span>
                     </CardTitle>
                     <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground underline transition-colors"
                     >
                        Clear all filters
                     </button>
                  </div>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                           <SearchIcon className="h-4 w-4" />
                           Search Events
                        </label>
                        <div className="relative">
                           <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input
                              placeholder="Search events..."
                              value={searchQuery}
                              onChange={(
                                 e: React.ChangeEvent<HTMLInputElement>
                              ) => setSearchQuery(e.target.value)}
                              className="pl-10"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                           Date
                        </label>
                        <DatePicker
                           value={selectedDate}
                           onChange={(date) => setSelectedDate(date || "")}
                           placeholder="Select event date"
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                           Category
                        </label>
                        <Select
                           value={selectedCategory}
                           onValueChange={setSelectedCategory}
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                           </SelectTrigger>
                           <SelectContent>
                              {categories.map((category) => (
                                 <SelectItem key={category} value={category}>
                                    {category}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                           Organization
                        </label>
                        <Select
                           value={selectedOrganization}
                           onValueChange={setSelectedOrganization}
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="Select organization" />
                           </SelectTrigger>
                           <SelectContent>
                              {organizations.map((organization) => (
                                 <SelectItem
                                    key={organization}
                                    value={organization}
                                 >
                                    {organization}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="mb-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
               <div className="flex items-center gap-2">
                  <p>
                     <span className="font-semibold text-primary">
                        {filteredEvents.length}
                     </span>{" "}
                     event
                     {filteredEvents.length !== 1 ? "s" : ""} found
                     {(selectedCategory !== "All" ||
                        selectedOrganization !== "All" ||
                        selectedDate ||
                        searchQuery) && (
                        <span className="ml-1">matching your filters</span>
                     )}
                  </p>
               </div>
            </div>

            {filteredEvents.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event, index) => {
                     const isSaved = savedEvents.some(
                        (savedEvent) => savedEvent.id === event.id
                     );
                     return (
                        <Card
                           key={event.id}
                           className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-border/50 hover:border-border bg-card/50 backdrop-blur-sm overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4"
                           style={{ animationDelay: `${index * 50}ms` }}
                        >
                           <div className="relative h-48 overflow-hidden">
                              <img
                                 src={event.imageUrl}
                                 alt={event.title}
                                 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                              <button
                                 onClick={(e) => {
                                    if (isSaved) {
                                       handleDeleteEvent(event);
                                    } else {
                                       handleSaveEvent(event);
                                    }
                                    e.stopPropagation();
                                 }}
                                 className={`absolute top-3 left-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all cursor-pointer ${
                                    isSaved
                                       ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                       : "bg-background/80 text-muted-foreground hover:bg-background hover:text-foreground"
                                 } `}
                              >
                                 {isSaved ? (
                                    <BookmarkCheck className="h-4 w-4" />
                                 ) : (
                                    <Bookmark className="h-4 w-4" />
                                 )}
                              </button>

                              <div className="absolute top-3 right-3">
                                 <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/90 text-primary-foreground backdrop-blur-sm">
                                    {event.category}
                                 </span>
                              </div>
                              <div className="absolute bottom-3 left-3 right-3">
                                 <CardTitle className="text-lg text-foreground drop-shadow-md">
                                    {event.title}
                                 </CardTitle>
                              </div>
                           </div>

                           <CardContent className="p-4 flex flex-col h-full">
                              <CardDescription className="text-sm mb-2 flex-1">
                                 {event.description.length > 150
                                    ? `${event.description.substring(
                                         0,
                                         150
                                      )}...`
                                    : event.description}
                              </CardDescription>

                              <div className="space-y-2 mb-4">
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">
                                       {formatDate(event.event_date)}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 flex-shrink-0" />
                                    <span>{event.time}</span>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">
                                       {event.location}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4 flex-shrink-0" />
                                    <span>
                                       {event.remaining_tickets}/
                                       {event.ticket_capacity} attendees
                                    </span>
                                 </div>
                              </div>

                              <div className="mb-4 pt-2 border-t border-border/50">
                                 <p className="text-sm font-medium text-foreground">
                                    Organized by:{" "}
                                    <span className="text-primary">
                                       {event.organizer_name}
                                    </span>
                                 </p>
                              </div>

                              <button className="w-full bg-primary text-primary-foreground py-2.5 px-4 rounded-md hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] font-medium cursor-pointer">
                                 Register Now
                              </button>
                           </CardContent>
                        </Card>
                     );
                  })}
               </div>
            ) : (
               <Card>
                  <CardContent className="py-12 text-center">
                     <div className="space-y-4">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                        <div>
                           <h3 className="text-lg font-medium text-foreground mb-2">
                              🫤 No matches found
                           </h3>
                           <p className="text-muted-foreground mb-4">
                              We couldn't find any events matching your current
                              filters.
                           </p>
                           <button
                              onClick={clearFilters}
                              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                           >
                              Clear filters
                           </button>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            )}
         </div>
      </div>
   );
}
