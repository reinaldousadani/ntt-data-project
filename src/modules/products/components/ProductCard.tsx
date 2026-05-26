import { Pencil, Star, Trash2 } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/modules/core/components/ui/alert-dialog";
import { cn } from "@/modules/lib/utils";
import type { Product } from "../services/useProductsService";
import { useState } from "react";
import { toast } from "sonner";
import type { GenericErrorResponse } from "@/modules/core/services/api";

type ProductCardProps = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => Promise<void>;
};

function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete(product);
      toast.success(
        `Success deleting ${product.title}. NOTE: THIS IS ONLY A MOCK. NO ACTUAL DATA IS DELETED ON SERVER.`,
      );
      setLoading(false);
      setDeleteDialogOpen(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        (error as unknown as GenericErrorResponse).errorMsg ??
          "Some error happened.",
      );
    }
  };

  return (
    <div className="group bg-card flex cursor-pointer flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
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
          <AlertDialog open={deleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="icon-sm"
                variant="destructive"
                aria-label={`Delete ${product.title}`}
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive">
                  <Trash2 />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete product?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete{" "}
                  <span className="text-foreground font-medium">
                    {product.title}
                  </span>
                  . This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={loading}
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => {
                    handleDelete();
                  }}
                >
                  {loading ? "Loading" : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
