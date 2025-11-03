import { useEffect, useRef, useState } from "react";
import { QrCode, CheckCircle, XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnalyticsSection from "@/components/dashboard/organizer/AnalyticsSection";
import { useSearchParams } from "react-router";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import { useAuth } from "@clerk/clerk-react";

export default function ScanTicketPage() {
   const [status, setStatus] = useState<
      "idle" | "already" | "invalid" | "checked_in"
   >("idle");
   const scannerRef = useRef<any>(null);
   const startedRef = useRef(false);
   const [searchParams] = useSearchParams();
   const eventId = searchParams.get("eventId");
   const cooldownRef = useRef(false);
   const loadingRef = useRef(false);
   const scanResultRef = useRef<string | null>(null);
   const { getToken } = useAuth();

   useEffect(() => {
      async function startScanner() {
         if (startedRef.current) return;
         startedRef.current = true;

         await new Promise((resolve) => setTimeout(resolve, 100));

         const scanner = new Html5Qrcode("qr-reader");
         scannerRef.current = scanner;

         try {
            await scanner.start(
               { facingMode: "environment" },
               { fps: 10, qrbox: 250 },
               async (decodedText: string) => {
                  if (
                     loadingRef.current ||
                     cooldownRef.current ||
                     decodedText === scanResultRef.current
                  )
                     return;

                  cooldownRef.current = true;
                  loadingRef.current = true;
                  scanResultRef.current = decodedText;
                  console.log("Scanned:", decodedText);

                  await handleConfirmCheckIn(decodedText);
                  setTimeout(() => {
                     scanResultRef.current = null;
                     setStatus("idle");
                     loadingRef.current = false;
                     cooldownRef.current = false;
                  }, 4000);
               },
               (errorMessage: string) => {
                  if (!errorMessage.includes("NotFoundException")) {
                  }
               }
            );
         } catch (error) {
            console.error("Failed to start QR scanner:", error);
            startedRef.current = false;
         }
      }
      startScanner();

      return () => {
         if (scannerRef.current) {
            scannerRef.current
               .stop()
               .then(() => {
                  console.log("QR scanner stopped safely.");
                  scannerRef.current?.clear();
               })
               .catch((err: any) => {
                  console.warn("Error stopping QR scanner:", err);
               })
               .finally(() => {
                  startedRef.current = false;
               });
         }
      };
   }, []);

   const handleConfirmCheckIn = async (decodedText: string) => {
      if (!eventId) {
         console.log("Missing event ID");
         setStatus("invalid");
         return;
      }
      try {
        const token = await getToken();
         const res = await axios.post(
            "http://localhost:3000/api/v1/events/check-in",
            {
               payload: decodedText,
               event_id: eventId,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, 
              },
            }
         );

         console.log("Server response:", res.data);
         setStatus(res.data.status);
      } catch (error) {
         console.error("Check-in error:", error);
         setStatus("invalid");
      }
   };

   const handleNextScan = async () => {
      scanResultRef.current = null;
      setStatus("idle");
   };
   const renderStatus = () => {
      switch (status) {
         case "checked_in":
            return (
               <div className="flex flex-col items-center text-green-500">
                  <CheckCircle className="h-10 w-10 mb-2" />
                  <p className="font-semibold">
                     Ticket Checked In Successfully!
                  </p>
                  <Button size="sm" onClick={handleNextScan} className="mt-3">
                     Next Scan
                  </Button>
               </div>
            );

         case "already":
            return (
               <div className="flex flex-col items-center text-yellow-500">
                  <CheckCircle className="h-10 w-10 mb-2" />
                  <p className="font-semibold">Ticket Already Checked In</p>
                  <Button size="sm" onClick={handleNextScan} className="mt-3">
                     Next Scan
                  </Button>
               </div>
            );

         case "invalid":
            return (
               <div className="flex flex-col items-center text-red-500">
                  <XCircle className="h-10 w-10 mb-2" />
                  <p className="font-semibold">Invalid or Unknown QR</p>
                  <Button size="sm" onClick={handleNextScan} className="mt-3">
                     Try Again
                  </Button>
               </div>
            );
      }
   };

   return (
      <div className="h-full w-full flex flex-col p-6 md:p-10 gap-6 bg-gradient-to-br from-background via-muted/20 to-background overflow-auto">
         <AnalyticsSection
            title="QR Ticket Scanner"
            subtitle="Scan and check in attendees instantly"
            sectionId="check-in"
            icon={<QrCode className="h-6 w-6" />}
         >
            <Card className="max-w-md mx-auto border border-border/50 bg-card backdrop-blur-sm shadow-xl rounded-2xl">
               <CardHeader className="text-center">
                  <CardTitle className="text-xl font-semibold">
                     Event Check-In
                  </CardTitle>
               </CardHeader>

               <CardContent className="flex flex-col items-center justify-center space-y-6 py-6">
                  <div
                     id="qr-reader"
                     className="w-[85vw] max-w-[360px] h-[270px] rounded-xl overflow-hidden shadow-md "
                  />
                  {renderStatus()}
               </CardContent>
            </Card>
         </AnalyticsSection>
      </div>
   );
}
