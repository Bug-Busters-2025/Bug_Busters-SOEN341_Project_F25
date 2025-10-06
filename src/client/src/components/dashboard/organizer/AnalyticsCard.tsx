import { memo, type ReactNode } from "react"

interface AnalyticsCardProps {
    title: string,
    icon: ReactNode,
    analytic: string,
    action?: (id: string) => void,
    children: ReactNode
}

function AnalyticsCard ({title, icon, analytic, action, children} : AnalyticsCardProps) {
    return (
        <div
            className="flex flex-col border shadow-md rounded-md p-6 w-1/6 m-w-[250px]
                        transition-all duration-300 
                        hover:scale-105 hover:shadow-xl 
                        active:scale-100 active:shadow-sm"
            onClick={() => action}>
            <div className="flex flex-row items-center justify-between space-y-0 pb-6">
                <h1 className="text-sm font-medium">{title}</h1>
                {icon}
            </div>
            <div>
                <div className="text-3xl font-bold">{analytic}</div>
                <p className="text-xs text-muted-foreground">
                    {children}
                </p>
            </div>
        </div>
    )
}

export default memo(AnalyticsCard);