import { RouterProvider } from "react-router/dom";
import router from "./routing/reactRouter.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";

export default function App() {
   return (
      <ThemeProvider>
         {/* future clerk provider implementation */}
         <RouterProvider router={router} />
      </ThemeProvider>
   );
}
