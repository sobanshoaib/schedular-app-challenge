import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, User, Clock, DollarSign, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Badge } from "@/app/components/ui/badge";
import { sessionsData, Session, studentsData, instructorsData } from "@/app/data/mock-data";
import { toast } from "sonner";
import { Toaster } from "@/app/components/ui/sonner";

interface ParentViewProps {
  currentMonth: number;
  onNextMonth: () => void;
  onPrevMonth: () => void;
}

export function ParentView({ currentMonth, onNextMonth, onPrevMonth }: ParentViewProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [myEnrollments, setMyEnrollments] = useState<Set<string>>(new Set());

  const currentStudent = studentsData[0]; // Emma Johnson

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("sessions");
    const savedEnrollments = localStorage.getItem(`enrollments_${currentStudent.id}`);
    
    if (saved) {
      setSessions(JSON.parse(saved));
    } else {
      setSessions(sessionsData);
      localStorage.setItem("sessions", JSON.stringify(sessionsData));
    }

    if (savedEnrollments) {
      setMyEnrollments(new Set(JSON.parse(savedEnrollments)));
    }
  }, []);

  const saveToStorage = (updatedSessions: Session[], updatedEnrollments: Set<string>) => {
    localStorage.setItem("sessions", JSON.stringify(updatedSessions));
    localStorage.setItem(`enrollments_${currentStudent.id}`, JSON.stringify([...updatedEnrollments]));
  };

  const months = [
    { name: "February 2026", year: 2026, month: 1 },
    { name: "March 2026", year: 2026, month: 2 },
  ];

  const currentMonthData = months[currentMonth];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonthData.year, currentMonthData.month);
  const firstDay = getFirstDayOfMonth(currentMonthData.year, currentMonthData.month);

  const getSessionForDate = (day: number) => {
    const dateStr = `${currentMonthData.year}-${String(currentMonthData.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return sessions.find((s) => s.date === dateStr);
  };

  const getInstructorName = (instructorId: string | null) => {
    if (!instructorId) return "TBA";
    const instructor = instructorsData.find((i) => i.id === instructorId);
    return instructor ? instructor.name : "TBA";
  };

  const handleDayClick = (session: Session) => {
    setSelectedSession(session);
    setShowDialog(true);
  };

  const canCancelSession = (sessionDate: string) => {
    const session = new Date(sessionDate);
    const now = new Date();
    const diffHours = (session.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours > 24;
  };

  const handleRegister = () => {
    if (selectedSession) {
      const updatedSessions = sessions.map((s) =>
        s.id === selectedSession.id
          ? {
              ...s,
              enrolledStudents: [...(s.enrolledStudents || []), currentStudent.id],
              slotsFilled: s.slotsFilled + 1,
            }
          : s
      );
      
      const updatedEnrollments = new Set(myEnrollments);
      updatedEnrollments.add(selectedSession.id);
      
      setSessions(updatedSessions);
      setMyEnrollments(updatedEnrollments);
      saveToStorage(updatedSessions, updatedEnrollments);
      
      setShowDialog(false);
      setSelectedSession(null);
      toast.success("Successfully registered for the session!");
    }
  };

  const handleCancel = () => {
    if (selectedSession) {
      if (!canCancelSession(selectedSession.date)) {
        toast.error("Cannot cancel within 24 hours of the session");
        return;
      }

      const updatedSessions = sessions.map((s) =>
        s.id === selectedSession.id
          ? {
              ...s,
              enrolledStudents: (s.enrolledStudents || []).filter(id => id !== currentStudent.id),
              slotsFilled: Math.max(0, s.slotsFilled - 1),
            }
          : s
      );
      
      const updatedEnrollments = new Set(myEnrollments);
      updatedEnrollments.delete(selectedSession.id);
      
      setSessions(updatedSessions);
      setMyEnrollments(updatedEnrollments);
      saveToStorage(updatedSessions, updatedEnrollments);
      
      setShowDialog(false);
      setSelectedSession(null);
      toast.success("Registration cancelled successfully");
    }
  };

  const isEnrolled = (sessionId: string) => myEnrollments.has(sessionId);

  return (
    <>
      <Toaster />
      <Card className="shadow-lg border-0 overflow-hidden">
        <div className="bg-white">
          {/* Month Navigation */}
          <div className="flex items-center justify-between p-4 border-b">
            <Button
              onClick={onPrevMonth}
              disabled={currentMonth === 0}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-bold text-gray-900">{currentMonthData.name}</h2>
            <Button
              onClick={onNextMonth}
              disabled={currentMonth === months.length - 1}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <CardContent className="p-3">
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day Headers */}
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div
                  key={i}
                  className="text-center font-semibold text-gray-500 text-xs py-2"
                >
                  {day}
                </div>
              ))}

              {/* Empty cells */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Calendar Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const session = getSessionForDate(day);
                const isFull = session && session.slotsFilled >= session.slotsTotal;
                const hasSession = !!session;
                const enrolled = session && isEnrolled(session.id);

                return (
                  <div
                    key={day}
                    className={`aspect-square p-1 border rounded-lg flex flex-col items-center justify-center transition-all ${
                      enrolled
                        ? "bg-blue-500 text-white border-blue-600 shadow-md"
                        : hasSession && !isFull
                        ? "bg-green-50 border-green-300 hover:bg-green-100 cursor-pointer active:scale-95"
                        : hasSession && isFull
                        ? "bg-gray-100 border-gray-300"
                        : "bg-white border-gray-200"
                    }`}
                    onClick={() => hasSession && session && handleDayClick(session)}
                  >
                    <span className={`text-xs font-medium ${enrolled ? "text-white" : "text-gray-700"}`}>
                      {day}
                    </span>
                    {hasSession && (
                      <span className={`text-[10px] mt-0.5 ${enrolled ? "text-blue-100" : "text-gray-500"}`}>
                        {session.slotsFilled}/{session.slotsTotal}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs px-2">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span className="text-gray-600">Enrolled</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-green-50 border-2 border-green-300 rounded" />
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded" />
                <span className="text-gray-600">Full</span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Session Details Dialog */}
      {selectedSession && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Session Details</DialogTitle>
              <DialogDescription>
                {new Date(selectedSession.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Instructor</p>
                  <p className="font-medium text-gray-900">{getInstructorName(selectedSession.instructorId)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium text-gray-900">
                    {selectedSession.startTime} - {selectedSession.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Cost</p>
                  <p className="font-medium text-gray-900">${selectedSession.costPerHour}/hour</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  {selectedSession.slotsTotal - selectedSession.slotsFilled} spots available
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all"
                    style={{
                      width: `${(selectedSession.slotsFilled / selectedSession.slotsTotal) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  {selectedSession.slotsFilled} / {selectedSession.slotsTotal} enrolled
                </p>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              {isEnrolled(selectedSession.id) ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                    className="w-full sm:w-auto"
                  >
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleCancel}
                    disabled={!canCancelSession(selectedSession.date)}
                    className="w-full sm:w-auto"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {canCancelSession(selectedSession.date) ? "Cancel Registration" : "Cannot Cancel (< 24hrs)"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                    className="w-full sm:w-auto"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleRegister}
                    disabled={selectedSession.slotsFilled >= selectedSession.slotsTotal}
                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    Register
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
