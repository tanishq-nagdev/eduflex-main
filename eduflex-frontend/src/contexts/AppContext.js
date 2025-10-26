// src/contexts/AppContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../config/api';
import { toast } from 'react-toastify';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  // ------- AUTH --------
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      return data.user;
    } catch {
      // Error handled globally
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = useCallback(() => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      setToken(null);
      setUser(null);
      toast.info('You have been logged out.');
    }
  }, []);

  // On mount: try to load user from token or fetch from /me
  useEffect(() => {
    const loadInitialUser = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('currentUser');
      if (storedToken) {
        setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
        else {
          try {
            const { data } = await api.get('/auth/me');
            setUser(data);
            localStorage.setItem('currentUser', JSON.stringify(data));
          } catch {}
        }
      }
      setLoading(false);
    };
    loadInitialUser();
  }, []);

  // ---------------------------------------
  //            PROFESSOR FUNCTIONS
  // ---------------------------------------
  const getMyProfessorCourses = async () => {
    try {
      const { data } = await api.get('/professor/courses');
      return data;
    } catch {}
  };

  const getProfessorCourseById = async (courseId) => {
  try {
    const { data } = await api.get(`/professor/courses/${courseId}`);
    return data;
  } catch {
    return null;
  }
};

const getAssignmentsForCourse = async (courseId) => {
  try {
    const { data } = await api.get(`/professor/courses/${courseId}/assignments`);
    return data;
  } catch {
    return [];
  }
};

  const createCourse = async (courseData) => {
    try {
      const { data } = await api.post('/professor/courses', courseData);
      toast.success('Course created!');
      return data;
    } catch {}
  };

  const updateCourse = async (courseId, updateData) => {
    try {
      const { data } = await api.put(`/professor/courses/${courseId}`, updateData);
      toast.success('Course updated!');
      return data;
    } catch {}
  };

  const deleteCourse = async (courseId) => {
    try {
      await api.delete(`/professor/courses/${courseId}`);
      toast.success('Course deleted!');
    } catch {}
  };

  const addMaterialToCourse = async (courseId, materialData) => {
    try {
      const { data } = await api.post(`/professor/courses/${courseId}/materials`, materialData);
      toast.success('Material added!');
      return data;
    } catch {}
  };

  const createAssignment = async (courseId, assignmentData) => {
    try {
      const { data } = await api.post(`/professor/courses/${courseId}/assignments`, assignmentData);
      toast.success('Assignment created!');
      return data;
    } catch {}
  };

  const getProfessorAssignments = async (courseId) => {
    try {
      const { data } = await api.get(`/professor/courses/${courseId}/assignments`);
      return data;
    } catch {}
  };

  const getSubmissionsForAssignment = async (assignmentId) => {
    try {
      const { data } = await api.get(`/professor/assignments/${assignmentId}/submissions`);
      return data;
    } catch {}
  };

  const gradeSubmission = async (assignmentId, studentId, gradeData) => {
    try {
      await api.patch(`/professor/assignments/${assignmentId}/grade`, { studentId, ...gradeData });
      toast.success('Submission graded!');
    } catch {}
  };

  // Quiz routes for professors (optional)
  const addQuizToCourse = async (courseId, quizData) => {
    try {
      await api.post(`/professor/courses/${courseId}/quizzes`, quizData);
      toast.success('Quiz created!');
    } catch {}
  };
  const addQuestionToQuiz = async (courseId, quizId, questionData) => {
    try {
      await api.post(`/professor/courses/${courseId}/quizzes/${quizId}/questions`, questionData);
      toast.success('Question added!');
    } catch {}
  };

  // ---------------------------------------
  //                 STUDENT FUNCTIONS
  // ---------------------------------------
  const getMyStudentCourses = async () => {
    try {
      const { data } = await api.get('/student/courses');
      return data;
    } catch {}
  };

  const getStudentAssignmentsForCourse = async (courseId) => {
    try {
      const { data } = await api.get(`/student/courses/${courseId}/assignments`);
      return data;
    } catch {}
  };

  const submitAssignment = async (assignmentId, submissionData) => {
    try {
      await api.post(`/student/assignments/${assignmentId}/submit`, submissionData);
      toast.success('Assignment submitted!');
    } catch {}
  };

  const getMyGrades = async () => {
    try {
      const { data } = await api.get(`/student/grades`);
      return data;
    } catch {}
  };

  const submitQuiz = async (courseId, quizId, answers) => {
    try {
      await api.post(`/student/courses/${courseId}/quizzes/${quizId}/submit`, { answers });
      toast.success('Quiz submitted!');
    } catch {}
  };

  // ---------------------------------------
  //                  ADMIN  
  // ---------------------------------------
  const getAllUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      return data;
    } catch {}
  };

  const createUser = async (userData) => {
    try {
      await api.post('/admin/users', userData);
      toast.success('User created!');
    } catch {}
  };

  // ---------------------------------------
  //               PROFILE / GENERAL
  // ---------------------------------------
  const updateUserProfile = async (profileData) => {
    try {
      await api.put('/users/profile', profileData);
      setUser(prev => ({ ...prev, ...profileData }));
      toast.success('Profile updated!');
    } catch {}
  };

  // ---------------------------------------
  //           VALUE & PROVIDER
  // ---------------------------------------
  const value = {
  user, token, loading,
  loginUser, logoutUser,
  // Professor
  getMyProfessorCourses,
  getProfessorCourseById,            // <--- add this
  getAssignmentsForCourse,           // <--- and this, if used
  createCourse, updateCourse, deleteCourse, addMaterialToCourse,
  createAssignment, getProfessorAssignments,
  getSubmissionsForAssignment, gradeSubmission,
  addQuizToCourse, addQuestionToQuiz,
  // Student
  getMyStudentCourses, getStudentAssignmentsForCourse, submitAssignment,
  getMyGrades, submitQuiz,
  // Admin
  getAllUsers, createUser,
  // Profile
  updateUserProfile,
};


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
