
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Award, BookOpen, Briefcase, Building, Star, TrendingUp } from "lucide-react";

// Mock career recommendations data
const mockCareers = [
  {
    id: 1,
    title: "Software Developer",
    description: "Develop applications and systems using programming languages and development tools.",
    keySkills: ["Programming", "Problem Solving", "Analytical Thinking", "Creativity"],
    educationPath: "Computer Science or related degree, coding bootcamps, or self-taught with portfolio",
    growthOutlook: "Very High",
    salaryRange: "$70,000 - $150,000",
    industries: ["Technology", "Finance", "Healthcare", "E-commerce"],
    matchPercentage: 95,
  },
  {
    id: 2,
    title: "Data Scientist",
    description: "Analyze and interpret complex data to help organizations make better decisions.",
    keySkills: ["Mathematics", "Programming", "Statistics", "Research", "Communication"],
    educationPath: "Statistics, Mathematics, Computer Science, or related quantitative field",
    growthOutlook: "High",
    salaryRange: "$80,000 - $160,000",
    industries: ["Technology", "Finance", "Healthcare", "Retail", "Manufacturing"],
    matchPercentage: 88,
  },
  {
    id: 3,
    title: "UX/UI Designer",
    description: "Create intuitive, engaging user experiences for websites and applications.",
    keySkills: ["Design", "Creativity", "Communication", "Problem Solving", "Empathy"],
    educationPath: "Design, Human-Computer Interaction, or self-taught with portfolio",
    growthOutlook: "High",
    salaryRange: "$65,000 - $130,000",
    industries: ["Technology", "Marketing", "E-commerce", "Entertainment"],
    matchPercentage: 82,
  },
];

const CareerRecommendations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [careers, setCareers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has completed the test
    const testResults = localStorage.getItem("testResults");
    const userProfile = localStorage.getItem("userProfile");
    
    if (!testResults || !userProfile) {
      toast({
        title: "Error",
        description: "Please complete the assessment first.",
        variant: "destructive",
      });
      navigate("/assessment");
      return;
    }

    // In a real app, we would fetch recommendations from the backend
    // For now, use mock data
    setTimeout(() => {
      setCareers(mockCareers);
      setIsLoading(false);
    }, 1500);
  }, [navigate, toast]);

  const viewRoadmap = (careerId: number) => {
    // Save selected career to localStorage
    const selectedCareer = careers.find((career) => career.id === careerId);
    localStorage.setItem("selectedCareer", JSON.stringify(selectedCareer));
    
    // Navigate to roadmap page
    navigate(`/career-roadmap/${careerId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-6 gradient-heading">Analyzing Your Results</h2>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-career-lightpurple rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-career-lightblue rounded w-full mx-auto"></div>
            <div className="h-4 bg-career-lightpurple rounded w-5/6 mx-auto"></div>
          </div>
          <p className="mt-6 text-career-gray">
            Our AI is analyzing your skills, interests, and aptitude to find your perfect career matches...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3 gradient-heading">Your Career Recommendations</h1>
          <p className="text-career-gray max-w-2xl mx-auto">
            Based on your skills, interests, and aptitude test results, we've identified these career paths as your best matches.
          </p>
        </div>

        <div className="space-y-6">
          {careers.map((career) => (
            <Card key={career.id} className="card-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-career-blue">{career.title}</CardTitle>
                    <CardDescription className="text-base">{career.description}</CardDescription>
                  </div>
                  <div className="flex items-center bg-career-lightpurple px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 text-career-purple mr-1 fill-career-purple" />
                    <span className="font-semibold text-career-purple">{career.matchPercentage}% Match</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Award className="h-5 w-5 text-career-purple mt-0.5" />
                      <div>
                        <p className="font-medium">Key Skills</p>
                        <p className="text-sm text-gray-600">{career.keySkills.join(", ")}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <BookOpen className="h-5 w-5 text-career-purple mt-0.5" />
                      <div>
                        <p className="font-medium">Education Path</p>
                        <p className="text-sm text-gray-600">{career.educationPath}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <TrendingUp className="h-5 w-5 text-career-blue mt-0.5" />
                      <div>
                        <p className="font-medium">Growth Outlook</p>
                        <p className="text-sm text-gray-600">{career.growthOutlook}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Briefcase className="h-5 w-5 text-career-blue mt-0.5" />
                      <div>
                        <p className="font-medium">Salary Range</p>
                        <p className="text-sm text-gray-600">{career.salaryRange}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Building className="h-5 w-5 text-career-blue mt-0.5" />
                      <div>
                        <p className="font-medium">Industries</p>
                        <p className="text-sm text-gray-600">{career.industries.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button 
                  onClick={() => viewRoadmap(career.id)}
                  className="bg-career-purple hover:bg-career-blue transition-colors"
                >
                  View Career Roadmap <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="mb-4 text-career-gray">Want to explore more options?</p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/colleges")}
            className="mr-4 border-career-purple text-career-purple hover:bg-career-lightpurple"
          >
            Browse Colleges
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/assessment")}
            className="border-career-blue text-career-blue hover:bg-career-lightblue"
          >
            Retake Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CareerRecommendations;
