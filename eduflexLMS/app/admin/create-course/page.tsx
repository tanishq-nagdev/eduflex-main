"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/api";
import { Sidebar } from "@/components/layout/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Teacher {
  _id: string;
  name: string;
  email: string;
}

export default function CreateCoursePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState(""); // selected teacher
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState(""); // for input display & filter
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // --- Redirect if not admin ---
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  // --- Fetch all teachers ---
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data } = await api.get("/admin/users?role=teacher");
        setTeachers(data);
      } catch (err) {
        console.error("Error fetching teachers:", err);
      } finally {
        setLoadingTeachers(false);
      }
    };
    fetchTeachers();
  }, []);

  // --- Handle teacher selection ---
  const handleSelectTeacher = (id: string) => {
    const teacher = teachers.find((t) => t._id === id);
    if (!teacher) return;
    setTeacherId(id);
    setSearch(teacher.name); // display name in input
    setOpenDropdown(false);
  };

  // --- Filter teachers by search term ---
  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
  );

  // --- Submit course ---
  const handleSubmit = async () => {
    if (!title || !description || !teacherId) {
      alert("Please fill all fields and select a teacher");
      return;
    }
    try {
      setSubmitting(true);
      await api.post("/admin/courses", { title, description, teacher: teacherId });
      alert("Course created successfully");
      router.push("/admin/dashboard"); // redirect after creation
    } catch (err: any) {
      console.error("Error creating course:", err);
      alert(err.response?.data?.message || "Failed to create course");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !user || user.role !== "admin") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Create New Course</h1>

        <div className="max-w-md space-y-4">
          <div>
            <label className="block mb-1 font-medium">Course Title</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter course title"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter course description"
            />
          </div>

          <div className="relative">
            <label className="block mb-1 font-medium">Assign Teacher</label>
            <Input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenDropdown(true);
              }}
              placeholder="Search teacher..."
              onFocus={() => setOpenDropdown(true)}
            />
            {openDropdown && (
              <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto border border-gray-300 bg-white rounded shadow-lg">
                {loadingTeachers ? (
                  <div className="p-2 text-sm text-gray-500">Loading...</div>
                ) : filteredTeachers.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">No teachers found</div>
                ) : (
                  filteredTeachers.map((t) => (
                    <div
                      key={t._id}
                      onClick={() => handleSelectTeacher(t._id)}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {t.name} ({t.email})
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-4 w-full"
          >
            {submitting ? "Creating..." : "Create Course"}
          </Button>
        </div>
      </main>
    </div>
  );
}
