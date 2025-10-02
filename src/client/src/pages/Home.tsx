import { Link } from "react-router";

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
               <Link
                  to="/search"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
               >
                  Browse Events
               </Link>
               <Link
                  to="/dashboard"
                  className="inline-flex items-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
               >
                  Dashboard
               </Link>
            </div>
         </div>
      </div>
   );
}
