import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, User, LogOut } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ParentView } from "@/app/components/parent-view";
import { AdminView } from "@/app/components/admin-view";

export function Home() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = February, 1 = March

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role) {
      navigate("/");
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/");
  };

  const nextMonth = () => {
    if (currentMonth < 1) {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth > 0) {
      setCurrentMonth(currentMonth - 1);
    }
  };

  if (!userRole) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Mobile App Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {userRole === "admin" ? "Admin Panel" : "My Schedule"}
              </h1>
              <p className="text-xs text-indigo-100">
                {userRole === "admin" ? "Manage Sessions" : "Book Your Classes"}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Bottom Navigation */}
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/home")}
            variant="ghost"
            size="sm"
            className="flex-1 text-white bg-white/20 hover:bg-white/30"
          >
            Calendar
          </Button>
          {userRole === "parent" && (
            <Button
              onClick={() => navigate("/profile")}
              variant="ghost"
              size="sm"
              className="flex-1 text-white hover:bg-white/20"
            >
              Profile
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto">
        {userRole === "parent" ? (
          <ParentView
            currentMonth={currentMonth}
            onNextMonth={nextMonth}
            onPrevMonth={prevMonth}
          />
        ) : (
          <AdminView
            currentMonth={currentMonth}
            onNextMonth={nextMonth}
            onPrevMonth={prevMonth}
          />
        )}
      </div>
    </div>
  );
}
