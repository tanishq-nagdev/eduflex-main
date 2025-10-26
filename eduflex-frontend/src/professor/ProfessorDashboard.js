import { useApp } from "../contexts/AppContext";

export default function ProfessorDashboard() {
  const { user, courses, assignments, loading } = useApp();

  // Show loading or redirect if not logged in as professor
  if (loading || !user || user.role !== "professor") {
    return (
      <div style={{ padding: "2rem", textAlign: "center", fontSize: "1.4rem" }}>
        Loading dashboard...
      </div>
    );
  }

  const myCourses = courses.filter(c => c.ownerId === user.id);
  const myAssignments = assignments.filter(a => myCourses.some(c => c.id === a.courseId));
  const submissionsToGrade = myAssignments.filter(a => a.status === "submitted").length;
  const totalStudents = myCourses.reduce((sum) => sum + Math.round(Math.random()*20+10), 0);

  return (
    <div style={{padding: "2rem", minHeight: "100vh"}}>
      <h2 style={{fontWeight: "bold", fontSize: "2rem", marginBottom: "2rem"}}>
        Welcome, {user.name}
      </h2>
      <div style={{
        display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem"
      }}>
        <StatCard title="My Courses" count={myCourses.length} color="#6366f1" icon="📚" />
        <StatCard title="Assignments Created" count={myAssignments.length} color="#f59e42" icon="📝" />
        <StatCard title="Submissions to Grade" count={submissionsToGrade} color="#f43f5e" icon="✅" />
        <StatCard title="Students (approx.)" count={totalStudents} color="#22c55e" icon="👥" />
      </div>
    </div>
  );
}

function StatCard({ title, count, color, icon }) {
  return (
    <div style={{
      flex: "1 1 220px",
      background: color,
      color: "#fff",
      borderRadius: "1rem",
      padding: "1.5rem",
      boxShadow: "0 4px 12px rgba(44,44,44,0.18)",
      display: "flex",
      alignItems: "center",
      minWidth: 180
    }}>
      <span style={{fontSize: "2.2rem", marginRight: "1rem"}}>{icon}</span>
      <div>
        <div style={{fontSize: "2rem", fontWeight: "bold"}}>{count}</div>
        <div style={{fontSize: "1rem", opacity: 0.88}}>{title}</div>
      </div>
    </div>
  );
}
