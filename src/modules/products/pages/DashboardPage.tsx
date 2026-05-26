import { useAuthService } from "@/modules/auth/services/useAuthService";
import { useAuthStore } from "@/modules/auth/stores/useAuthStore";
import Navbar from "@/modules/core/components/Navbar";
import Sidebar from "@/modules/core/components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function DashboardPage({ children }: { children: React.ReactNode }) {
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
      <div className="flex min-h-full flex-1 flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

export default DashboardPage;
