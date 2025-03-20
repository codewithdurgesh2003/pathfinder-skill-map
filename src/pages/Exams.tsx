
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";

// Exam data
const exams = [
  {
    id: "gate",
    title: "GATE (Graduate Aptitude Test in Engineering)",
    description: "National level examination for admission to postgraduate programs in engineering.",
    applicationProcess: "Applications typically open in September each year. The process involves registration, application form filling, uploading documents, and fee payment.",
    examPattern: "3-hour computer-based test with 65 questions (multiple choice and numerical answer type) worth 100 marks. Subjects include General Aptitude and specific engineering discipline.",
    importantDates: "Registration: Sept-Oct, Exam: Feb, Results: March",
    eligibility: "Bachelor's degree in Engineering/Technology or Master's degree in Science/Mathematics/Statistics/Computer Applications",
    officialWebsite: "https://gate.iitm.ac.in/"
  },
  {
    id: "neet",
    title: "NEET (National Eligibility cum Entrance Test)",
    description: "Single entrance examination for admission to MBBS and BDS courses in India.",
    applicationProcess: "Online application through NTA website, upload photograph, signature, and pay application fee.",
    examPattern: "3-hour pen-paper test with 180 multiple-choice questions from Physics, Chemistry, and Biology subjects.",
    importantDates: "Registration: Dec-Jan, Exam: May, Results: June",
    eligibility: "10+2 with Physics, Chemistry, Biology/Biotechnology and English as core subjects",
    officialWebsite: "https://neet.nta.nic.in/"
  },
  {
    id: "jee",
    title: "JEE (Joint Entrance Examination)",
    description: "National level engineering entrance exam for admission to various engineering colleges in India.",
    applicationProcess: "Online application through JEE website, upload required documents, and pay application fee.",
    examPattern: "JEE Main: 3-hour computer-based test with 90 questions. JEE Advanced: 6-hour exam (two sessions) with multiple-choice and numerical questions.",
    importantDates: "JEE Main: Jan/Apr, JEE Advanced: May/June",
    eligibility: "10+2 with Physics, Chemistry, and Mathematics as core subjects",
    officialWebsite: "https://jeemain.nta.nic.in/"
  },
  {
    id: "cet",
    title: "CET (Common Entrance Test)",
    description: "State level entrance test for admission to various undergraduate courses in state colleges.",
    applicationProcess: "Online application through state CET website, document verification, and fee payment.",
    examPattern: "Multiple choice questions from subjects relevant to the applied course (varies by state and course).",
    importantDates: "Varies by state, typically held between April-June",
    eligibility: "10+2 with subjects relevant to the applied course",
    officialWebsite: "https://cetcell.mahacet.org/" // Example for Maharashtra
  },
  {
    id: "cat",
    title: "CAT (Common Admission Test)",
    description: "National level entrance test for admission to MBA programs in IIMs and other business schools.",
    applicationProcess: "Online registration, application form submission, and fee payment through CAT website.",
    examPattern: "2-hour computer-based test with sections on Verbal Ability, Data Interpretation & Logical Reasoning, and Quantitative Ability.",
    importantDates: "Registration: Aug-Sept, Exam: Nov-Dec, Results: Jan",
    eligibility: "Bachelor's degree with at least 50% marks or equivalent CGPA",
    officialWebsite: "https://iimcat.ac.in/"
  }
];

