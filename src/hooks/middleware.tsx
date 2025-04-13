"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

// Define a more specific prop type if possible, or use a generic fallback
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  redirectPath: string = "/"
) {
  const AuthenticatedComponent: React.FC<P> = (props: P) => {
    const router = useRouter();
    const token = typeof window !== "undefined" ? getCookie("token") : null;

    useEffect(() => {
      if (!token) {
        router.push(redirectPath);
      }
    }, [token, router]);

    if (!token) return null;

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
}
