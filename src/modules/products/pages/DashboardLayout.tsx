import { useAuthService } from "@/modules/auth/services/useAuthService";
import { useAuthStore } from "@/modules/auth/stores/useAuthStore";
import Navbar from "@/modules/core/components/Navbar";
import Sidebar from "@/modules/core/components/Sidebar";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

function DashboardLayout() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const { getProfile } = useAuthService();
  const [initLoading, setInitLoading] = useState(true);

  // Auth Guard
  useEffect(() => {
    getProfile()
      .then((profile) => {
        setUser(profile);
      })
      .catch(() => {
        navigate("/", { replace: true });
      })
      .finally(() => {
        setInitLoading(false);
      });
  }, []);

  if (initLoading) return null;

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col">
        <Navbar />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
