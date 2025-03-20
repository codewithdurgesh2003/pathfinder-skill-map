
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  FileText, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  AlertCircle, 
  Download, 
  ExternalLink
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample exam data
const examsData = [
  {
    id: 1,
    name: "GATE",
    fullName: "Graduate Aptitude Test in Engineering",
    category: "Engineering",
    description: "GATE is a national examination conducted for admission to postgraduate programs in engineering and science.",
    applicationPeriod: "September - October",
    examDate: "February",
    eligibility: "Bachelor's degree in Engineering/Technology/Architecture/Science",
    pattern: "Multiple-choice questions, numerical answer type questions covering mathematics, general aptitude, and subject-specific topics.",
    website: "https://gate.iitk.ac.in/",
    hasPreviousPapers: true
  },
  {
    id: 2,
    name: "NEET",
    fullName: "National Eligibility cum Entrance Test",
    category: "Medical",
    description: "NEET is a nationwide entrance examination for students who wish to pursue medical courses in India.",
    applicationPeriod: "December - January",
    examDate: "May",
    eligibility: "12th standard with Physics, Chemistry, and Biology/Biotechnology",
    pattern: "180 multiple-choice questions from Physics, Chemistry, and Biology (Botany & Zoology).",
    website: "https://neet.nta.nic.in/",
    hasPreviousPapers: true
  },
  {
    id: 3,
    name: "JEE",
    fullName: "Joint Entrance Examination",
    category: "Engineering",
    description: "JEE is a standardized test for admission to engineering colleges in India.",
    applicationPeriod: "November - December",
    examDate: "January, April, May, June",
    eligibility: "12th standard with Physics, Chemistry, and Mathematics",
    pattern: "Multiple-choice questions and numerical answer type questions from Physics, Chemistry, and Mathematics.",
    website: "https://jeemain.nta.nic.in/",
    hasPreviousPapers: true
  },
  {
    id: 4,
    name: "CET",
    fullName: "Common Entrance Test",
    category: "Engineering",
    description: "CET is a state-level entrance examination for admission to engineering and pharmacy courses.",
    applicationPeriod: "March - April",
    examDate: "May",
    eligibility: "12th standard with Physics, Chemistry, and Mathematics/Biology",
    pattern: "Multiple-choice questions from Physics, Chemistry, Mathematics/Biology.",
    website: "https://cetcell.mahacet.org/",
    hasPreviousPapers: true
  },
  {
    id: 5,
    name: "CAT",
    fullName: "Common Admission Test",
    category: "Management",
    description: "CAT is a computer-based test for admission to graduate management programs in India.",
    applicationPeriod: "August - September",
    examDate: "November",
    eligibility: "Bachelor's degree with minimum 50% marks",
    pattern: "Multiple-choice questions and non-MCQs from Verbal Ability, Data Interpretation, Logical Reasoning, and Quantitative Ability.",
    website: "https://iimcat.ac.in/",
    hasPreviousPapers: true
  },
  {
    id: 6,
    name: "UPSC",
    fullName: "Union Public Service Commission",
    category: "Civil Services",
    description: "UPSC Civil Services Examination is conducted for recruitment to various Civil Services of the Government of India.",
    applicationPeriod: "February - March",
    examDate: "June (Prelims), September (Mains)",
    eligibility: "Bachelor's degree in any discipline",
    pattern: "Preliminary (objective), Mains (written), and Interview/Personality Test.",
    website: "https://www.upsc.gov.in/",
    hasPreviousPapers: true
  },
  {
    id: 7,
    name: "CLAT",
    fullName: "Common Law Admission Test",
    category: "Law",
    description: "CLAT is a centralized test for admission to undergraduate and postgraduate law programs in India.",
    applicationPeriod: "January - March",
    examDate: "May",
    eligibility: "12th standard with minimum 45% marks (for UG); Bachelor's degree in Law (for PG)",
    pattern: "Multiple-choice questions from English, Current Affairs, Legal Reasoning, Logical Reasoning, and Quantitative Techniques.",
    website: "https://consortiumofnlus.ac.in/",
    hasPreviousPapers: true
  },
  {
    id: 8,
    name: "NATA",
    fullName: "National Aptitude Test in Architecture",
    category: "Architecture",
    description: "NATA measures the aptitude of candidates for architecture through aesthetic sensitivity, drawing, and critical thinking tests.",
    applicationPeriod: "January - March",
    examDate: "April, June",
    eligibility: "12th standard with Mathematics",
    pattern: "Drawing test, aesthetic sensitivity test, and general aptitude test.",
    website: "https://www.nata.in/",
    hasPreviousPapers: true
  }
];

