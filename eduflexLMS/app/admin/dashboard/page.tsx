"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen } from "lucide-react";
import UsersList from "@/components/admin/UsersList";
import CoursesList from "@/components/admin/CoursesList";
import api from "@/lib/api";

type View = "overview" | "teachers" | "students" | "users" | "courses";

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalCourses: 0,
  });
  const [selectedView, setSelectedView] = useState<View>("overview");
  const [filterRole, setFilterRole] = useState<string | undefined>();

  // --- LOGIN CHECK ---
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // --- FETCH DASHBOARD STATS ---
  useEffect(() => {
    if (user?.role === "admin") {
      const fetchStats = async () => {
        try {
          const { data } = await api.get("/admin/overview");
          setStats(data);
        } catch (err) {
          console.error("Dashboard Overview Error:", err);
        }
      };
      fetchStats();
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // --- RENDER TABLES OR OVERVIEW ---
  const renderContent = () => {
    switch (selectedView) {
      case "teachers":
        return <UsersList role="teacher" />;
      case "students":
        return <UsersList role="student" />;
      case "users":
        return <UsersList />;
      case "courses":
        return <CoursesList />;
      default:
        return (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card
                onClick={() => setSelectedView("users")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </CardContent>
              </Card>

              <Card
                onClick={() => setSelectedView("courses")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Total Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCourses}</div>
                </CardContent>
              </Card>

              <Card
                onClick={() => setSelectedView("teachers")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Teachers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTeachers}</div>
                </CardContent>
              </Card>

              <Card
                onClick={() => setSelectedView("students")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents}</div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                className="w-full border border-primary"
                onClick={() => router.push("/admin/create-user")}
              >
                Create New User
              </Button>
              <Button
                className="w-full border border-primary"
                onClick={() => router.push("/admin/create-course")}
              >
                Create New Course
              </Button>
              <Button
                variant="outline"
                className="w-full border border-primary"
                onClick={() => setSelectedView("users")}
              >
                Manage Users
              </Button>
              <Button
                variant="outline"
                className="w-full border border-primary"
              >
                System Settings
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {selectedView !== "overview" && (
          <Button
            onClick={() => setSelectedView("overview")}
            className="mb-4 border border-primary"
          >
            Back to Overview
          </Button>
        )}
        {renderContent()}
      </main>
    </div>
  );
}
