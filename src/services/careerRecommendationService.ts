import { careers, Career } from "../data/careerData";
import { students, StudentData } from "../data/studentData";
import { recommendationWeights, knnConfig } from "../data/studentOptions";
import { findKNearestNeighbors, vectorizeProfile, calculateContentSimilarity } from "../utils/mlUtils";

export interface UserProfile {
  name?: string;
  skills: string[];
  interests: string[];
  sscPercentage: string;
  hscPercentage: string;
  preferredWorkStyle?: "remote" | "office" | "hybrid";
}

export interface CareerRecommendation extends Career {
  matchPercentage: number;
  description: string;
  educationPath: string;
  growthOutlook: string;
  salaryRange: string;
  industries: string[];
  workEnvironment: string[];
}

// Sample career details and additional data
const careerDetails: Record<string, Omit<CareerRecommendation, 'title' | 'requiredSkills' | 'matchPercentage'>> = {
  "Journalist": {
    description: "Gather, verify, and present information as news, conducting interviews and investigations.",
    educationPath: "Bachelor's in Journalism, Communications, or related field",
    growthOutlook: "Moderate",
    salaryRange: "$45,000 - $90,000",
    industries: ["Media", "Publishing", "Broadcasting", "Digital Content"],
    workEnvironment: ["Office", "Field", "Remote"]
  },
  "Writer/Author": {
    description: "Create content for various media including books, magazines, websites, and advertisements.",
    educationPath: "Bachelor's in English, Creative Writing, or related field",
    growthOutlook: "Moderate",
    salaryRange: "$40,000 - $85,000",
    industries: ["Publishing", "Media", "Marketing", "Education"],
    workEnvironment: ["Remote", "Freelance"]
  },
  "Historian": {
    description: "Research, analyze, interpret, and present the past through records, artifacts, and documents.",
    educationPath: "Master's or PhD in History or related field",
    growthOutlook: "Stable",
    salaryRange: "$55,000 - $95,000",
    industries: ["Education", "Research", "Government", "Museums"],
    workEnvironment: ["Office", "Academic", "Field"]
  },
  "Sociologist": {
    description: "Study human society and social behavior by examining groups, cultures, organizations, and institutions.",
    educationPath: "Master's or PhD in Sociology or related field",
    growthOutlook: "Moderate",
    salaryRange: "$60,000 - $100,000",
    industries: ["Research", "Education", "Government", "Non-profit"],
    workEnvironment: ["Academic", "Office", "Field"]
  },
  "Psychologist": {
    description: "Study cognitive, emotional, and social processes and behavior by observing and interpreting how people relate to one another and their environments.",
    educationPath: "Doctoral degree in Psychology; licensing required for clinical practice",
    growthOutlook: "High",
    salaryRange: "$70,000 - $130,000",
    industries: ["Healthcare", "Education", "Government", "Private Practice"],
    workEnvironment: ["Office", "Clinical", "Academic"]
  },
  "Political Scientist": {
    description: "Study the origin, development, and operation of political systems and public policy.",
    educationPath: "Master's or PhD in Political Science or related field",
    growthOutlook: "Moderate",
    salaryRange: "$65,000 - $115,000",
    industries: ["Government", "Education", "Research", "Non-profit"],
    workEnvironment: ["Office", "Academic", "Remote"]
  },
  "Artist": {
    description: "Create original artwork using various mediums and techniques.",
    educationPath: "Bachelor's in Fine Arts or self-taught with portfolio",
    growthOutlook: "Competitive",
    salaryRange: "$35,000 - $80,000",
    industries: ["Entertainment", "Advertising", "Digital Media", "Education"],
    workEnvironment: ["Studio", "Freelance", "Remote"]
  },
  "Software Developer": {
    description: "Design, build, and maintain software applications and systems.",
    educationPath: "Bachelor's in Computer Science or related field; coding bootcamps",
    growthOutlook: "High",
    salaryRange: "$70,000 - $150,000",
    industries: ["Technology", "Finance", "Healthcare", "E-commerce", "Entertainment"],
    workEnvironment: ["Office", "Remote", "Hybrid"]
  },
  "Data Scientist": {
    description: "Analyze complex data to help organizations make better decisions.",
    educationPath: "Master's or PhD in Data Science, Statistics, Computer Science, or related field",
    growthOutlook: "Very High",
    salaryRange: "$90,000 - $180,000",
    industries: ["Technology", "Finance", "Healthcare", "Research", "E-commerce"],
    workEnvironment: ["Office", "Remote", "Hybrid"]
  },
  "Cybersecurity Analyst": {
    description: "Protect computer systems and networks from security breaches and cyber threats.",
    educationPath: "Bachelor's in Cybersecurity, Computer Science, or related field; certifications",
    growthOutlook: "Very High",
    salaryRange: "$75,000 - $160,000",
    industries: ["Technology", "Finance", "Government", "Healthcare", "Defense"],
    workEnvironment: ["Office", "Remote", "Hybrid"]
  },
  "Cloud Architect": {
    description: "Design and implement cloud computing strategies for organizations.",
    educationPath: "Bachelor's in Computer Science; cloud certifications; professional experience",
    growthOutlook: "High",
    salaryRange: "$110,000 - $200,000",
    industries: ["Technology", "Consulting", "Finance", "Healthcare", "E-commerce"],
    workEnvironment: ["Office", "Remote", "Hybrid"]
  },
  "AI Engineer": {
    description: "Develop and deploy AI systems and algorithms for real-world applications.",
    educationPath: "Master's or PhD in Computer Science, AI, or related field",
    growthOutlook: "Very High",
    salaryRange: "$100,000 - $200,000",
    industries: ["Technology", "Research", "Finance", "Healthcare", "Robotics"],
    workEnvironment: ["Office", "Research Lab", "Remote"]
  },
  "Web Developer": {
    description: "Build and maintain websites and web applications.",
    educationPath: "Bachelor's in Computer Science or related field; coding bootcamps; self-taught",
    growthOutlook: "High",
    salaryRange: "$60,000 - $130,000",
    industries: ["Technology", "E-commerce", "Media", "Marketing", "Finance"],
    workEnvironment: ["Office", "Remote", "Hybrid", "Freelance"]
  },
  "Healthcare Administrator": {
    description: "Plan, direct, and coordinate medical and health services.",
    educationPath: "Bachelor's or Master's in Healthcare Administration or related field",
    growthOutlook: "High",
    salaryRange: "$65,000 - $120,000",
    industries: ["Healthcare", "Hospitals", "Clinics", "Public Health", "Insurance"],
    workEnvironment: ["Office", "Medical Facilities"]
  },
  "Medical Researcher": {
    description: "Conduct research to improve human health and advance medical knowledge.",
    educationPath: "PhD or MD in relevant field",
    growthOutlook: "Moderate",
    salaryRange: "$80,000 - $150,000",
    industries: ["Pharmaceuticals", "Research Institutions", "Universities", "Government", "Biotech"],
    workEnvironment: ["Laboratory", "Research Institution", "Academic"]
  },
  "Financial Analyst": {
    description: "Analyze financial data and provide guidance on investment decisions.",
    educationPath: "Bachelor's in Finance, Economics, or related field; certifications",
    growthOutlook: "Moderate",
    salaryRange: "$65,000 - $130,000",
    industries: ["Finance", "Banking", "Investment", "Consulting", "Corporate"],
    workEnvironment: ["Office", "Remote", "Hybrid"]
  }
};

