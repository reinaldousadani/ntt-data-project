import { House, SquareChartGantt } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

function Sidebar() {
  return (
    <TooltipProvider>
      <div className="flex h-full w-16 flex-col items-center gap-0.5 bg-[#0B2645] px-2.5 py-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant={"secondary"}>
              <House />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Home</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant={"default"}>
              <SquareChartGantt />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Products</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export default Sidebar;
