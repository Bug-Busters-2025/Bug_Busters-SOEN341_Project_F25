import { Outlet } from "react-router";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout() {
   return (
      <>
         <Navbar />
         <Outlet />
         <Toaster richColors />
      </>
   );
}
