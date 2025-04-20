import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowRight, Award, BookOpen, Briefcase, Building, BarChart, Star, 
  TrendingUp, AlertCircle, ExternalLink, List, FileText, RefreshCw 
} from "lucide-react";
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
import { toast } from "sonner";

const CareerRecommendations = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [careers, setCareers] = useState<CareerRecommendation[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("careers");
  const [lastFetchTime, setLastFetchTime] = useState(new Date());
  const [newsCategory, setNewsCategory] = useState<string>("all");
  const [showFallbackNotice, setShowFallbackNotice] = useState(false);

  useEffect(() => {
    localStorage.removeItem("cachedRecommendations");
    localStorage.removeItem("cachedAnalysis");
  }, []);

  useEffect(() => {
    const testResults = localStorage.getItem("testResults");
    const userProfile = localStorage.getItem("userProfile");
    const currentUser = getCurrentUser();
    
    if (!userProfile) {
      uiToast({
        title: "Error",
        description: "Please complete the assessment first.",
        variant: "destructive",
      });
      navigate("/assessment");
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const profile = JSON.parse(userProfile);
        console.log("User profile:", profile);
        
        if (currentUser && currentUser.name) {
          profile.name = currentUser.name;
        }
        
        setTimeout(async () => {
          try {
            const recommendations = await getCareerRecommendations(profile);
            
            const topRecommendations = recommendations.slice(0, 5);
            
            const processedRecommendations = await loadLargeDataset(topRecommendations);
            setCareers(processedRecommendations);
            
            const insightAnalysis = analyzeRecommendations(processedRecommendations);
            setAnalysis(insightAnalysis);
            
            setRecommendationsLoading(false);
          } catch (error) {
            console.error("Error processing recommendations:", error);
            uiToast({
              title: "Error",
              description: "There was a problem generating your recommendations.",
              variant: "destructive",
            });
            setRecommendationsLoading(false);
          }
        }, 1500);
      } catch (error) {
        console.error("Error processing recommendations:", error);
        uiToast({
          title: "Error",
          description: "There was a problem generating your recommendations.",
          variant: "destructive",
        });
        setRecommendationsLoading(false);
      }
    };

    fetchRecommendations();
  }, [navigate, uiToast]);

  const viewRoadmap = (careerId: string) => {
    const selectedCareer = careers.find((career) => career.title === careerId);
    localStorage.setItem("selectedCareer", JSON.stringify(selectedCareer));
    
    navigate(`/career-roadmap/${careerId}`);
  };

  if (recommendationsLoading) {
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
      
      const apiKey = "YOUR_NEWS_API_KEY";
      
      const currentDate = new Date();
      const pastDate = new Date();
      pastDate.setDate(currentDate.getDate() - 3);
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
      
      const fallbackTimestamp = new Date().toISOString();
      
      const getFallbackData = (data) => {
        return data.map((item, index) => {
          const currentDate = new Date();
          const itemDate = new Date(currentDate);
          itemDate.setDate(currentDate.getDate() - (data.length - index) + 1);
          
          return {
            ...item,
            _fallback: true,
            originalDate: item.publishedAt,
            publishedAt: itemDate.toISOString().split('T')[0],
            retrievedAt: fallbackTimestamp
          };
        });
      };
      
      if (category === "all") {
        return getFallbackData(fallbackNews);
      } else {
        return getFallbackData(categoryNewsMap[category] || fallbackNews);
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
      publishedAt: "2025-04-19",
      source: { name: "Education Today" },
      content: "The Ministry of Education has announced full implementation of the National Education Policy across all universities starting next academic year. The policy aims to transform the educational landscape with flexible degree options and multidisciplinary approach.",
      url: "#",
      category: "Education"
    },
    {
      id: 2,
      title: "Digital Learning Platforms See 200% Growth Post-Pandemic",
      publishedAt: "2025-04-18",
      source: { name: "EdTech Review" },
      content: "Online education platforms have reported continued growth even after the pandemic restrictions were lifted. Students are increasingly preferring hybrid learning models that combine classroom and digital instruction.",
      url: "#",
      category: "Education"
    },
    {
      id: 3,
      title: "Top Universities Announce Scholarship Programs for Rural Students",
      publishedAt: "2025-04-17",
      source: { name: "Higher Education Chronicle" },
      content: "Leading universities have collectively announced scholarship programs aimed specifically at students from rural backgrounds to increase diversity and provide equal opportunities in higher education.",
      url: "#",
      category: "Education"
    },
    {
      id: 4,
      title: "Global Education Summit to be Held in New Delhi Next Month",
      publishedAt: "2025-04-16",
      source: { name: "International Education News" },
      content: "New Delhi will host the Global Education Summit bringing together education ministers and policy experts from over 50 countries to discuss the future of education and international collaboration.",
      url: "#",
      category: "Education"
    }
  ];

  const examNews = [
    {
      id: 1,
      title: "NEET 2025 Registration Opens Today",
      publishedAt: "2025-04-20",
      source: { name: "Education Times" },
      content: "The National Testing Agency has announced that NEET 2025 registrations begin today. Students planning to appear for the medical entrance exam should prepare their documents and start the application process.",
      url: "#",
      category: "Exams"
    },
    {
      id: 2,
      title: "JEE Main 2025 to be Conducted in Four Sessions",
      publishedAt: "2025-04-19",
      source: { name: "Education Ministry" },
      content: "The Ministry of Education has announced that JEE Main 2025 will be conducted in four sessions to give multiple opportunities to candidates and avoid clash with board exams.",
      url: "#",
      category: "Exams"
    },
    {
      id: 3,
      title: "CAT 2025 Registration Deadline Extended",
      publishedAt: "2025-04-18",
      source: { name: "IIM Bangalore" },
      content: "IIM Bangalore, the conducting body for CAT 2025, has extended the registration deadline by one week due to technical issues faced by candidates.",
      url: "#",
      category: "Exams"
    },
    {
      id: 4,
      title: "GATE 2025 Exam Pattern Changes Announced",
      publishedAt: "2025-04-17",
      source: { name: "IIT Delhi" },
      content: "IIT Delhi has announced significant changes to the GATE 2025 exam pattern, including the introduction of new subjects and modifications to the marking scheme.",
      url: "#",
      category: "Exams"
    },
    {
      id: 5,
      title: "UPSC Civil Services 2025 Notification Released",
      publishedAt: "2025-04-16",
      source: { name: "UPSC" },
      content: "The Union Public Service Commission has released the notification for Civil Services Examination 2025. The preliminary exam is scheduled for June 2025.",
      url: "#",
      category: "Exams"
    },
    {
      id: 6,
      title: "SSC CGL 2025 Registration to Begin Next Week",
      publishedAt: "2025-04-15",
      source: { name: "Staff Selection Commission" },
      content: "The Staff Selection Commission has announced that registrations for the Combined Graduate Level Examination 2025 will begin next week, with the tier-1 exam scheduled for August.",
      url: "#",
      category: "Exams"
    }
  ];

  const careerNews = [
    {
      id: 1,
      title: "AI and Machine Learning Jobs See 300% Growth in Demand",
      publishedAt: "2025-04-19",
      source: { name: "Career Insights" },
      content: "The demand for professionals skilled in artificial intelligence and machine learning has tripled over the past year, with companies across sectors looking to implement AI solutions.",
      url: "#",
      category: "Career"
    },
    {
      id: 2,
      title: "Government Announces 50,000 New Positions in Civil Services",
      publishedAt: "2025-04-18",
      source: { name: "Public Sector Career News" },
      content: "The central government has announced plans to create 50,000 new positions across various civil service departments in the next fiscal year, creating significant opportunities for UPSC aspirants.",
      url: "#",
      category: "Career"
    },
    {
      id: 3,
      title: "Remote Work Opportunities Continue to Expand in Tech Industry",
      publishedAt: "2025-04-17",
      source: { name: "Tech Careers Today" },
      content: "Major tech companies are maintaining and expanding their remote work policies, opening up opportunities for professionals regardless of geographical location.",
      url: "#",
      category: "Career"
    },
    {
      id: 4,
      title: "Healthcare Sector to Create 1 Million New Jobs by 2026",
      publishedAt: "2025-04-16",
      source: { name: "Healthcare Career Network" },
      content: "The healthcare industry is projected to create over one million new jobs in the next two years, with particular demand for nursing, mental health, and telehealth professionals.",
      url: "#",
      category: "Career"
    },
    {
      id: 5,
      title: "Railway Recruitment Board Announces Largest Hiring Drive",
      publishedAt: "2025-04-15",
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
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 10,
  });

  useEffect(() => {
    refetch();
  }, [newsCategory, refetch]);

  useEffect(() => {
    if (newsArticles && newsArticles.length > 0 && newsArticles[0]._fallback) {
      setShowFallbackNotice(true);
    } else {
      setShowFallbackNotice(false);
    }
  }, [newsArticles]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLastFetchTime(new Date());
      console.log("Auto-refreshing news...");
    }, 1000 * 60 * 30);
    
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

  const handleRefresh = () => {
    setLastFetchTime(new Date());
    toast("Refreshing latest news...");
    refetch();
  };

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

        <div className="mt-10">
          <Card className="card-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  Latest Education & Career News
                  {isError && <AlertCircle className="ml-2 h-5 w-5 text-destructive" />}
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>
              <div className="w-full">
                <Tabs defaultValue="all" onValueChange={setNewsCategory}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="Education">Education</TabsTrigger>
                    <TabsTrigger value="Exams">Exams</TabsTrigger>
                    <TabsTrigger value="Career">Career</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {showFallbackNotice && (
                <Alert variant="default" className="mb-4 border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Using Cached News</AlertTitle>
                  <AlertDescription>
                    We're currently showing locally stored news. The dates shown are simulated for better readability.
                    <Button variant="link" onClick={handleRefresh} className="p-0 h-auto text-xs underline">
                      Try refreshing again
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              {isError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Could not load the latest news from our provider. Showing stored news instead.
                  </AlertDescription>
                </Alert>
              )}
              
              <ScrollArea className="h-96 w-full pr-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="border-b pb-3 last:border-b-0 animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3 mb-2"></div>
                        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displayedNews && displayedNews.length > 0 ? (
                      displayedNews.map((item: any, index: number) => (
                        <div key={index} className="border-b pb-3 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900 p-2 rounded-md transition-colors">
                          <div className="flex items-start gap-2">
                            <div className="mt-1 p-1 bg-blue-100 dark:bg-blue-900 rounded">
                              {getNewsCategoryIcon(item.category || "All")}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium hover:text-blue-600 transition-colors">
                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                  {item.title}
                                </a>
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(item.publishedAt)} • {item.source.name} 
                                {item.category && <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">{item.category}</span>}
                                {item._fallback && <span className="ml-1 text-amber-600">•</span>}
                              </p>
                              <p className="text-sm mt-1 line-clamp-2">
                                {item.content?.split(" ").slice(0, 20).join(" ")}...
                              </p>
                              <div className="mt-2">
                                <Button variant="ghost" size="sm" asChild className="p-0 h-auto text-xs text-blue-600 hover:text-blue-800">
                                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                    Read more <ExternalLink className="h-3 w-3" />
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p>No news found for the selected category.</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleRefresh}
                          className="mt-2"
                        >
                          Refresh News
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-6">
                  <Separator className="my-4" />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">
                      News data automatically refreshes every 10 minutes. Last updated: {new Date().toLocaleTimeString()}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleRefresh}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" /> Refresh News Now
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
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
