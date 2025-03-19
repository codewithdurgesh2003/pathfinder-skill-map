
import { StudentData } from "../data/studentData";
import { UserProfile } from "../services/careerRecommendationService";

/**
 * Calculates Euclidean distance between two feature vectors
 */
export const calculateEuclideanDistance = (vector1: number[], vector2: number[]): number => {
  if (vector1.length !== vector2.length) {
    throw new Error("Vectors must have the same dimensions");
  }
  
  const squaredDiffs = vector1.map((val, i) => Math.pow(val - vector2[i], 2));
  return Math.sqrt(squaredDiffs.reduce((sum, val) => sum + val, 0));
};

/**
 * Finds k nearest neighbors using Euclidean distance
 */
export const findKNearestNeighbors = (
  target: number[], 
  dataPoints: Array<{vector: number[], data: any}>,
  k: number
): Array<{distance: number, data: any}> => {
  // Calculate distances
  const distances = dataPoints.map(point => ({
    distance: calculateEuclideanDistance(target, point.vector),
    data: point.data
  }));
  
  // Sort by distance (ascending)
  const sortedDistances = distances.sort((a, b) => a.distance - b.distance);
  
  // Return k nearest neighbors
  return sortedDistances.slice(0, k);
};

/**
 * Vectorize student profile for ML processing
 */
export const vectorizeProfile = (profile: UserProfile | StudentData): number[] => {
  // Simple vectorization approach:
  // 1. Academic performance (normalized)
  const sscScore = typeof profile.sscPercentage === 'string' 
    ? parseFloat(profile.sscPercentage) 
    : profile.sscPercentage;
    
  const hscScore = typeof profile.hscPercentage === 'string' 
    ? parseFloat(profile.hscPercentage) 
    : profile.hscPercentage;
  
  // Normalize academic scores to [0, 1]
  const normalizedSSC = sscScore / 100;
  const normalizedHSC = hscScore / 100;
  
  // 2. Work style preference (categorical to numeric)
  // Only if profile has preferredWorkStyle
  let workStyleValue = 0.5; // Default to middle value
  if ('preferredWorkStyle' in profile) {
    switch(profile.preferredWorkStyle) {
      case 'remote': workStyleValue = 0; break;
      case 'hybrid': workStyleValue = 0.5; break;
      case 'office': workStyleValue = 1; break;
    }
  }
  
  // Return feature vector
  return [normalizedSSC, normalizedHSC, workStyleValue];
};

/**
 * Performs content-based similarity using text features
 */
export const calculateContentSimilarity = (
  userFeatures: string[],
  referenceFeatures: string[]
): number => {
  if (userFeatures.length === 0 || referenceFeatures.length === 0) return 0;
  
  // Lowercase all features for better matching
  const userLower = userFeatures.map(f => f.toLowerCase());
  const refLower = referenceFeatures.map(f => f.toLowerCase());
  
  // Count matching features (considering partial matches)
  let matchScore = 0;
  
  userLower.forEach(userFeature => {
    // Look for exact or partial matches
    const bestMatchScore = refLower.reduce((score, refFeature) => {
      // Check for direct containment
      if (refFeature.includes(userFeature) || userFeature.includes(refFeature)) {
        return Math.max(score, 0.8); // High score for partial match
      }
      
      // Check for word-level similarity
      const userWords = userFeature.split(/\s+/);
      const refWords = refFeature.split(/\s+/);
      
      const wordMatches = userWords.filter(word => 
        refWords.some(refWord => refWord.includes(word) || word.includes(refWord))
      ).length;
      
      if (wordMatches > 0) {
        const normalizedScore = 0.3 + (0.5 * wordMatches / Math.max(userWords.length, refWords.length));
        return Math.max(score, normalizedScore);
      }
      
      return score;
    }, 0);
    
    matchScore += bestMatchScore;
  });
  
  // Normalize by user features length
  return matchScore / userFeatures.length;
};
