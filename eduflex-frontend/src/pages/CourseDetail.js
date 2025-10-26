import { useParams, Link } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { FaFilePdf, FaLink, FaCloudDownloadAlt, FaClipboardCheck, FaQuestionCircle, FaCheckCircle } from "react-icons/fa";

export default function CourseDetail() {
  const { courseId } = useParams();
  const { courses, assignments} = useApp();
  const course = courses.find(c => String(c.id) === String(courseId));
  const courseAssignments = assignments.filter(a => a.courseId === course?.id);

  if (!course || !course.enrolled) {
    return <div style={{ padding: "2rem" }}>Course not found or not enrolled.</div>;
  }

  return (
    <div style={{
      padding: "2rem",
      maxWidth: 780,
      margin: "0 auto",
      background: "radial-gradient(circle 600px at 65% 40%, #e0e7ff 0%, #f8fafc 100%)",
      minHeight: "100vh"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "1rem",
        boxShadow: "0 6px 32px #c7d2fe33",
        padding: "2.2rem 2rem",
        marginBottom: "2.5rem"
      }}>
        {/* Course Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: "2.2rem" }}>
          <img
            src={course.image}
            alt={course.title}
            style={{ width: 110, height: 110, objectFit: "cover", borderRadius: "0.8rem", boxShadow: "0 2px 15px #c7d2fe55" }}
          />
          <div>
            <h2 style={{ fontWeight: "bold", fontSize: "2rem", marginBottom: "0.6rem", color: "#3730a3" }}>{course.title}</h2>
            <div style={{ fontSize: "1.1rem", color: "#5c5c81", marginBottom: ".3rem" }}>
              {course.description}
            </div>
            <div style={{ fontSize: ".97rem", color: "#388bb7" }}>
              Instructor: <span style={{ fontWeight: 500 }}>{course.instructor}</span>
            </div>
            <div style={{ fontSize: ".92rem", color: "#aaa", marginTop: "0.18rem" }}>
              Progress: <span style={{ color: "#22c55e", fontWeight: 500 }}>{course.progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Study Materials */}
      <div style={{
        background: "#f9fafb",
        borderRadius: "1rem",
        padding: "1.5rem 2rem",
        marginBottom: "2.2rem",
        boxShadow: "0 2px 18px #cbd5e144"
      }}>
        <h3 style={{ color: "#2563eb", fontWeight: "bold", marginBottom: "1rem" }}>📁 Study Materials</h3>
        {course.materials.length === 0 ? (
          <div style={{ color: "#a6a6a6" }}>No materials uploaded yet.</div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.4rem" }}>
            {course.materials.map(mat => (
              <div key={mat.id} style={{
                minWidth: 220,
                background: "#eef1ff",
                borderRadius: ".6rem",
                padding: "0.9rem 1rem .7rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.7rem"
              }}>
                {mat.type === "pdf"
                  ? <FaFilePdf style={{ color: "#ef4444", fontSize: "1.5rem" }} />
                  : <FaLink style={{ color: "#2563eb", fontSize: "1.4rem" }} />}
                <span style={{ fontWeight: 500 }}>
                  <a href={mat.url} target="_blank" rel="noopener noreferrer" style={{ color: "#3730a3" }}>{mat.title}</a>
                </span>
                <a href={mat.url} target="_blank" rel="noopener noreferrer"
                  style={{ marginLeft: "auto", color: "#0891b2", fontSize: "1.2rem" }}
                  title="Download/Open"
                >
                  <FaCloudDownloadAlt />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assignments */}
      <div style={{
        background: "#fff",
        borderRadius: "1rem",
        padding: "1.5rem 2rem",
        marginBottom: "2.2rem",
        boxShadow: "0 2px 18px #f0faf24c"
      }}>
        <h3 style={{ color: "#16a34a", fontWeight: "bold", marginBottom: "1rem" }}>📝 Assignments</h3>
        {courseAssignments.length === 0 ? (
          <div style={{ color: "#a6a6a6" }}>No assignments yet.</div>
        ) : (
          <ul style={{ padding: 0, listStyle: "none", marginLeft: 0 }}>
            {courseAssignments.map(a => (
              <li key={a.id} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
                background: "#f0fdf4",
                borderRadius: ".6rem",
                padding: "1rem 1.2rem"
              }}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "1.11rem" }}>{a.title}</div>
                  <div style={{ color: "#166534", marginTop: "0.22rem", fontSize: ".99rem" }}>Due: {a.due}</div>
                  <div style={{ color: "#444", fontSize: ".97rem", marginTop: ".15rem" }}>{a.instructions}</div>
                </div>
                <Link to="/assignments" style={{
                  marginLeft: 30,
                  color: "#fff",
                  background: "#22c55e",
                  borderRadius: "7px",
                  padding: ".6rem 1.25rem",
                  fontWeight: 600,
                  fontSize: ".97rem",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <FaClipboardCheck /> Submit/View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quizzes */}
      <div style={{
        background: "#fefce8",
        borderRadius: "1rem",
        padding: "1.5rem 2rem",
        marginBottom: "1.7rem",
        boxShadow: "0 2px 18px #fde68a22"
      }}>
        <h3 style={{ color: "#ca8a04", fontWeight: "bold", marginBottom: "1rem" }}>📋 Quizzes</h3>
        {(course.quizzes || []).length === 0 ? (
          <div style={{ color: "#a6a6a6" }}>No quizzes yet.</div>
        ) : (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {course.quizzes.map((q, idx) => (
              <li key={q.id} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: ".85rem",
                background: "#fffbe3",
                borderRadius: ".6rem",
                padding: "0.8rem 1.1rem"
              }}>
                <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                  <FaQuestionCircle style={{ color: "#ca8a04", marginRight: 6, fontSize: "1.05em" }} />
                  {q.title}
                </span>
                <Link to={`/courses/${course.id}/quizzes/${q.id}`}
                  style={{
                    color: "#fff", background: "#f59e42",
                    borderRadius: "7px",
                    padding: ".5rem 1.15rem",
                    fontWeight: 600,
                    fontSize: ".97rem",
                    textDecoration: "none",
                    marginLeft: "20px",
                    display: "flex", alignItems: "center", gap: "6px"
                  }}>
                  <FaCheckCircle /> Take Quiz
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
