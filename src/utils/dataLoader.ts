
/**
 * Utilities for efficiently loading and processing large datasets
 */

// Load data in chunks to avoid blocking the main thread
export const loadLargeDataset = async <T>(
  dataArray: T[],
  chunkSize: number = 100,
  processChunk?: (chunk: T[]) => void
): Promise<T[]> => {
  return new Promise((resolve) => {
    const result: T[] = [];
    let index = 0;

    function processNextChunk() {
      const chunk = dataArray.slice(index, index + chunkSize);
      result.push(...chunk);
      
      if (processChunk) {
        processChunk(chunk);
      }
      
      index += chunkSize;
      
      if (index >= dataArray.length) {
        resolve(result);
        return;
      }
      
      // Use setTimeout to avoid blocking the main thread
      setTimeout(processNextChunk, 0);
    }

    processNextChunk();
  });
};

// Cache data in localStorage with expiration
export const cacheData = <T>(key: string, data: T, expirationMinutes: number = 60): void => {
  const item = {
    data,
    expiry: new Date().getTime() + (expirationMinutes * 60 * 1000)
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error("Error caching data:", error);
  }
};

// Get cached data if not expired
export const getCachedData = <T>(key: string): T | null => {
  const itemStr = localStorage.getItem(key);
  
  if (!itemStr) {
    return null;
  }
  
  try {
    const item = JSON.parse(itemStr);
    const now = new Date().getTime();
    
    if (now > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.data as T;
  } catch (error) {
    console.error("Error retrieving cached data:", error);
    return null;
  }
};

// Check if user is logged in
export const isUserLoggedIn = (): boolean => {
  return localStorage.getItem('currentUser') !== null;
};

// Get current user profile
export const getCurrentUser = () => {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
};

// Save user profile
export const saveUserProfile = (email: string, profile: any) => {
  // Get existing users
  const usersData = localStorage.getItem('userProfiles') || '{}';
  const users = JSON.parse(usersData);
  
  // Update or add new user profile
  users[email] = {
    ...profile,
    lastUpdated: new Date().toISOString()
  };
  
  // Save updated users data
  localStorage.setItem('userProfiles', JSON.stringify(users));
  
  // Set current user
  localStorage.setItem('currentUser', JSON.stringify({
    email,
    ...profile
  }));
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('currentUser');
};

// Get all user profiles (for machine learning purposes)
export const getAllUserProfiles = () => {
  const usersData = localStorage.getItem('userProfiles') || '{}';
  return Object.values(JSON.parse(usersData));
};

// Python ML Integration Helper
export const fetchPredictionsFromPython = async (userData: any) => {
  try {
    // In production, this would call your Flask/FastAPI backend
    // For now, simulate the API call
    console.log("Sending user data to Python ML service:", userData);
    
    // Simulate response from Python backend
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          predictions: [
            { career: "Software Engineer", score: 92 },
            { career: "Data Scientist", score: 88 },
            { career: "UX Designer", score: 76 },
            { career: "Product Manager", score: 71 },
            { career: "Network Administrator", score: 65 }
          ],
          accuracy: 0.85,
          model: "KNN",
          features_used: ["interests", "skills", "aptitude_scores"]
        });
      }, 1000);
    });
  } catch (error) {
    console.error("Error fetching predictions from Python service:", error);
    throw error;
  }
};

// MongoDB Integration helpers
export const saveUserDataToMongoDB = async (userData: any) => {
  try {
    // In production, this would call your MongoDB API endpoint
    console.log("Saving user data to MongoDB:", userData);
    
    // Simulate successful save
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "User data saved to MongoDB" });
      }, 500);
    });
  } catch (error) {
    console.error("Error saving to MongoDB:", error);
    throw error;
  }
};

export const getUserDataFromMongoDB = async (email: string) => {
  try {
    // In production, this would call your MongoDB API endpoint
    console.log("Fetching user data from MongoDB for:", email);
    
    // Simulate response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          email,
          name: "Test User",
          testResults: [/* ...test results... */],
          recommendations: [/* ...recommendations... */]
        });
      }, 500);
    });
  } catch (error) {
    console.error("Error fetching from MongoDB:", error);
    throw error;
  }
};
