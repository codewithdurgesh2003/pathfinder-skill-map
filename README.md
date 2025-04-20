
# Career Guidance System - Full Setup Guide

This career guidance system helps students discover suitable career paths based on their aptitude, academic performance, and personal interests. The system uses machine learning algorithms (KNN) to match students with career options that align with their profile.

## System Overview

The system consists of two main components:
1. **Frontend Application** (React with TypeScript)
2. **Backend Server** (Node.js/Express + MongoDB)

## Quick Start

### Frontend Setup

1. **Clone the repository**
```sh
git clone <repository-url>
cd career-guidance-system
```

2. **Install dependencies**
```sh
npm install
```

3. **Run the development server**
```sh
npm run dev
```

This will start the development server on [http://localhost:5173](http://localhost:5173)

### Backend Setup

1. **Create a backend folder**
```sh
mkdir career-guidance-backend
cd career-guidance-backend
npm init -y
```

2. **Install required dependencies**
```sh
npm install express mongoose cors dotenv
npm install -D nodemon typescript @types/express @types/node @types/cors
```

3. **Create a `.env` file**
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/career_guidance
# Or use a MongoDB Atlas connection string:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/career_guidance
```

4. **Create `server.js` file**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  skills: [String],
  interests: [String],
  academics: {
    sscPercentage: String,
    hscPercentage: String
  },
  preferredWorkStyle: String,
  recommendations: [{
    title: String,
    requiredSkills: [String],
    matchPercentage: Number,
    description: String,
    educationPath: String,
    growthOutlook: String,
    salaryRange: String,
    industries: [String],
    workEnvironment: [String]
  }]
});

const User = mongoose.model('User', userSchema);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', mongodb: 'Connected' });
});

// Create user endpoint
app.post('/users', async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    
    if (existingUser) {
      const updatedUser = await User.findOneAndUpdate(
        { email: req.body.email },
        req.body,
        { new: true }
      );
      return res.json(updatedUser);
    }
    
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user endpoint
app.get('/users/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user recommendations
app.put('/users/:email/recommendations', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { recommendations: req.body.recommendations },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating recommendations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

5. **Start the backend server**
```sh
node server.js
```

## MongoDB Setup

### Option 1: Local MongoDB Installation

#### Windows
1. Download and install MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Follow the installation wizard
3. MongoDB should start automatically as a Windows service

#### macOS
Using Homebrew:
```sh
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu)
```sh
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (the free tier is sufficient for development)
3. Set up database access (create a user with password)
4. Set up network access (allow access from anywhere for development)
5. Get your connection string and update the `.env` file

## Connecting Frontend to Backend

The frontend is already configured to connect to your MongoDB backend through the following files:

1. `src/utils/mongodbTest.ts` - Tests MongoDB connectivity
2. `src/utils/csvRecommendationEngine.ts` - Handles saving recommendations to MongoDB

Make sure to set the `BACKEND_URL` environment variable or use the default `http://localhost:5001`.

## Testing MongoDB Connection

After setting up both the frontend and backend:

1. Start the backend server: `node server.js`
2. Start the frontend development server: `npm run dev`
3. Use the "Test MongoDB Connection" button in the frontend to check connectivity
4. Create a test user profile and check if it's saved to MongoDB

## Running the Complete System

1. Start the MongoDB server (if running locally)
2. Start the Express backend server: `node server.js`
3. Start the React frontend: `npm run dev`
4. Access the application at [http://localhost:5173](http://localhost:5173)

## Production Deployment

For production deployment:

1. Build the frontend: `npm run build`
2. Serve the static files from a web server like Nginx or from a service like Netlify/Vercel
3. Deploy the backend to a service like Heroku, AWS, or DigitalOcean
4. Use a production MongoDB instance (MongoDB Atlas recommended)

## Additional Resources

- Check the `src/utils/setupGuide.ts` file for more detailed information about the system
- Explore the `careerRecommendationService.ts` to understand the recommendation engine

## Troubleshooting

If you encounter issues:

1. **MongoDB Connection Errors**: Verify MongoDB is running and connection string is correct
2. **CORS Errors**: Make sure the backend has CORS properly configured for your frontend URL
3. **API Errors**: Check the browser console and backend logs for specific error messages
