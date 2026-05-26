import { Star } from "lucide-react";
import { cn } from "@/modules/lib/utils";

function StarRating({
  rating,
  size = 4,
}: {
  rating: number;
  size?: 3 | 4 | 5;
}) {
  const rounded = Math.round(rating);
  const sizeClass = size === 3 ? "size-3" : size === 5 ? "size-5" : "size-4";
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            sizeClass,
            i <= rounded
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/40 fill-transparent",
          )}
        />
      ))}
    </div>
  );
}

export default StarRating;
