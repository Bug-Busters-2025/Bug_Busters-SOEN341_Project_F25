import { RouterProvider } from "react-router/dom";
import router from "./routing/reactRouter.tsx";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";

export default function App() {
   return (
      <ThemeProvider>
         {/* future clerk provider implementation */}
         <RouterProvider router={router} />
         <ThemeToggle />
      </ThemeProvider>
   );
}
