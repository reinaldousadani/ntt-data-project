import { Pencil, Star, Trash2 } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";
import { cn } from "@/modules/lib/utils";
import type { Product } from "../services/useProductsService";

type ProductCardProps = {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
};

function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const discount = Math.round(product.discountPercentage);
  const originalPrice =
    discount > 0 ? product.price / (1 - discount / 100) : product.price;

  const status = product.availabilityStatus;
  const statusColor =
    status === "In Stock"
      ? "text-emerald-600"
      : status === "Low Stock"
        ? "text-amber-600"
        : "text-destructive";

  return (
    <div className="group bg-card flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer">
      <div className="bg-muted relative aspect-square">
        {discount > 0 && (
          <div className="bg-destructive text-destructive-foreground absolute top-3 left-3 rounded-md px-2 py-1 text-xs font-semibold">
            −{discount}%
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            aria-label={`Edit ${product.title}`}
            onClick={() => onEdit?.(product)}
          >
            <Pencil />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="destructive"
            aria-label={`Delete ${product.title}`}
            onClick={() => onDelete?.(product)}
          >
            <Trash2 />
          </Button>
        </div>
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="size-full object-contain p-6"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-foreground text-xs font-semibold tracking-wider uppercase">
            {product.category}
          </span>
          <span className="flex items-center gap-1 text-sm font-medium">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(2)}
          </span>
        </div>

        <h3 className="text-foreground line-clamp-2 text-base font-semibold">
          {product.title}
        </h3>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-2">
            {discount > 0 && (
              <span className="text-muted-foreground text-sm line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-foreground text-lg font-bold">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <div className={cn("flex items-center gap-1.5 text-sm", statusColor)}>
            <span className="size-1.5 rounded-full bg-current" />
            <span>{status}</span>
            <span className="text-muted-foreground">· {product.stock}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
