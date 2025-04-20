import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Award, BookOpen, Briefcase, Building, BarChart, Star, TrendingUp, AlertCircle, ExternalLink, List } from "lucide-react";
import { 
  getCareerRecommendations, 
  analyzeRecommendations, 
  type CareerRecommendation 
} from "@/services/careerRecommendationService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { loadLargeDataset, cacheData, getCachedData, getCurrentUser } from "@/utils/dataLoader";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const CareerRecommendations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [careers, setCareers] = useState<CareerRecommendation[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("careers");
  const [lastFetchTime, setLastFetchTime] = useState(new Date());
  const [newsCategory, setNewsCategory] = useState<string>("all");

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
    const fetchRecommendations = async () => {
      try {
        const profile = JSON.parse(userProfile);
        console.log("User profile:", profile);
        
        // Add username to profile if available
        if (currentUser && currentUser.name) {
          profile.name = currentUser.name;
        }
        
        // Simulate ML processing delay
        setTimeout(async () => {
          try {
            // Get recommendations - now properly awaiting the Promise
            const recommendations = await getCareerRecommendations(profile);
            
            // Only show top 5 recommendations for a better user experience
            const topRecommendations = recommendations.slice(0, 5);
            
            // Process large dataset if needed
            const processedRecommendations = await loadLargeDataset(topRecommendations);
            setCareers(processedRecommendations);
            
            // Generate analysis from recommendations
            const insightAnalysis = analyzeRecommendations(processedRecommendations);
            setAnalysis(insightAnalysis);
            
            setIsLoading(false);
          } catch (error) {
            console.error("Error processing recommendations:", error);
            toast({
              title: "Error",
              description: "There was a problem generating your recommendations.",
              variant: "destructive",
            });
            setIsLoading(false);
          }
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
    };

    fetchRecommendations();
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

  const fetchLatestNews = async (category = "all") => {
    try {
      console.log("Fetching news for category:", category);
      
      const apiKey = "YOUR_NEWS_API_KEY"; // Replace with your actual API key
      
      const currentDate = new Date();
      const pastDate = new Date();
      pastDate.setDate(currentDate.getDate() - 7);
      const formattedPastDate = pastDate.toISOString().split('T')[0];
      
      let url;
      
      if (category === "all") {
        url = `https://newsapi.org/v2/everything?q=exam OR competitive OR education OR career OR government&from=${formattedPastDate}&sortBy=publishedAt&apiKey=${apiKey}`;
      } else {
        const keywordMap = {
          "Education": "education+university+student+learning",
          "Exams": "competitive+exam+entrance+government+upsc+ssc+jee+neet+gate+civil+services",
          "Career": "career+job+government+recruitment+placement+hiring+opportunity"
        };
        const keyword = keywordMap[category] || "";
        url = `https://newsapi.org/v2/everything?q=${keyword}&from=${formattedPastDate}&sortBy=publishedAt&apiKey=${apiKey}`;
      }
      
      console.log("Fetching from URL:", url);
      
      // Set a timeout for the fetch operation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, { 
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }
      
      const data = await response.json();
      const articles = data.articles || [];
      
      if (articles.length > 0) {
        console.log(`Successfully fetched ${articles.length} articles from API`);
        return articles.map(article => ({
          id: article.url || Math.random().toString(),
          title: article.title,
          publishedAt: article.publishedAt || new Date().toISOString(),
          source: { name: article.source?.name || "News Source" },
          content: article.description || article.content || "",
          url: article.url || "#",
          category: mapToCategory(article.title, article.description)
        }));
      } else {
        console.log("No articles found from API, using fallback");
        throw new Error("No current news available");
      }
    } catch (error) {
      console.warn("API fetch failed, using fallback data:", error);
      
      if (category === "all") {
        return fallbackNews;
      } else {
        return categoryNewsMap[category] || fallbackNews;
      }
    }
  };

  const mapToCategory = (title = "", description = "") => {
    const text = (title + " " + (description || "")).toLowerCase();
    
    if (text.includes("upsc") || text.includes("ssc") || text.includes("civil service") || 
        text.includes("government exam") || text.includes("competitive exam") || 
        text.includes("exam") || text.includes("test") || text.includes("entrance") || 
        text.includes("score") || text.includes("grade") || text.includes("jee") || 
        text.includes("neet") || text.includes("gate")) {
      return "Exams";
    } else if (text.includes("education") || text.includes("school") || 
             text.includes("college") || text.includes("university") || 
             text.includes("student") || text.includes("learn") || 
             text.includes("course")) {
      return "Education";
    } else if (text.includes("career") || text.includes("job") || 
             text.includes("employ") || text.includes("work") || 
             text.includes("profession") || text.includes("skill") || 
             text.includes("hire") || text.includes("recruitment") ||
             text.includes("vacancy") || text.includes("position") ||
             text.includes("opportunity")) {
      return "Career";
    }
    return "Education";
  };

  const educationNews = [
    {
      id: 1,
      title: "New Education Policy Implementation Across Universities",
      publishedAt: "2024-10-18",
      source: { name: "Education Today" },
      content: "The Ministry of Education has announced full implementation of the National Education Policy across all universities starting next academic year. The policy aims to transform the educational landscape with flexible degree options and multidisciplinary approach.",
      url: "#",
      category: "Education"
    },
    {
      id: 2,
      title: "Digital Learning Platforms See 200% Growth Post-Pandemic",
      publishedAt: "2024-10-17",
      source: { name: "EdTech Review" },
      content: "Online education platforms have reported continued growth even after the pandemic restrictions were lifted. Students are increasingly preferring hybrid learning models that combine classroom and digital instruction.",
      url: "#",
      category: "Education"
    },
    {
      id: 3,
      title: "Top Universities Announce Scholarship Programs for Rural Students",
      publishedAt: "2024-10-14",
      source: { name: "Higher Education Chronicle" },
      content: "Leading universities have collectively announced scholarship programs aimed specifically at students from rural backgrounds to increase diversity and provide equal opportunities in higher education.",
      url: "#",
      category: "Education"
    },
    {
      id: 4,
      title: "Global Education Summit to be Held in New Delhi Next Month",
      publishedAt: "2024-10-12",
      source: { name: "International Education News" },
      content: "New Delhi will host the Global Education Summit bringing together education ministers and policy experts from over 50 countries to discuss the future of education and international collaboration.",
      url: "#",
      category: "Education"
    }
  ];

  const examNews = [
    {
      id: 1,
      title: "NEET 2025 Registration Opens Next Week",
      publishedAt: "2025-04-10",
      source: { name: "Education Times" },
      content: "The National Testing Agency has announced that NEET 2025 registrations will begin next week. Students planning to appear for the medical entrance exam should prepare their documents.",
      url: "#",
      category: "Exams"
    },
    {
      id: 2,
      title: "JEE Main 2025 to be Conducted in Four Sessions",
      publishedAt: "2025-04-07",
      source: { name: "Education Ministry" },
      content: "The Ministry of Education has announced that JEE Main 2025 will be conducted in four sessions to give multiple opportunities to candidates and avoid clash with board exams.",
      url: "#",
      category: "Exams"
    },
    {
      id: 3,
      title: "CAT 2025 Registration Deadline Extended",
      publishedAt: "2025-04-05",
      source: { name: "IIM Bangalore" },
      content: "IIM Bangalore, the conducting body for CAT 2025, has extended the registration deadline by one week due to technical issues faced by candidates.",
      url: "#",
      category: "Exams"
    },
    {
      id: 4,
      title: "GATE 2025 Exam Pattern Changes Announced",
      publishedAt: "2025-04-02",
      source: { name: "IIT Delhi" },
      content: "IIT Delhi has announced significant changes to the GATE 2025 exam pattern, including the introduction of new subjects and modifications to the marking scheme.",
      url: "#",
      category: "Exams"
    },
    {
      id: 5,
      title: "UPSC Civil Services 2025 Notification Released",
      publishedAt: "2025-04-01",
      source: { name: "UPSC" },
      content: "The Union Public Service Commission has released the notification for Civil Services Examination 2025. The preliminary exam is scheduled for June 2025.",
      url: "#",
      category: "Exams"
    },
    {
      id: 6,
      title: "SSC CGL 2025 Registration to Begin in May",
      publishedAt: "2025-03-28",
      source: { name: "Staff Selection Commission" },
      content: "The Staff Selection Commission has announced that registrations for the Combined Graduate Level Examination 2025 will begin in May, with the tier-1 exam scheduled for August.",
      url: "#",
      category: "Exams"
    }
  ];

  const careerNews = [
    {
      id: 1,
      title: "AI and Machine Learning Jobs See 300% Growth in Demand",
      publishedAt: "2025-04-09",
      source: { name: "Career Insights" },
      content: "The demand for professionals skilled in artificial intelligence and machine learning has tripled over the past year, with companies across sectors looking to implement AI solutions.",
      url: "#",
      category: "Career"
    },
    {
      id: 2,
      title: "Government Announces 50,000 New Positions in Civil Services",
      publishedAt: "2025-04-06",
      source: { name: "Public Sector Career News" },
      content: "The central government has announced plans to create 50,000 new positions across various civil service departments in the next fiscal year, creating significant opportunities for UPSC aspirants.",
      url: "#",
      category: "Career"
    },
    {
      id: 3,
      title: "Remote Work Opportunities Continue to Expand in Tech Industry",
      publishedAt: "2025-04-04",
      source: { name: "Tech Careers Today" },
      content: "Major tech companies are maintaining and expanding their remote work policies, opening up opportunities for professionals regardless of geographical location.",
      url: "#",
      category: "Career"
    },
    {
      id: 4,
      title: "Healthcare Sector to Create 1 Million New Jobs by 2026",
      publishedAt: "2025-03-30",
      source: { name: "Healthcare Career Network" },
      content: "The healthcare industry is projected to create over one million new jobs in the next two years, with particular demand for nursing, mental health, and telehealth professionals.",
      url: "#",
      category: "Career"
    },
    {
      id: 5,
      title: "Railway Recruitment Board Announces Largest Hiring Drive",
      publishedAt: "2025-03-27",
      source: { name: "Government Jobs Portal" },
      content: "The Railway Recruitment Board has announced its largest hiring drive in a decade, with plans to fill over 35,000 positions across various categories in the coming months.",
      url: "#",
      category: "Career"
    }
  ];

  const fallbackNews = [
    ...examNews,
    ...educationNews,
    ...careerNews
  ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const categoryNewsMap = {
    "all": fallbackNews,
    "Education": educationNews,
    "Exams": examNews,
    "Career": careerNews
  };

  const { data: newsArticles, isLoading, isError, refetch } = useQuery({
    queryKey: ['examNews', newsCategory, lastFetchTime],
    queryFn: () => fetchLatestNews(newsCategory),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 15, // 15 minutes
  });

  useEffect(() => {
    refetch();
  }, [newsCategory, refetch]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLastFetchTime(new Date());
      console.log("Auto-refreshing news...");
    }, 1000 * 60 * 60); // 1 hour
    
    return () => clearInterval(intervalId);
  }, []);

  function formatDate(dateString: string) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Date unavailable";
    }
  }

  const getNewsCategoryIcon = (category: string) => {
    switch (category) {
      case "Education":
        return <BookOpen className="h-4 w-4" />;
      case "Exams":
        return <FileText className="h-4 w-4" />;
      case "Career":
        return <Briefcase className="h-4 w-4" />;
      default:
        return <List className="h-4 w-4" />;
    }
  };

  const displayedNews = newsArticles || 
    (newsCategory === "all" ? fallbackNews : categoryNewsMap[newsCategory] || fallbackNews);

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

