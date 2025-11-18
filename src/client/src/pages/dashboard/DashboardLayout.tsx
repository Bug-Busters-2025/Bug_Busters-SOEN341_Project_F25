import { Outlet } from "react-router";

import DashboardSidemenu from "./DashboardSidemenu";

export default function DashboardLayout() {
   return (
      <div className="w-full h-screen flex flex-row overflow-hidden">
         <DashboardSidemenu />
         <main id="dsh-content" className="flex-auto overflow-auto min-w-0">
            <Outlet />
         </main>
      </div>
   );
}
