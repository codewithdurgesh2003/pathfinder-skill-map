
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Available skills and interests options
import { skillOptions, interestOptions } from "@/data/studentOptions";

const studentProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  sscPercentage: z.string().refine(val => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, {
    message: "SSC percentage must be a number between 0 and 100",
  }),
  hscPercentage: z.string().refine(val => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, {
    message: "HSC percentage must be a number between 0 and 100",
  }),
  preferredWorkStyle: z.enum(["remote", "office", "hybrid"]),
});

type StudentProfileData = z.infer<typeof studentProfileSchema>;

interface StudentProfileFormProps {
  onSubmit?: (data: StudentProfileData) => void;
}

const StudentProfileForm = ({ onSubmit }: StudentProfileFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<StudentProfileData>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      name: "",
      skills: [],
      interests: [],
      sscPercentage: "",
      hscPercentage: "",
      preferredWorkStyle: "office",
    }
  });

  const handleSubmit = (data: StudentProfileData) => {
    toast({
      title: "Profile submitted",
      description: "Your student profile has been saved.",
    });
    
    // Save data to localStorage for demo purposes
    localStorage.setItem("userProfile", JSON.stringify(data));
    
    // Call the onSubmit prop if provided
    if (onSubmit) {
      onSubmit(data);
    } else {
      // Navigate to the next step in the career assessment flow
      navigate("/aptitude-test");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="sscPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SSC Percentage (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    step="0.01" 
                    placeholder="e.g. 85.5" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hscPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HSC Percentage (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    step="0.01" 
                    placeholder="e.g. 78.3" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="skills"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Skills</FormLabel>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {skillOptions.map((skill) => (
                  <FormField
                    key={skill}
                    control={form.control}
                    name="skills"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={skill}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(skill)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, skill])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== skill
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            {skill}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interests"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Interests</FormLabel>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {interestOptions.map((interest) => (
                  <FormField
                    key={interest}
                    control={form.control}
                    name="interests"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={interest}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(interest)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, interest])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== interest
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            {interest}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredWorkStyle"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Preferred Work Style</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="remote" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Remote
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="office" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Office
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="hybrid" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Hybrid
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full md:w-auto bg-career-purple hover:bg-career-blue"
        >
          Submit Profile
        </Button>
      </form>
    </Form>
  );
};

export default StudentProfileForm;
