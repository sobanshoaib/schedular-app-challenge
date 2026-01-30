import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Calendar } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sample credentials
    if (username === "parent" && password === "password123") {
      localStorage.setItem("userRole", "parent");
      localStorage.setItem("username", "parent");
      navigate("/home");
    } else if (username === "admin" && password === "admin123") {
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("username", "admin");
      navigate("/home");
    } else {
      setError("Invalid credentials. Check the demo credentials below.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-500 to-purple-600 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <Calendar className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Scheduler</h1>
          <p className="text-indigo-100">Manage your classes easily</p>
        </div>
        
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Sign in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
              )}
              <Button type="submit" className="w-full h-12 text-base">
                Sign In
              </Button>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500 mb-2">Demo Credentials:</p>
                <div className="space-y-1 text-xs text-center">
                  <p className="text-gray-600">
                    <span className="font-semibold">Parent:</span> username: <strong>parent</strong>, password: <strong>password123</strong>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Admin:</span> username: <strong>admin</strong>, password: <strong>admin123</strong>
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
