import { NavLink } from "react-router";

export default function DashboardSidemenu() {
   return (
      <aside
         id="dsb-sidemenu"
         className="relative h-full min-w-16 max-w-1/2 truncate border-solid border-1 border-grey-300 resize-x overflow-auto flex flex-col z-5 bg-gray-100"
      >
         <div className="min-h-[50px] bg-black-100">topbar</div>
         <nav className="flex flex-1 flex-col justify-left truncate p-2">
            <NavLink className="hover:underline truncate" to=".">
               Overview
            </NavLink>
            <NavLink className="hover:underline truncate" to="./analytics">
               Analytics
            </NavLink>
            <NavLink className="hover:underline truncate" to="./OrganizerEvents">
             Events
            </NavLink>
         </nav>
         <div className="truncate">bottombar</div>
      </aside>
   );
}
