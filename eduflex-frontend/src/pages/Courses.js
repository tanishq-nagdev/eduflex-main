import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import SearchIcon from "../assets/search.svg";

function Courses() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, enrolled, available
  const { courses, updateCourseProgress, loading } = useApp();

  // Filter courses based on enrollment and search
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                         (filter === "enrolled" && course.enrolled) ||
                         (filter === "available" && !course.enrolled);
    
    return matchesSearch && matchesFilter;
  });

  // Handle enrollment toggle
  const handleEnrollment = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      course.enrolled = !course.enrolled;
      if (!course.enrolled) {
        course.progress = 0; // Reset progress when unenrolling
      }
      updateCourseProgress(courseId, course.progress);
    }
  };

  // Handle progress update
  const handleProgressUpdate = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    if (course && course.enrolled) {
      const newProgress = Math.min(course.progress + 10, 100);
      updateCourseProgress(courseId, newProgress);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", marginLeft: "64px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f4f6",
            borderTop: "4px solid #22c55e",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }}></div>
          <p>Loading courses...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", marginLeft: "64px", minHeight: "100vh" }}>
      {/* Header */}
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
        Courses
      </h1>
      <p style={{ fontSize: "1rem", color: "#555", marginBottom: "1.5rem" }}>
        Browse all available courses. Use the search bar to quickly find what you need.
      </p>

      {/* Stats Cards */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ 
          background: "linear-gradient(135deg, #22c55e, #16a34a)", 
          color: "white", 
          padding: "1rem", 
          borderRadius: "0.5rem",
          minWidth: "120px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {courses.filter(c => c.enrolled).length}
          </div>
          <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>Enrolled</div>
        </div>
        
        <div style={{ 
          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", 
          color: "white", 
          padding: "1rem", 
          borderRadius: "0.5rem",
          minWidth: "120px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {courses.filter(c => !c.enrolled).length}
          </div>
          <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>Available</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap" }}>
        {/* Search Bar */}
        <div style={{ position: "relative", width: "350px" }}>
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "0.6rem 1rem 0.6rem 2.5rem",
              width: "100%",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <img
            src={SearchIcon}
            alt="Search"
            style={{
              position: "absolute",
              left: "0.8rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: "1rem",
              height: "1rem",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Filter Buttons */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[
            { key: "all", label: "All", color: "#6b7280" },
            { key: "enrolled", label: "My Courses", color: "#22c55e" },
            { key: "available", label: "Available", color: "#3b82f6" }
          ].map(filterOption => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "none",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                background: filter === filterOption.key ? filterOption.color : "#f3f4f6",
                color: filter === filterOption.key ? "white" : "#374151",
                transition: "all 0.2s ease"
              }}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              style={{
                width: "280px",
                background: "#fff",
                borderRadius: "1rem",
                overflow: "hidden",
                boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                transition: "transform 0.3s ease",
                cursor: "pointer",
                border: course.enrolled ? "3px solid #22c55e" : "3px solid transparent",
                position: "relative"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {/* Enrollment Badge */}
              {course.enrolled && (
                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "#22c55e",
                  color: "white",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "1rem",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  zIndex: 1
                }}>
                  ✓ Enrolled
                </div>
              )}

              <img
                src={course.image}
                alt={course.title}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                }}
              />
              
              <div style={{ padding: "1rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                  {course.title}
                </h2>
                <p style={{ fontSize: "0.9rem", color: "#555", marginBottom: "0.5rem" }}>
                  {course.description}
                </p>
                <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "#777", marginBottom: "0.8rem" }}>
                  Instructor: {course.instructor}
                </p>

                {/* Progress Bar for Enrolled Courses */}
                {course.enrolled && (
                  <div style={{ marginBottom: "0.8rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "#666" }}>Progress</span>
                      <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#22c55e" }}>{course.progress}%</span>
                    </div>
                    <div style={{
                      width: "100%",
                      height: "6px",
                      backgroundColor: "#e5e7eb",
                      borderRadius: "3px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${course.progress}%`,
                        height: "100%",
                        backgroundColor: "#22c55e",
                        transition: "width 0.3s ease"
                      }} />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleEnrollment(course.id)}
                    style={{
                      flex: "1",
                      padding: "0.5rem 1rem",
                      border: "none",
                      borderRadius: "0.5rem",
                      backgroundColor: course.enrolled ? "#ef4444" : "#22c55e",
                      color: "#fff",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "background 0.3s",
                      fontSize: "0.9rem"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = course.enrolled ? "#dc2626" : "#16a34a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = course.enrolled ? "#ef4444" : "#22c55e";
                    }}
                  >
                    {course.enrolled ? "Unenroll" : "Enroll"}
                  </button>

                  {/* Progress Button for Enrolled Courses */}
                  {course.enrolled && course.progress < 100 && (
                    <button
                      onClick={() => handleProgressUpdate(course.id)}
                      style={{
                        padding: "0.5rem 0.8rem",
                        border: "2px solid #22c55e",
                        borderRadius: "0.5rem",
                        backgroundColor: "white",
                        color: "#22c55e",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        fontSize: "0.8rem"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#22c55e";
                        e.target.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "white";
                        e.target.style.color = "#22c55e";
                      }}
                    >
                      +10%
                    </button>
                  )}

                  {/* Completed Badge */}
                  {course.enrolled && course.progress === 100 && (
                    <div style={{
                      padding: "0.5rem 0.8rem",
                      borderRadius: "0.5rem",
                      backgroundColor: "#fbbf24",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "0.8rem",
                      textAlign: "center"
                    }}>
                      🎉 Done!
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ fontSize: "1rem", color: "#999" }}>No courses found.</p>
        )}
      </div>
    </div>
  );
}

export default Courses;
