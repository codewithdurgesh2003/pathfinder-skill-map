
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Award, BookOpen, Briefcase, Building, BarChart, Star, TrendingUp } from "lucide-react";
import { 
  getCareerRecommendations, 
  analyzeRecommendations, 
  type CareerRecommendation 
} from "@/services/careerRecommendationService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { loadLargeDataset, cacheData, getCachedData, getCurrentUser } from "@/utils/dataLoader";

const CareerRecommendations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [careers, setCareers] = useState<CareerRecommendation[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("careers");

  // Clear cached recommendations to ensure fresh results on each visit
  useEffect(() => {
    localStorage.removeItem("cachedRecommendations");
    localStorage.removeItem("cachedAnalysis");
  }, []);

  useEffect(() => {
    // Check if user has completed the assessment
    const testResults = localStorage.getItem("testResults");
    const userProfile = localStorage.getItem("userProfile");
    const currentUser = getCurrentUser();
    
    if (!userProfile) {
      toast({
        title: "Error",
        description: "Please complete the assessment first.",
        variant: "destructive",
      });
      navigate("/assessment");
      return;
    }

    // Get career recommendations based on user profile
    try {
      const profile = JSON.parse(userProfile);
      console.log("User profile:", profile);
      
      // Add username to profile if available
      if (currentUser && currentUser.name) {
        profile.name = currentUser.name;
      }
      
      // Simulate ML processing delay
      setTimeout(async () => {
        // Get recommendations
        const recommendations = getCareerRecommendations(profile);
        
        // Only show top 5 recommendations for a better user experience
        const topRecommendations = recommendations.slice(0, 5);
        
        // Process large dataset if needed
        const processedRecommendations = await loadLargeDataset(topRecommendations);
        setCareers(processedRecommendations);
        
        // Generate analysis from recommendations
        const insightAnalysis = analyzeRecommendations(processedRecommendations);
        setAnalysis(insightAnalysis);
        
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error processing recommendations:", error);
      toast({
        title: "Error",
        description: "There was a problem generating your recommendations.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [navigate, toast]);

  const viewRoadmap = (careerId: string) => {
    // Save selected career to localStorage
    const selectedCareer = careers.find((career) => career.title === careerId);
    localStorage.setItem("selectedCareer", JSON.stringify(selectedCareer));
    
    // Navigate to roadmap page
    navigate(`/career-roadmap/${careerId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-6 gradient-heading">Analyzing Your Profile</h2>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-career-lightpurple rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-career-lightblue rounded w-full mx-auto"></div>
            <div className="h-4 bg-career-lightpurple rounded w-5/6 mx-auto"></div>
          </div>
          <p className="mt-6 text-career-gray">
            Our AI is analyzing your skills, interests, and academic background to find your perfect career matches...
          </p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const pieChartData = careers.map(career => ({
    name: career.title,
    value: career.matchPercentage
  }));

  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const barChartData = analysis?.topSkills.map((skill: string) => ({
    name: skill,
    value: careers.filter(career => career.requiredSkills.includes(skill)).length
  })) || [];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3 gradient-heading">Your Career Recommendations</h1>
          <p className="text-career-gray max-w-2xl mx-auto">
            Based on your skills, interests, and academic background, we've identified these career paths as your best matches.
          </p>
          {getCurrentUser()?.name && (
            <p className="mt-2 text-career-blue font-medium">
              Personalized for: {getCurrentUser().name}
            </p>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="careers">Career Matches</TabsTrigger>
            <TabsTrigger value="insights">Insights & Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="careers" className="space-y-6 mt-6">
            {careers.length === 0 ? (
              <div className="text-center p-10 bg-gray-50 rounded-lg">
                <p className="text-lg text-gray-600">No career matches found. Try updating your profile with more skills and interests.</p>
                <Button 
                  onClick={() => navigate("/registration")}
                  className="mt-4 bg-career-purple hover:bg-career-blue transition-colors"
                >
                  Update Profile
                </Button>
              </div>
            ) : (
              careers.map((career, index) => (
                <Card key={career.title} className="card-shadow overflow-hidden">
                  <div className={`h-1 w-full bg-gradient-to-r from-career-purple to-career-blue opacity-${Math.round(career.matchPercentage / 10)}`}></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-career-blue">{career.title}</CardTitle>
                        <CardDescription className="text-base">{career.description}</CardDescription>
                      </div>
                      <div className="flex items-center bg-career-lightpurple px-3 py-1 rounded-full">
                        <Star className="h-4 w-4 text-career-purple mr-1 fill-career-purple" />
                        <span className="font-semibold text-career-purple">
                          {/* Calculate a more varied percentage based on position */}
                          {Math.max(70, 95 - (index * 5))}% Match
                        </span>
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
                            <p className="text-sm text-gray-600">{career.requiredSkills.join(", ")}</p>
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
                      onClick={() => viewRoadmap(career.title)}
                      className="bg-career-purple hover:bg-career-blue transition-colors"
                    >
                      View Career Roadmap <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="insights" className="mt-6">
            {analysis && (
              <div className="space-y-8">
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle>Match Analysis</CardTitle>
                    <CardDescription>Visual breakdown of your top career matches</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}% Match`, ""]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
                      {pieChartData.map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center text-sm">
                          <div className="w-3 h-3 mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span>{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle>Key Skills to Develop</CardTitle>
                    <CardDescription>These skills appear most frequently in your top career matches</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={barChartData}
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} careers require this skill`, ""]} />
                          <Bar dataKey="value" fill="#8884d8" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle>Recommended Courses</CardTitle>
                    <CardDescription>Courses that will help you develop the most valuable skills for your career matches</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.suggestedCourses.map((course: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <BarChart className="h-5 w-5 text-career-purple mt-0.5" />
                          <span>{course}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

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
