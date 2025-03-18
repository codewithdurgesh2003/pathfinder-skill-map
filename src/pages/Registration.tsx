
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const skillOptions = [
  "Programming",
  "Design",
  "Writing",
  "Public Speaking",
  "Problem Solving",
  "Leadership",
  "Communication",
  "Teamwork",
  "Analytical Thinking",
  "Creativity",
  "Time Management",
  "Adaptability",
  "Critical Thinking",
  "Mathematics",
  "Research",
];

const interestOptions = [
  "Technology",
  "Science",
  "Arts",
  "Business",
  "Healthcare",
  "Education",
  "Engineering",
  "Environment",
  "Finance",
  "Marketing",
  "Law",
  "Media",
  "Sports",
  "Social Work",
  "Travel",
];

const Registration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    sscPercentage: "",
    hscPercentage: "",
    skills: [] as string[],
    interests: [] as string[],
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (!formData.name || !formData.sscPercentage || !formData.hscPercentage) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.skills.length < 3) {
      toast({
        title: "Error",
        description: "Please select at least 3 skills.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.interests.length < 3) {
      toast({
        title: "Error",
        description: "Please select at least 3 interests.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // In a real app, here we would save the data to the backend
    console.log("Submitting form data:", formData);
    
    // Simulate API call delay
    setTimeout(() => {
      toast({
        title: "Registration successful!",
        description: "You can now proceed to the aptitude test.",
      });
      setIsLoading(false);
      
      // Save data to localStorage for demo purposes
      localStorage.setItem("userProfile", JSON.stringify(formData));
      
      // Navigate to the next step
      navigate("/aptitude-test");
    }, 1500);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl gradient-heading">Registration</CardTitle>
          <CardDescription>
            Please provide your information to start the career assessment process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sscPercentage">SSC Percentage (%)</Label>
                  <Input
                    id="sscPercentage"
                    name="sscPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="e.g. 85.5"
                    value={formData.sscPercentage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hscPercentage">HSC Percentage (%)</Label>
                  <Input
                    id="hscPercentage"
                    name="hscPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="e.g. 78.3"
                    value={formData.hscPercentage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Skills (Select at least 3)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {skillOptions.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={`skill-${skill}`}
                        checked={formData.skills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                      />
                      <label
                        htmlFor={`skill-${skill}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Selected: {formData.skills.length}/15
                </p>
              </div>

              <div>
                <Label className="mb-2 block">Interests (Select at least 3)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {interestOptions.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={`interest-${interest}`}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <label
                        htmlFor={`interest-${interest}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Selected: {formData.interests.length}/15
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full md:w-auto bg-career-purple hover:bg-career-blue"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Proceed to Aptitude Test"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Registration;
