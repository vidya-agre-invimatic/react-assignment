"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardPage() {
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    console.log("User data from localStorage:", userData) // Debugging line
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!user) {
    return <p>Loading...</p>
  }

  // Create initials for avatar fallback, safely handling undefined or empty values
  const getInitials = () => {
    const firstInitial = user.firstName && user.firstName.length > 0 ? user.firstName[0] : "U"
    const lastInitial = user.lastName && user.lastName.length > 0 ? user.lastName[0] : ""
    return `${firstInitial}${lastInitial}`
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {user.firstName || "User"}!</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${user.firstName || ""}+${user.lastName || ""}&background=random`}
                alt="User avatar"
              />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">
                {user.firstName || ""} {user.lastName || ""}
              </h2>
              <p className="text-muted-foreground">Software Developer</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium">Email</h3>
              <p>{user.email || "No email provided"}</p>
            </div>
            <div>
              <h3 className="font-medium">Account Created</h3>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
