"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layouts/Home";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import HomePage from "@/components/pages/Home";
import { authService } from "@/services/auth";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authenticated = await authService.checkAuth();
        setIsAuthenticated(authenticated);

        if (!authenticated) {
          router.push("/auth/sign-in");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth/sign-in");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Listen to auth state changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange((user) => {
      if (!user) {
        setIsAuthenticated(false);
        router.push("/auth/sign-in");
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loader-3d mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <Layout>
          <HomePage />
        </Layout>
      </div>
    </div>
  );
}
