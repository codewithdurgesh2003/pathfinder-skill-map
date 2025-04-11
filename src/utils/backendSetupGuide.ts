
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
 * Setting Up MongoDB on Your Local System
 */
export const localMongoDBSetup = `
# MongoDB Local Setup Guide

## Step 1: Install MongoDB Community Edition
- **Windows:**
  1. Download the MongoDB installer from the MongoDB Download Center
  2. Run the installer and follow the setup wizard
  3. Optionally install MongoDB Compass (GUI for MongoDB)
  
- **macOS:**
  1. Using Homebrew: \`brew tap mongodb/brew\`
  2. Then: \`brew install mongodb-community\`
  3. Start: \`brew services start mongodb-community\`
  
- **Linux (Ubuntu):**
  1. Import public key: \`wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -\`
  2. Create list file: \`echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list\`
  3. Update: \`sudo apt-get update\`
  4. Install: \`sudo apt-get install -y mongodb-org\`
  5. Start: \`sudo systemctl start mongod\`

## Step 2: Verify Installation
- Run: \`mongosh\` in terminal/command prompt
- You should see the MongoDB shell connecting to: mongodb://127.0.0.1:27017

## Step 3: Create Database and Collection
- In MongoDB shell:
  1. Switch to your DB: \`use career_guidance\`
  2. Create collection: \`db.createCollection("student_profiles")\`
  3. Verify: \`show collections\`

## Step 4: Set Up Node.js Backend
1. Create a new directory for your backend
2. Initialize npm: \`npm init -y\`
3. Install dependencies:
   \`npm install express mongoose cors dotenv bcrypt jsonwebtoken\`
4. Create .env file with:
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/career_guidance
   PORT=5000
   TOKEN_SECRET=your_secret_key
   \`\`\`
5. Create server.js file (refer to example in this guide)
6. Start server: \`node server.js\`

## Step 5: Connect Your Frontend
- Update the API_URL in your frontend code to point to your local server
- Test the connection by creating a user profile
`;

/**
 * Setting Up MongoDB Atlas (Cloud)
 */
export const mongoDBAtlasSetup = `
# MongoDB Atlas (Cloud) Setup Guide

## Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account or log in

## Step 2: Create a New Cluster
1. Click "Build a Database"
2. Choose the free tier option
3. Select your preferred cloud provider and region
4. Click "Create Cluster" (creation takes a few minutes)

## Step 3: Configure Security
1. In the Security tab, add a new database user with password
2. In Network Access, add your IP address or allow access from anywhere (for development)

## Step 4: Connect to Your Cluster
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace <password> with your database user's password

## Step 5: Set Up Node.js Backend
1. Create a new directory for your backend
2. Initialize npm: \`npm init -y\`
3. Install dependencies:
   \`npm install express mongoose cors dotenv bcrypt jsonwebtoken\`
4. Create .env file with:
   \`\`\`
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=5000
   TOKEN_SECRET=your_secret_key
   \`\`\`
5. Create server.js file (refer to example in this guide)
6. Start server: \`node server.js\`

## Step 6: Deploy Backend (Optional)
1. Create a GitHub repository for your backend code
2. Connect your repository to a hosting service like:
   - Render.com
   - Vercel
   - Railway
   - Heroku
3. Configure environment variables on the hosting platform
4. Deploy your application

## Step 7: Connect Your Frontend
- Update the API_URL in your frontend code to point to your deployed server
- Test the connection by creating a user profile
`;

/**
 * Technologies Overview for Research Paper
 */
export const technologiesOverview = [
  {
    name: "React",
    description: "JavaScript library for building user interfaces with component-based architecture, enabling efficient DOM updates through virtual DOM and declarative programming paradigm."
  },
  {
    name: "TypeScript",
    description: "Strongly-typed superset of JavaScript that adds static type checking, enhancing code quality, reducing runtime errors, and improving developer experience through better IDE support and documentation."
  },
  {
    name: "MongoDB",
    description: "NoSQL document database using JSON-like documents with flexible schema, ideal for storing heterogeneous student profile data and ML training datasets with horizontal scalability."
  },
  {
    name: "K-Nearest Neighbors (KNN)",
    description: "Machine learning algorithm that classifies data points based on majority vote of k-nearest neighbors, particularly suitable for career recommendation systems due to its interpretability and effectiveness with mixed data types."
  },
  {
    name: "Express.js",
    description: "Minimalist web framework for Node.js that facilitates the creation of RESTful APIs, handling HTTP requests and middleware integration for the backend service infrastructure."
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first CSS framework enabling rapid UI development through composable utility classes, promoting consistent design without leaving HTML context, and optimizing production builds."
  },
  {
    name: "React Query",
    description: "Data-fetching library for React that simplifies server state management with automatic caching, background updates, and optimistic UI updates for responsive user experiences."
  },
  {
    name: "JSON Web Tokens (JWT)",
    description: "Compact, self-contained method for securely transmitting information between parties as a JSON object, used for authentication and maintaining user sessions without server-side storage."
  }
];

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
  },
  {
    name: "KNN Algorithm for Machine Learning",
    url: "https://scikit-learn.org/stable/modules/neighbors.html"
  },
  {
    name: "React Query Documentation",
    url: "https://tanstack.com/query/latest/docs/react/overview"
  }
];
