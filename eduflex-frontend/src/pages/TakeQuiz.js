import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { toast } from "react-toastify";

export default function TakeQuiz() {
  const { user, courses, submitQuiz } = useApp();
  const { courseId, quizId } = useParams();

  const course = courses.find(c => String(c.id) === String(courseId));
  const quiz = course?.quizzes?.find(q => String(q.id) === String(quizId));

  const [answers, setAnswers] = useState(Array(quiz?.questions.length || 0).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const submission = quiz?.submissions?.find(s => s.studentId === user?.id);

  if (!quiz) return <div style={{ padding: "2rem" }}>Quiz not found.</div>;

  const handleSelect = (qi, ans) => {
    setAnswers(prev => prev.map((a, i) => i === qi ? ans : a));
  };

  const handleSubmit = () => {
    if (answers.some(ans => ans === null)) {
      toast.warning("Answer all questions first!");
      return;
    }
    submitQuiz(course.id, quiz.id, user.id, answers);
    setSubmitted(true);
    toast.success("Quiz submitted!");
  };

  // If already submitted, show results
  const finalSubmission = submission || (submitted && quiz.submissions.find(s => s.studentId === user.id));

  return (
    <div style={{ padding: "2rem", maxWidth: 640, margin: "0 auto" }}>
      <h2 style={{ fontWeight: "bold", fontSize: "1.6rem", marginBottom: "1.4rem" }}>
        Quiz: {quiz.title}
      </h2>
      {!finalSubmission ? (
        <form onSubmit={e => {e.preventDefault(); handleSubmit();}}>
          {quiz.questions.map((q, i) => (
            <div key={q.id} style={{ marginBottom: 22, paddingBottom: 10, borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{i+1}. {q.text}</div>
              <div>
                {q.options.map((opt, idx) => (
                  <label key={idx} style={{ display: "block", marginBottom: 4 }}>
                    <input
                      type="radio"
                      value={idx}
                      checked={answers[i] === idx}
                      onChange={() => handleSelect(i, idx)}
                      style={{ marginRight: 8 }}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            style={{ background: "#6366f1", color: "#fff", padding: "0.7rem 2rem", borderRadius: 7, border: "none", fontWeight: 600, fontSize: "1.1rem", marginTop: 18 }}
          >
            Submit Quiz
          </button>
        </form>
      ) : (
        <div style={{ padding: 26, background: "#f0fdf4", borderRadius: 10, border: "2px solid #10b98177", marginTop: 20 }}>
          <h3 style={{ color: "#16a34a" }}>Your Score: {finalSubmission.score} / {finalSubmission.total}</h3>
          <ul style={{marginTop: 14, fontSize: "1.05rem"}}>
            {quiz.questions.map((q,i) =>
              <li key={i}>
                <b>
                  {i+1}. {q.text}
                </b>
                <ul>
                  <li style={{ color: finalSubmission.answers[i] === q.correct ? "#16a34a" : "#f43f5e" }}>
                    Your answer: {q.options[finalSubmission.answers[i]] || "-"}
                    {finalSubmission.answers[i] === q.correct ? " ✓" : ""}
                  </li>
                  <li style={{color:"#22c55e"}}>Correct: {q.options[q.correct]}</li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
