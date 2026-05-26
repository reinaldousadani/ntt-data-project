import { Check, InfoIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/modules/core/components/ui/button";
import { Input } from "@/modules/core/components/ui/input";
import { Textarea } from "@/modules/core/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/modules/core/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/core/components/ui/select";
import { useEffect, useState } from "react";
import {
  useProductsService,
  type Product,
} from "../services/useProductsService";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/modules/core/components/ui/alert";
import { toast } from "sonner";
import type { GenericErrorResponse } from "@/modules/core/services/api";

const CATEGORIES_FALLBACK = ["beauty", "fragrances"];

type ProductAddFormValues = {
  name: string;
  brand: string;
  category: string;
  description: string;
  tags: string;
  price: string;
  discountPercentage: string;
  stock: string;
  minimumOrderQuantity: string;
  sku: string;
  weight: string;
};

function ProductAddSection() {
  const navigate = useNavigate();
  const { getProductCategoryList, createProduct } = useProductsService();

  const [categories, setCategories] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProductCategoryList().then((res) => {
      setCategories(res);
    });
  }, []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductAddFormValues>({
    defaultValues: {
      name: "",
      brand: "",
      category: "",
      description: "",
      tags: "",
      price: "",
      discountPercentage: "",
      stock: "",
      minimumOrderQuantity: "",
      sku: "",
      weight: "",
    },
  });

  const onSubmit = async (_values: ProductAddFormValues) => {
    const product: Partial<Product> = {
      title: _values.name,
      brand: _values.brand,
      category: _values.category,
      description: _values.description,
      tags: _values.tags
        ? _values.tags.split(",").map((str) => str.trim())
        : [],
      price: Math.round(parseFloat(_values.price) * 100) / 100,
      discountPercentage: _values.discountPercentage
        ? Math.round(parseFloat(_values.discountPercentage) * 100) / 100
        : undefined,
      stock: _values.stock ? Math.floor(parseFloat(_values.stock)) : undefined,
      minimumOrderQuantity: _values.minimumOrderQuantity
        ? Math.floor(parseFloat(_values.minimumOrderQuantity))
        : undefined,
      sku: _values.sku,
      weight: _values.weight
        ? Math.round(parseFloat(_values.weight) * 100) / 100
        : undefined,
    };

    try {
      setLoading(true);
      await createProduct(product);
      setLoading(false);
      toast.success(
        `Created ${product.title}. NOTE: THIS IS ONLY A MOCK. NO ACTUAL DATA IS CREATED ON SERVER.`,
      );
      navigate("/dashboard/products", { replace: true });
    } catch (error) {
      setLoading(false);
      toast.error(
        (error as unknown as GenericErrorResponse).errorMsg ??
          "Some error happened.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Add a new product</h1>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/dashboard/products")}
        >
          Cancel
        </Button>
      </div>

      <Alert>
        <InfoIcon />
        <AlertTitle>Demo Purposes Only</AlertTitle>
        <AlertDescription>
          This is not all of the available fields on "Product".
        </AlertDescription>
      </Alert>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <section className="bg-card flex flex-col gap-5 rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Basics</h2>

          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Name *</FieldLabel>
            <Input
              id="name"
              placeholder="e.g. Essence Mascara Lash Princess"
              aria-invalid={!!errors.name}
              {...register("name", {
                required: "Name is required",
                maxLength: {
                  value: 100,
                  message: "Name must be 100 characters or fewer",
                },
              })}
            />
            <FieldError errors={errors.name ? [errors.name] : undefined} />
          </Field>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="brand">Brand</FieldLabel>
              <Input id="brand" placeholder="Essence" {...register("brand")} />
            </Field>

            <Field data-invalid={!!errors.category}>
              <FieldLabel htmlFor="category">Category *</FieldLabel>
              <Controller
                control={control}
                name="category"
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="category"
                      aria-invalid={!!errors.category}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 &&
                        CATEGORIES_FALLBACK.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      {categories.length > 0 &&
                        categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError
                errors={errors.category ? [errors.category] : undefined}
              />
            </Field>
          </div>

          <Field data-invalid={!!errors.description}>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              rows={4}
              placeholder="What is this product? Who is it for?"
              aria-invalid={!!errors.description}
              {...register("description", {
                maxLength: {
                  value: 1000,
                  message: "Description must be 1000 characters or fewer",
                },
              })}
            />
            <FieldError
              errors={errors.description ? [errors.description] : undefined}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="tags">Tags</FieldLabel>
            <Input id="tags" placeholder="beauty," {...register("tags")} />
          </Field>
        </section>

        <section className="bg-card flex flex-col gap-5 rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Pricing & stock</h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field data-invalid={!!errors.price}>
              <FieldLabel htmlFor="price">Price (USD) *</FieldLabel>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="9.99"
                aria-invalid={!!errors.price}
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be 0 or greater" },
                })}
              />
              <FieldError errors={errors.price ? [errors.price] : undefined} />
            </Field>

            <Field data-invalid={!!errors.discountPercentage}>
              <FieldLabel htmlFor="discountPercentage">Discount %</FieldLabel>
              <Input
                id="discountPercentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="7.17"
                aria-invalid={!!errors.discountPercentage}
                {...register("discountPercentage", {
                  min: { value: 0, message: "Discount must be 0 or greater" },
                  max: { value: 100, message: "Discount must be 100 or less" },
                })}
              />
              <FieldError
                errors={
                  errors.discountPercentage
                    ? [errors.discountPercentage]
                    : undefined
                }
              />
            </Field>

            <Field data-invalid={!!errors.stock}>
              <FieldLabel htmlFor="stock">Stock</FieldLabel>
              <Input
                id="stock"
                type="number"
                min="0"
                placeholder="100"
                aria-invalid={!!errors.stock}
                {...register("stock", {
                  min: { value: 0, message: "Stock must be 0 or greater" },
                })}
              />
              <FieldError errors={errors.stock ? [errors.stock] : undefined} />
            </Field>

            <Field data-invalid={!!errors.minimumOrderQuantity}>
              <FieldLabel htmlFor="minimumOrderQuantity">
                Min. order qty
              </FieldLabel>
              <Input
                id="minimumOrderQuantity"
                type="number"
                min="1"
                placeholder="1"
                aria-invalid={!!errors.minimumOrderQuantity}
                {...register("minimumOrderQuantity", {
                  min: {
                    value: 1,
                    message: "Minimum order quantity must be at least 1",
                  },
                })}
              />
              <FieldError
                errors={
                  errors.minimumOrderQuantity
                    ? [errors.minimumOrderQuantity]
                    : undefined
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="sku">SKU</FieldLabel>
              <Input
                id="sku"
                placeholder="Auto-generated if blank"
                {...register("sku")}
              />
            </Field>

            <Field data-invalid={!!errors.weight}>
              <FieldLabel htmlFor="weight">Weight (kg)</FieldLabel>
              <Input
                id="weight"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.5"
                aria-invalid={!!errors.weight}
                {...register("weight", {
                  min: { value: 0, message: "Weight must be 0 or greater" },
                })}
              />
              <FieldError
                errors={errors.weight ? [errors.weight] : undefined}
              />
            </Field>
          </div>
        </section>

        <div className="flex flex-col items-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            <Check />
            {isSubmitting ? "Creating…" : "Create product"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProductAddSection;
