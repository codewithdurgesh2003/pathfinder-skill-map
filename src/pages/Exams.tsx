import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertCircle, Book, Calendar, FileText, Award, GraduationCap, BookOpen, Briefcase, List, RefreshCw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const exams = [
  {
    id: "gate",
    title: "GATE (Graduate Aptitude Test in Engineering)",
    description: "National level examination for admission to postgraduate programs in engineering.",
    applicationProcess: "Applications typically open in September each year. The process involves registration, application form filling, uploading documents, and fee payment.",
    examPattern: "3-hour computer-based test with 65 questions (multiple choice and numerical answer type) worth 100 marks. Subjects include General Aptitude and specific engineering discipline.",
    importantDates: "Registration: Sept-Oct, Exam: Feb, Results: March",
    eligibility: "Bachelor's degree in Engineering/Technology or Master's degree in Science/Mathematics/Statistics/Computer Applications",
    officialWebsite: "https://gate.iitm.ac.in/",
    field: "Engineering"
  },
  {
    id: "neet",
    title: "NEET (National Eligibility cum Entrance Test)",
    description: "Single entrance examination for admission to MBBS and BDS courses in India.",
    applicationProcess: "Online application through NTA website, upload photograph, signature, and pay application fee.",
    examPattern: "3-hour pen-paper test with 180 multiple-choice questions from Physics, Chemistry, and Biology subjects.",
    importantDates: "Registration: Dec-Jan, Exam: May, Results: June",
    eligibility: "10+2 with Physics, Chemistry, Biology/Biotechnology and English as core subjects",
    officialWebsite: "https://neet.nta.nic.in/",
    field: "Medical"
  },
  {
    id: "jee",
    title: "JEE (Joint Entrance Examination)",
    description: "National level engineering entrance exam for admission to various engineering colleges in India.",
    applicationProcess: "Online application through JEE website, upload required documents, and pay application fee.",
    examPattern: "JEE Main: 3-hour computer-based test with 90 questions. JEE Advanced: 6-hour exam (two sessions) with multiple-choice and numerical questions.",
    importantDates: "JEE Main: Jan/Apr, JEE Advanced: May/June",
    eligibility: "10+2 with Physics, Chemistry, and Mathematics as core subjects",
    officialWebsite: "https://jeemain.nta.nic.in/",
    field: "Engineering"
  },
  {
    id: "upsc",
    title: "UPSC Civil Services Examination",
    description: "National level examination for recruitment to various Civil Services of the Government of India.",
    applicationProcess: "Applications typically open in February. The process involves registration, application form filling, uploading documents, and fee payment.",
    examPattern: "Three stages: Preliminary (objective MCQs), Main (written descriptive), and Interview (personality test).",
    importantDates: "Registration: Feb-Mar, Prelims: May-Jun, Mains: Sep, Interview: Mar-May, Results: May-Jun",
    eligibility: "Bachelor's degree in any discipline from a recognized university, age between 21-32 years with relaxation for reserved categories",
    officialWebsite: "https://upsc.gov.in/",
    field: "Civil Services"
  },
  {
    id: "cat",
    title: "CAT (Common Admission Test)",
    description: "National level entrance test for admission to MBA programs in IIMs and other business schools.",
    applicationProcess: "Online registration, application form submission, and fee payment through CAT website.",
    examPattern: "2-hour computer-based test with sections on Verbal Ability, Data Interpretation & Logical Reasoning, and Quantitative Ability.",
    importantDates: "Registration: Aug-Sept, Exam: Nov-Dec, Results: Jan",
    eligibility: "Bachelor's degree with at least 50% marks or equivalent CGPA",
    officialWebsite: "https://iimcat.ac.in/",
    field: "Management"
  },
  {
    id: "clat",
    title: "CLAT (Common Law Admission Test)",
    description: "National level entrance exam for admission to undergraduate and postgraduate law programs.",
    applicationProcess: "Online application through CLAT website, document verification, and fee payment.",
    examPattern: "2-hour test with 150 multiple-choice questions on English, Current Affairs, Legal Reasoning, Logical Reasoning, and Quantitative Techniques.",
    importantDates: "Registration: Jan, Exam: May, Results: June",
    eligibility: "For UG: 10+2 with at least 45% marks (40% for SC/ST). For PG: LLB degree with at least 50% marks",
    officialWebsite: "https://consortiumofnlus.ac.in/",
    field: "Law"
  },
  {
    id: "nata",
    title: "NATA (National Aptitude Test in Architecture)",
    description: "National level entrance exam for admission to B.Arch programs in India.",
    applicationProcess: "Online application through NATA website, document submission, and fee payment.",
    examPattern: "3-hour test with multiple-choice questions, diagrammatic reasoning, and drawing test to evaluate aesthetic sensitivity, drawing skills, and architectural awareness.",
    importantDates: "Registration: Jan-Feb, Exam: Apr-Jul (multiple sessions), Results: Within 20 days of exam",
    eligibility: "10+2 with Mathematics as a subject and at least 50% aggregate marks",
    officialWebsite: "https://nata.in/",
    field: "Architecture"
  },
  {
    id: "cet",
    title: "CET (Common Entrance Test)",
    description: "State level entrance test for admission to various undergraduate courses in state colleges.",
    applicationProcess: "Online application through state CET website, document verification, and fee payment.",
    examPattern: "Multiple choice questions from subjects relevant to the applied course (varies by state and course).",
    importantDates: "Varies by state, typically held between April-June",
    eligibility: "10+2 with subjects relevant to the applied course",
    officialWebsite: "https://cetcell.mahacet.org/",
    field: "Various"
  },
  {
    id: "aims",
    title: "AIIMS (All India Institute of Medical Sciences)",
    description: "Entrance exam for admission to undergraduate medical courses at AIIMS institutions across India.",
    applicationProcess: "Online registration, document verification, and fee payment.",
    examPattern: "3.5-hour computer-based test with 200 multiple-choice questions covering Physics, Chemistry, Biology, General Knowledge, and Aptitude.",
    importantDates: "Registration: Jan-Feb, Exam: May, Results: June",
    eligibility: "10+2 with Physics, Chemistry, Biology and English, minimum 60% aggregate",
    officialWebsite: "https://www.aiimsexams.ac.in/",
    field: "Medical"
  },
  {
    id: "cucet",
    title: "CUCET (Central Universities Common Entrance Test)",
    description: "Joint entrance exam for admission to various undergraduate, postgraduate, and research programs in participating central universities.",
    applicationProcess: "Online registration through CUCET portal, document upload, and fee payment.",
    examPattern: "2-hour computer-based test with multiple-choice questions. Pattern varies based on the program.",
    importantDates: "Registration: Mar-Apr, Exam: May, Results: June",
    eligibility: "Varies by program and university",
    officialWebsite: "https://cucet.nta.nic.in/",
    field: "Various"
  }
];

