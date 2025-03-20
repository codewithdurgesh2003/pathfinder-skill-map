
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

// Exam data
const exams = [
  {
    id: "gate",
    title: "GATE (Graduate Aptitude Test in Engineering)",
    description: "National level examination for admission to postgraduate programs in engineering.",
    applicationProcess: "Applications typically open in September each year. The process involves registration, application form filling, uploading documents, and fee payment.",
    examPattern: "3-hour computer-based test with 65 questions (multiple choice and numerical answer type) worth 100 marks. Subjects include General Aptitude and specific engineering discipline.",
    importantDates: "Registration: Sept-Oct, Exam: Feb, Results: March",
    eligibility: "Bachelor's degree in Engineering/Technology or Master's degree in Science/Mathematics/Statistics/Computer Applications"
  },
  {
    id: "neet",
    title: "NEET (National Eligibility cum Entrance Test)",
    description: "Single entrance examination for admission to MBBS and BDS courses in India.",
    applicationProcess: "Online application through NTA website, upload photograph, signature, and pay application fee.",
    examPattern: "3-hour pen-paper test with 180 multiple-choice questions from Physics, Chemistry, and Biology subjects.",
    importantDates: "Registration: Dec-Jan, Exam: May, Results: June",
    eligibility: "10+2 with Physics, Chemistry, Biology/Biotechnology and English as core subjects"
  },
  {
    id: "jee",
    title: "JEE (Joint Entrance Examination)",
    description: "National level engineering entrance exam for admission to various engineering colleges in India.",
    applicationProcess: "Online application through JEE website, upload required documents, and pay application fee.",
    examPattern: "JEE Main: 3-hour computer-based test with 90 questions. JEE Advanced: 6-hour exam (two sessions) with multiple-choice and numerical questions.",
    importantDates: "JEE Main: Jan/Apr, JEE Advanced: May/June",
    eligibility: "10+2 with Physics, Chemistry, and Mathematics as core subjects"
  },
  {
    id: "cet",
    title: "CET (Common Entrance Test)",
    description: "State level entrance test for admission to various undergraduate courses in state colleges.",
    applicationProcess: "Online application through state CET website, document verification, and fee payment.",
    examPattern: "Multiple choice questions from subjects relevant to the applied course (varies by state and course).",
    importantDates: "Varies by state, typically held between April-June",
    eligibility: "10+2 with subjects relevant to the applied course"
  },
  {
    id: "cat",
    title: "CAT (Common Admission Test)",
    description: "National level entrance test for admission to MBA programs in IIMs and other business schools.",
    applicationProcess: "Online registration, application form submission, and fee payment through CAT website.",
    examPattern: "2-hour computer-based test with sections on Verbal Ability, Data Interpretation & Logical Reasoning, and Quantitative Ability.",
    importantDates: "Registration: Aug-Sept, Exam: Nov-Dec, Results: Jan",
    eligibility: "Bachelor's degree with at least 50% marks or equivalent CGPA"
  }
];

// News data
const news = [
  {
    id: 1,
    title: "NEET 2023 Registration Opens Next Week",
    date: "2023-10-15",
    source: "Education Times",
    content: "The National Testing Agency has announced that NEET 2023 registrations will begin next week. Students planning to appear for the medical entrance exam should prepare their documents."
  },
  {
    id: 2,
    title: "JEE Main 2023 to be Conducted in Four Sessions",
    date: "2023-10-12",
    source: "Education Ministry",
    content: "The Ministry of Education has announced that JEE Main 2023 will be conducted in four sessions to give multiple opportunities to candidates and avoid clash with board exams."
  },
  {
    id: 3,
    title: "CAT 2023 Registration Deadline Extended",
    date: "2023-10-10",
    source: "IIM Bangalore",
    content: "IIM Bangalore, the conducting body for CAT 2023, has extended the registration deadline by one week due to technical issues faced by candidates."
  },
  {
    id: 4,
    title: "New Changes in GATE 2023 Exam Pattern",
    date: "2023-10-05",
    source: "IIT Delhi",
    content: "IIT Delhi has announced significant changes to the GATE 2023 exam pattern, including the introduction of new subjects and modifications to the marking scheme."
  },
  {
    id: 5,
    title: "State CETs to Consider Board Marks for 2023 Admissions",
    date: "2023-10-01",
    source: "Higher Education Department",
    content: "Various state education departments have announced that Common Entrance Tests for 2023 will consider board exam marks in addition to entrance test scores for final merit lists."
  }
];

const ExamsPage = () => {
  const [selectedExam, setSelectedExam] = useState(exams[0]);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Entrance Examinations Guide</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/4">
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
                    
                    <div className="pt-4">
                      <Button variant="outline" className="mr-2">Download Previous Year Papers</Button>
                      <a href="#" className="text-blue-600 hover:underline">Official Website</a>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
          
          {/* ML Integration Section */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Career Guidance ML Model</CardTitle>
                <CardDescription>
                  Our career guidance system uses machine learning to provide personalized career recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  We use a K-Nearest Neighbors (KNN) algorithm trained on student data to match your profile 
                  with suitable career paths based on your interests, skills, and academic performance.
                </p>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://colab.research.google.com/drive/1MFIlUCMk5cSsUWG2C6Aur1nR2cFjVwYt?usp=sharing" target="_blank" rel="noopener noreferrer">
                    <span>Open ML Model in Google Colab</span>
                    <ExternalLink size={16} />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Latest News & Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {news.map(item => (
                  <div key={item.id} className="border-b pb-3 last:border-b-0">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.date} • {item.source}</p>
                    <p className="text-sm mt-1">{item.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExamsPage;
