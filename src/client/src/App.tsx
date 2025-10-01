import { RouterProvider } from "react-router/dom";
import router from "./routing/reactRouter.tsx";

export default function App() {
   return (
      // future clerk provider implementation
      <>
         <RouterProvider router={router} />
      </>
   );
}
