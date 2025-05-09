
import { CareerRecommendation } from "@/services/careerRecommendationService";
import { calculateEuclideanDistance, vectorizeProfile, calculateContentSimilarity } from "@/utils/mlUtils";
import { CollegeData, getCollegeData } from "@/utils/csvLoader";

interface CSVCareerProfile {
  field: string;
  skills: string[];
  interests: string[];
  academicScore: number;
  workStyle: string;
}

export const processCareerCSVData = (colleges: CollegeData[]): CSVCareerProfile[] => {
  // Group colleges by field to create career profiles
  const careerProfiles = new Map<string, CSVCareerProfile>();
  
  colleges.forEach(college => {
    if (!careerProfiles.has(college.field)) {
      // Initialize career profile for this field
      careerProfiles.set(college.field, {
        field: college.field,
        skills: [],
        interests: [],
        academicScore: 0,
        workStyle: "hybrid" // Default
      });
    }
  });
  
  return Array.from(careerProfiles.values());
};

// New function to save recommendations to MongoDB
export const saveRecommendationsToMongoDB = async (
  email: string,
  recommendations: CareerRecommendation[]
): Promise<boolean> => {
  try {
    const apiUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    const response = await fetch(`${apiUrl}/users/${email}/recommendations`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recommendations }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save recommendations');
    }
    
    const data = await response.json();
    console.log('Recommendations saved to MongoDB:', data);
    return true;
  } catch (error) {
    console.error('Error saving recommendations to MongoDB:', error);
    return false;
  }
};

// New function to get user profile from MongoDB
export const getUserProfileFromMongoDB = async (email: string): Promise<any> => {
  try {
    const apiUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    const response = await fetch(`${apiUrl}/users/${email}`);
    
    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting user profile from MongoDB:', error);
    // Fall back to local storage
    const localProfile = localStorage.getItem('userProfile');
    return localProfile ? JSON.parse(localProfile) : null;
  }
};

export const getCSVBasedRecommendations = async (
  userProfile: {
    email?: string;
    skills: string[];
    interests: string[];
    sscPercentage: string;
    hscPercentage: string;
    preferredWorkStyle?: "remote" | "office" | "hybrid";
  }
): Promise<CareerRecommendation[]> => {
  // Get college data from CSV
  const collegeData = getCollegeData();
  
  // Process CSV data into career profiles
  const careerProfiles = processCareerCSVData(collegeData);
  
  // Calculate match scores for each career
  const recommendations: CareerRecommendation[] = [];
  
  // Convert academic scores to numbers
  const userAcademicScore = (
    (parseFloat(userProfile.sscPercentage) + parseFloat(userProfile.hscPercentage)) / 2
  );
  
  careerProfiles.forEach(career => {
    // Calculate skill match using content similarity
    const skillMatchScore = calculateContentSimilarity(
      userProfile.skills,
      career.skills
    );
    
    // Calculate interest match
    const interestMatchScore = calculateContentSimilarity(
      userProfile.interests,
      career.interests
    );
    
    // Calculate academic match (normalized to 0-1)
    const academicMatchScore = Math.max(0, Math.min(1, 
      1 - Math.abs(userAcademicScore - career.academicScore) / 100
    ));
    
    // Calculate work style match
    const workStyleMatch = userProfile.preferredWorkStyle === career.workStyle ? 1 : 0.5;
    
    // Calculate overall match percentage
    const matchPercentage = Math.round(
      (skillMatchScore * 0.4 + 
       interestMatchScore * 0.3 + 
       academicMatchScore * 0.2 + 
       workStyleMatch * 0.1) * 100
    );
    
    // Get relevant college data for this career field
    const relevantColleges = collegeData.filter(college => 
      college.field === career.field
    );
    
    // Get average fees and rating for this career field
    const avgFees = relevantColleges.reduce((sum, college) => {
      const fees = parseInt(college.fees.replace(/[^0-9]/g, '')) || 0;
      return sum + fees;
    }, 0) / relevantColleges.length;
    
    const avgRating = relevantColleges.reduce((sum, college) => 
      sum + college.rating, 0
    ) / relevantColleges.length;
    
    // Create career recommendation
    recommendations.push({
      title: career.field,
      requiredSkills: career.skills,
      matchPercentage,
      description: `Career in ${career.field} based on available college programs`,
      educationPath: `Bachelor's degree in ${career.field}`,
      growthOutlook: avgRating > 4.5 ? "High" : avgRating > 4.0 ? "Moderate" : "Stable",
      salaryRange: `₹${Math.round(avgFees * 1.5)}/year - ₹${Math.round(avgFees * 3)}/year`,
      industries: relevantColleges.map(college => college.location).filter((v, i, a) => a.indexOf(v) === i),
      workEnvironment: [career.workStyle]
    });
  });
  
  // Sort recommendations by match percentage
  const sortedRecommendations = recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
  
  // Save recommendations to MongoDB if email is provided
  if (userProfile.email) {
    await saveRecommendationsToMongoDB(userProfile.email, sortedRecommendations);
  }
  
  return sortedRecommendations;
};
