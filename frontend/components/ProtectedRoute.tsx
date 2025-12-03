"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.replace("/dashboard");
      } else {
        setChecking(false); // allowed → stop loading
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  // ยังโหลด auth อยู่ หรือกำลังเช็คสิทธิ์
  if (isLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
