import { Outlet } from "react-router";

import DashboardSidemenu from "./DashboardSidemenu";

export default function DashboardLayout() {
   return (
      <div className="w-screen h-screen flex flex-row">
         <DashboardSidemenu />
         <main id="dsh-content" className="flex-auto">
            <Outlet />
         </main>
      </div>
   );
}