/**
 * Calculate similarity score between two text strings
 * This is a simple implementation of cosine similarity using term frequency
 */
const calculateTextSimilarity = (text1: string, text2: string): number => {
  if (!text1 || !text2) return 0;
  
  // Convert to lowercase and split into words
  const words1 = text1.toLowerCase().split(/\W+/);
  const words2 = text2.toLowerCase().split(/\W+/);
  
  // Count word frequencies
  const freq1: Record<string, number> = {};
  const freq2: Record<string, number> = {};
  
  words1.forEach(word => {
    if (word) freq1[word] = (freq1[word] || 0) + 1;
  });
  
  words2.forEach(word => {
    if (word) freq2[word] = (freq2[word] || 0) + 1;
  });
  
  // Find intersection of words
  const intersection = Object.keys(freq1).filter(word => freq2[word]);
  
  if (intersection.length === 0) return 0;
  
  // Calculate dot product
  let dotProduct = 0;
  intersection.forEach(word => {
    dotProduct += freq1[word] * freq2[word];
  });
  
  // Calculate magnitudes
  const mag1 = Math.sqrt(Object.values(freq1).reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(Object.values(freq2).reduce((sum, val) => sum + val * val, 0));
  
  // Calculate cosine similarity
  return dotProduct / (mag1 * mag2);
};

/**
 * Calculate skill match score between user skills and career required skills
 * Using a more advanced algorithm than simple matching
 */
const calculateSkillMatch = (userSkills: string[], careerSkills: string[]): number => {
  if (userSkills.length === 0 || careerSkills.length === 0) return 0;
  
  // Calculate similarity scores for each user skill against each career skill
  const similarityMatrix = userSkills.map(userSkill => 
    careerSkills.map(careerSkill => 
      calculateTextSimilarity(userSkill, careerSkill)
    )
  );
  
  // Get the best match score for each user skill
  const bestMatches = similarityMatrix.map(row => 
    Math.max(...row)
  );
  
  // Average of best matches
  const averageMatch = bestMatches.reduce((sum, score) => sum + score, 0) / bestMatches.length;
  
  // Convert to percentage
  return Math.round(averageMatch * 100);
};

/**
 * Calculate interest match score based on career industries and user interests
 */
const calculateInterestMatch = (userInterests: string[], careerIndustries: string[]): number => {
  if (userInterests.length === 0 || !careerIndustries || careerIndustries.length === 0) return 0;
  
  // Calculate similarity scores for each user interest against each career industry
  const similarityMatrix = userInterests.map(interest => 
    careerIndustries.map(industry => 
      calculateTextSimilarity(interest, industry)
    )
  );
  
  // Get the best match score for each user interest
  const bestMatches = similarityMatrix.map(row => 
    Math.max(...row)
  );
  
  // Average of best matches
  const averageMatch = bestMatches.reduce((sum, score) => sum + score, 0) / bestMatches.length;
  
  // Convert to percentage
  return Math.round(averageMatch * 100);
};

/**
 * Calculate academic score based on SSC and HSC percentages
 * This is a simplified approach - in a real ML system, we would train on historical data
 */
const calculateAcademicMatch = (sscPercentage: string, hscPercentage: string): number => {
  const ssc = parseFloat(sscPercentage) || 0;
  const hsc = parseFloat(hscPercentage) || 0;
  
  // Average of SSC and HSC scores, normalized to 100
  const averageScore = (ssc + hsc) / 2;
  
  // Apply a curve - high scores get higher match percentages
  // This is a simple sigmoid function to create a S-curve
  const normalizedScore = 100 / (1 + Math.exp(-0.1 * (averageScore - 50)));
  
  return Math.round(normalizedScore);
};

/**
 * Calculate work environment match based on user preference and career environments
 */
const calculateWorkEnvironmentMatch = (
  preferredWorkStyle: "remote" | "office" | "hybrid" | undefined, 
  careerEnvironments: string[]
): number => {
  if (!preferredWorkStyle || !careerEnvironments || careerEnvironments.length === 0) return 50;
  
  // Map user preference to potential environment keywords
  const preferenceKeywords: Record<string, string[]> = {
    remote: ["Remote", "Freelance", "Virtual", "Work from home"],
    office: ["Office", "On-site", "Clinical", "Studio", "Field"],
    hybrid: ["Remote", "Office", "Flexible"]
  };
  
  const matchingKeywords = preferenceKeywords[preferredWorkStyle];
  
  // Count matching environments
  const matches = careerEnvironments.filter(env => 
    matchingKeywords.some(keyword => 
      env.toLowerCase().includes(keyword.toLowerCase())
    )
  ).length;
  
  // Calculate percentage match
  return Math.round((matches / careerEnvironments.length) * 100);
};

/**
 * Find similar student profiles using k-NN algorithm
 * Combines vector-based similarity with content-based similarity
 */
const findSimilarStudents = (userProfile: UserProfile, k = knnConfig.k): StudentData[] => {
  // Prepare vector features for all students
  const studentVectors = students.map(student => ({
    vector: vectorizeProfile(student),
    data: student
  }));
  
  // Get user vector
  const userVector = vectorizeProfile(userProfile);
  
  // Find k nearest neighbors based on vector similarity
  const vectorNeighbors = findKNearestNeighbors(userVector, studentVectors, k);
  
  // Calculate content-based similarity for skills and interests
  const contentSimilarities = students.map(student => {
    const skillSimilarity = calculateContentSimilarity(userProfile.skills, student.skills);
    const interestSimilarity = calculateContentSimilarity(userProfile.interests, student.interests);
    
    // Combined content similarity score
    const contentScore = (skillSimilarity * 0.6) + (interestSimilarity * 0.4);
    
    return {
      contentScore,
      data: student
    };
  });
  
  // Sort by content similarity (descending)
  const contentNeighbors = contentSimilarities
    .sort((a, b) => b.contentScore - a.contentScore)
    .slice(0, k);
  
  // Combine both approaches with weighted scoring
  const combinedScores = new Map<string, {score: number, student: StudentData}>();
  
  // Add vector-based neighbors with their weights
  vectorNeighbors.forEach((neighbor, index) => {
    // Normalize by position (closer neighbors get higher weights)
    const positionWeight = (k - index) / k;
    const score = positionWeight * knnConfig.vectorWeight;
    
    combinedScores.set(neighbor.data.name, {
      score,
      student: neighbor.data
    });
  });
  
  // Add content-based neighbors with their weights
  contentNeighbors.forEach((neighbor, index) => {
    // Normalize by position
    const positionWeight = (k - index) / k;
    const score = positionWeight * knnConfig.contentWeight;
    
    const existing = combinedScores.get(neighbor.data.name);
    if (existing) {
      existing.score += score;
    } else {
      combinedScores.set(neighbor.data.name, {
        score,
        student: neighbor.data
      });
    }
  });
  
  // Get top k combined neighbors
  return Array.from(combinedScores.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(item => item.student);
};

/**
 * Get career recommendations based on similar students
 * Returns a map of career titles to match scores
 */
const getRecommendationsFromSimilarStudents = (similarStudents: StudentData[]): Map<string, number> => {
  const careerScores = new Map<string, number>();
  
  // For each similar student, analyze their skills and interests
  // to determine the most likely career matches
  similarStudents.forEach(student => {
    // Calculate match scores for each career
    careers.forEach(career => {
      const skillMatchScore = calculateSkillMatch(student.skills, career.requiredSkills);
      const interestMatchScore = calculateInterestMatch(student.interests, 
        careerDetails[career.title]?.industries || []);
      
      // Calculate a weighted score for this student-career pair
      const matchScore = (skillMatchScore * 0.7) + (interestMatchScore * 0.3);
      
      // Add to cumulative score for this career
      const currentScore = careerScores.get(career.title) || 0;
      careerScores.set(career.title, currentScore + matchScore);
    });
  });
  
  // Normalize scores by number of similar students
  careerScores.forEach((score, career) => {
    careerScores.set(career, score / similarStudents.length);
  });
  
  return careerScores;
};

/**
 * Get career recommendations based on user profile
 * Using a weighted average of multiple factors including kNN
 */
export const getCareerRecommendations = (userProfile: UserProfile): CareerRecommendation[] => {
  const recommendations: CareerRecommendation[] = [];
  
  // Find similar student profiles using kNN
  const similarStudents = findSimilarStudents(userProfile);
  console.log("Similar students:", similarStudents.map(s => s.name));
  
  // Get career recommendations based on similar students
  const similarStudentRecommendations = getRecommendationsFromSimilarStudents(similarStudents);
  
  for (const career of careers) {
    // Calculate individual match scores
    const skillMatchScore = calculateSkillMatch(userProfile.skills, career.requiredSkills);
    
    // Get career details or use defaults
    const details = careerDetails[career.title] || {
      description: "No detailed description available.",
      educationPath: "Varies based on specialization",
      growthOutlook: "Varies",
      salaryRange: "Varies by location and experience",
      industries: ["Various"],
      workEnvironment: ["Various"]
    };
    
    const interestMatchScore = calculateInterestMatch(userProfile.interests, details.industries);
    const academicMatchScore = calculateAcademicMatch(userProfile.sscPercentage, userProfile.hscPercentage);
    const workEnvironmentScore = calculateWorkEnvironmentMatch(userProfile.preferredWorkStyle, details.workEnvironment);
    
    // Get similar student recommendation score for this career
    const similarStudentScore = similarStudentRecommendations.get(career.title) || 0;
    
    // Apply weighted average using predefined weights
    const matchPercentage = Math.round(
      (skillMatchScore * recommendationWeights.skillMatch) +
      (interestMatchScore * recommendationWeights.interestMatch) +
      (academicMatchScore * recommendationWeights.academicMatch) +
      (similarStudentScore * recommendationWeights.similarStudents)
    );
    
    // Only include careers with at least 30% match
    if (matchPercentage >= 30) {
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

/**
 * Function to analyze recommendation results and provide insights
 */
export const analyzeRecommendations = (recommendations: CareerRecommendation[]): {
  topSkills: string[];
  suggestedCourses: string[];
  careerGroupings: Record<string, number>;
} => {
  // Extract all skills from top recommendations
  const allSkills = recommendations.slice(0, 3).flatMap(career => career.requiredSkills);
  
  // Count skill frequencies
  const skillCounts: Record<string, number> = {};
  allSkills.forEach(skill => {
    skillCounts[skill] = (skillCounts[skill] || 0) + 1;
  });
  
  // Get top skills
  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill]) => skill);
  
  // Generate suggested courses based on top skills
  const suggestedCourses = topSkills.map(skill => {
    switch(skill) {
      case "Writing": return "Advanced Creative Writing";
      case "Research": return "Research Methodology";
      case "Communication": return "Effective Communication Skills";
      case "Critical Thinking": return "Critical Thinking and Problem Solving";
      case "Analytical Skills": return "Data Analysis and Interpretation";
      case "Creativity": return "Creative Problem Solving";
      case "Programming": return "Introduction to Programming";
      default: return `${skill} Fundamentals`;
    }
  });
  
  // Group careers by industry
  const careerGroupings: Record<string, number> = {};
  recommendations.forEach(career => {
    career.industries.forEach(industry => {
      careerGroupings[industry] = (careerGroupings[industry] || 0) + 1;
    });
  });
  
  return {
    topSkills,
    suggestedCourses,
    careerGroupings
  };
};
