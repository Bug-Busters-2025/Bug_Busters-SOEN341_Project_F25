import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "./ui/button";

export function ThemeToggle() {
   const { setTheme, theme } = useTheme();

   return (
      <Button
         onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
         className="rounded-lg bg-card border border-border hover:bg-accent transition-all duration-200 shadow-lg hover:shadow-xl"
         aria-label={`Switch to ${theme} mode`}
         title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
         size="icon"
      >
         <div className="relative">
            <Sun
               className={`h-5 w-5 text-foreground transition-all duration-300 ${
                  theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
               }`}
            />
            <Moon
               className={`h-5 w-5 text-foreground transition-all duration-300 absolute top-0 left-0 ${
                  theme === "light"
                     ? "rotate-0 scale-100"
                     : "-rotate-90 scale-0"
               }`}
            />
         </div>
      </Button>
   );
}
