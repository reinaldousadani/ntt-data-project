import { Package, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/modules/auth/stores/useAuthStore";
import { Button } from "@/modules/core/components/ui/button";

function WelcomeSection() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col p-4">
      <div className="bg-primary relative overflow-hidden rounded-xl px-8 py-10">
        <div
          aria-hidden
          className="bg-accent/35 pointer-events-none absolute -top-24 -right-24 size-80 rounded-full blur-3xl"
        />
        <div className="relative flex flex-col gap-5 text-white">
          <h1 className="max-w-2xl text-3xl leading-tight font-bold text-balance md:text-4xl">
            Hi {user?.firstName ?? "there"} — welcome back!
          </h1>
          <p className="max-w-xl text-sm text-white/70">
            What do you want to do today?
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              variant="ghost"
              className="border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              onClick={() => navigate("/dashboard/products")}
            >
              <Package />
              Browse products
            </Button>
            <Button
              variant="ghost"
              className="border border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white"
              onClick={() => navigate("/dashboard/products")}
            >
              <Plus />
              Add a product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
