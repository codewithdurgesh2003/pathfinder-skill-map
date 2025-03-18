
import { careers, Career } from "../data/careerData";

interface UserProfile {
  skills: string[];
  interests: string[];
  sscPercentage: string;
  hscPercentage: string;
}

interface CareerRecommendation extends Career {
  matchPercentage: number;
  description: string;
  educationPath: string;
  growthOutlook: string;
  salaryRange: string;
  industries: string[];
}

// Sample career descriptions and additional data
const careerDetails: Record<string, Omit<CareerRecommendation, 'title' | 'requiredSkills' | 'matchPercentage'>> = {
  "Journalist": {
    description: "Gather, verify, and present information as news, conducting interviews and investigations.",
    educationPath: "Bachelor's in Journalism, Communications, or related field",
    growthOutlook: "Moderate",
    salaryRange: "$45,000 - $90,000",
    industries: ["Media", "Publishing", "Broadcasting", "Digital Content"]
  },
  "Writer/Author": {
    description: "Create content for various media including books, magazines, websites, and advertisements.",
    educationPath: "Bachelor's in English, Creative Writing, or related field",
    growthOutlook: "Moderate",
    salaryRange: "$40,000 - $85,000",
    industries: ["Publishing", "Media", "Marketing", "Education"]
  },
  "Historian": {
    description: "Research, analyze, interpret, and present the past through records, artifacts, and documents.",
    educationPath: "Master's or PhD in History or related field",
    growthOutlook: "Stable",
    salaryRange: "$55,000 - $95,000",
    industries: ["Education", "Research", "Government", "Museums"]
  },
  "Sociologist": {
    description: "Study human society and social behavior by examining groups, cultures, organizations, and institutions.",
    educationPath: "Master's or PhD in Sociology or related field",
    growthOutlook: "Moderate",
    salaryRange: "$60,000 - $100,000",
    industries: ["Research", "Education", "Government", "Non-profit"]
  },
  "Psychologist": {
    description: "Study cognitive, emotional, and social processes and behavior by observing and interpreting how people relate to one another and their environments.",
    educationPath: "Doctoral degree in Psychology; licensing required for clinical practice",
    growthOutlook: "High",
    salaryRange: "$70,000 - $130,000",
    industries: ["Healthcare", "Education", "Government", "Private Practice"]
  },
  "Political Scientist": {
    description: "Study the origin, development, and operation of political systems and public policy.",
    educationPath: "Master's or PhD in Political Science or related field",
    growthOutlook: "Moderate",
    salaryRange: "$65,000 - $115,000",
    industries: ["Government", "Education", "Research", "Non-profit"]
  },
  "Artist": {
    description: "Create original artwork using various mediums and techniques.",
    educationPath: "Bachelor's in Fine Arts or self-taught with portfolio",
    growthOutlook: "Competitive",
    salaryRange: "$35,000 - $80,000",
    industries: ["Entertainment", "Advertising", "Digital Media", "Education"]
  }
  // Add more career details as needed
};

// Calculate match score between user skills and career required skills
const calculateSkillMatch = (userSkills: string[], careerSkills: string[]): number => {
  if (userSkills.length === 0 || careerSkills.length === 0) return 0;
  
  let matchCount = 0;
  
  // Count how many of the user's skills match the career skills
  for (const skill of userSkills) {
    for (const careerSkill of careerSkills) {
      if (careerSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(careerSkill.toLowerCase())) {
        matchCount++;
        break;
      }
    }
  }
  
  // Calculate percentage based on user skills (how many of their skills match this career)
  return Math.round((matchCount / userSkills.length) * 100);
};

// Get career recommendations based on user profile
export const getCareerRecommendations = (userProfile: UserProfile): CareerRecommendation[] => {
  const recommendations: CareerRecommendation[] = [];
  
  for (const career of careers) {
    const matchPercentage = calculateSkillMatch(userProfile.skills, career.requiredSkills);
    
    // Only include careers with at least 30% match
    if (matchPercentage >= 30) {
      // Get additional career details or use defaults
      const details = careerDetails[career.title] || {
        description: "No detailed description available.",
        educationPath: "Varies based on specialization",
        growthOutlook: "Varies",
        salaryRange: "Varies by location and experience",
        industries: ["Various"]
      };
      
      recommendations.push({
        ...career,
        ...details,
        matchPercentage
      });
    }
  }
  
  // Sort by match percentage (highest first)
  return recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
};
