
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import StudentProfileForm from "@/components/StudentProfileForm";
import UserAuth from "@/components/UserAuth";
import { isUserLoggedIn, getCurrentUser } from "@/utils/dataLoader";

const Registration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is logged in
  useEffect(() => {
    // Redirect non-logged in users to assessment page
    if (!isUserLoggedIn()) {
      toast({
        title: "Login Required",
        description: "Please login or register to access this page.",
        variant: "destructive"
      });
      navigate("/assessment");
    }
  }, [navigate, toast]);

  const handleSubmit = (data: any) => {
    toast({
      title: "Registration successful!",
      description: "You can now proceed to the aptitude test.",
    });
    
    // Get current user if logged in
    const currentUser = getCurrentUser();
    
    // If user is logged in, associate the profile with their account
    if (currentUser && currentUser.email) {
      const usersData = localStorage.getItem('userProfiles') || '{}';
      const users = JSON.parse(usersData);
      
      users[currentUser.email] = {
        ...users[currentUser.email],
        ...data
      };
      
      localStorage.setItem('userProfiles', JSON.stringify(users));
      
      // Update current user
      localStorage.setItem('currentUser', JSON.stringify({
        ...currentUser,
        ...data
      }));
    }
    
    // Save data to localStorage for the current session
    localStorage.setItem("userProfile", JSON.stringify(data));
    
    // Navigate to the next step
    navigate("/aptitude-test");
  };

  // If not logged in, don't render the form (will redirect via useEffect)
  if (!isUserLoggedIn()) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl gradient-heading">Student Profile</CardTitle>
          <CardDescription>
            Please provide your information to start the career assessment process.
            {isUserLoggedIn() && (
              <span className="block mt-2 text-career-blue">
                Logged in as: {getCurrentUser().name || getCurrentUser().email}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StudentProfileForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Registration;
