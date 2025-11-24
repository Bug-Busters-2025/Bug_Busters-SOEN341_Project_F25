import { memo, type ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
   title: string;
   icon?: ReactNode;
   analytic: number;
   action?: (id: string) => void;
   children: ReactNode;
   trend?: "up" | "down" | "neutral";
}

function AnalyticsCard({
   title,
   icon,
   analytic,
   action,
   children,
   trend = "neutral"
}: AnalyticsCardProps) {
   const trendColor = trend === "up"
      ? "text-emerald-500"
      : trend === "down"
      ? "text-red-500"
      : "text-muted-foreground";

   const trendSymbol = trend === "up" ? "▲" : trend === "down" ? "▼" : "◼";

   return (
      <Card
         className={cn(
            "relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-default bg-gradient-to-br from-card to-muted/20 w-[250px] max-w-[250px]"
         )}
         onClick={() => action}
      >
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
               {title}
            </h3>
            {icon && (<div className="p-2 bg-primary/10 rounded-lg">{icon}</div>)}
         </CardHeader>
         <CardContent>
            <div className="text-3xl font-bold tracking-tight">{analytic}</div>
            <p
               className={cn(
                  "text-xs mt-1 flex items-center gap-1",
                  trendColor
               )}
            >
               <span>{trendSymbol}</span>
               {children}
            </p>
         </CardContent>
      </Card>
   );
}

export default memo(AnalyticsCard);
