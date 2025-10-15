import { Calendar, MapPin, Users, Eye } from "lucide-react";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTickets } from "@/hooks/useTickets";
import { useUserId } from "@/hooks/useUserId";

export default function MyTickets() {
   const { userId, loading: userLoading } = useUserId();
   const { tickets } = useTickets(userId ?? 0);

   if (userLoading) return <p className="p-6">Loading…</p>;

   return (
      <div className="space-y-6 p-6">
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((t) => (
               <Card key={t.ticket_id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                     <div className="flex items-start justify-between">
                        <div className="space-y-1">
                           <CardTitle className="text-lg">{t.title}</CardTitle>
                           <CardDescription className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              {new Date(t.date).toLocaleDateString("en-US", {
                                 month: "short",
                                 day: "numeric",
                                 year: "numeric",
                              })}
                           </CardDescription>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                           {t.status}
                        </Badge>
                     </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                     {/* ✅ Corrected QR route & field name */}
                     <div className="flex justify-center bg-white p-4 rounded-lg border">
                        {t.qr_code ? (
                           <img
                              src={t.qr_code}
                              alt={`QR for ${t.title}`}
                              className="w-48 h-48 object-contain"
                           />
                        ) : (
                           <p className="text-gray-500 text-sm">
                              No QR available
                           </p>
                        )}
                     </div>

                     <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                           <MapPin className="h-4 w-4" />
                           <span>{t.location ?? "TBA"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Users className="h-4 w-4" />
                           <span>
                              {t.remaining} remaining of {t.capacity}
                           </span>
                        </div>
                     </div>

                     <div className="flex gap-2 pt-2">
                        <Button
                           variant="outline"
                           size="sm"
                           className="flex-1 bg-transparent"
                           asChild
                        >
                           <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => {
                                 if (!t.qr_code)
                                    return alert("No QR code available");

                                 const base64Data = t.qr_code.split(",")[1];
                                 const byteChars = atob(base64Data);
                                 const byteNumbers = new Array(byteChars.length)
                                    .fill(0)
                                    .map((_, i) => byteChars.charCodeAt(i));
                                 const byteArray = new Uint8Array(byteNumbers);
                                 const blob = new Blob([byteArray], {
                                    type: "image/png",
                                 });

                                 const link = document.createElement("a");
                                 link.href = URL.createObjectURL(blob);
                                 link.download = `ticket-${t.ticket_id}-qr.png`;
                                 link.click();
                                 URL.revokeObjectURL(link.href);
                              }}
                           >
                              <Eye className="h-4 w-4 mr-2" />
                              Download QR
                           </Button>
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>

         {tickets.length === 0 && (
            <Card>
               <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No tickets yet</p>
                  <p className="text-sm text-muted-foreground">
                     Claim a ticket to see its QR code.
                  </p>
               </CardContent>
            </Card>
         )}
      </div>
   );
}
