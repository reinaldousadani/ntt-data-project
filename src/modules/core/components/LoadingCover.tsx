import { Loader2 } from "lucide-react";

function LoadingCover() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
    </div>
  );
}

export default LoadingCover;
