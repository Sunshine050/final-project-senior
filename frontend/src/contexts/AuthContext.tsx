"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { User, Role } from "@/types";
import { initSocket, disconnectSocket } from "@/lib/socket";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const profile = await api.getProfile();
          setUser(profile);
          // Initialize WebSocket if user is authenticated
          initSocket(token);
        } catch (error) {
          localStorage.removeItem("access_token");
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    localStorage.setItem("access_token", response.accessToken);
    setUser(response.user);
    
    // Initialize WebSocket
    initSocket(response.accessToken);
    
    // Redirect based on role
    const role = response.user.role;
    if (role === Role.DISPATCHER) {
      router.push("/dashboard/dispatcher");
    } else if (role === Role.HOSPITAL_STAFF) {
      router.push("/dashboard/hospital");
    } else if (role === Role.RESCUE_TEAM) {
      router.push("/dashboard/rescue");
    } else if (role === Role.ADMIN) {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard");
    }
  };

  const logout = () => {
    disconnectSocket();
    localStorage.removeItem("access_token");
    setUser(null);
    router.push("/login");
  };

  const refreshProfile = async () => {
    try {
      const profile = await api.getProfile();
      setUser(profile);
    } catch (error) {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

