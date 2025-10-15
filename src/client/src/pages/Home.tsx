import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function Home() {
   return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
         <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-foreground">
               Welcome to Event Discovery
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
               Discover and join amazing events happening around your campus
            </p>
            <div className="space-x-4">
               <Button size="lg" variant={"primary"} asChild>
                  <Link to="/search">Browse Events</Link>
               </Button>
               <Button size="lg" variant={"mono"} asChild>
                  <Link to="/dashboard">
                     My Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
               </Button>
            </div>
         </div>
      </div>
   );
}
