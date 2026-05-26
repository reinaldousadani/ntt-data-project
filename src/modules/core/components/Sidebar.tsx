import { House, SquareChartGantt } from "lucide-react";
import { useMatch, useNavigate } from "react-router";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

function Sidebar() {
  const navigate = useNavigate();
  const homeMatch = useMatch("/dashboard");
  const productsMatch = useMatch("/dashboard/products/*");

  return (
    <TooltipProvider>
      <div className="flex h-full w-16 flex-col items-center gap-0.5 bg-[#0B2645] px-2.5 py-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={homeMatch ? "secondary" : "default"}
              onClick={() => navigate("/dashboard")}
            >
              <House />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Home</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={productsMatch ? "secondary" : "default"}
              onClick={() => navigate("/dashboard/products")}
            >
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
