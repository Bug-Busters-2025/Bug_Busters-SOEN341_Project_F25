import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import AnalyticsSection from "@/components/dashboard/organizer/AnalyticsSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Notification {
   id: number;
   user_id: number;
   event_id: number;
   timestamp: string;
   event_title: string;
   event_status: string;
}

export default function OrganizerNotifications() {
   const { getToken } = useAuth();
   const [notifications, setNotifications] = useState<Notification[]>([]);
   const [loading, setLoading] = useState(true);
   const [deletingId, setDeletingId] = useState<number | null>(null);
   const [error, setError] = useState<string | null>(null);

   const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
         const token = await getToken();
         const res = await axios.get("http://localhost:3000/api/v1/notifications", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
         });
         setNotifications(res.data);
      } catch (e: any) {
         setError(e?.response?.data?.message || "Failed to load notifications");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchNotifications();
   }, []);

   const handleDismiss = async (notificationId: number) => {
      setDeletingId(notificationId);
      setError(null);
      try {
         const token = await getToken();
         await axios.delete(
            `http://localhost:3000/api/v1/notifications/${notificationId}`,
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
         );
         setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
         toast.success("Notification dismissed");
      } catch (e: any) {
         setError(e?.response?.data?.message || "Failed to dismiss notification");
         toast.error("Failed to dismiss notification");
      } finally {
         setDeletingId(null);
      }
   };

   const formatTimestamp = (timestamp: string) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      
      return date.toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   return (
      <div className="h-full w-full flex flex-col p-6 md:p-10 gap-6 bg-gradient-to-br from-background via-muted/20 to-background overflow-auto">
         <AnalyticsSection
            icon={<Bell className="w-4 h-4" />}
            title={
               <div className="flex items-center gap-2">
                  <span>Notifications</span>
                  {notifications.length > 0 && (
                     <Badge variant="destructive" className="ml-2">
                        {notifications.length}
                     </Badge>
                  )}
               </div>
            }
            subtitle={
               <span className="text-sm text-muted-foreground">
                  Event removal notifications from administrators
               </span>
            }
            sectionId="organizer-notifications"
         >
            {error && (
               <div className="border border-destructive/40 bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm mb-4">
                  {error}
               </div>
            )}

            {loading ? (
               <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading notifications...</p>
               </div>
            ) : notifications.length === 0 ? (
               <div className="text-center py-16 rounded-lg border border-dashed border-border/50 bg-muted/20">
                  <Bell className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                     No notifications
                  </p>
                  <p className="text-sm text-muted-foreground">
                     You'll be notified here when an admin removes one of your events
                  </p>
               </div>
            ) : (
               <div className="space-y-4">
                  {notifications.map((notification) => (
                     <div
                        key={notification.id}
                        className="group relative flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                     >
                        <div className="flex-shrink-0 mt-1">
                           <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                              <AlertCircle className="h-5 w-5 text-destructive" />
                           </div>
                        </div>

                        <div className="flex-1 min-w-0">
                           <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                 <p className="text-sm font-medium text-foreground mb-1">
                                    Event Removed by Administrator
                                 </p>
                                 <p className="text-sm text-muted-foreground mb-2">
                                    Your event{" "}
                                    <span className="font-semibold text-foreground">
                                       "{notification.event_title}"
                                    </span>{" "}
                                    has been removed from the platform
                                 </p>
                                 <p className="text-xs text-muted-foreground">
                                    {formatTimestamp(notification.timestamp)}
                                 </p>
                              </div>

                              <Button
                                 size="icon"
                                 variant="ghost"
                                 className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                 onClick={() => handleDismiss(notification.id)}
                                 disabled={deletingId === notification.id}
                              >
                                 <Trash2 className="h-4 w-4" />
                              </Button>
                           </div>
                        </div>
                     </div>
                  ))}

                  {notifications.length > 0 && (
                     <div className="text-center pt-4">
                        <p className="text-xs text-muted-foreground">
                           Hover over a notification to dismiss it
                        </p>
                     </div>
                  )}
               </div>
            )}
         </AnalyticsSection>
      </div>
   );
}
