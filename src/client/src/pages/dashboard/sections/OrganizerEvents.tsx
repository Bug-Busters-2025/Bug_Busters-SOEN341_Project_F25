import { useState } from "react";
import { Plus , ClipboardList} from "lucide-react";
import AnalyticsSection from "@/components/dashboard/organizer/AnalyticsSection";
import { Button } from "@/components/ui/button";
import CreateEventModal from "@/components/dashboard/organizer/CreateEventModal";




export default function CreateEvent() {

    const [open, setOpen] = useState(false);

return (
    <AnalyticsSection
        title=
        {
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <span>My Events</span>
            </div>

          <Button
            variant="primary"
            size="icon"
            className=" h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setOpen(true)}
          >
            <Plus className="!h-4 !w-4" />
          </Button>
        </div>
        }
        subtitle="Manage your events"
        sectionId="my-events"
        icon={<ClipboardList/>}>
          <div className="space-y-4">
            <CreateEventModal open={open} onClose={() => setOpen(false)}>

            </CreateEventModal>

          </div>
    </AnalyticsSection>
 



)

}

