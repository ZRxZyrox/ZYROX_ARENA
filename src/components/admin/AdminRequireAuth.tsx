import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { adminApi } from "@/lib/admin-api";

export default function AdminRequireAuth({ children }: { children: ReactNode }) {
  const [state, setState] = useState<"checking" | "authed" | "denied">(() => {
    return adminApi.getSession() ? "authed" : "denied";
  });

  useEffect(() => {
    adminApi
      .me()
      .then(() => setState("authed"))
      .catch(() => setState("denied"));
  }, []);

  if (state === "denied") {
    const adminPath = import.meta.env.VITE_ADMIN_PATH || "control-panel-dev";
    return <Navigate to={`/${adminPath}/login`} replace />;
  }

  return <>{children}</>;
}