// Sample news data
const newsData = [
  {
    id: 1,
    title: "GATE 2025 Registration to begin in August 2024",
    date: "2024-04-15",
    category: "Exam Updates",
    source: "IIT Kanpur",
    content: "IIT Kanpur has announced that the registration process for GATE 2025 will begin in August 2024. Candidates are advised to keep checking the official website for updates.",
    url: "https://example.com/gate-2025"
  },
  {
    id: 2,
    title: "NEET 2024 Application Correction Window Opens",
    date: "2024-04-10",
    category: "Exam Updates",
    source: "NTA",
    content: "The National Testing Agency (NTA) has opened the application correction window for NEET 2024. Candidates can make corrections until April 20, 2024.",
    url: "https://example.com/neet-correction"
  },
  {
    id: 3,
    title: "JEE Advanced 2024 Registration to Start After JEE Main April Results",
    date: "2024-04-05",
    category: "Exam Updates",
    source: "IIT Delhi",
    content: "IIT Delhi has announced that JEE Advanced 2024 registration will commence after the declaration of JEE Main April session results.",
    url: "https://example.com/jee-advanced"
  },
  {
    id: 4,
    title: "New Scholarship Scheme Announced for Engineering Students",
    date: "2024-04-01",
    category: "Scholarships",
    source: "Ministry of Education",
    content: "The Ministry of Education has announced a new scholarship scheme for engineering students. The scheme aims to provide financial assistance to meritorious students from economically weaker sections.",
    url: "https://example.com/scholarship-scheme"
  },
  {
    id: 5,
    title: "Changes in CLAT 2025 Exam Pattern Announced",
    date: "2024-03-28",
    category: "Exam Updates",
    source: "Consortium of NLUs",
    content: "The Consortium of National Law Universities has announced changes in the CLAT 2025 exam pattern. The exam will now have more emphasis on critical reasoning and analytical thinking.",
    url: "https://example.com/clat-pattern"
  }
];

