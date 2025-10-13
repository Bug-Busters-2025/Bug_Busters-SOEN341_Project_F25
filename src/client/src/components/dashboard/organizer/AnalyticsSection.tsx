import { memo, type ReactNode } from "react";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   CardDescription,
} from "@/components/ui/card";

interface AnalyticsSectionProps {
   title: ReactNode;
   subtitle: ReactNode;
   sectionId?: string;
   icon: ReactNode;
   children: ReactNode;
}

function AnalyticsSection({
   title,
   subtitle,
   sectionId,
   icon,
   children,
}: AnalyticsSectionProps) {
   return (
      <Card id={sectionId} className="w-full shadow-lg border-border/50">
         <CardHeader className="space-y-1">
            <div className="flex items-center justify-between gap-3">
               <div className="p-2 bg-primary/10 rounded-lg text-secondary-foreground">
                  {icon}
               </div>
               <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  {title}
               </CardTitle>
            </div>
            <CardDescription className="text-base">{subtitle}</CardDescription>
         </CardHeader>
         <CardContent className="pt-6">{children}</CardContent>
      </Card>
   );
}

export default memo(AnalyticsSection);