// News API integration
const fetchLatestNews = async () => {
  try {
    // Using NewsAPI for education news
    // Note: In production, you would need to handle this request through a backend
    // as the NewsAPI doesn't allow direct browser requests from the free plan
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=entrance+exam+education+college&sortBy=publishedAt&language=en&pageSize=8&apiKey=YOUR_API_KEY_HERE`, 
      { mode: 'cors' }
    );
    
    if (!response.ok) {
      throw new Error('News API request failed');
    }
    
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    // Return fallback news if API fails
    return fallbackNews;
  }
};

// Fallback news data in case API fails
const fallbackNews = [
  {
    id: 1,
    title: "NEET 2024 Registration Opens Next Week",
    publishedAt: "2024-10-15",
    source: { name: "Education Times" },
    content: "The National Testing Agency has announced that NEET 2024 registrations will begin next week. Students planning to appear for the medical entrance exam should prepare their documents.",
    url: "#"
  },
  {
    id: 2,
    title: "JEE Main 2024 to be Conducted in Four Sessions",
    publishedAt: "2024-10-12",
    source: { name: "Education Ministry" },
    content: "The Ministry of Education has announced that JEE Main 2024 will be conducted in four sessions to give multiple opportunities to candidates and avoid clash with board exams.",
    url: "#"
  },
  {
    id: 3,
    title: "CAT 2024 Registration Deadline Extended",
    publishedAt: "2024-10-10",
    source: { name: "IIM Bangalore" },
    content: "IIM Bangalore, the conducting body for CAT 2024, has extended the registration deadline by one week due to technical issues faced by candidates.",
    url: "#"
  },
  {
    id: 4,
    title: "New Changes in GATE 2024 Exam Pattern",
    publishedAt: "2024-10-05",
    source: { name: "IIT Delhi" },
    content: "IIT Delhi has announced significant changes to the GATE 2024 exam pattern, including the introduction of new subjects and modifications to the marking scheme.",
    url: "#"
  },
  {
    id: 5,
    title: "State CETs to Consider Board Marks for 2024 Admissions",
    publishedAt: "2024-10-01",
    source: { name: "Higher Education Department" },
    content: "Various state education departments have announced that Common Entrance Tests for 2024 will consider board exam marks in addition to entrance test scores for final merit lists.",
    url: "#"
  },
  {
    id: 6,
    title: "Top Engineering Colleges Announce New Admission Criteria",
    publishedAt: "2024-09-28",
    source: { name: "Engineering Council" },
    content: "Several top engineering institutes have revised their admission criteria for the upcoming academic year, giving more weightage to project work and practical skills.",
    url: "#"
  },
  {
    id: 7,
    title: "Medical Council Introduces New NEET Counseling Process",
    publishedAt: "2024-09-25",
    source: { name: "Medical Council of India" },
    content: "The Medical Council has introduced a new online counseling process for NEET qualified candidates to streamline the admission process and reduce waiting time.",
    url: "#"
  },
  {
    id: 8,
    title: "Education Ministry Launches New Scholarship for Entrance Exam Toppers",
    publishedAt: "2024-09-20",
    source: { name: "Ministry of Education" },
    content: "The Education Ministry has announced a new scholarship program for students who score in the top 1% in national entrance examinations to encourage academic excellence.",
    url: "#"
  }
];

const ExamsPage = () => {
  const [selectedExam, setSelectedExam] = useState(exams[0]);

  // Fetch news using React Query
  const { data: newsArticles, isLoading, isError } = useQuery({
    queryKey: ['examNews'],
    queryFn: fetchLatestNews,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Entrance Examinations Guide</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <Tabs defaultValue={exams[0].id} onValueChange={(value) => setSelectedExam(exams.find(exam => exam.id === value) || exams[0])}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
              {exams.map(exam => (
                <TabsTrigger key={exam.id} value={exam.id}>{exam.id.toUpperCase()}</TabsTrigger>
              ))}
            </TabsList>
            
            {exams.map(exam => (
              <TabsContent key={exam.id} value={exam.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{exam.title}</CardTitle>
                    <CardDescription>{exam.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium text-lg">Application Process</h3>
                      <p>{exam.applicationProcess}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Exam Pattern</h3>
                      <p>{exam.examPattern}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Important Dates</h3>
                      <p>{exam.importantDates}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Eligibility</h3>
                      <p>{exam.eligibility}</p>
                    </div>
                    
                    <div className="pt-4 flex flex-wrap gap-3">
                      <Button variant="outline" className="flex items-center gap-2">
                        Download Previous Papers
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button asChild>
                        <a href={exam.officialWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          Visit Official Website
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        
        <div className="w-full md:w-1/3">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Latest Education News & Updates
                {isError && <AlertCircle className="h-5 w-5 text-destructive" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              {isError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Could not load the latest news. Please try again later.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="border-b pb-3 last:border-b-0 animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3 mb-2"></div>
                      <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
                    </div>
                  ))
                ) : (
                  (newsArticles || fallbackNews).map((item, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0">
                      <h3 className="font-medium hover:text-blue-600 transition-colors">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          {item.title}
                        </a>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(item.publishedAt)} • {item.source.name}
                      </p>
                      <p className="text-sm mt-1 line-clamp-2">
                        {item.content?.split(" ").slice(0, 20).join(" ")}...
                      </p>
                    </div>
                  ))
                )}
              </div>
              
              <div className="mt-6">
                <Separator className="my-4" />
                <div className="text-center">
                  <Button variant="outline" className="w-full">
                    View All Education News
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExamsPage;
