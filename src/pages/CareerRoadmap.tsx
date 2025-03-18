import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, 
  Award, 
  BookOpen, 
  BriefcaseBusiness, 
  Clock,
  GraduationCap, 
  Lightbulb, 
  ListChecks, 
  School
} from "lucide-react";
import { careers } from "@/data/careerData";

interface Step {
  title: string;
  description: string;
  duration: string;
  prerequisites?: string[];
  institution_types?: string[];
}

interface RoadmapPhase {
  title: string;
  description: string;
  steps: Step[];
}

const getRoadmapData = (careerId: string) => {
  const career = careers.find(c => c.title === careerId);
  
  if (!career) return null;
  
  return {
    career: career.title,
    phases: [
      {
        title: "Education",
        description: "Required educational qualifications",
        steps: [
          {
            title: "High School",
            description: "Complete high school with focus on relevant subjects",
            duration: "3-4 years",
            prerequisites: ["Basic education"],
          },
          {
            title: "Bachelor's Degree",
            description: `Undergraduate degree in fields related to ${career.title}`,
            duration: "3-4 years",
            prerequisites: ["High school diploma"],
            institution_types: ["University", "College"]
          },
          {
            title: "Master's Degree (Optional)",
            description: "Advanced degree for specialization",
            duration: "1-2 years",
            prerequisites: ["Bachelor's degree"],
            institution_types: ["University"]
          }
        ]
      },
      {
        title: "Skill Development",
        description: "Essential skills to develop",
        steps: career.requiredSkills.map(skill => ({
          title: skill,
          description: `Develop proficiency in ${skill}`,
          duration: "Ongoing",
          prerequisites: []
        }))
      },
      {
        title: "Career Progression",
        description: "Typical career path",
        steps: [
          {
            title: "Entry Level",
            description: `Junior ${career.title} role`,
            duration: "1-3 years",
            prerequisites: ["Bachelor's degree", ...career.requiredSkills.slice(0, 2)]
          },
          {
            title: "Mid Level",
            description: `Experienced ${career.title}`,
            duration: "3-5 years",
            prerequisites: ["Entry level experience"]
          },
          {
            title: "Senior Level",
            description: `Senior ${career.title} / Leadership role`,
            duration: "5+ years",
            prerequisites: ["Mid level experience", "Leadership skills"]
          }
        ]
      }
    ]
  };
};

const CareerRoadmap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { careerId } = useParams<{ careerId: string }>();
  const [activeTab, setActiveTab] = useState("education");
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!careerId) {
      toast({
        title: "Error",
        description: "Career ID not found.",
        variant: "destructive",
      });
      navigate("/career-recommendations");
      return;
    }

    setTimeout(() => {
      const data = getRoadmapData(careerId);
      if (!data) {
        toast({
          title: "Error",
          description: "Career roadmap not found.",
          variant: "destructive",
        });
        navigate("/career-recommendations");
        return;
      }
      setRoadmapData(data);
      setIsLoading(false);
    }, 1000);
  }, [careerId, navigate, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-6 gradient-heading">Loading Career Roadmap</h2>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-career-lightpurple rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-career-lightblue rounded w-full mx-auto"></div>
            <div className="h-4 bg-career-lightpurple rounded w-5/6 mx-auto"></div>
          </div>
          <p className="mt-6 text-career-gray">
            Please wait while we prepare your personalized career roadmap...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/career-recommendations")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Recommendations
        </Button>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3 gradient-heading">
            {roadmapData.career} Roadmap
          </h1>
          <p className="text-career-gray max-w-2xl mx-auto">
            Your personalized path to becoming a successful {roadmapData.career}. Follow this roadmap to develop the necessary skills and qualifications.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as string)}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="education" className="text-career-blue">
              <GraduationCap className="mr-2 h-4 w-4" /> Education
            </TabsTrigger>
            <TabsTrigger value="skills" className="text-career-purple">
              <Lightbulb className="mr-2 h-4 w-4" /> Skills
            </TabsTrigger>
            <TabsTrigger value="career" className="text-career-green">
              <BriefcaseBusiness className="mr-2 h-4 w-4" /> Career Path
            </TabsTrigger>
          </TabsList>

          {roadmapData.phases.map((phase: RoadmapPhase, index: number) => (
            <TabsContent key={index} value={phase.title.toLowerCase()}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    {index === 0 && <GraduationCap className="mr-2 h-5 w-5 text-career-blue" />}
                    {index === 1 && <Lightbulb className="mr-2 h-5 w-5 text-career-purple" />}
                    {index === 2 && <BriefcaseBusiness className="mr-2 h-5 w-5 text-career-green" />}
                    {phase.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {phase.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="relative pl-8">
                        {stepIndex < phase.steps.length - 1 && (
                          <div className="absolute left-4 top-8 h-full w-0.5 bg-gray-200"></div>
                        )}
                        <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-career-lightblue">
                          <span className="text-sm font-medium text-career-blue">{stepIndex + 1}</span>
                        </div>
                        <div className="pt-1">
                          <h3 className="text-lg font-semibold">{step.title}</h3>
                          <p className="text-career-gray mt-1">{step.description}</p>
                          
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start space-x-2">
                              <Clock className="h-5 w-5 text-career-purple mt-0.5" />
                              <div>
                                <p className="font-medium text-sm">Duration</p>
                                <p className="text-sm text-gray-600">{step.duration}</p>
                              </div>
                            </div>
                            
                            {step.prerequisites && step.prerequisites.length > 0 && (
                              <div className="flex items-start space-x-2">
                                <ListChecks className="h-5 w-5 text-career-blue mt-0.5" />
                                <div>
                                  <p className="font-medium text-sm">Prerequisites</p>
                                  <p className="text-sm text-gray-600">
                                    {step.prerequisites.join(", ")}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {step.institution_types && step.institution_types.length > 0 && (
                              <div className="flex items-start space-x-2">
                                <School className="h-5 w-5 text-career-green mt-0.5" />
                                <div>
                                  <p className="font-medium text-sm">Institution Types</p>
                                  <p className="text-sm text-gray-600">
                                    {step.institution_types.join(", ")}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-10 bg-career-lightpurple rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mt-1">
              <Award className="h-5 w-5 text-career-purple" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-career-purple">Success Tips</h3>
              <p className="text-gray-700 mt-2">
                Build a strong portfolio showcasing your skills and projects. Network with professionals in the field by attending industry events and joining relevant online communities. Consider finding a mentor who can provide guidance and introduce you to opportunities.
              </p>
              <div className="mt-4">
                <Button 
                  onClick={() => navigate("/colleges")}
                  className="bg-career-purple hover:bg-career-blue transition-colors"
                >
                  <BookOpen className="mr-2 h-4 w-4" /> Browse Relevant Colleges
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerRoadmap;
