import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
   SignedIn,
   SignedOut,
   SignInButton,
   SignUpButton,
   UserButton,
} from "@clerk/clerk-react";
import SyncUser from "@/components/syncUser";

export default function Navbar() {
   return (
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         <div className="flex justify-between h-16 items-center px-4 w-full">
            <Link to="/" className="flex items-center space-x-2">
               <span className="text-2xl font-bold text-primary">
                  LookingForAName
               </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
               <Link
                  to="/"
                  className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
               >
                  Home
               </Link>
               <Link
                  to="/search"
                  className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
               >
                  Browse Events
               </Link>
               <Link
                  to="/dashboard"
                  className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
               >
                  Dashboard
               </Link>
               <Link
                  to="/calendar"
                  className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
               >
                  Saved Events Calendar
               </Link>
            </div>

            <div className="flex items-center gap-3">
               <SignedOut>
                  <SignInButton mode="modal">
                     <Button variant="outline" size="md">
                        Login
                     </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                     <Button variant="primary" size="md">
                        Sign Up
                     </Button>
                  </SignUpButton>
               </SignedOut>
               <SignedIn>
                  <SyncUser />
                  <UserButton />
               </SignedIn>
               <ThemeToggle />
            </div>
         </div>
      </nav>
   );
}
