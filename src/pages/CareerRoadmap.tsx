
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { 
  Award, 
  BookOpen, 
  Briefcase, 
  Building, 
  Download, 
  GraduationCap, 
  Lightbulb, 
  Link,
  Map,
  Star, 
  TrendingUp 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Mock roadmap data for different careers
const roadmapData = {
  1: { // Software Developer
    title: "Software Developer Roadmap",
    description: "A comprehensive roadmap to become a successful Software Developer.",
    steps: [
      {
        title: "Foundation (0-6 months)",
        description: "Build your programming foundation",
        tasks: [
          "Learn a programming language (Python, JavaScript, Java)",
          "Master programming fundamentals (variables, loops, conditionals)",
          "Study basic data structures and algorithms",
          "Learn version control with Git",
          "Create small projects to practice your skills"
        ]
      },
      {
        title: "Development Skills (6-12 months)",
        description: "Enhance your development skills",
        tasks: [
          "Learn web development fundamentals (HTML, CSS, JavaScript)",
          "Study a front-end framework (React, Angular, Vue)",
          "Learn back-end development with a framework (Node.js, Django, Spring)",
          "Master database concepts (SQL and NoSQL)",
          "Build full-stack applications"
        ]
      },
      {
        title: "Specialization (1-2 years)",
        description: "Specialize in your area of interest",
        tasks: [
          "Choose a specialization (web, mobile, AI, game development)",
          "Study advanced concepts in your chosen area",
          "Build complex projects that showcase your skills",
          "Learn industry best practices for your specialization",
          "Contribute to open source projects"
        ]
      },
      {
        title: "Professional Growth (2+ years)",
        description: "Grow as a professional developer",
        tasks: [
          "Master software architecture patterns",
          "Learn DevOps and CI/CD pipelines",
          "Study system design and scalability",
          "Improve code quality and testing practices",
          "Mentor junior developers and lead projects"
        ]
      }
    ],
    resources: [
      {
        name: "freeCodeCamp",
        url: "https://www.freecodecamp.org/",
        type: "Learning Platform"
      },
      {
        name: "The Odin Project",
        url: "https://www.theodinproject.com/",
        type: "Learning Path"
      },
      {
        name: "LeetCode",
        url: "https://leetcode.com/",
        type: "Coding Practice"
      },
      {
        name: "GitHub",
        url: "https://github.com/",
        type: "Version Control"
      },
      {
        name: "Stack Overflow",
        url: "https://stackoverflow.com/",
        type: "Q&A Platform"
      }
    ],
    certifications: [
      "AWS Certified Developer",
      "Microsoft Certified: Azure Developer Associate",
      "Google Professional Cloud Developer",
      "Oracle Certified Professional, Java SE Developer",
      "Certified Kubernetes Application Developer (CKAD)"
    ]
  },
  2: { // Data Scientist
    title: "Data Scientist Roadmap",
    description: "A step-by-step guide to becoming a proficient Data Scientist.",
    steps: [
      {
        title: "Foundation (0-6 months)",
        description: "Build your data science foundation",
        tasks: [
          "Learn a programming language (Python or R)",
          "Master statistics and probability fundamentals",
          "Study linear algebra and calculus basics",
          "Learn data manipulation with Pandas/NumPy",
          "Practice data visualization techniques"
        ]
      },
      {
        title: "Machine Learning Basics (6-12 months)",
        description: "Learn machine learning fundamentals",
        tasks: [
          "Study supervised learning algorithms",
          "Learn unsupervised learning techniques",
          "Practice feature engineering",
          "Master model evaluation metrics",
          "Build end-to-end ML projects"
        ]
      },
      {
        title: "Advanced Techniques (1-2 years)",
        description: "Specialize in advanced techniques",
        tasks: [
          "Study deep learning fundamentals",
          "Learn natural language processing",
          "Master computer vision techniques",
          "Practice time series analysis",
          "Study reinforcement learning"
        ]
      },
      {
        title: "Professional Growth (2+ years)",
        description: "Grow as a professional data scientist",
        tasks: [
          "Master production ML systems",
          "Learn MLOps practices",
          "Study big data technologies",
          "Develop expertise in a specific industry",
          "Lead data science projects and mentor others"
        ]
      }
    ],
    resources: [
      {
        name: "Kaggle",
        url: "https://www.kaggle.com/",
        type: "Learning & Competition"
      },
      {
        name: "DataCamp",
        url: "https://www.datacamp.com/",
        type: "Learning Platform"
      },
      {
        name: "Towards Data Science",
        url: "https://towardsdatascience.com/",
        type: "Publication"
      },
      {
        name: "Analytics Vidhya",
        url: "https://www.analyticsvidhya.com/",
        type: "Learning Resources"
      },
      {
        name: "arXiv",
        url: "https://arxiv.org/",
        type: "Research Papers"
      }
    ],
    certifications: [
      "IBM Data Science Professional Certificate",
      "Google Professional Data Engineer",
      "Microsoft Certified: Azure Data Scientist Associate",
      "TensorFlow Developer Certificate",
      "AWS Certified Machine Learning - Specialty"
    ]
  },
  3: { // UX/UI Designer
    title: "UX/UI Designer Roadmap",
    description: "A comprehensive guide to becoming a successful UX/UI Designer.",
    steps: [
      {
        title: "Foundation (0-6 months)",
        description: "Build your design foundation",
        tasks: [
          "Learn design fundamentals (color theory, typography, layout)",
          "Master UI principles and patterns",
          "Study UX research methods",
          "Learn a design tool (Figma, Sketch, Adobe XD)",
          "Build a small portfolio of redesigns"
        ]
      },
      {
        title: "Design Skills (6-12 months)",
        description: "Enhance your design skills",
        tasks: [
          "Learn user research techniques",
          "Master wireframing and prototyping",
          "Study information architecture",
          "Practice usability testing",
          "Build end-to-end design projects"
        ]
      },
      {
        title: "Specialization (1-2 years)",
        description: "Specialize in your area of interest",
        tasks: [
          "Choose a specialization (mobile, web, product design)",
          "Learn interaction design patterns for your specialization",
          "Study advanced prototyping techniques",
          "Practice design systems creation",
          "Build a professional portfolio"
        ]
      },
      {
        title: "Professional Growth (2+ years)",
        description: "Grow as a professional designer",
        tasks: [
          "Master design strategy and leadership",
          "Learn to collaborate with development teams",
          "Study design operations (DesignOps)",
          "Practice design critique and feedback",
          "Lead design projects and mentor junior designers"
        ]
      }
    ],
    resources: [
      {
        name: "Dribbble",
        url: "https://dribbble.com/",
        type: "Design Inspiration"
      },
      {
        name: "Behance",
        url: "https://www.behance.net/",
        type: "Portfolio Platform"
      },
      {
        name: "Nielsen Norman Group",
        url: "https://www.nngroup.com/",
        type: "UX Research"
      },
      {
        name: "Interaction Design Foundation",
        url: "https://www.interaction-design.org/",
        type: "Learning Platform"
      },
      {
        name: "UX Collective",
        url: "https://uxdesign.cc/",
        type: "Publication"
      }
    ],
    certifications: [
      "Google UX Design Professional Certificate",
      "Certified User Experience Professional (CUXP)",
      "Certified Usability Analyst (CUA)",
      "Interaction Design Foundation Certificates",
      "Nielsen Norman Group UX Certification"
    ]
  }
};

const CareerRoadmap = () => {
  const navigate = useNavigate();
  const { careerId } = useParams();
  const { toast } = useToast();
  const [roadmap, setRoadmap] = useState<any>(null);
  const [career, setCareer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!careerId || !roadmapData[Number(careerId) as keyof typeof roadmapData]) {
      toast({
        title: "Error",
        description: "Career roadmap not found.",
        variant: "destructive",
      });
      navigate("/career-recommendations");
      return;
    }

    // Get selected career from localStorage
    const selectedCareer = localStorage.getItem("selectedCareer");
    if (!selectedCareer) {
      toast({
        title: "Error",
        description: "Please select a career first.",
        variant: "destructive",
      });
      navigate("/career-recommendations");
      return;
    }

    setCareer(JSON.parse(selectedCareer));
    setRoadmap(roadmapData[Number(careerId) as keyof typeof roadmapData]);
    setIsLoading(false);
  }, [careerId, navigate, toast]);

  const downloadRoadmap = () => {
    toast({
      title: "Roadmap Downloaded",
      description: "Your career roadmap has been downloaded successfully.",
    });
    // In a real app, we would generate a PDF and download it
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-6 gradient-heading">Loading Roadmap</h2>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-career-lightpurple rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-career-lightblue rounded w-full mx-auto"></div>
            <div className="h-4 bg-career-lightpurple rounded w-5/6 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-heading">{roadmap.title}</h1>
            <p className="text-career-gray mt-2">{roadmap.description}</p>
          </div>
          <Button 
            onClick={downloadRoadmap}
            className="bg-career-purple hover:bg-career-blue transition-colors"
          >
            <Download className="mr-2 h-4 w-4" /> Download Roadmap
          </Button>
        </div>

        {career && (
          <Card className="mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-career-blue">Career Overview: {career.title}</CardTitle>
              <CardDescription className="text-base">{career.description}</CardDescription>
            </CardHeader>
            <CardContent>
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
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Map className="h-6 w-6 text-career-purple mr-2" />
            <h2 className="text-2xl font-semibold">Development Path</h2>
          </div>
          
          <div className="space-y-6">
            {roadmap.steps.map((step: any, index: number) => (
              <div key={index} className="relative">
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-10 h-10 rounded-full bg-career-purple text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    {index < roadmap.steps.length - 1 && (
                      <div className="h-full w-0.5 bg-career-lightpurple mt-2 mb-2" />
                    )}
                  </div>
                  <div className="bg-white rounded-lg border p-5 shadow-sm flex-1">
                    <h3 className="text-lg font-semibold text-career-blue">{step.title}</h3>
                    <p className="text-career-gray mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.tasks.map((task: string, taskIndex: number) => (
                        <li key={taskIndex} className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-career-lightblue text-career-blue flex items-center justify-center mr-2 mt-0.5 text-xs font-bold">
                            {taskIndex + 1}
                          </div>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Link className="h-5 w-5 text-career-purple mr-2" />
                Recommended Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {roadmap.resources.map((resource: any, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-career-lightblue flex items-center justify-center mr-3">
                      <Link className="h-4 w-4 text-career-blue" />
                    </div>
                    <div>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-career-blue hover:underline"
                      >
                        {resource.name}
                      </a>
                      <p className="text-sm text-gray-600">{resource.type}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 text-career-purple mr-2" />
                Recommended Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {roadmap.certifications.map((certification: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-career-lightpurple flex items-center justify-center mr-3">
                      <GraduationCap className="h-4 w-4 text-career-purple" />
                    </div>
                    <div className="pt-1">
                      <span>{certification}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-career-lightblue p-6 rounded-lg border border-career-blue mb-8">
          <div className="flex items-start">
            <Lightbulb className="h-6 w-6 text-career-blue mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-career-blue mb-2">Pro Tip</h3>
              <p className="text-gray-700">
                While following this roadmap, focus on building practical projects that demonstrate your skills. 
                A strong portfolio is often more valuable than certifications alone. Consider joining communities related 
                to your field to network and keep up with industry trends.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate("/colleges")}
            className="bg-career-purple hover:bg-career-blue transition-colors"
          >
            Find Colleges for This Career
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CareerRoadmap;