const uniqueFields = [...new Set(exams.map(exam => exam.field))];

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

const getFieldIcon = (field: string) => {
  switch (field) {
    case "Engineering":
      return <FileText className="h-5 w-5" />;
    case "Medical":
      return <Book className="h-5 w-5" />;
    case "Management":
      return <GraduationCap className="h-5 w-5" />;
    case "Law":
      return <Award className="h-5 w-5" />;
    case "Civil Services":
      return <GraduationCap className="h-5 w-5" />;
    case "Architecture":
      return <FileText className="h-5 w-5" />;
    default:
      return <Calendar className="h-5 w-5" />;
  }
};

const ExamsPage = () => {
  const [selectedField, setSelectedField] = useState<string>("All");
  const [selectedExam, setSelectedExam] = useState(exams[0]);
  const [newsCategory, setNewsCategory] = useState<string>("all");
  const [lastFetchTime, setLastFetchTime] = useState(new Date());
  const [showFallbackNotice, setShowFallbackNotice] = useState(false);

  const filteredExams = selectedField === "All" 
    ? exams 
    : exams.filter(exam => exam.field === selectedField);

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
    toast.info("Refreshing latest news...");
    refetch();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Entrance Examinations Guide</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Browse Exams by Field</h2>
            <div className="w-full md:w-64">
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Fields</SelectItem>
                  {uniqueFields.map(field => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Entrance Exams</CardTitle>
                <CardDescription>
                  {selectedField === "All" 
                    ? "Showing all entrance exams across different fields" 
                    : `Showing entrance exams for ${selectedField}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredExams.length === 0 ? (
                  <div className="text-center py-6">
                    <p>No exams found for the selected field</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredExams.map(exam => (
                      <Card key={exam.id} className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                        <div className={`h-2 w-full bg-${exam.field === "Engineering" ? "blue" : exam.field === "Medical" ? "green" : exam.field === "Management" ? "purple" : exam.field === "Law" ? "amber" : "slate"}-500`}></div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <CardTitle className="text-base font-semibold line-clamp-1">{exam.title.split('(')[0]}</CardTitle>
                              <Badge variant="outline" className="mt-1">
                                <span className="flex items-center gap-1">
                                  {getFieldIcon(exam.field)}
                                  {exam.field}
                                </span>
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2 flex-grow">
                          <p className="text-sm text-muted-foreground line-clamp-2">{exam.description}</p>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full"
                            onClick={() => setSelectedExam(exam)}
                          >
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{selectedExam.title}</CardTitle>
              <CardDescription>{selectedExam.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="application">
                  <AccordionTrigger>Application Process</AccordionTrigger>
                  <AccordionContent>
                    {selectedExam.applicationProcess}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pattern">
                  <AccordionTrigger>Exam Pattern</AccordionTrigger>
                  <AccordionContent>
                    {selectedExam.examPattern}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="dates">
                  <AccordionTrigger>Important Dates</AccordionTrigger>
                  <AccordionContent>
                    {selectedExam.importantDates}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="eligibility">
                  <AccordionTrigger>Eligibility</AccordionTrigger>
                  <AccordionContent>
                    {selectedExam.eligibility}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="pt-4 flex flex-wrap gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  Download Previous Papers
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button asChild>
                  <a href={selectedExam.officialWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    Visit Official Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full lg:w-1/3">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
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
            <CardContent className="flex-grow overflow-auto">
              {showFallbackNotice && (
                <Alert variant="warning" className="mb-4">
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
              
              <ScrollArea className="h-[500px] w-full pr-4">
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
      </div>
    </div>
  );
};

export default ExamsPage;
