// src/contexts/AppContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Mock data - we'll replace this with API calls later
const mockCoursesData = [
  {
    id: 1,
    title: "Web Development",
    description: "Learn HTML, CSS, JavaScript, and React to build modern web apps.",
    instructor: "Prof. Sharma",
    image: "https://images.unsplash.com/photo-1523475496153-3d6cc3000f4c?auto=format&fit=crop&w=400&q=80",
    enrolled: true,
    progress: 75
  },
  {
    id: 2,
    title: "Data Structures",
    description: "Understand algorithms, linked lists, stacks, queues, and trees.",
    instructor: "Dr. Verma", 
    image: "https://images.unsplash.com/photo-1537432376769-00a53c6b9333?auto=format&fit=crop&w=400&q=80",
    enrolled: true,
    progress: 60
  },
  {
    id: 3,
    title: "Computer Networks",
    description: "Dive into TCP/IP, routing, DNS, and network security fundamentals.",
    instructor: "Prof. Iyer",
    image: "https://images.unsplash.com/photo-1590608897129-79da98d159e9?auto=format&fit=crop&w=400&q=80",
    enrolled: false,
    progress: 0
  },
  {
    id: 4,
    title: "Database Systems", 
    description: "Master SQL, relational databases, and data modeling techniques.",
    instructor: "Dr. Banerjee",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80",
    enrolled: true,
    progress: 40
  }
];

// Updated assignments with edit submission support
const mockAssignmentsData = [
  { 
    id: 1, 
    title: "React Component Assignment", 
    course: "Web Development", 
    status: "pending", 
    due: "2025-09-25", 
    progress: 0,
    submittedAt: null,
    lastEditedAt: null,
    submissionData: { text: "", fileName: null }
  },
  { 
    id: 2, 
    title: "Binary Tree Implementation", 
    course: "Data Structures", 
    status: "submitted", 
    due: "2025-09-20", 
    progress: 100,
    submittedAt: "2025-09-18T10:30:00",
    lastEditedAt: null,
    submissionData: { 
      text: "Binary tree implementation completed with all required methods: insert, delete, search, traversal (inorder, preorder, postorder). Includes balanced tree operations and proper error handling.", 
      fileName: "tree_implementation.py" 
    }
  },
  { 
    id: 3, 
    title: "Database Design Project", 
    course: "Database Systems", 
    status: "pending", 
    due: "2025-09-30", 
    progress: 25,
    submittedAt: null,
    lastEditedAt: null,
    submissionData: { text: "", fileName: null }
  },
  { 
    id: 4, 
    title: "CSS Grid Layout", 
    course: "Web Development", 
    status: "graded", 
    due: "2025-09-15", 
    progress: 100, 
    grade: "A",
    submittedAt: "2025-09-14T16:45:00",
    lastEditedAt: "2025-09-15T09:20:00",
    submissionData: { 
      text: "CSS Grid layout project completed with responsive design, modern grid techniques, and accessibility features. Includes mobile-first approach and cross-browser compatibility.", 
      fileName: "grid_layout.html" 
    }
  }
];

const mockGradesData = [
  { id: 1, course: "Web Development", assignment: "CSS Grid Layout", grade: "A", score: "92%", date: "2025-09-16" },
  { id: 2, course: "Data Structures", assignment: "Array Operations", grade: "B+", score: "85%", date: "2025-09-10" },
  { id: 3, course: "Database Systems", assignment: "SQL Queries", grade: "A-", score: "88%", date: "2025-09-12" },
  { id: 4, course: "Web Development", assignment: "JavaScript Functions", grade: "B", score: "80%", date: "2025-09-08" }
];

export const AppProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCourses(mockCoursesData);
      setAssignments(mockAssignmentsData);
      setGrades(mockGradesData);
      setLoading(false);
    };

    loadData();
  }, []);

  // Functions to update data
  const updateCourseProgress = (courseId, progress) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, progress } : course
    ));
  };

  // Enhanced assignment update function
  const updateAssignmentStatus = (assignmentId, status, progress = null) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId 
        ? { 
            ...assignment, 
            status, 
            ...(progress !== null && { progress })
          }
        : assignment
    ));
  };

  const addGrade = (gradeData) => {
    setGrades(prev => [gradeData, ...prev]);
  };

  // Computed values
  const enrolledCourses = courses.filter(course => course.enrolled);
  const pendingAssignments = assignments.filter(assignment => assignment.status === 'pending');
  const recentGrades = grades.slice(0, 5);

  const value = {
    // Data
    courses,
    assignments, 
    grades,
    loading,
    
    // Computed data
    enrolledCourses,
    pendingAssignments,
    recentGrades,
    
    // Actions
    updateCourseProgress,
    updateAssignmentStatus,
    addGrade,
    
    // Stats
    stats: {
      totalCourses: enrolledCourses.length,
      pendingAssignments: pendingAssignments.length,
      averageGrade: grades.length > 0 ? (grades.reduce((acc, grade) => {
        const numGrade = grade.score.replace('%', '');
        return acc + parseInt(numGrade);
      }, 0) / grades.length).toFixed(1) : 0
    }
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
