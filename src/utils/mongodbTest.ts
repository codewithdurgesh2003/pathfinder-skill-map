
/**
 * MongoDB Connectivity Test Utility
 * 
 * This file provides utility functions to test the connection to MongoDB
 * backend from the frontend application.
 */

// Test MongoDB connectivity
export const testMongoDBConnection = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const apiUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    const response = await fetch(`${apiUrl}/health`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      message: `Successfully connected to MongoDB backend. Status: ${data.status}`
    };
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return {
      success: false,
      message: `Failed to connect to MongoDB: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Save test user to MongoDB
export const saveTestUserToMongoDB = async (): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    const apiUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    
    // Create test user profile
    const testUser = {
      email: "test@example.com",
      name: "Test User",
      interests: ["programming", "design", "analytics"],
      skills: ["javascript", "problem-solving", "communication"],
      academics: {
        sscPercentage: "85",
        hscPercentage: "88"
      }
    };
    
    const response = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      message: 'Test user successfully saved to MongoDB',
      data
    };
  } catch (error) {
    console.error('Failed to save test user:', error);
    return {
      success: false,
      message: `Failed to save test user: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Get test user from MongoDB
export const getTestUserFromMongoDB = async (): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    const apiUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    const response = await fetch(`${apiUrl}/users/test@example.com`);
    
    if (response.status === 404) {
      return {
        success: false,
        message: 'Test user not found. Try saving a test user first.'
      };
    }
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      message: 'Test user retrieved successfully',
      data
    };
  } catch (error) {
    console.error('Failed to get test user:', error);
    return {
      success: false,
      message: `Failed to get test user: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
