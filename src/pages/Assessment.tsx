
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  ClipboardList, 
  User, 
  GraduationCap, 
  CheckCircle 
} from "lucide-react";

const Assessment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Check if registration and test are already completed
  useEffect(() => {
    const userProfile = localStorage.getItem("userProfile");
    const testResults = localStorage.getItem("testResults");
    
    if (userProfile && testResults) {
      setCurrentStep(2); // Both registration and test completed
    } else if (userProfile) {
      setCurrentStep(1); // Only registration completed
    } else {
      setCurrentStep(0); // Nothing completed yet
    }
  }, []);

  const startRegistration = () => {
    navigate("/registration");
  };

  const startAptitudeTest = () => {
    navigate("/aptitude-test");
  };

  const viewRecommendations = () => {
    navigate("/career-recommendations");
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3 gradient-heading">Career Assessment</h1>
          <p className="text-career-gray max-w-2xl mx-auto">
            Complete our comprehensive assessment to discover career paths perfectly matched to your skills, interests, and aptitude.
          </p>
        </div>

        <div className="flex items-center justify-between mb-10">
          <div className="w-full flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 0 ? "bg-career-purple text-white" : "bg-gray-200 text-gray-500"
            }`}>
              <User className="h-5 w-5" />
            </div>
            <div className={`h-1 flex-1 mx-2 ${
              currentStep >= 1 ? "bg-career-purple" : "bg-gray-200"
            }`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? "bg-career-purple text-white" : "bg-gray-200 text-gray-500"
            }`}>
              <ClipboardList className="h-5 w-5" />
            </div>
            <div className={`h-1 flex-1 mx-2 ${
              currentStep >= 2 ? "bg-career-purple" : "bg-gray-200"
            }`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? "bg-career-purple text-white" : "bg-gray-200 text-gray-500"
            }`}>
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className={`card-shadow border-l-4 ${currentStep === 0 ? "border-l-career-blue" : "border-l-green-500"}`}>
            <CardContent className="p-6">
              <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mt-1 ${
                    currentStep > 0 ? "bg-green-100 text-green-600" : "bg-career-lightblue text-career-blue"
                  }`}>
                    {currentStep > 0 ? <CheckCircle className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Step 1: Registration
                      {currentStep > 0 && <span className="text-green-600 text-sm ml-2">(Completed)</span>}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Provide your basic information, academic background, skills, and interests.
                    </p>
                  </div>
                </div>
                {currentStep === 0 ? (
                  <Button 
                    onClick={startRegistration}
                    className="bg-career-blue hover:bg-career-purple transition-colors"
                  >
                    Start Registration <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={startRegistration}
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    Update Information
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={`card-shadow border-l-4 ${
            currentStep === 0 ? "border-l-gray-200" : 
            currentStep === 1 ? "border-l-career-blue" : "border-l-green-500"
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mt-1 ${
                    currentStep === 0 ? "bg-gray-100 text-gray-400" : 
                    currentStep > 1 ? "bg-green-100 text-green-600" : "bg-career-lightblue text-career-blue"
                  }`}>
                    {currentStep > 1 ? (
                      <CheckCircle className="h-5 w-5" /> 
                    ) : (
                      <ClipboardList className={`h-5 w-5 ${currentStep === 0 ? "text-gray-400" : ""}`} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Step 2: Aptitude Test
                      {currentStep > 1 && <span className="text-green-600 text-sm ml-2">(Completed)</span>}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Complete the personality and aptitude assessment to help us understand your strengths.
                    </p>
                  </div>
                </div>
                {currentStep === 0 ? (
                  <Button 
                    disabled
                    className="bg-gray-300 text-gray-600 cursor-not-allowed"
                  >
                    Complete Registration First
                  </Button>
                ) : currentStep === 1 ? (
                  <Button 
                    onClick={startAptitudeTest}
                    className="bg-career-blue hover:bg-career-purple transition-colors"
                  >
                    Start Aptitude Test <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={startAptitudeTest}
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    Retake Test
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={`card-shadow border-l-4 ${
            currentStep < 2 ? "border-l-gray-200" : "border-l-career-blue"
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mt-1 ${
                    currentStep < 2 ? "bg-gray-100 text-gray-400" : "bg-career-lightblue text-career-blue"
                  }`}>
                    <GraduationCap className={`h-5 w-5 ${currentStep < 2 ? "text-gray-400" : ""}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Step 3: Career Recommendations
                    </h3>
                    <p className="text-gray-600 mt-1">
                      View your personalized career matches and detailed roadmaps for success.
                    </p>
                  </div>
                </div>
                {currentStep < 2 ? (
                  <Button 
                    disabled
                    className="bg-gray-300 text-gray-600 cursor-not-allowed"
                  >
                    Complete Previous Steps
                  </Button>
                ) : (
                  <Button 
                    onClick={viewRecommendations}
                    className="bg-career-blue hover:bg-career-purple transition-colors"
                  >
                    View Recommendations <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-career-lightpurple rounded-lg">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mt-1">
              <GraduationCap className="h-5 w-5 text-career-purple" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-career-purple">Your Career Journey Starts Here</h3>
              <p className="text-gray-700 mt-2">
                By completing our comprehensive assessment, you'll gain valuable insights into potential career paths 
                that match your unique profile. Our AI-powered system analyzes multiple factors to provide 
                personalized recommendations and detailed roadmaps for success.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
