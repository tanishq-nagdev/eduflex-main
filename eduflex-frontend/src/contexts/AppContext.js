import React, { createContext, useContext, useState, useEffect } from 'react';

export const MOCK_USERS = [
  {
    id: "s1",
    email: "student@eduflex.com",
    password: "student123",
    role: "student",
    name: "Aditya Choudhary",
    year: "3rd Year, Computer Engineering",
    studentId: "CE2022001",
    joinDate: "2022-08-15"
  },
  {
    id: "s2",
    email: "john@eduflex.com",
    password: "john123",
    role: "student",
    name: "John Doe",
    year: "2nd Year, Computer Engineering",
    studentId: "CE2023045",
    joinDate: "2023-08-15"
  },
  {
    id: "p1",
    email: "prof.sharma@eduflex.com",
    password: "prof123",
    role: "professor",
    name: "Prof. Sharma",
    department: "Computer Engineering",
    joinDate: "2021-07-01"
  }
];

const mockCoursesData = [
  {
    id: 1,
    title: "Web Development",
    ownerId: "p1",
    description: "Learn HTML, CSS, JavaScript, and React to build modern web apps.",
    instructor: "Prof. Sharma",
    instructorEmail: "sharma@eduflex.com",
    image: "https://images.unsplash.com/photo-1523475496153-3d6cc3000f4c?auto=format&fit=crop&w=400&q=80",
    enrolled: true,
    progress: 75,
    startDate: "2024-08-15",
    endDate: "2024-12-20",
    credits: 4,
    enrolledStudents: ["s1", "s2"],
    materials: [
      { id: 1, title: "Week 1 - HTML Basics", type: "pdf", url: "#" },
      { id: 2, title: "Week 2 - CSS Fundamentals", type: "pdf", url: "#" }
    ],
    quizzes: []
  }
];

const mockAssignmentsData = [
  {
    id: 10,
    title: "React Component Assignment",
    instructions: "Build at least 5 reusable React components with props and proper documentation.",
    course: "Web Development",
    courseId: 1,
    due: "2025-10-25",
    maxScore: 100,
    submissions: []
  }
];

const mockGradesData = [
  {
    id: 1,
    course: "Web Development",
    courseId: 1,
    assignment: "React Component Assignment",
    assignmentId: 10,
    grade: "A",
    score: "95%",
    studentId: "s1",
    date: "2025-10-30"
  }
];

const AppContext = createContext();
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};

