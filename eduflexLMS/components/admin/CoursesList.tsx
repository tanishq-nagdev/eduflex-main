"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function CoursesList() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/admin/courses");
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/admin/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Button
        onClick={() => (window.location.href = "/admin/create-course")}
        className="mb-4 border border-primary"
      >
        Create Course
      </Button>
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>{course.teacher?.name ?? "N/A"}</TableCell>
                <TableCell className="flex gap-2">
                  <Button onClick={() => alert("Edit functionality")}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(course._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
