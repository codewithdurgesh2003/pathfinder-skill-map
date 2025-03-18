
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import StudentProfileForm from "@/components/StudentProfileForm";

const Registration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    toast({
      title: "Registration successful!",
      description: "You can now proceed to the aptitude test.",
    });
    
    // Save data to localStorage for demo purposes
    localStorage.setItem("userProfile", JSON.stringify(data));
    
    // Navigate to the next step
    navigate("/aptitude-test");
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl gradient-heading">Registration</CardTitle>
          <CardDescription>
            Please provide your information to start the career assessment process.
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