export const AppProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) setUser(JSON.parse(storedUser));
      setCourses(mockCoursesData);
      setAssignments(mockAssignmentsData);
      setGrades(mockGradesData);
      setLoading(false);
    };
    loadData();
  }, []);

  // STUDENT: Submit assignment (with file/text)
  const submitAssignment = (assignmentId, submissionData) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === assignmentId
          ? {
              ...assignment,
              submissions: [
                ...(assignment.submissions || []).filter(sub => sub.studentId !== submissionData.studentId),
                {
                  studentId: submissionData.studentId,
                  status: "submitted",
                  fileName: submissionData.fileName || null,
                  fileUrl: submissionData.fileUrl || null,
                  text: submissionData.text || null,
                  graded: false,
                  grade: null,
                  feedback: "",
                  submittedAt: new Date().toISOString()
                }
              ]
            }
          : assignment
      )
    );
  };

  // STUDENT: Edit assignment (same as submit for now)
  const editSubmission = (assignmentId, submissionData) => {
    submitAssignment(assignmentId, submissionData);
  };

  // PROFESSOR: Grade student submission
  const gradeSubmission = (assignmentId, studentId, grade, feedback) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === assignmentId
          ? {
              ...assignment,
              submissions: (assignment.submissions || []).map(sub =>
                sub.studentId === studentId
                  ? { ...sub, grade, feedback, graded: true }
                  : sub
              )
            }
          : assignment
      )
    );
    setGrades(prev => [
      ...prev,
      {
        id: Date.now(),
        course: assignments.find(a => a.id === assignmentId)?.course,
        courseId: assignments.find(a => a.id === assignmentId)?.courseId,
        assignment: assignments.find(a => a.id === assignmentId)?.title,
        assignmentId,
        grade: grade >= 90 ? "A" : grade >= 80 ? "B" : grade >= 70 ? "C" : "D",
        score: `${grade}%`,
        studentId,
        date: new Date().toISOString().slice(0, 10)
      }
    ]);
  };

  // ------- PROFESSOR QUIZ FUNCTIONS --------
  const addQuizToCourse = (courseId, quizData) => {
    setCourses(prev =>
      prev.map(course =>
        course.id === courseId
          ? {
              ...course,
              quizzes: [
                ...(course.quizzes || []),
                {
                  id: Date.now(),
                  title: quizData.title || "Untitled Quiz",
                  questions: [],
                  submissions: []
                }
              ]
            }
          : course
      )
    );
  };

  const addQuestionToQuiz = (courseId, quizId, questionData) => {
    setCourses(prev =>
      prev.map(course =>
        course.id === courseId
          ? {
              ...course,
              quizzes: course.quizzes.map(quiz =>
                quiz.id === quizId
                  ? {
                      ...quiz,
                      questions: [
                        ...(quiz.questions || []),
                        {
                          id: Date.now(),
                          text: questionData.text,
                          options: questionData.options,
                          correct: questionData.correct
                        }
                      ]
                    }
                  : quiz
              )
            }
          : course
      )
    );
  };

  // Student: Submit a quiz (auto grade)
  const submitQuiz = (courseId, quizId, studentId, answers) => {
    setCourses(prev =>
      prev.map(course =>
        course.id === courseId
          ? {
              ...course,
              quizzes: course.quizzes.map(quiz =>
                quiz.id === quizId
                  ? {
                      ...quiz,
                      submissions: [
                        ...(quiz.submissions || []),
                        {
                          studentId,
                          answers,
                          submittedAt: new Date().toISOString(),
                          score: quiz.questions
                            ? answers.reduce(
                                (score, ans, i) =>
                                  ans === quiz.questions[i]?.correct
                                    ? score + 1
                                    : score,
                                0
                              )
                            : 0,
                          total: quiz.questions ? quiz.questions.length : 0
                        }
                      ]
                    }
                  : quiz
              )
            }
          : course
      )
    );
  };

  // CRUD and other course/professor functions:
  const createCourse = courseData => {
    const newCourse = {
      ...courseData,
      id: Date.now(),
      ownerId: courseData.ownerId || (user && user.id),
      instructor: user && user.name,
      instructorEmail: user && user.email,
      image:
        "https://images.unsplash.com/photo-1523475496153-3d6cc3000f4c?auto=format&fit=crop&w=400&q=80",
      enrolled: false,
      progress: 0,
      credits: courseData.credits || 4,
      startDate: "2025-01-01",
      endDate: "2025-04-30",
      enrolledStudents: [],
      materials: [],
      quizzes: []
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const updateCourse = (courseId, newTitle, newDesc) => {
    setCourses(prev =>
      prev.map(course =>
        course.id === courseId ? { ...course, title: newTitle, description: newDesc } : course
      )
    );
  };

  const deleteCourse = (courseId) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
  };

  const addMaterialToCourse = (courseId, material) => {
    setCourses(prev =>
      prev.map(course =>
        course.id === courseId
          ? { ...course, materials: [...(course.materials || []), { ...material, id: Date.now() }] }
          : course
      )
    );
  };

  const addAssignmentToCourse = (courseId, assignmentData) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    setAssignments(prev => [
      ...prev,
      {
        ...assignmentData,
        id: Date.now(),
        course: course.title,
        courseId: course.id,
        submissions: [],
        due: assignmentData.due
      }
    ]);
  };

  const updateUserProfile = (newProfile) => {
    setUser(prev => ({ ...prev, ...newProfile }));
  };

  const enrollInCourse = (courseId) => {
    setCourses(prev =>
      prev.map(course =>
        course.id === courseId
          ? { ...course, enrolled: true }
          : course
      )
    );
  };

  const unenrollFromCourse = (courseId) => {
    setCourses(prev =>
      prev.map(course =>
        course.id === courseId
          ? { ...course, enrolled: false }
          : course
      )
    );
  };

  const updateCourseProgress = (courseId, progress) => {
    setCourses(prev =>
      prev.map(course =>
        course.id === courseId
          ? { ...course, progress }
          : course
      )
    );
  };

  // Authentication
  const loginUser = userData => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  // Stats
  const enrolledCourses = courses.filter(course => course.enrolled);
  const pendingAssignments = assignments.filter(assignment =>
    (assignment?.submissions || []).some(
      sub => sub.studentId === user?.id && sub.status !== "submitted"
    ) || (assignment?.submissions || []).length === 0 // not submitted at all
  );
  const recentGrades = grades.slice(0, 5);

  const stats = {
    totalCourses: enrolledCourses.length,
    pendingAssignments: pendingAssignments.length,
    averageGrade: grades.length > 0
      ? (
          grades.reduce((acc, grade) => {
            const numGrade = parseInt(grade.score.replace('%', ''));
            return acc + numGrade;
          }, 0) / grades.length
        ).toFixed(1)
      : 0,
    overallProgress: enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce((acc, course) => acc + course.progress, 0) /
            enrolledCourses.length
        )
      : 0
  };

  const value = {
    courses,
    assignments,
    grades,
    user,
    loading,
    createCourse,
    updateCourse,
    deleteCourse,
    addMaterialToCourse,
    addAssignmentToCourse,
    addQuizToCourse,
    addQuestionToQuiz,
    submitQuiz,
    gradeSubmission,
    submitAssignment,
    editSubmission,
    updateUserProfile,
    enrollInCourse,
    unenrollFromCourse,
    updateCourseProgress,
    loginUser,
    logoutUser,
    MOCK_USERS,
    enrolledCourses,
    pendingAssignments,
    recentGrades,
    stats,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
