import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   CardDescription,
} from "@/components/ui/card";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
   categories,
   organizations,
   type Event,
} from "@/data/events";
import { DatePicker } from "@/components/DatePicker";
import EventCard from "@/components/ui/EventCard";
import {
   Calendar,
   MapPin,
   Users,
   Search as SearchIcon,
   Filter,
   Bookmark,
   BookmarkCheck,
} from "lucide-react";

import { mockEvents } from "@/data/events";

// Mock functions to manage saved events
const getSavedEvents = () => {
   return mockEvents;
};

const saveEvent = async (event: Event): Promise<boolean> => {
   const savedEvents = getSavedEvents();
   const isAlreadySaved = savedEvents.some(
      (savedEvent) => savedEvent.id === event.id
   );

   if (!isAlreadySaved) {
      mockEvents.push(event);
      return true;
   }
   return false;
};

const unsaveEvent = async (eventId: string): Promise<boolean> => {
   const index = mockEvents.findIndex((event) => event.id === eventId);
   if (index > -1) {
      mockEvents.splice(index, 1);
      return true;
   }
   return false;
};

export default function Search() {
   const [selectedCategory, setSelectedCategory] = useState<string>("All");
   const [selectedOrganization, setSelectedOrganization] = useState<string>("All");
   const [selectedDate, setSelectedDate] = useState<string>("");
   const [searchQuery, setSearchQuery] = useState<string>("");
   const [events, setEvents] = useState<Event[]>([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get("http://localhost:3000/events");
            console.log("Events fetched:", response.data);
            if (response.data) {
               setEvents(response.data);
            }
         } catch (error) {
            console.error("Error fetching events:", error);
         }
      };

      fetchData();
   }, []);

   const filteredEvents = useMemo(() => {
      return events.filter((event) => {
         if (selectedDate && event.event_date !== selectedDate) {
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

   const handleSaveEvent = async (event: Event) => {
      try {
         const isCurrentlySaved = savedEvents.some(
            (savedEvent) => savedEvent.id === event.id
         );

         if (isCurrentlySaved) {
            await unsaveEvent(event.id);
            setSavedEvents((prev) =>
               prev.filter((savedEvent) => savedEvent.id !== event.id)
            );
         } else {
            await saveEvent(event);
            setSavedEvents((prev) => [...prev, event]);
         }
      } catch (error) {
         console.error("Error saving event:", error);
      }
   };

   const isEventSaved = (eventId: string) => {
      return savedEvents.some((event) => event.id === eventId);
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
                     const isSaved = isEventSaved(event.id);
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
                                    e.stopPropagation();
                                    handleSaveEvent(event);
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
                                    <MapPin className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">
                                       {event.location}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4 flex-shrink-0" />
                                    <span>{event.ticket_capacity} tickets</span>
                                 </div>
                              </div>

                              <div className="mb-4 pt-2 border-t border-border/50">
                                 <p className="text-sm font-medium text-foreground">
                                    Organized by:{" "}
                                    <span className="text-primary">
                                       {event.organizer}
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
