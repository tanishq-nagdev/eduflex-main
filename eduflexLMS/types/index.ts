// This type is based on your backend User model
export type User = {
  _id: string
  name: string
  email: string
  role: "student" | "teacher" | "admin"
  createdAt: string
  // Add any other fields you might need
}