import { Check, Pencil, Star, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/modules/core/components/ui/avatar";
import StarRating from "./StarRating";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/core/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/modules/core/components/ui/field";
import { Input } from "@/modules/core/components/ui/input";
import { Textarea } from "@/modules/core/components/ui/textarea";
import { cn } from "@/modules/lib/utils";
import type { Product } from "../services/useProductsService";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { GenericErrorResponse } from "@/modules/core/services/api";

type ProductCardProps = {
  product: Product;
  onEdit: (id: number, payload: Partial<Product>) => void | Promise<void>;
  onDelete: (product: Product) => void | Promise<void>;
};

type EditFormValues = {
  name: string;
  description: string;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditFormValues>({
    defaultValues: {
      name: product.title,
      description: product.description,
    },
  });

  const handleEdit = async (values: EditFormValues) => {
    try {
      await onEdit(product.id, {
        title: values.name,
        description: values.description
      });
      toast.success(
        `Updated ${product.title}. NOTE: THIS IS ONLY A MOCK. NO ACTUAL DATA IS UPDATED ON SERVER.`,
      );
      setEditDialogOpen(false);
    } catch (error) {
      toast.error(
        (error as unknown as GenericErrorResponse).errorMsg ??
          "Some error happened.",
      );
    }
  };

  const handleEditOpenChange = (next: boolean) => {
    if (isSubmitting && !next) return;
    if (next) {
      reset({ name: product.title, description: product.description });
    }
    setEditDialogOpen(next);
  };

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
    <>
    <div
      className="group bg-card flex cursor-pointer flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      onClick={() => setDetailDialogOpen(true)}
    >
      <div className="bg-muted relative aspect-square">
        {discount > 0 && (
          <div className="bg-destructive text-destructive-foreground absolute top-3 left-3 rounded-md px-2 py-1 text-xs font-semibold">
            −{discount}%
          </div>
        )}
        <div
          className="absolute top-3 right-3 flex gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <Dialog open={editDialogOpen} onOpenChange={handleEditOpenChange}>
            <DialogTrigger asChild>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                aria-label={`Edit ${product.title}`}
              >
                <Pencil />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit(handleEdit)} noValidate>
                <DialogHeader>
                  <DialogTitle>Edit product</DialogTitle>
                  <DialogDescription>
                    Update name and description
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                  <Field data-invalid={!!errors.name}>
                    <FieldLabel htmlFor={`name-${product.id}`}>Name</FieldLabel>
                    <Input
                      id={`name-${product.id}`}
                      aria-invalid={!!errors.name}
                      {...register("name", {
                        required: "Name is required",
                        maxLength: {
                          value: 100,
                          message: "Name must be 100 characters or fewer",
                        },
                      })}
                    />
                    <FieldError
                      errors={errors.name ? [errors.name] : undefined}
                    />
                  </Field>

                  <Field data-invalid={!!errors.description}>
                    <FieldLabel htmlFor={`description-${product.id}`}>
                      Description
                    </FieldLabel>
                    <Textarea
                      id={`description-${product.id}`}
                      rows={4}
                      aria-invalid={!!errors.description}
                      {...register("description", {
                        required: "Description is required",
                        maxLength: {
                          value: 1000,
                          message:
                            "Description must be 1000 characters or fewer",
                        },
                      })}
                    />
                    <FieldError
                      errors={
                        errors.description ? [errors.description] : undefined
                      }
                    />
                  </Field>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    <Check />
                    {isSubmitting ? "Saving…" : "Save changes"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-4xl"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader className="border-b pb-4">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {product.category}
              {product.brand ? ` · ${product.brand}` : ""}
            </p>
            <DialogTitle className="text-2xl font-bold">
              {product.title}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="bg-muted relative aspect-square overflow-hidden rounded-lg">
              {discount > 0 && (
                <div className="bg-destructive text-destructive-foreground absolute top-3 left-3 rounded-md px-2 py-1 text-xs font-semibold">
                  −{discount}%
                </div>
              )}
              <img
                src={product.thumbnail}
                alt={product.title}
                className="size-full object-contain p-6"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
                <StarRating rating={product.rating} />
                <span className="text-foreground font-semibold">
                  {product.rating.toFixed(1)}
                </span>
                <span>({product.reviews?.length ?? 0} reviews)</span>
                {product.sku && (
                  <>
                    <span>·</span>
                    <span>SKU {product.sku}</span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-foreground text-4xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-muted-foreground text-base line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-destructive/10 text-destructive rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      Save {discount} %
                    </span>
                  </>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <div
                  className={cn(
                    "flex items-center gap-1.5 text-sm",
                    statusColor,
                  )}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  <span>{status}</span>
                  <span className="text-muted-foreground">
                    · {product.stock}
                  </span>
                </div>
                {product.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {product.reviews && product.reviews.length > 0 && (
            <div className="flex flex-col gap-3 border-t pt-6">
              <h3 className="text-xl font-bold">
                Reviews{" "}
                <span className="text-muted-foreground">
                  ({product.reviews.length})
                </span>
              </h3>
              <div className="flex flex-col gap-3">
                {product.reviews.map((review, idx) => (
                  <div
                    key={`${review.reviewerEmail}-${idx}`}
                    className="bg-card flex flex-col gap-2 rounded-lg border p-4"
                  >
                    <div className="flex flex-wrap items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-slate-900 text-white">
                          {getInitials(review.reviewerName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="text-foreground font-semibold">
                          {review.reviewerName}
                        </span>
                        <span className="text-muted-foreground truncate text-sm">
                          {review.reviewerEmail}
                        </span>
                      </div>
                      <div className="ml-auto flex items-center gap-3">
                        <StarRating rating={review.rating} size={3} />
                        <span className="text-muted-foreground text-sm">
                          {new Date(review.date).toLocaleDateString("en-US")}
                        </span>
                      </div>
                    </div>
                    <p className="text-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProductCard;
