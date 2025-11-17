import { RouterProvider } from "react-router";
import router from "./routing/reactRouter";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
