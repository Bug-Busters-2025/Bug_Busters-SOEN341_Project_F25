import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { type EventWithOrganizer } from "@/types/event";

import {
   Calendar as CalendarIcon,
   MapPin,
   Clock,
   BookmarkCheck,
   ArrowLeft,
   Trash2,
   Grid3x3,
   List,
   Search,
   X,
   Tag,
   SearchX,
} from "lucide-react";
import axios from "axios";
import {
   Select,
   SelectItem,
   SelectValue,
   SelectTrigger,
   SelectContent,
} from "@/components/ui/select";
import { Input, InputWrapper } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

type ViewMode = "grid" | "list";
type SortMode = "date" | "title" | "attendees";

export default function Calendar() {
   const [savedEvents, setSavedEvents] = useState<EventWithOrganizer[]>([]);
   const [viewMode, setViewMode] = useState<ViewMode>("grid");
   const [sortMode, setSortMode] = useState<SortMode>("date");
   const [searchQuery, setSearchQuery] = useState("");

   useEffect(() => {
      const getSavedEventsData = async () => {
         const response = await axios.get("http://localhost:3000/events/1");
         console.log("Saved events:", response.data);
         if (response.data) {
            console.log("Saved events:", response.data);
            setSavedEvents(response.data);
         }
      };
      getSavedEventsData();
   }, []);

   const removeSavedEvent = async (eventId: number) => {
      try {
         await axios.delete(`http://localhost:3000/delete-event`, {
            data: { user_id: 1, event_id: eventId },
         });
         setSavedEvents(savedEvents.filter((event) => event.id !== eventId));
      } catch (error) {
         console.error("Error removing event:", error);
      }
   };

   const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
         weekday: "long",
         year: "numeric",
         month: "long",
         day: "numeric",
      });
   };

   const getFilteredAndSortedEvents = () => {
      let filtered = savedEvents;

      if (searchQuery) {
         filtered = filtered.filter(
            (event) =>
               event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               event.location
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
               event.organizer_name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
         );
      }

      const sorted = [...filtered].sort((a, b) => {
         switch (sortMode) {
            case "date":
               return (
                  new Date(a.event_date).getTime() -
                  new Date(b.event_date).getTime()
               );
            case "title":
               return a.title.localeCompare(b.title);
            case "attendees":
               return b.remaining_tickets - a.remaining_tickets;
            default:
               return 0;
         }
      });

      return sorted;
   };

   const groupEventsByDate = () => {
      const filtered = getFilteredAndSortedEvents();
      const grouped: { [key: string]: EventWithOrganizer[] } = {};

      filtered.forEach((event) => {
         const eventDate = new Date(event.event_date);
         const year = eventDate.getFullYear();
         const month = String(eventDate.getMonth() + 1).padStart(2, "0");
         const day = String(eventDate.getDate()).padStart(2, "0");
         const date = `${year}-${month}-${day}`;
         if (!grouped[date]) {
            grouped[date] = [];
         }
         grouped[date].push(event);
      });

      return grouped;
   };

   const groupedEvents = groupEventsByDate();
   const filteredEvents = getFilteredAndSortedEvents();

   return (
      <div className="min-h-screen bg-background">
         <div className="border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="space-y-2">
                     <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        My Event Calendar
                     </h1>
                     <p className="text-muted-foreground text-lg">
                        Check my upcoming saved events
                     </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                     <Card className="flex-1 min-w-[250px] border-primary/50 ">
                        <CardContent className="p-4">
                           <div className="flex items-center gap-3">
                              <div className="p-3 bg-primary/15 rounded-xl">
                                 <BookmarkCheck className="h-6 w-6 text-secondary-foreground" />
                              </div>
                              <div>
                                 <p className="text-3xl font-bold text-foreground">
                                    {savedEvents.length}
                                 </p>
                                 <p className="text-xs text-muted-foreground font-medium">
                                    Saved Events
                                 </p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {savedEvents.length > 0 && (
               <Card className="mb-6 shadow-sm">
                  <CardContent className="p-4">
                     <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1 ">
                           <InputWrapper variant="lg">
                              <Search />
                              <Input
                                 type="text"
                                 variant="lg"
                                 placeholder="Search events by title, location, or organizer..."
                                 value={searchQuery}
                                 onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                 }
                              />
                              {searchQuery && (
                                 <X onClick={() => setSearchQuery("")} />
                              )}
                           </InputWrapper>
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                           <Select
                              value={sortMode}
                              onValueChange={(value) =>
                                 setSortMode(value as SortMode)
                              }
                           >
                              <SelectTrigger className="w-[180px]" size="lg">
                                 <SelectValue placeholder="Sort by" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="date">
                                    Sort by Date
                                 </SelectItem>
                                 <SelectItem value="title">
                                    Sort by Title
                                 </SelectItem>
                                 <SelectItem value="attendees">
                                    Sort by Attendees
                                 </SelectItem>
                              </SelectContent>
                           </Select>

                           <div className="flex border border-input rounded-lg overflow-hidden">
                              <ButtonGroup>
                                 <Button
                                    size="lg"
                                    onClick={() => setViewMode("grid")}
                                    className={` ${
                                       viewMode === "grid"
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-background hover:bg-accent"
                                    }`}
                                    title="Grid View"
                                 >
                                    <Grid3x3 className="h-4 w-4" />
                                 </Button>
                                 <Button
                                    size="lg"
                                    onClick={() => setViewMode("list")}
                                    className={` ${
                                       viewMode === "list"
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-background hover:bg-accent"
                                    }`}
                                    title="List View"
                                 >
                                    <List className="h-4 w-4" />
                                 </Button>
                              </ButtonGroup>
                           </div>
                        </div>
                     </div>

                     {searchQuery && (
                        <div className="mt-3 pt-3 border-t border-border">
                           <p className="text-sm text-muted-foreground">
                              Found{" "}
                              <span className="font-semibold text-foreground">
                                 {filteredEvents.length}
                              </span>{" "}
                              event
                              {filteredEvents.length !== 1 ? "s" : ""} matching
                              "{searchQuery}"
                           </p>
                        </div>
                     )}
                  </CardContent>
               </Card>
            )}

            {savedEvents.length === 0 ? (
               <Card className="border-dashed border-2">
                  <CardContent className="py-20 text-center">
                     <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                        <CalendarIcon className="h-10 w-10 text-primary" />
                     </div>
                     <h3 className="text-2xl font-semibold text-foreground mb-3">
                        No saved events yet
                     </h3>
                     <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Start building your calendar by discovering and saving
                        events that interest you
                     </p>
                     <Link to="/search">
                        <button className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform duration-200">
                           <Search className="h-5 w-5" />
                           Discover Events
                        </button>
                     </Link>
                  </CardContent>
               </Card>
            ) : filteredEvents.length === 0 ? (
               <Card className="border-dashed border-2">
                  <CardContent className="py-16 text-center">
                     <SearchX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                     <h3 className="text-xl font-medium text-foreground mb-2">
                        No events found
                     </h3>
                     <p className="text-muted-foreground mb-4">
                        Try adjusting your search criteria
                     </p>
                     <button
                        onClick={() => setSearchQuery("")}
                        className="px-6 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors font-medium"
                     >
                        Clear Search
                     </button>
                  </CardContent>
               </Card>
            ) : (
               <div className="relative">
                  <div className="absolute left-[50px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/60 to-primary/30"></div>

                  <div className="space-y-12">
                     {Object.entries(groupedEvents)
                        .sort(
                           ([dateA], [dateB]) =>
                              new Date(dateA).getTime() -
                              new Date(dateB).getTime()
                        )
                        .map(([date, events]) => (
                           <div
                              key={date}
                              className="relative animate-in fade-in slide-in-from-bottom-4 duration-500"
                           >
                              <div className="flex items-start gap-6">
                                 <div className="flex-shrink-0">
                                    <Card className="bg-primary text-primary-foreground min-w-[100px] hover:shadow-xl">
                                       <CardContent className="px-10 py-4 text-center">
                                          <div className="text-3xl font-bold">
                                             {new Date(
                                                `${date}T00:00:00`
                                             ).getDate()}
                                          </div>
                                          <div className="text-sm uppercase tracking-wider font-semibold mt-1">
                                             {new Date(
                                                `${date}T00:00:00`
                                             ).toLocaleDateString("en-US", {
                                                month: "short",
                                             })}
                                          </div>
                                          <div className="text-xs text-primary-foreground/80 mt-1">
                                             {new Date(
                                                `${date}T00:00:00`
                                             ).toLocaleDateString("en-US", {
                                                weekday: "short",
                                             })}
                                          </div>
                                       </CardContent>
                                    </Card>
                                 </div>
                                 <div className="flex-1 pt-2">
                                    <h3 className="text-2xl font-bold text-foreground">
                                       {formatDate(`${date}T00:00:00`)}
                                    </h3>
                                    <p className="text-muted-foreground font-medium">
                                       {events.length} event
                                       {events.length !== 1 ? "s" : ""}{" "}
                                       scheduled
                                    </p>
                                 </div>
                              </div>

                              <div
                                 className={
                                    viewMode === "grid"
                                       ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:ml-25 mt-8 lg:mt-10"
                                       : "space-y-4 lg:ml-25 lg:mt-6 ml-10 mt-6"
                                 }
                              >
                                 {events.map((event, index) => (
                                    <Card
                                       key={event.id}
                                       className="group transition-all duration-300 hover:border-primary/50 animate-in fade-in cursor-pointer"
                                       style={{
                                          animationDelay: `${index * 50}ms`,
                                       }}
                                    >
                                       <CardContent className="p-5">
                                          <div className="flex justify-between items-start mb-4">
                                             <h4 className="text-lg font-bold text-foreground pr-4">
                                                {event.title}
                                             </h4>
                                             <button
                                                onClick={() =>
                                                   console.log(event.id)
                                                }
                                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg opacity-0 group-hover:opacity-100 flex-shrink-0"
                                                title="Remove from calendar"
                                             >
                                                <Trash2
                                                   onClick={(e) => {
                                                      e.stopPropagation();
                                                      removeSavedEvent(
                                                         event.id
                                                      );
                                                   }}
                                                   className="h-4 w-4"
                                                />
                                             </button>
                                          </div>

                                          <div className="space-y-2.5 text-sm">
                                             <div className="flex items-center gap-3 text-muted-foreground">
                                                <div className="p-2 bg-primary/15 rounded-lg">
                                                   <Tag className="h-4 w-4 text-secondary-foreground" />
                                                </div>
                                                <span className="font-medium">
                                                   {event.category}
                                                </span>
                                             </div>
                                             <div className="flex items-center gap-3 text-muted-foreground">
                                                <div className="p-2 bg-primary/15 rounded-lg">
                                                   <Clock className="h-4 w-4 text-secondary-foreground" />
                                                </div>
                                                <span className="font-medium">
                                                   {formatDate(
                                                      event.event_date
                                                   )}
                                                </span>
                                             </div>
                                             <div className="flex items-center gap-3 text-muted-foreground">
                                                <div className="p-2 bg-primary/15 rounded-lg">
                                                   <MapPin className="h-4 w-4 text-secondary-foreground" />
                                                </div>
                                                <span className="truncate font-medium">
                                                   {event.location}
                                                </span>
                                             </div>
                                          </div>

                                          <div className="mt-4 pt-4 border-t border-border/50">
                                             <p className="text-sm text-muted-foreground">
                                                Organized by{" "}
                                                <span className="font-semibold text-primary">
                                                   {event.organizer_name}
                                                </span>
                                             </p>
                                          </div>

                                          <button className="w-full mt-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-2.5 px-4 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all font-semibold group/btn">
                                             <span className="flex items-center justify-center gap-2">
                                                View Details
                                                <ArrowLeft className="h-4 w-4 rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                                             </span>
                                          </button>
                                       </CardContent>
                                    </Card>
                                 ))}
                              </div>
                           </div>
                        ))}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
