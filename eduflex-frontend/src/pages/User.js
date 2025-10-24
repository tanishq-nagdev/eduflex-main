// src/pages/User.js
import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { useApp } from "../contexts/AppContext";
import profilePic from "../assets/Profile.jpg";

function User() {
  const { courses, assignments, grades, loading } = useApp();
  const [activeTab, setActiveTab] = useState("overview"); // overview, progress, achievements, settings

  // Real user statistics from global state
  const userStats = {
    totalCourses: courses.filter(c => c.enrolled).length,
    completedCourses: courses.filter(c => c.enrolled && c.progress === 100).length,
    totalAssignments: assignments.length,
    pendingAssignments: assignments.filter(a => a.status === 'pending').length,
    completedAssignments: assignments.filter(a => a.status === 'graded' || a.status === 'submitted').length,
    averageGrade: grades.length > 0 ? (grades.reduce((acc, grade) => {
      const numGrade = grade.score.replace('%', '');
      return acc + parseInt(numGrade);
    }, 0) / grades.length).toFixed(1) : 0,
    overallProgress: courses.filter(c => c.enrolled).length > 0 ? 
      Math.round(courses.filter(c => c.enrolled).reduce((acc, course) => acc + course.progress, 0) / courses.filter(c => c.enrolled).length) : 0
  };

  // Real user data
  const user = {
    name: "Aditya Choudhary",
    year: "3rd Year, Computer Engineering",
    email: "aditya@eduflex.com",
    studentId: "CE2022001",
    profilePic: profilePic,
    joinDate: "2022-08-15"
  };

  // Real progress data for pie chart
  const progressData = [
    { name: "Completed", value: userStats.overallProgress },
    { name: "Remaining", value: 100 - userStats.overallProgress },
  ];

  // Course progress data for bar chart
  const courseProgressData = courses.filter(c => c.enrolled).map(course => ({
    name: course.title.split(' ').slice(0, 2).join(' '), // Shorten names
    progress: course.progress
  }));

  // Grade distribution for pie chart
  const gradeDistribution = grades.reduce((acc, grade) => {
    const letter = grade.grade.charAt(0); // Get A, B, C, etc.
    acc[letter] = (acc[letter] || 0) + 1;
    return acc;
  }, {});

  const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    name: `${grade} Grade`,
    value: count
  }));

  const COLORS = ["#28a745", "#17a2b8", "#ffc107", "#dc3545", "#6f42c1"];

  // Real pending assignments from global state
  const pendingAssignmentsList = assignments.filter(a => a.status === 'pending');

  // Calculate achievements
  const achievements = [
    {
      id: 1,
      title: "Course Enrollee",
      description: "Enrolled in your first course",
      icon: "📚",
      earned: userStats.totalCourses > 0,
      earnedDate: "2022-08-20"
    },
    {
      id: 2,
      title: "Assignment Master",
      description: "Completed 5+ assignments",
      icon: "📝",
      earned: userStats.completedAssignments >= 5,
      earnedDate: userStats.completedAssignments >= 5 ? "2023-01-15" : null
    },
    {
      id: 3,
      title: "High Achiever",
      description: "Maintained average above 85%",
      icon: "🎯",
      earned: userStats.averageGrade >= 85,
      earnedDate: userStats.averageGrade >= 85 ? "2023-02-15" : null
    },
    {
      id: 4,
      title: "Course Completer",
      description: "Completed your first course",
      icon: "🏆",
      earned: userStats.completedCourses > 0,
      earnedDate: userStats.completedCourses > 0 ? "2023-03-01" : null
    }
  ];

  if (loading) {
    return (
      <div style={{ padding: "2rem", marginLeft: "5rem", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f4f6",
            borderTop: "4px solid #28a745",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }}></div>
          <p>Loading profile...</p>
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
    <div style={{ padding: "2rem", marginLeft: "5rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>
        User Profile
      </h1>

      {/* Enhanced Profile Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "2rem",
          background: "linear-gradient(135deg, #28a745, #20c997)",
          color: "white",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 8px 20px rgba(40,167,69,0.3)",
        }}
      >
        <img
          src={user.profilePic}
          alt="Profile"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            marginRight: "2rem",
            border: "4px solid white",
            objectFit: "cover"
          }}
        />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "0.5rem" }}>
            {user.name}
          </h2>
          <p style={{ fontSize: "1.1rem", opacity: 0.9, marginBottom: "0.5rem" }}>
            {user.year}
          </p>
          <p style={{ fontSize: "0.9rem", opacity: 0.8, marginBottom: "1rem" }}>
            Student ID: {user.studentId} • Joined {new Date(user.joinDate).toLocaleDateString()}
          </p>
          
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{userStats.totalCourses}</div>
              <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>Enrolled Courses</div>
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{userStats.pendingAssignments}</div>
              <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>Pending Assignments</div>
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{userStats.averageGrade}%</div>
              <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>Average Grade</div>
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{userStats.overallProgress}%</div>
              <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>Overall Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: "flex", 
        gap: "0.5rem", 
        marginBottom: "2rem",
        borderBottom: "2px solid #f3f4f6"
      }}>
        {[
          { key: "overview", label: "Overview", icon: "📊" },
          { key: "progress", label: "Detailed Progress", icon: "📈" },
          { key: "achievements", label: "Achievements", icon: "🏆" },
          { key: "settings", label: "Settings", icon: "⚙️" }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "1rem 1.5rem",
              border: "none",
              background: activeTab === tab.key ? "#28a745" : "transparent",
              color: activeTab === tab.key ? "white" : "#666",
              borderRadius: "0.5rem 0.5rem 0 0",
              fontSize: "0.9rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <>
          {/* Charts + Assignments Row */}
          <div
            style={{
              display: "flex",
              gap: "2rem",
              marginBottom: "2rem",
              flexWrap: "wrap",
            }}
          >
            {/* Progress Overview Pie Chart */}
            <div
              style={{
                flex: 1,
                minWidth: "300px",
                background: "#fff",
                padding: "1.5rem",
                borderRadius: "1rem",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginBottom: "1rem", color: "#28a745" }}>Overall Progress</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Pending Assignments */}
            <div
              style={{
                flex: 1,
                minWidth: "300px",
                background: "#fff",
                padding: "1.5rem",
                borderRadius: "1rem",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginBottom: "1rem", color: "#dc3545" }}>
                Pending Assignments ({userStats.pendingAssignments})
              </h3>
              {pendingAssignmentsList.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#28a745" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
                  <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>No pending assignments!</p>
                  <p style={{ color: "#666" }}>Great job staying on top of your work!</p>
                </div>
              ) : (
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {pendingAssignmentsList.map((assignment, index) => (
                    <div
                      key={assignment.id}
                      style={{
                        padding: "1rem",
                        marginBottom: "0.8rem",
                        background: "#fff3cd",
                        border: "1px solid #ffeaa7",
                        borderRadius: "0.5rem",
                        borderLeft: "4px solid #ffc107"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <strong style={{ color: "#856404" }}>{assignment.title}</strong>
                          <p style={{ margin: "0.25rem 0", color: "#856404", fontSize: "0.9rem" }}>
                            Course: {assignment.course}
                          </p>
                          <p style={{ margin: 0, color: "#dc3545", fontSize: "0.85rem", fontWeight: "500" }}>
                            Due: {new Date(assignment.due).toLocaleDateString()}
                          </p>
                        </div>
                        <span style={{
                          background: "#ffc107",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "1rem",
                          fontSize: "0.75rem",
                          fontWeight: "500"
                        }}>
                          ⏳ PENDING
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enrolled Courses */}
          <div
            style={{
              background: "#fff",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#17a2b8" }}>
              Enrolled Courses ({userStats.totalCourses})
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
              {courses.filter(c => c.enrolled).map((course, index) => (
                <div
                  key={course.id}
                  style={{
                    padding: "1rem",
                    background: course.progress === 100 ? "#d4edda" : "#e2e3e5",
                    border: `2px solid ${course.progress === 100 ? "#28a745" : "#6c757d"}`,
                    borderRadius: "0.5rem",
                    transition: "transform 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div>
                      <strong style={{ color: course.progress === 100 ? "#155724" : "#495057" }}>
                        {course.title}
                      </strong>
                      <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#6c757d" }}>
                        {course.instructor}
                      </p>
                    </div>
                    <span style={{
                      background: course.progress === 100 ? "#28a745" : "#ffc107",
                      color: "white",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      fontSize: "0.8rem",
                      fontWeight: "600"
                    }}>
                      {course.progress}%
                    </span>
                  </div>
                  
                  <div style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#e9ecef",
                    borderRadius: "4px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${course.progress}%`,
                      height: "100%",
                      backgroundColor: course.progress === 100 ? "#28a745" : "#ffc107",
                      transition: "width 0.3s ease"
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Detailed Progress Tab */}
      {activeTab === "progress" && (
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          {/* Course Progress Bar Chart */}
          <div style={{
            flex: 1,
            minWidth: "400px",
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "1rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ marginBottom: "1rem", color: "#17a2b8" }}>Course Progress Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseProgressData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="progress" fill="#17a2b8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Grade Distribution */}
          {gradeData.length > 0 && (
            <div style={{
              flex: 1,
              minWidth: "300px",
              background: "#fff",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ marginBottom: "1rem", color: "#6f42c1" }}>Grade Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {gradeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              style={{
                background: achievement.earned ? "#d4edda" : "#f8f9fa",
                border: achievement.earned ? "2px solid #28a745" : "2px solid #dee2e6",
                padding: "1.5rem",
                borderRadius: "1rem",
                opacity: achievement.earned ? 1 : 0.6,
                transition: "all 0.3s"
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem", textAlign: "center" }}>
                {achievement.icon}
              </div>
              
              <h4 style={{ 
                margin: "0 0 0.5rem 0", 
                fontSize: "1.2rem", 
                fontWeight: "600",
                color: achievement.earned ? "#155724" : "#6c757d",
                textAlign: "center"
              }}>
                {achievement.title}
              </h4>
              
              <p style={{ 
                margin: "0 0 1rem 0", 
                fontSize: "0.9rem", 
                color: achievement.earned ? "#495057" : "#adb5bd",
                textAlign: "center"
              }}>
                {achievement.description}
              </p>
              
              <div style={{ textAlign: "center" }}>
                {achievement.earned ? (
                  <div style={{
                    background: "#28a745",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "1rem",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    display: "inline-block"
                  }}>
                    ✓ Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                  </div>
                ) : (
                  <div style={{
                    background: "#6c757d",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "1rem",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    display: "inline-block"
                  }}>
                    Not yet earned
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "1rem", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginBottom: "2rem", fontSize: "1.5rem", fontWeight: "600", color: "#495057" }}>
            Account Settings
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {/* Profile Information */}
            <div>
              <h4 style={{ marginBottom: "1rem", color: "#28a745" }}>Profile Information</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontWeight: "500", marginBottom: "0.5rem" }}>Name</label>
                  <input type="text" value={user.name} disabled style={{
                    width: "100%", padding: "0.75rem", border: "1px solid #ced4da",
                    borderRadius: "0.375rem", background: "#f8f9fa"
                  }} />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: "500", marginBottom: "0.5rem" }}>Email</label>
                  <input type="email" value={user.email} disabled style={{
                    width: "100%", padding: "0.75rem", border: "1px solid #ced4da",
                    borderRadius: "0.375rem", background: "#f8f9fa"
                  }} />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h4 style={{ marginBottom: "1rem", color: "#17a2b8" }}>Notifications</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input type="checkbox" defaultChecked />
                  <span>Assignment due date reminders</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input type="checkbox" defaultChecked />
                  <span>Grade notifications</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input type="checkbox" />
                  <span>Course announcements</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
