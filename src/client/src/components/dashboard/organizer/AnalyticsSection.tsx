import { memo, type ReactNode } from "react"

interface AnalyticsSectionProps {
    title: ReactNode,
    subtitle: string,
    sectionId?: string,
    icon: ReactNode,
    children: ReactNode
}

function AnalyticsSection ({title, subtitle, sectionId, icon, children} : AnalyticsSectionProps)
{
    return (
        <div id={sectionId} className="w-full flex flex-col justify-center items-center border rounded-md p-6 shadow-md">
            <div className="w-full grid grid-cols-2 grid-rows-2">
                <h2 className="row-start-1 text-xl font-bold tracking-tigh">{title}</h2>
                <p className="row-start-2 text-muted-foreground">{subtitle}</p>
                <div className="row-span-2 flex w-full justify-end">
                    {icon}
                </div>
            </div>
            {children}
        </div>
    );
};

export default memo(AnalyticsSection);