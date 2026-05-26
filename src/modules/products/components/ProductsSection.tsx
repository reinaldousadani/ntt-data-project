import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/modules/core/components/ui/button";
import { Input } from "@/modules/core/components/ui/input";

function ProductsSection() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input type="search" placeholder="Search" className="w-64 pl-8" />
          </div>
          <Button onClick={() => navigate("/dashboard/products/add")}>
            <Plus />
            Add Product
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductsSection;
