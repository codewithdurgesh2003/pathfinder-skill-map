
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveUserProfile, isUserLoggedIn, getCurrentUser } from "@/utils/dataLoader";

const UserAuth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loginChecked, setLoginChecked] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    setLoginChecked(true);
  }, []);

  if (loginChecked && isUserLoggedIn()) {
    const user = getCurrentUser();
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome back, {user.name || user.email}</CardTitle>
          <CardDescription>You are already logged in</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.removeItem('currentUser');
              toast({
                title: "Logged out",
                description: "You have been logged out successfully.",
              });
              window.location.reload();
            }}
          >
            Logout
          </Button>
          <Button 
            onClick={() => navigate("/assessment")}
          >
            Continue to Assessment
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get stored user profiles
    const usersData = localStorage.getItem('userProfiles') || '{}';
    const users = JSON.parse(usersData);
    
    // Simple login logic (in a real app, we would use a proper auth system)
    if (users[email]) {
      // In a real app, we would validate the password hash here
      
      // Set current user
      localStorage.setItem('currentUser', JSON.stringify({
        email,
        ...users[email]
      }));
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Refresh the page to update navigation
      window.location.reload();
    } else {
      toast({
        title: "Login failed",
        description: "Email not found. Please register first.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!email || !password || !name) {
      toast({
        title: "Registration failed",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // Create new user profile
    saveUserProfile(email, { name, email });
    
    toast({
      title: "Registration successful",
      description: "You can now proceed with the assessment.",
    });
    
    // Refresh the page to update navigation
    window.location.reload();
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome to CareerFinder</CardTitle>
        <CardDescription>Login or register to start your career assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full bg-career-purple hover:bg-career-blue">
                Login
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="name">Full Name</label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="reg-email">Email</label>
                <Input 
                  id="reg-email" 
                  type="email" 
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="reg-password">Password</label>
                <Input 
                  id="reg-password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full bg-career-purple hover:bg-career-blue">
                Register
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserAuth;
