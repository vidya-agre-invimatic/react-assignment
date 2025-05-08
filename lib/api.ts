import axios from "axios"
import type { User } from "@/hooks/use-auth"

const API_URL = "https://second-brain-web.onrender.com/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem("user")
    if (userJson) {
      const user = JSON.parse(userJson)
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Login API
export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await api.post("/auth/login", { email, password })
    return {
      id: response.data.id || response.data._id || "user-id",
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      email: response.data.email,
      token: response.data.token,
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Login failed")
    }
    throw new Error("Network error. Please try again.")
  }
}

// Register API
export const register = async (firstName: string, lastName: string, email: string, password: string): Promise<User> => {
  try {
    const response = await api.post("/auth/register", {
      firstName,
      lastName,
      email,
      password,
    })
    return {
      id: response.data.id || response.data._id || "user-id",
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      email: response.data.email,
      token: response.data.token,
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Registration failed")
    }
    throw new Error("Network error. Please try again.")
  }
}

// Forgot password API
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await api.post("/auth/forgot-password", { email })
  } catch (error) {
    throw error
  }
}
