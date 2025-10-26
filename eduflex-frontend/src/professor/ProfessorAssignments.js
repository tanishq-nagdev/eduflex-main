import { useApp } from "../contexts/AppContext";
import { Link } from "react-router-dom";

export default function ProfessorAssignments() {
  const { assignments, courses, user } = useApp();

  // Get courses taught by this professor
  const myCourseIds = courses.filter(c => c.ownerId === user.id).map(c => c.id);
  const myAssignments = assignments.filter(a => myCourseIds.includes(a.courseId));

  return (
    <div style={{ padding: "2rem", minHeight: "100vh" }}>
      <h2 style={{ fontWeight: "bold", fontSize: "2rem", marginBottom: "1.5rem" }}>My Assignments</h2>

      {myAssignments.length === 0 ? (
        <p>No assignments found. Create one for your course!</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          {myAssignments.map(a => {
            // Submission stats (assuming submissions array present as in previous messages)
            const total = a.submissions ? a.submissions.length : 0;
            const graded = a.submissions ? a.submissions.filter(sub => sub.graded).length : 0;
            const submitted = a.submissions ? a.submissions.filter(sub => sub.status === "submitted").length : 0;

            return (
              <div key={a.id}
                style={{
                  background: "#e0e7ff",
                  borderRadius: "1rem",
                  padding: "1.2rem 1.5rem",
                  minWidth: 320,
                  boxShadow: "0 4px 12px #c7d2fe55"
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#3730a3", marginBottom: 6 }}>
                  {a.title} <span style={{ color: "#6d28d9", fontWeight: 400 }}>({a.course})</span>
                </div>
                <div style={{ fontSize: ".97rem", color: "#555", marginBottom: 7 }}>{a.instructions}</div>
                <div style={{ fontSize: ".96rem" }}>
                  <span style={{ color: "#eab308" }}>Due: {new Date(a.due).toLocaleDateString()}</span>
                </div>
                <div style={{ margin: "1rem 0 0.7rem 0", fontSize: ".93rem", color: "#475569" }}>
                  <strong>Submissions:</strong> {submitted} &nbsp;|&nbsp;
                  <strong>Graded:</strong> {graded}
                </div>
                <Link
                  to={`/professor/assignments/${a.id}`}
                  style={{
                    background: "#6366f1",
                    color: "#fff",
                    borderRadius: "7px",
                    padding: "0.6rem 1.25rem",
                    fontWeight: 600,
                    fontSize: ".97rem",
                    textDecoration: "none",
                    display: "inline-block",
                    marginTop: "0.3rem"
                  }}>
                  View Submissions
                </Link>
              </div>
            );
          })}
        </div>
      )}
      {/* Add "Create Assignment" button here in the future */}
    </div>
  );
}
