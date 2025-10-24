// src/pages/Assignments.js
import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";

function Assignments() {
  const { assignments, updateAssignmentStatus, loading } = useApp();
  const [filter, setFilter] = useState("all"); // all, pending, submitted, graded
  const [selectedFile, setSelectedFile] = useState({});
  const [submissionText, setSubmissionText] = useState({});
  
  // New state variables for edit functionality
  const [editMode, setEditMode] = useState({}); // Track which assignments are being edited
  const [originalSubmissions, setOriginalSubmissions] = useState({}); // Store original submission data

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    if (filter === "all") return true;
    return assignment.status === filter;
  });

  // Handle file upload
  const handleFileChange = (assignmentId, file) => {
    setSelectedFile(prev => ({ ...prev, [assignmentId]: file }));
  };

  // Handle text submission
  const handleTextChange = (assignmentId, text) => {
    setSubmissionText(prev => ({ ...prev, [assignmentId]: text }));
  };

  // Enhanced submit function
  const handleSubmit = (assignmentId) => {
    const hasFile = selectedFile[assignmentId];
    const hasText = submissionText[assignmentId]?.trim();
    
    if (hasFile || hasText) {
      const assignment = assignments.find(a => a.id === assignmentId);
      const now = new Date().toISOString();
      
      // Update assignment with submission data
      assignment.status = 'submitted';
      assignment.progress = 100;
      assignment.submittedAt = now;
      assignment.submissionData = {
        text: submissionText[assignmentId] || "",
        fileName: hasFile ? hasFile.name : null
      };
      
      updateAssignmentStatus(assignmentId, 'submitted', 100);
      
      // Clear the form
      setSelectedFile(prev => ({ ...prev, [assignmentId]: null }));
      setSubmissionText(prev => ({ ...prev, [assignmentId]: '' }));
      
      alert('Assignment submitted successfully! 🎉');
    } else {
      alert('Please add a file or text before submitting.');
    }
  };

  // New function to handle edit mode
  const handleEditSubmission = (assignmentId) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    
    // Store original submission data
    setOriginalSubmissions(prev => ({
      ...prev,
      [assignmentId]: { ...assignment.submissionData }
    }));
    
    // Load current submission into edit form
    setSubmissionText(prev => ({
      ...prev,
      [assignmentId]: assignment.submissionData.text || ''
    }));
    
    // Enable edit mode
    setEditMode(prev => ({ ...prev, [assignmentId]: true }));
  };

  // New function to save edited submission
  const handleSaveEdit = (assignmentId) => {
    const hasFile = selectedFile[assignmentId];
    const hasText = submissionText[assignmentId]?.trim();
    
    if (hasFile || hasText) {
      const assignment = assignments.find(a => a.id === assignmentId);
      const now = new Date().toISOString();
      
      // Update with new submission data
      assignment.lastEditedAt = now;
      assignment.submissionData = {
        text: submissionText[assignmentId] || "",
        fileName: hasFile ? hasFile.name : assignment.submissionData.fileName
      };
      
      // Update context
      updateAssignmentStatus(assignmentId, 'submitted', 100);
      
      // Clear edit mode
      setEditMode(prev => ({ ...prev, [assignmentId]: false }));
      setSelectedFile(prev => ({ ...prev, [assignmentId]: null }));
      
      alert('Submission updated successfully! ✏️');
    } else {
      alert('Please add content before saving.');
    }
  };

  // New function to cancel edit
  const handleCancelEdit = (assignmentId) => {
    // Restore original data
    setSubmissionText(prev => ({
      ...prev,
      [assignmentId]: originalSubmissions[assignmentId]?.text || ''
    }));
    
    setSelectedFile(prev => ({ ...prev, [assignmentId]: null }));
    setEditMode(prev => ({ ...prev, [assignmentId]: false }));
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f59e0b';
      case 'submitted': return '#3b82f6';
      case 'graded': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return '⏳';
      case 'submitted': return '📤';
      case 'graded': return '✅';
      default: return '📝';
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
            borderTop: "4px solid #f59e0b",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }}></div>
          <p>Loading assignments...</p>
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
        My Assignments
      </h1>
      <p style={{ fontSize: "1rem", color: "#555", marginBottom: "1.5rem" }}>
        Submit your assignments and track your progress.
      </p>

      {/* Stats */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ 
          background: "linear-gradient(135deg, #f59e0b, #d97706)", 
          color: "white", 
          padding: "1rem", 
          borderRadius: "0.5rem",
          minWidth: "120px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {assignments.filter(a => a.status === 'pending').length}
          </div>
          <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>Pending</div>
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
            {assignments.filter(a => a.status === 'submitted').length}
          </div>
          <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>Submitted</div>
        </div>

        <div style={{ 
          background: "linear-gradient(135deg, #10b981, #059669)", 
          color: "white", 
          padding: "1rem", 
          borderRadius: "0.5rem",
          minWidth: "120px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {assignments.filter(a => a.status === 'graded').length}
          </div>
          <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>Graded</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
        {[
          { key: "all", label: "All Assignments", color: "#6b7280" },
          { key: "pending", label: "Pending", color: "#f59e0b" },
          { key: "submitted", label: "Submitted", color: "#3b82f6" },
          { key: "graded", label: "Graded", color: "#10b981" }
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

      {/* Assignments List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                border: `2px solid ${getStatusColor(assignment.status)}20`
              }}
            >
              {/* Assignment Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                    {assignment.title}
                  </h3>
                  <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                    <strong>Course:</strong> {assignment.course}
                  </p>
                  <p style={{ color: "#666", fontSize: "0.9rem" }}>
                    <strong>Due Date:</strong> {new Date(assignment.due).toLocaleDateString()}
                  </p>
                </div>
                
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "1rem",
                    background: getStatusColor(assignment.status),
                    color: "white",
                    fontSize: "0.9rem",
                    fontWeight: "500"
                  }}>
                    {getStatusIcon(assignment.status)} {assignment.status.toUpperCase()}
                  </div>
                  
                  {assignment.status === 'graded' && assignment.grade && (
                    <div style={{ marginTop: "0.5rem", fontSize: "1.1rem", fontWeight: "bold", color: "#10b981" }}>
                      Grade: {assignment.grade}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.9rem", color: "#666" }}>Progress</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>{assignment.progress}%</span>
                </div>
                <div style={{
                  width: "100%",
                  height: "6px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "3px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${assignment.progress}%`,
                    height: "100%",
                    backgroundColor: getStatusColor(assignment.status),
                    transition: "width 0.3s ease"
                  }} />
                </div>
              </div>

              {/* Submission Form for Pending Assignments */}
              {assignment.status === 'pending' && (
                <div style={{ 
                  background: "#f9fafb", 
                  padding: "1.5rem", 
                  borderRadius: "0.5rem",
                  border: "1px solid #e5e7eb"
                }}>
                  <h4 style={{ marginBottom: "1rem", color: "#374151" }}>Submit Assignment</h4>
                  
                  {/* File Upload */}
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>
                      Upload File (Optional)
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(assignment.id, e.target.files[0])}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.375rem",
                        background: "white"
                      }}
                      accept=".pdf,.doc,.docx,.txt,.zip"
                    />
                    {selectedFile[assignment.id] && (
                      <p style={{ fontSize: "0.8rem", color: "#10b981", marginTop: "0.5rem" }}>
                        ✓ Selected: {selectedFile[assignment.id].name}
                      </p>
                    )}
                  </div>

                  {/* Text Submission */}
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>
                      Text Submission (Optional)
                    </label>
                    <textarea
                      value={submissionText[assignment.id] || ''}
                      onChange={(e) => handleTextChange(assignment.id, e.target.value)}
                      placeholder="Write your submission here..."
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.375rem",
                        resize: "vertical",
                        fontFamily: "inherit"
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={() => handleSubmit(assignment.id)}
                    style={{
                      padding: "0.75rem 1.5rem",
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#059669"}
                    onMouseLeave={(e) => e.target.style.background = "#10b981"}
                  >
                    Submit Assignment 📤
                  </button>
                </div>
              )}

              {/* Enhanced Submission Status for Submitted/Graded */}
              {(assignment.status === 'submitted' || assignment.status === 'graded') && (
                <div style={{
                  background: assignment.status === 'graded' ? "#f0fdf4" : "#eff6ff",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  border: `1px solid ${assignment.status === 'graded' ? '#bbf7d0' : '#bfdbfe'}`
                }}>
                  {/* Submission Info */}
                  <div style={{ marginBottom: "1rem" }}>
                    <p style={{ 
                      margin: "0 0 0.5rem 0", 
                      color: assignment.status === 'graded' ? "#059669" : "#1d4ed8",
                      fontWeight: "600",
                      fontSize: "1rem"
                    }}>
                      {assignment.status === 'graded' 
                        ? `✅ Assignment Graded! Score: ${assignment.grade || 'Pending'}` 
                        : "📤 Assignment Submitted Successfully!"}
                    </p>
                    
                    {/* Submission Timeline */}
                    <div style={{ fontSize: "0.85rem", color: "#666", lineHeight: "1.4" }}>
                      <p style={{ margin: "0.25rem 0" }}>
                        <strong>📅 Original Submission:</strong> {' '}
                        {assignment.submittedAt ? new Date(assignment.submittedAt).toLocaleString() : 'Not recorded'}
                      </p>
                      {assignment.lastEditedAt && (
                        <p style={{ margin: "0.25rem 0", color: "#f59e0b", fontWeight: "500" }}>
                          <strong>✏️ Last Edited:</strong> {' '}
                          {new Date(assignment.lastEditedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Current Submission Content */}
                  {assignment.submissionData && (
                    <div style={{ 
                      background: "white", 
                      padding: "1rem", 
                      borderRadius: "0.375rem",
                      border: "1px solid #e5e7eb",
                      marginBottom: "1rem"
                    }}>
                      <h5 style={{ margin: "0 0 0.75rem 0", color: "#374151" }}>Current Submission:</h5>
                      
                      {assignment.submissionData.fileName && (
                        <p style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>
                          📎 <strong>File:</strong> {assignment.submissionData.fileName}
                        </p>
                      )}
                      
                      {assignment.submissionData.text && (
                        <div>
                          <p style={{ margin: "0.5rem 0 0.25rem 0", fontSize: "0.9rem", fontWeight: "500" }}>📝 Text Submission:</p>
                          <p style={{ 
                            margin: "0", 
                            padding: "0.75rem", 
                            background: "#f9fafb", 
                            borderRadius: "0.25rem",
                            fontSize: "0.85rem",
                            fontStyle: "italic",
                            border: "1px solid #f3f4f6"
                          }}>
                            {assignment.submissionData.text}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Edit Submission Section */}
                  {assignment.status === 'submitted' && (
                    <div>
                      {!editMode[assignment.id] ? (
                        // Show Edit Button
                        <button
                          onClick={() => handleEditSubmission(assignment.id)}
                          style={{
                            padding: "0.75rem 1.5rem",
                            background: "#f59e0b",
                            color: "white",
                            border: "none",
                            borderRadius: "0.5rem",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "background 0.2s"
                          }}
                          onMouseEnter={(e) => e.target.style.background = "#d97706"}
                          onMouseLeave={(e) => e.target.style.background = "#f59e0b"}
                        >
                          ✏️ Edit Submission
                        </button>
                      ) : (
                        // Show Edit Form
                        <div style={{ 
                          background: "#fff7ed", 
                          padding: "1.5rem", 
                          borderRadius: "0.5rem",
                          border: "2px solid #fed7aa" 
                        }}>
                          <h5 style={{ margin: "0 0 1rem 0", color: "#ea580c" }}>✏️ Edit Your Submission</h5>
                          
                          {/* File Upload for Edit */}
                          <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>
                              Update File (Optional)
                            </label>
                            <input
                              type="file"
                              onChange={(e) => handleFileChange(assignment.id, e.target.files[0])}
                              style={{
                                width: "100%",
                                padding: "0.5rem",
                                border: "1px solid #fed7aa",
                                borderRadius: "0.375rem",
                                background: "white"
                              }}
                              accept=".pdf,.doc,.docx,.txt,.zip"
                            />
                            {selectedFile[assignment.id] && (
                              <p style={{ fontSize: "0.8rem", color: "#ea580c", marginTop: "0.5rem" }}>
                                ✓ New file selected: {selectedFile[assignment.id].name}
                              </p>
                            )}
                          </div>

                          {/* Text Edit */}
                          <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>
                              Update Text Submission
                            </label>
                            <textarea
                              value={submissionText[assignment.id] || ''}
                              onChange={(e) => handleTextChange(assignment.id, e.target.value)}
                              placeholder="Update your submission text..."
                              rows={4}
                              style={{
                                width: "100%",
                                padding: "0.75rem",
                                border: "1px solid #fed7aa",
                                borderRadius: "0.375rem",
                                resize: "vertical",
                                fontFamily: "inherit"
                              }}
                            />
                          </div>

                          {/* Edit Action Buttons */}
                          <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button
                              onClick={() => handleSaveEdit(assignment.id)}
                              style={{
                                padding: "0.75rem 1.5rem",
                                background: "#10b981",
                                color: "white",
                                border: "none",
                                borderRadius: "0.5rem",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "background 0.2s"
                              }}
                              onMouseEnter={(e) => e.target.style.background = "#059669"}
                              onMouseLeave={(e) => e.target.style.background = "#10b981"}
                            >
                              💾 Save Changes
                            </button>

                            <button
                              onClick={() => handleCancelEdit(assignment.id)}
                              style={{
                                padding: "0.75rem 1.5rem",
                                background: "#6b7280",
                                color: "white",
                                border: "none",
                                borderRadius: "0.5rem",
                                fontSize: "0.9rem",
                                fontWeight: "500",
                                cursor: "pointer",
                                transition: "background 0.2s"
                              }}
                              onMouseEnter={(e) => e.target.style.background = "#4b5563"}
                              onMouseLeave={(e) => e.target.style.background = "#6b7280"}
                            >
                              ❌ Cancel
                            </button>
                          </div>

                          <p style={{ 
                            margin: "1rem 0 0 0", 
                            fontSize: "0.8rem", 
                            color: "#dc2626",
                            fontStyle: "italic"
                          }}>
                            ⚠️ Note: Editing will update your submission timestamp
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📝</div>
            <h3>No assignments found</h3>
            <p>No assignments match your current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Assignments;
