"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthChange } from "@/lib/auth";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthChange((user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                // Only redirect if we're not on the login page or public pages
                if (pathname !== "/login" && pathname !== "/") {
                    router.push("/login");
                }
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [router, pathname]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-slate-600 font-medium">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // If not authenticated and we're on a protected route, don't render children
    // (the useEffect will handle the redirect)
    if (!isAuthenticated && pathname !== "/login" && pathname !== "/") {
        return null;
    }

    return <>{children}</>;
}
