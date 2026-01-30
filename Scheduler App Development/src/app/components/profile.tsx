import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, Phone, Calendar, Clock, LogOut, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Badge } from "@/app/components/ui/badge";
import { userProfile, studentsData, Session, instructorsData } from "@/app/data/mock-data";
import { toast } from "sonner";
import { Toaster } from "@/app/components/ui/sonner";

export function Profile() {
  const navigate = useNavigate();
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const currentStudent = studentsData[0]; // Emma Johnson

  useEffect(() => {
    const savedEnrollments = localStorage.getItem(`enrollments_${currentStudent.id}`);
    const savedSessions = localStorage.getItem("sessions");

    if (savedEnrollments && savedSessions) {
      const enrollmentIds = new Set(JSON.parse(savedEnrollments));
      const sessions: Session[] = JSON.parse(savedSessions);
      const enrolled = sessions.filter((s) => enrollmentIds.has(s.id));
      setUpcomingSessions(enrolled);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/");
  };

  const getInstructorName = (instructorId: string | null) => {
    if (!instructorId) return "TBA";
    const instructor = instructorsData.find((i) => i.id === instructorId);
    return instructor ? instructor.name : "TBA";
  };

  const canCancelSession = (sessionDate: string) => {
    const session = new Date(sessionDate);
    const now = new Date();
    const diffHours = (session.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours > 24;
  };

  const handleCancel = (sessionId: string, sessionDate: string) => {
    if (!canCancelSession(sessionDate)) {
      toast.error("Cannot cancel within 24 hours of the session");
      return;
    }

    const savedSessions = localStorage.getItem("sessions");
    if (savedSessions) {
      const sessions: Session[] = JSON.parse(savedSessions);
      const updatedSessions = sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              enrolledStudents: (s.enrolledStudents || []).filter((id) => id !== currentStudent.id),
              slotsFilled: Math.max(0, s.slotsFilled - 1),
            }
          : s
      );

      localStorage.setItem("sessions", JSON.stringify(updatedSessions));

      const savedEnrollments = localStorage.getItem(`enrollments_${currentStudent.id}`);
      if (savedEnrollments) {
        const enrollments = new Set(JSON.parse(savedEnrollments));
        enrollments.delete(sessionId);
        localStorage.setItem(`enrollments_${currentStudent.id}`, JSON.stringify([...enrollments]));
      }

      setUpcomingSessions(upcomingSessions.filter((s) => s.id !== sessionId));
      toast.success("Registration cancelled successfully");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Toaster />
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => navigate("/home")}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Profile</h1>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Profile Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="text-lg">Student & Parent Info</CardTitle>
            <CardDescription>Account details</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Child Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Student
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Name</p>
                  <p className="font-medium text-sm text-gray-900">{userProfile.childName}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Age</p>
                  <p className="font-medium text-sm text-gray-900">{userProfile.childAge} years</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Parent Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                Parent
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Name</p>
                  <p className="font-medium text-sm text-gray-900">{userProfile.parentName}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Phone
                  </p>
                  <p className="font-medium text-sm text-gray-900">{userProfile.parentPhone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions Card */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>Your registered classes</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No upcoming sessions</p>
                <Button
                  onClick={() => navigate("/home")}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  Browse Calendar
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.map((session) => {
                  const canCancel = canCancelSession(session.date);
                  return (
                    <div
                      key={session.id}
                      className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-gray-900">
                            {new Date(session.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            Instructor: {getInstructorName(session.instructorId)}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs">Enrolled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {session.startTime} - {session.endTime}
                            </span>
                          </div>
                          <div className="font-medium">${session.costPerHour}/hr</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 px-3 text-xs ${
                            canCancel
                              ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                          onClick={() => handleCancel(session.id, session.date)}
                          disabled={!canCancel}
                        >
                          <X className="w-3 h-3 mr-1" />
                          {canCancel ? "Cancel" : "< 24hrs"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
