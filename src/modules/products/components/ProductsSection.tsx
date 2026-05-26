import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/modules/core/components/ui/button";
import { Input } from "@/modules/core/components/ui/input";
import { useEffect, useState } from "react";
import { useProductsService, PAGE_SIZE } from "../services/useProductsService";
import ProductCard from "./ProductCard";
import { useProductsStore } from "../stores/useProductsStore";
import { toast } from "sonner";
import type { GenericErrorResponse } from "@/modules/core/services/api";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/modules/core/components/ui/pagination";
import { cn } from "@/modules/lib/utils";

function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const items: (number | "ellipsis")[] = [1];
  if (current > 3) items.push("ellipsis");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) items.push(i);
  if (current < total - 2) items.push("ellipsis");
  items.push(total);
  return items;
}

function ProductsSection() {
  const navigate = useNavigate();
  const { getProducts } = useProductsService();
  const {
    currentProducts,
    setAvailableItemsCount,
    availableItemsCount,
    resetAll,
    currentPage,
    currentQuery,
    setProducts,
    setParams,
  } = useProductsStore();

  const [searchInput, setSearchInput] = useState("");

  const totalPages = Math.ceil(availableItemsCount / PAGE_SIZE);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setParams(page, currentQuery);
  };

  useEffect(() => {
    // Debounced search
    const timer = setTimeout(() => {
        setParams(1, searchInput);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    // Reset products store.
    resetAll();
  }, []);

  useEffect(() => {
    getProducts({ query: currentQuery, page: currentPage })
      .then((res) => {
        setAvailableItemsCount(res.total);
        setProducts(res.products);
      })
      .catch((err) => {
        toast.error(
          (err as unknown as GenericErrorResponse).errorMsg ??
            "Some error happened.",
        );
      });
  }, [currentQuery, currentPage]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              type="search"
              placeholder="Search"
              className="w-64 pl-8"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button onClick={() => navigate("/dashboard/products/add")}>
            <Plus />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={currentPage === 1}
                className={cn(
                  currentPage === 1 && "pointer-events-none opacity-50",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(currentPage - 1);
                }}
              />
            </PaginationItem>

            {getPageItems(currentPage, totalPages).map((item, index) =>
              item === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    href="#"
                    isActive={item === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(item);
                    }}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={currentPage === totalPages}
                className={cn(
                  currentPage === totalPages &&
                    "pointer-events-none opacity-50",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default ProductsSection;
