import { NavLink } from "react-router";

export default function DashboardSidemenu() {
  
  return (
    <aside id="dsb-sidemenu" className="relative h-full min-w-16 max-w-1/2 truncate border-solid border-1 border-grey-300 resize-x overflow-auto flex flex-col z-5 bg-red-500">
        <div className="min-h-[50px] bg-black-100">
          topbar
        </div>
        <nav className="flex flex-1 justify-left items-center truncate p-2">
          dashboard tab navbar
        </nav>
        <div className="truncate">
          bottombar
        </div>
    </aside>
  )
}
