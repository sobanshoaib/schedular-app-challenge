import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ChevronLeft, ChevronRight, Users, GripVertical, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { sessionsData, Session, instructorsData, Instructor } from "@/app/data/mock-data";
import { toast } from "sonner";
import { Toaster } from "@/app/components/ui/sonner";

interface AdminViewProps {
  currentMonth: number;
  onNextMonth: () => void;
  onPrevMonth: () => void;
}

const ItemType = "INSTRUCTOR";

interface DraggableInstructorProps {
  instructor: Instructor;
  fromSessionId?: string;
}

function DraggableInstructor({ instructor, fromSessionId }: DraggableInstructorProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { instructorId: instructor.id, fromSessionId: fromSessionId || null },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`flex items-center gap-2 p-3 bg-white border-2 border-indigo-200 rounded-lg cursor-move hover:border-indigo-400 hover:shadow-md transition-all ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <GripVertical className="w-4 h-4 text-indigo-400" />
      <div className="flex-1">
        <p className="font-medium text-sm text-gray-900">{instructor.name}</p>
        <p className="text-xs text-gray-500">{instructor.specialty}</p>
      </div>
    </div>
  );
}

interface SessionCardProps {
  session: Session;
  instructor: Instructor | null;
  onRemoveInstructor: (sessionId: string) => void;
  onDrop: (instructorId: string, fromSessionId: string | null, toSessionId: string) => void;
}

function SessionCard({ session, instructor, onRemoveInstructor, onDrop }: SessionCardProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemType,
    drop: (item: { instructorId: string; fromSessionId: string | null }) => {
      onDrop(item.instructorId, item.fromSessionId, session.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const needsInstructor = !session.instructorId;

  return (
    <Card
      ref={drop}
      className={`shadow-md transition-all ${
        isOver && canDrop
          ? "ring-2 ring-indigo-500 bg-indigo-50"
          : needsInstructor
          ? "border-2 border-dashed border-amber-300 bg-amber-50"
          : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">
              {new Date(session.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {session.startTime} - {session.endTime}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {session.slotsFilled}/{session.slotsTotal}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {needsInstructor ? (
          <div className="border-2 border-dashed border-amber-400 bg-amber-50 rounded-lg p-4 text-center">
            <Users className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-amber-700">No Instructor Assigned</p>
            <p className="text-xs text-amber-600 mt-1">Drag an instructor here</p>
          </div>
        ) : instructor ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
              <GripVertical className="w-4 h-4 text-indigo-400" />
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900">{instructor.name}</p>
                <p className="text-xs text-gray-500">{instructor.specialty}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveInstructor(session.id)}
                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-center text-gray-500">
              Click Replace to swap, or drag another instructor
            </p>
          </div>
        ) : null}

        {isOver && canDrop && (
          <div className="mt-2 border-2 border-dashed border-indigo-400 bg-indigo-100 rounded-lg p-3 text-center">
            <p className="text-sm text-indigo-700 font-medium">Drop to assign</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AdminView({ currentMonth, onNextMonth, onPrevMonth }: AdminViewProps) {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("sessions");
    if (saved) {
      setSessions(JSON.parse(saved));
    } else {
      setSessions(sessionsData);
    }
  }, []);

  const months = [
    { name: "February 2026", year: 2026, month: 1 },
    { name: "March 2026", year: 2026, month: 2 },
  ];

  const currentMonthData = months[currentMonth];

  const getSessionsForMonth = () => {
    const monthStr = String(currentMonthData.month + 1).padStart(2, "0");
    return sessions.filter((s) => s.date.includes(`2026-${monthStr}`));
  };

  const getInstructorById = (instructorId: string | null) => {
    if (!instructorId) return null;
    return instructorsData.find((i) => i.id === instructorId) || null;
  };

  const getAvailableInstructors = () => {
    const assignedIds = new Set(
      sessions.filter((s) => s.instructorId).map((s) => s.instructorId)
    );
    return instructorsData.filter((i) => !assignedIds.has(i.id));
  };

  const handleRemoveInstructor = (sessionId: string) => {
    const updatedSessions = sessions.map((s) =>
      s.id === sessionId ? { ...s, instructorId: null } : s
    );
    setSessions(updatedSessions);
    localStorage.setItem("sessions", JSON.stringify(updatedSessions));
    toast.success("Instructor removed. Drag a new one to assign.");
  };

  const handleDrop = (instructorId: string, fromSessionId: string | null, toSessionId: string) => {
    const updatedSessions = sessions.map((session) => {
      // Remove instructor from previous session if moving from another session
      if (session.id === fromSessionId) {
        return { ...session, instructorId: null };
      }
      // Assign instructor to new session
      if (session.id === toSessionId) {
        return { ...session, instructorId: instructorId };
      }
      return session;
    });

    setSessions(updatedSessions);
    localStorage.setItem("sessions", JSON.stringify(updatedSessions));

    if (fromSessionId) {
      toast.success("Instructor moved successfully");
    } else {
      toast.success("Instructor assigned successfully");
    }
  };

  const monthSessions = getSessionsForMonth();
  const availableInstructors = getAvailableInstructors();

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster />
      
      {/* Month Navigation */}
      <Card className="shadow-lg border-0 mb-4">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <Button
              onClick={onPrevMonth}
              disabled={currentMonth === 0}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <CardTitle className="text-xl">{currentMonthData.name}</CardTitle>
              <p className="text-sm text-indigo-100 mt-1">Manage Instructor Assignments</p>
            </div>
            <Button
              onClick={onNextMonth}
              disabled={currentMonth === months.length - 1}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Available Instructors Sidebar */}
      {availableInstructors.length > 0 && (
        <Card className="shadow-lg border-0 mb-4 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Available Instructors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {availableInstructors.map((instructor) => (
              <DraggableInstructor key={instructor.id} instructor={instructor} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Sessions */}
      <div className="space-y-4">
        {monthSessions.length === 0 ? (
          <Card className="shadow-md">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No sessions this month</p>
            </CardContent>
          </Card>
        ) : (
          monthSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              instructor={getInstructorById(session.instructorId)}
              onRemoveInstructor={handleRemoveInstructor}
              onDrop={handleDrop}
            />
          ))
        )}
      </div>
    </DndProvider>
  );
}
