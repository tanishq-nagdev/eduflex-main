"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen } from "lucide-react";
import UsersList from "@/components/admin/UsersList";
import CoursesList from "@/components/admin/CoursesList";
import api from "@/lib/api";

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalCourses: 0,
  });

  const [selectedView, setSelectedView] = useState<"teachers" | "students" | "all" | "courses" | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === "admin") {
      const fetchOverview = async () => {
        try {
          const { data } = await api.get("/admin/overview");
          setStats(data);
        } catch (err) {
          console.error("Dashboard Overview Error:", err);
        }
      };
      fetchOverview();
    }
  }, [user]);

  if (isLoading || !user) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const renderContent = () => {
    switch (selectedView) {
      case "teachers": return <UsersList role="teacher" />;
      case "students": return <UsersList role="student" />;
      case "all": return <UsersList />;
      case "courses": return <CoursesList />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <Card onClick={() => setSelectedView("teachers")} className="cursor-pointer">
              <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-4 w-4" /> Teachers</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.totalTeachers}</div></CardContent>
            </Card>

            <Card onClick={() => setSelectedView("students")} className="cursor-pointer">
              <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-4 w-4" /> Students</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.totalStudents}</div></CardContent>
            </Card>

            <Card onClick={() => setSelectedView("all")} className="cursor-pointer">
              <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-4 w-4" /> Total Users</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.totalUsers}</div></CardContent>
            </Card>

            <Card onClick={() => setSelectedView("courses")} className="cursor-pointer">
              <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Courses</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.totalCourses}</div></CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8">{renderContent()}</main>
    </div>
  );
}
