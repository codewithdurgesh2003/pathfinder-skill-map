import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertCircle, Book, Calendar, FileText, Award, GraduationCap, BookOpen, Briefcase, List } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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

const fetchLatestNews = async (category = "all") => {
  try {
    console.log("Fetching news for category:", category);
    
    const apiKey = "YOUR_API_KEY"; // Replace with actual API key in production
    
    // For demo purposes, we'll use our mock data but in production this would be:
    // const url = `https://newsapi.org/v2/top-headlines?country=in&category=${category === 'all' ? '' : category}&apiKey=${apiKey}`;
    // const response = await fetch(url);
    // const data = await response.json();
    // return data.articles;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return categoryNewsMap[category] || fallbackNews;
  } catch (error) {
    console.error("Error fetching news:", error);
    toast.error("Failed to fetch latest news updates");
    return fallbackNews;
  }
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
    title: "NEET 2024 Registration Opens Next Week",
    publishedAt: "2024-10-15",
    source: { name: "Education Times" },
    content: "The National Testing Agency has announced that NEET 2024 registrations will begin next week. Students planning to appear for the medical entrance exam should prepare their documents.",
    url: "#",
    category: "Exams"
  },
  {
    id: 2,
    title: "JEE Main 2024 to be Conducted in Four Sessions",
    publishedAt: "2024-10-12",
    source: { name: "Education Ministry" },
    content: "The Ministry of Education has announced that JEE Main 2024 will be conducted in four sessions to give multiple opportunities to candidates and avoid clash with board exams.",
    url: "#",
    category: "Exams"
  },
  {
    id: 3,
    title: "CAT 2024 Registration Deadline Extended",
    publishedAt: "2024-10-10",
    source: { name: "IIM Bangalore" },
    content: "IIM Bangalore, the conducting body for CAT 2024, has extended the registration deadline by one week due to technical issues faced by candidates.",
    url: "#",
    category: "Exams"
  },
  {
    id: 4,
    title: "GATE 2024 Exam Pattern Changes Announced",
    publishedAt: "2024-10-05",
    source: { name: "IIT Delhi" },
    content: "IIT Delhi has announced significant changes to the GATE 2024 exam pattern, including the introduction of new subjects and modifications to the marking scheme.",
    url: "#",
    category: "Exams"
  },
  {
    id: 5,
    title: "CLAT 2024 Registration Begins Next Month",
    publishedAt: "2024-09-25",
    source: { name: "Consortium of NLUs" },
    content: "The Consortium of National Law Universities has announced that registrations for CLAT 2024 will begin next month. The exam is expected to be held in May 2024.",
    url: "#",
    category: "Exams"
  }
];

const careerNews = [
  {
    id: 1,
    title: "AI and Machine Learning Jobs See 300% Growth in Demand",
    publishedAt: "2024-10-16",
    source: { name: "Career Insights" },
    content: "The demand for professionals skilled in artificial intelligence and machine learning has tripled over the past year, with companies across sectors looking to implement AI solutions.",
    url: "#",
    category: "Career"
  },
  {
    id: 2,
    title: "Remote Work Opportunities Continue to Expand in Tech Industry",
    publishedAt: "2024-10-13",
    source: { name: "Tech Careers Today" },
    content: "Major tech companies are maintaining and expanding their remote work policies, opening up opportunities for professionals regardless of geographical location.",
    url: "#",
    category: "Career"
  },
  {
    id: 3,
    title: "Healthcare Sector to Create 1 Million New Jobs by 2026",
    publishedAt: "2024-10-09",
    source: { name: "Healthcare Career Network" },
    content: "The healthcare industry is projected to create over one million new jobs in the next two years, with particular demand for nursing, mental health, and telehealth professionals.",
    url: "#",
    category: "Career"
  },
  {
    id: 4,
    title: "Green Energy Careers Boom as Sustainability Becomes Priority",
    publishedAt: "2024-10-07",
    source: { name: "Sustainable Future" },
    content: "Careers in renewable energy, sustainability management, and environmental engineering are seeing unprecedented growth as companies commit to carbon neutrality goals.",
    url: "#",
    category: "Career"
  },
  {
    id: 5,
    title: "Skill-Based Hiring on the Rise, Degrees Becoming Less Important",
    publishedAt: "2024-10-03",
    source: { name: "Future of Work" },
    content: "More employers are focusing on skills and practical capabilities rather than formal degrees, with many tech companies eliminating degree requirements for technical positions.",
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

  const filteredExams = selectedField === "All" 
    ? exams 
    : exams.filter(exam => exam.field === selectedField);

  const { data: newsArticles, isLoading, isError, refetch } = useQuery({
    queryKey: ['examNews', newsCategory],
    queryFn: () => fetchLatestNews(newsCategory),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 15,
  });

  useEffect(() => {
    refetch();
  }, [newsCategory, refetch]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
                {isError && <AlertCircle className="h-5 w-5 text-destructive" />}
              </CardTitle>
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
              {isError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Could not load the latest news. Using fallback data instead.
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
                    {newsArticles && newsArticles.length > 0 ? (
                      newsArticles.map((item: any, index: number) => (
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
                              </p>
                              <p className="text-sm mt-1 line-clamp-2">
                                {item.content?.split(" ").slice(0, 20).join(" ")}...
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p>No news found for the selected category.</p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-6">
                  <Separator className="my-4" />
                  <div className="text-center">
                    <Button variant="outline" className="w-full">
                      View All News
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
