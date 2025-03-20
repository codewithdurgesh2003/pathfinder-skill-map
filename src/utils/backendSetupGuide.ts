
/**
 * Backend Setup Guide for Career Recommendation System
 * 
 * This file provides guidance on setting up a backend to store user profile data
 * that can be used to improve our career recommendation KNN model.
 */

/**
 * Backend Options - Comparison
 * 
 * 1. Firebase/Firestore
 *    - Pros: Easy setup, realtime updates, authentication included
 *    - Cons: Limited query capabilities for complex ML data analysis
 * 
 * 2. MongoDB Atlas
 *    - Pros: Flexible schema, scales well, good for ML data storage
 *    - Cons: More complex setup than Firebase
 * 
 * 3. Express.js + PostgreSQL
 *    - Pros: Relational data structure, powerful queries, good for structured data
 *    - Cons: Requires more backend knowledge
 * 
 * 4. Supabase
 *    - Pros: Firebase-like features with PostgreSQL, auth included
 *    - Cons: Newer platform
 */

/**
 * Recommended Data Schema for User Profiles
 */
export interface UserProfileSchema {
  // User Identifiers
  id: string;
  email?: string;
  
  // Basic Information
  name: string;
  age?: number;
  education?: string;
  
  // Academic Information
  sscPercentage: number;
  hscPercentage: number;
  
  // Career Preferences
  skills: string[];
  interests: string[];
  preferredWorkStyle?: 'remote' | 'office' | 'hybrid';
  
  // Assessment Results
  aptitudeScores?: {
    logical: number;
    verbal: number;
    numerical: number;
    spatial: number;
    interpersonal: number;
  };
  
  // Career Recommendations (stored for feedback loop)
  recommendedCareers?: Array<{
    title: string;
    matchPercentage: number;
    userFeedback?: 'positive' | 'negative' | 'neutral';
  }>;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Implementation Steps for Express.js + MongoDB Backend
 * 
 * 1. Setup Express.js server
 * 2. Connect to MongoDB using Mongoose
 * 3. Define Mongoose schema based on UserProfileSchema
 * 4. Create API endpoints:
 *    - POST /api/profiles - Create new profile
 *    - GET /api/profiles - Get all profiles (admin only)
 *    - GET /api/profiles/:id - Get profile by ID
 *    - PUT /api/profiles/:id - Update profile
 *    - POST /api/recommendations - Generate recommendations
 *    - POST /api/feedback - Save user feedback on recommendations
 * 5. Implement authentication (JWT)
 * 6. Deploy to hosting service (Heroku, Vercel, Railway, etc.)
 */

// Example MongoDB Schema (if using Mongoose)
export const mongooseSchemaExample = `
const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  age: Number,
  education: String,
  sscPercentage: { type: Number, required: true },
  hscPercentage: { type: Number, required: true },
  skills: [String],
  interests: [String],
  preferredWorkStyle: { type: String, enum: ['remote', 'office', 'hybrid'] },
  aptitudeScores: {
    logical: Number,
    verbal: Number,
    numerical: Number,
    spatial: Number,
    interpersonal: Number
  },
  recommendedCareers: [{
    title: String,
    matchPercentage: Number,
    userFeedback: { type: String, enum: ['positive', 'negative', 'neutral'] }
  }]
}, { timestamps: true });

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile;
`;

/**
 * Integration Steps for Connecting Frontend to Backend
 * 
 * 1. Create API service in frontend:
 *    - src/services/api.ts for API calls
 * 2. Update career recommendation service to fetch data from API
 * 3. Modify user registration flow to save data to backend
 * 4. Implement authentication flow for user identification
 * 5. Add feedback mechanism for recommendations
 */

export const frontendApiServiceExample = `
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiService = {
  // Save user profile
  saveUserProfile: async (profileData) => {
    const response = await axios.post(\`\${API_URL}/profiles\`, profileData);
    return response.data;
  },
  
  // Get recommendations
  getRecommendations: async (userData) => {
    const response = await axios.post(\`\${API_URL}/recommendations\`, userData);
    return response.data;
  },
  
  // Save feedback
  saveFeedback: async (recommendationId, feedback) => {
    const response = await axios.post(\`\${API_URL}/feedback\`, {
      recommendationId,
      feedback
    });
    return response.data;
  }
};
`;

/**
 * ML Model Update Process
 * 
 * 1. Export user profile data from MongoDB periodically
 * 2. Prepare data for model training (cleaning, normalization)
 * 3. Retrain KNN model with expanded dataset
 * 4. Evaluate model performance (accuracy, precision, recall)
 * 5. Update model parameters in frontend code or export as API
 */

export const modelUpdateWorkflow = `
// Pseudocode for model update process
async function updateModel() {
  // 1. Export data from MongoDB
  const userData = await MongoDB.exportCollection('userProfiles');
  
  // 2. Clean and prepare data
  const processedData = preprocessData(userData);
  
  // 3. Train new model
  const newModel = trainKNNModel(processedData);
  
  // 4. Evaluate model
  const { accuracy, precision, recall } = evaluateModel(newModel, testData);
  console.log(\`New model metrics: Accuracy \${accuracy}, Precision \${precision}, Recall \${recall}\`);
  
  // 5. If improved, update production model
  if (accuracy > currentModelAccuracy) {
    deployNewModel(newModel);
  }
}
`;

/**
 * Deployment Options
 * 
 * 1. Heroku - Easy deployment, free tier available
 * 2. Vercel - Good for Next.js/Express backends
 * 3. Railway - Easy deployment, PostgreSQL included
 * 4. AWS/GCP/Azure - More complex but scalable
 */

/**
 * Security Considerations
 * 
 * 1. Implement proper authentication (JWT, OAuth)
 * 2. Use HTTPS for all API calls
 * 3. Implement rate limiting to prevent abuse
 * 4. Sanitize all user inputs
 * 5. Implement proper CORS settings
 * 6. Use environment variables for sensitive info
 */

export const securityImplementationTips = `
// Express.js security setup
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Secure route example
app.get('/api/profiles', authenticateToken, (req, res) => {
  // Only accessible with valid token
});
`;

/**
 * Resources and Further Reading
 */
export const resources = [
  {
    name: "MongoDB Atlas Documentation",
    url: "https://docs.atlas.mongodb.com/"
  },
  {
    name: "Express.js Documentation",
    url: "https://expressjs.com/"
  },
  {
    name: "JWT Authentication Guide",
    url: "https://jwt.io/introduction/"
  },
  {
    name: "Deploying Node.js to Heroku",
    url: "https://devcenter.heroku.com/articles/deploying-nodejs"
  },
  {
    name: "Machine Learning with MongoDB",
    url: "https://www.mongodb.com/languages/python/mongodb-machine-learning-pymongo"
  }
];

