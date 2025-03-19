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
