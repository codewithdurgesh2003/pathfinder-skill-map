
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Big Five Personality Traits Questions
const personalityQuestions = [
  {
    id: "e1",
    text: "I am the life of the party.",
    trait: "Extraversion",
  },
  {
    id: "a1",
    text: "I feel little concern for others.",
    trait: "Agreeableness",
    reversed: true,
  },
  {
    id: "c1",
    text: "I am always prepared.",
    trait: "Conscientiousness",
  },
  {
    id: "n1",
    text: "I get stressed out easily.",
    trait: "Neuroticism",
  },
  {
    id: "o1",
    text: "I have a rich vocabulary.",
    trait: "Openness",
  },
  {
    id: "e2",
    text: "I don't talk a lot.",
    trait: "Extraversion",
    reversed: true,
  },
  {
    id: "a2",
    text: "I am interested in people.",
    trait: "Agreeableness",
  },
  {
    id: "c2",
    text: "I leave my belongings around.",
    trait: "Conscientiousness",
    reversed: true,
  },
  {
    id: "n2",
    text: "I am relaxed most of the time.",
    trait: "Neuroticism",
    reversed: true,
  },
  {
    id: "o2",
    text: "I have difficulty understanding abstract ideas.",
    trait: "Openness",
    reversed: true,
  },
];

// Quantitative Aptitude Questions
const aptitudeQuestions = [
  {
    id: "q1",
    text: "If 3x + 7 = 22, what is the value of x?",
    options: ["3", "5", "7", "15"],
    answer: "5",
  },
  {
    id: "q2",
    text: "A train travels at 60 km/hr. How many meters does it travel in 1 minute?",
    options: ["600", "1000", "1600", "3600"],
    answer: "1000",
  },
  {
    id: "q3",
    text: "If a square has a perimeter of 20 units, what is its area?",
    options: ["16 sq units", "25 sq units", "100 sq units", "400 sq units"],
    answer: "25 sq units",
  },
  {
    id: "q4",
    text: "What is the next number in the sequence: 2, 6, 12, 20, 30, ?",
    options: ["36", "40", "42", "45"],
    answer: "42",
  },
  {
    id: "q5",
    text: "In a group of 50 students, 30 like mathematics and 25 like science. If 10 students like both subjects, how many students don't like either subject?",
    options: ["5", "10", "15", "20"],
    answer: "5",
  },
];

type Question = {
  id: string;
  text: string;
  trait?: string;
  reversed?: boolean;
  options?: string[];
  answer?: string;
};

const AptitudeTest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user has completed registration
  useEffect(() => {
    const userProfile = localStorage.getItem("userProfile");
    if (!userProfile) {
      toast({
        title: "Error",
        description: "Please complete your registration first.",
        variant: "destructive",
      });
      navigate("/assessment");
    }
  }, [navigate, toast]);

  const allQuestions = [...personalityQuestions, ...aptitudeQuestions];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Make sure all questions are answered
    if (Object.keys(answers).length < allQuestions.length) {
      toast({
        title: "Warning",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Calculate scores (in a real app, we would do more complex calculations)
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");

    // Process aptitude answers
    const aptitudeScore = aptitudeQuestions.reduce((score, question) => {
      return score + (answers[question.id] === question.answer ? 1 : 0);
    }, 0);

    // Process personality answers
    const personalityTraits = personalityQuestions.reduce(
      (traits, question) => {
        const answer = Number(answers[question.id]);
        const score = question.reversed ? 6 - answer : answer;
        
        if (!traits[question.trait!]) {
          traits[question.trait!] = 0;
        }
        
        traits[question.trait!] += score;
        return traits;
      },
      {} as Record<string, number>
    );

    // Save test results
    const testResults = {
      aptitudeScore,
      personalityTraits,
      answers,
    };

    console.log("Test results:", testResults);
    
    // In a real app, we would send this data to the backend
    // For now, save to localStorage
    localStorage.setItem("testResults", JSON.stringify(testResults));
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Test completed!",
        description: "Generating your career recommendations...",
      });
      navigate("/career-recommendations");
    }, 2000);
  };

  const renderQuestionContent = () => {
    const question = allQuestions[currentQuestionIndex];
    
    if (currentQuestionIndex < personalityQuestions.length) {
      // Render personality question (Likert scale)
      return (
        <div className="space-y-4">
          <p className="text-lg font-medium">{question.text}</p>
          <RadioGroup
            value={answers[question.id]?.toString() || ""}
            onValueChange={handleAnswer}
            className="grid grid-cols-5 gap-2"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="flex flex-col items-center space-y-1">
                <RadioGroupItem
                  value={value.toString()}
                  id={`${question.id}-${value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`${question.id}-${value}`}
                  className="w-full p-2 rounded-md text-center cursor-pointer peer-data-[state=checked]:bg-career-purple peer-data-[state=checked]:text-white hover:bg-career-lightpurple border border-gray-200"
                >
                  {value}
                </Label>
                <span className="text-xs text-gray-500">
                  {value === 1
                    ? "Strongly Disagree"
                    : value === 2
                    ? "Disagree"
                    : value === 3
                    ? "Neutral"
                    : value === 4
                    ? "Agree"
                    : "Strongly Agree"}
                </span>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    } else {
      // Render aptitude question (multiple choice)
      const aptQuestion = question as Question & { options: string[] };
      return (
        <div className="space-y-4">
          <p className="text-lg font-medium">{aptQuestion.text}</p>
          <RadioGroup
            value={answers[aptQuestion.id]?.toString() || ""}
            onValueChange={handleAnswer}
            className="space-y-2"
          >
            {aptQuestion.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={`${aptQuestion.id}-${option}`}
                />
                <Label htmlFor={`${aptQuestion.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl gradient-heading">Aptitude Assessment</CardTitle>
          <CardDescription>
            {currentQuestionIndex < personalityQuestions.length
              ? "Personality assessment: Rate how much you agree with each statement."
              : "Quantitative aptitude: Select the correct answer for each question."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {allQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {renderQuestionContent()}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0 || isLoading}
            >
              Previous
            </Button>
            <Button
              onClick={goToNextQuestion}
              disabled={!answers[currentQuestion.id] || isLoading}
              className="bg-career-purple hover:bg-career-blue"
            >
              {currentQuestionIndex === allQuestions.length - 1
                ? isLoading
                  ? "Submitting..."
                  : "Submit"
                : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AptitudeTest;
