import { Bell, Clock } from "lucide-react";

const notifications = [
   {
      id: 1,
      title: "New event created",
      description: "A new event 'Tech Conference 2025' has been created.",
      time: "10 minutes ago",
   },
   {
      id: 2,
      title: "Ticket sold",
      description: "A ticket for 'Music Festival' has been sold.",
      time: "30 minutes ago",
   },
   {
      id: 3,
      title: "Event updated",
      description: "The event 'Art Exhibition' has been updated.",
      time: "1 hour ago",
   },
   {
      id: 4,
      title: "New Subscriber",
      description: "John Doe has subscribed to your events.",
      time: "2 hours ago",
   },
];

export default function OrganizerNotifications() {
   return (
      <div className="h-full w-full flex flex-col p-6 md:p-10 gap-6 bg-gradient-to-br from-background via-muted/20 to-background overflow-auto">
         <div className="flex items-center gap-2">
            <Bell className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Notifications</h1>
         </div>
         <div className="space-y-4">
            {notifications.map((notification) => (
               <div
                  key={notification.id}
                  className="p-4 bg-card border border-border/50 rounded-lg flex items-start gap-4"
               >
                  <div className="flex-shrink-0">
                     <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-grow">
                     <h3 className="font-semibold">{notification.title}</h3>
                     <p className="text-sm text-muted-foreground">
                        {notification.description}
                     </p>
                     <div className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                        <Clock className="h-3 w-3" />
                        <span>{notification.time}</span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