const Exams = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [activeTab, setActiveTab] = useState("exams");
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [newsFilter, setNewsFilter] = useState("All");
  
  // Filter exams based on search query and category
  const filteredExams = examsData.filter((exam) => {
    const matchesSearch = 
      exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "All Categories" || exam.category === category;
    return matchesSearch && matchesCategory;
  });
  
  // Filter news based on category
  const filteredNews = newsData.filter((news) => {
    return newsFilter === "All" || news.category === newsFilter;
  });
  
  // Extract unique categories
  const categories = ["All Categories", ...new Set(examsData.map(exam => exam.category))];
  
  // Format date for news
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3 gradient-heading">Entrance Examinations Guide</h1>
          <p className="text-career-gray max-w-2xl mx-auto">
            Comprehensive information about various entrance exams, application processes, patterns, and the latest news.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exams">Entrance Exams</TabsTrigger>
            <TabsTrigger value="news">Latest News</TabsTrigger>
          </TabsList>
          
          {/* Exams Tab */}
          <TabsContent value="exams">
            {selectedExam ? (
              <ExamDetails exam={selectedExam} onBack={() => setSelectedExam(null)} />
            ) : (
              <>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-xl text-career-blue">Find Your Exam</CardTitle>
                    <CardDescription>
                      Search for entrance exams by name or filter by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search exams by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredExams.map((exam) => (
                    <Card key={exam.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl text-career-blue flex items-center">
                          <GraduationCap className="mr-2 h-5 w-5" />
                          {exam.name}
                        </CardTitle>
                        <CardDescription>{exam.fullName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{exam.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs bg-career-lightpurple text-career-purple px-2 py-1 rounded-full">
                            {exam.category}
                          </span>
                          <span className="text-xs bg-career-lightblue text-career-blue px-2 py-1 rounded-full">
                            <Calendar className="inline-block h-3 w-3 mr-1" />
                            {exam.examDate}
                          </span>
                        </div>
                        <Button 
                          onClick={() => setSelectedExam(exam)}
                          className="w-full bg-career-purple hover:bg-career-blue transition-colors"
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredExams.length === 0 && (
                  <div className="text-center py-10">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Exams Found</h3>
                    <p className="text-gray-500">
                      Try adjusting your search criteria.
                    </p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          {/* News Tab */}
          <TabsContent value="news">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-career-blue">Latest Education News</CardTitle>
                <CardDescription>
                  Stay updated with the latest news about entrance exams, colleges, and education
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                  {["All", "Exam Updates", "Scholarships", "Results", "Admissions"].map((cat) => (
                    <Button
                      key={cat}
                      variant={newsFilter === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewsFilter(cat)}
                      className={newsFilter === cat ? "bg-career-purple hover:bg-career-blue" : ""}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-4">
                  {filteredNews.map((news) => (
                    <Card key={news.id} className="hover:bg-gray-50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-career-blue">{news.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{news.content}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-xs bg-career-lightpurple text-career-purple px-2 py-1 rounded-full">
                                {news.category}
                              </span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                Source: {news.source}
                              </span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {formatDate(news.date)}
                              </span>
                            </div>
                          </div>
                          <a 
                            href={news.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-4 flex-shrink-0"
                          >
                            <Button variant="outline" size="sm" className="flex items-center">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Read More
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {filteredNews.length === 0 && (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No News Found</h3>
                    <p className="text-gray-500">
                      Try selecting a different category.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Exam Details Component
const ExamDetails = ({ exam, onBack }: { exam: any; onBack: () => void }) => {
  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-career-blue">{exam.name}</CardTitle>
            <CardDescription className="text-lg">{exam.fullName}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-500 hover:text-gray-700">
            ← Back to list
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-career-purple mb-2 flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Overview
            </h3>
            <p className="text-gray-700">{exam.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-career-lightpurple text-career-purple px-2 py-1 rounded-full">
                {exam.category}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-career-purple mb-2 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Important Dates
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Application Period</span>
                  <span className="font-medium">{exam.applicationPeriod}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Exam Date</span>
                  <span className="font-medium">{exam.examDate}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-career-purple mb-2 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Eligibility
              </h3>
              <p className="text-gray-700">{exam.eligibility}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-career-purple mb-2 flex items-center">
              <GraduationCap className="mr-2 h-5 w-5" />
              Exam Pattern
            </h3>
            <p className="text-gray-700">{exam.pattern}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-career-purple mb-2">Official Website</h3>
              <a 
                href={exam.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-career-blue hover:underline flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Visit {exam.name} Official Website
              </a>
            </div>

            {exam.hasPreviousPapers && (
              <div>
                <h3 className="font-semibold text-career-purple mb-2">Previous Papers</h3>
                <Button className="bg-career-purple hover:bg-career-blue transition-colors flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download Previous Papers
                </Button>
              </div>
            )}
          </div>

          <div className="bg-career-lightblue p-4 rounded-lg">
            <h3 className="font-semibold text-career-blue mb-2 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Preparation Tips
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Start preparation at least 6 months before the exam</li>
              <li>Focus on fundamentals and practice regularly</li>
              <li>Solve previous years' question papers</li>
              <li>Take mock tests to improve time management</li>
              <li>Create a study schedule and stick to it</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Exams;
