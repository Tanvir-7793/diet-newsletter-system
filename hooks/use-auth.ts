"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        // This would typically be an API call to verify session
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // This would typically be an API call
      const mockUser: User = {
        id: "1",
        email,
        name: "John Doe",
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
