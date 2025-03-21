
/**
 * Career Guidance System - Complete Setup Guide
 * 
 * This file provides a comprehensive guide for setting up and understanding
 * the Career Guidance System, with a focus on the KNN-based career recommendation engine.
 */

// Overview of the entire system
export const systemOverview = `
# Career Guidance System - Complete Setup Guide

This system helps students discover suitable career paths based on their aptitude, academic performance,
and personal interests. The core of our recommendation engine uses the K-Nearest Neighbors (KNN)
algorithm to match students with career options that align with their profile.

## System Components

1. Frontend React Application
   - User interface for student data input
   - Career recommendation display
   - Educational resources (exams, colleges)

2. KNN Machine Learning Model
   - Core recommendation engine
   - Feature engineering and preprocessing
   - Model training and evaluation

3. Backend Data Storage (Optional)
   - MongoDB for storing student profiles
   - API endpoints for data access
   - Authentication and authorization
`;

// Core concepts of the KNN algorithm for career recommendation
export const knnExplanation = `
## How Our KNN Career Recommendation Works

### What is KNN?
The K-Nearest Neighbors (KNN) algorithm is a supervised machine learning algorithm that classifies 
data points based on the majority class of their k-nearest neighbors in the feature space.

### How We Apply KNN to Career Recommendations:

1. **Data Collection**: We collect student profiles with features such as:
   - Academic scores in various subjects
   - Aptitude test results (logical, verbal, spatial reasoning)
   - Interest scores in different fields
   - Skills assessment results

2. **Feature Engineering**: 
   - We normalize all numeric features to ensure equal importance
   - We encode categorical features (like preferred working style)
   - We select the most predictive features based on feature importance

3. **Training the KNN Model**:
   - We use a dataset of student profiles where the career outcomes are known
   - These "labeled" examples form our training set
   - The model learns to associate feature patterns with career outcomes

4. **Making Predictions**:
   - When a new student completes their profile, we:
     a. Normalize their data using the same scales
     b. Find the k most similar student profiles in our database
     c. Recommend careers based on what worked for similar students
   - We typically use k=5 (five nearest neighbors)

5. **Confidence Scoring**:
   - For each career recommendation, we calculate a confidence score
   - This is based on how many of the k neighbors had this career outcome
   - We also consider the distance (similarity) to these neighbors

### Why KNN for Career Recommendations?

1. **Interpretable Results**: 
   - We can explain WHY a career was recommended ("Students with similar profiles succeeded in this field")
   - The similarity concept is intuitive for users to understand

2. **Handles Mixed Data Types**:
   - Can work with both numeric (test scores) and categorical data (interests)

3. **No Assumptions About Data**:
   - Doesn't assume linear relationships or specific distributions
   - Adapts to complex patterns in student profiles

4. **Improves Over Time**:
   - As more student profiles and outcomes are added, recommendations get better
   - The system learns from real-world success stories
`;

// Setup instructions for the KNN model
export const knnModelSetup = `
## Setting Up the KNN Model

### Prerequisites
- Python 3.8+ installed
- Basic knowledge of ML concepts
- Student profile dataset

### Step 1: Prepare Your Environment
\`\`\`bash
# Create a virtual environment
python -m venv career_guidance_env
source career_guidance_env/bin/activate  # On Windows: career_guidance_env\\Scripts\\activate

# Install required packages
pip install pandas numpy scikit-learn matplotlib seaborn
\`\`\`

### Step 2: Prepare Your Dataset
Create a CSV file with the following structure:
\`\`\`
student_id,math_score,science_score,verbal_score,creative_interest,technical_interest,...,career_outcome
1,85,92,78,4,5,...,Software Engineer
2,75,68,90,5,2,...,Content Writer
...
\`\`\`

### Step 3: Train the KNN Model

\`\`\`python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# Load the dataset
data = pd.read_csv('student_careers.csv')

# Split features and target
X = data.drop(['student_id', 'career_outcome'], axis=1)
y = data['career_outcome']

# Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Find optimal k value (optional)
k_values = list(range(1, 31, 2))
scores = []
for k in k_values:
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train_scaled, y_train)
    scores.append(knn.score(X_test_scaled, y_test))

plt.figure(figsize=(10, 6))
plt.plot(k_values, scores)
plt.xlabel('K value')
plt.ylabel('Accuracy')
plt.title('Accuracy vs K Value')
plt.grid(True)
plt.show()

# Train the model with optimal k
optimal_k = k_values[scores.index(max(scores))]
knn = KNeighborsClassifier(n_neighbors=optimal_k)
knn.fit(X_train_scaled, y_train)

# Evaluate the model
y_pred = knn.predict(X_test_scaled)
print(classification_report(y_test, y_pred))

# Plot confusion matrix
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(12, 10))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", 
            xticklabels=knn.classes_, 
            yticklabels=knn.classes_)
plt.title('Confusion Matrix')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.show()

# Save the model
import joblib
joblib.dump(knn, 'career_knn_model.pkl')
joblib.dump(scaler, 'career_scaler.pkl')
\`\`\`

### Step 4: Generate Key Performance Metrics

The code above will output:

1. **Accuracy**: Overall percentage of correct predictions
2. **Precision**: For each career, how many of the predicted matches were correct
3. **Recall**: For each career, how many actual instances were correctly predicted
4. **F1-score**: Harmonic mean of precision and recall
5. **Confusion Matrix**: Visual representation of true vs predicted labels

### Step 5: Making Predictions

\`\`\`python
# Load the model
knn = joblib.load('career_knn_model.pkl')
scaler = joblib.load('career_scaler.pkl')

# Example student data
new_student = {
    'math_score': 88,
    'science_score': 92,
    'verbal_score': 75,
    'creative_interest': 3,
    'technical_interest': 5,
    # ... other features
}

# Convert to DataFrame with the same columns as training data
student_df = pd.DataFrame([new_student])

# Scale the features
student_scaled = scaler.transform(student_df)

# Get predictions
predicted_career = knn.predict(student_scaled)
print(f"Recommended career: {predicted_career[0]}")

# Get probabilities for all careers
career_probs = knn.predict_proba(student_scaled)[0]
career_options = knn.classes_

# Sort and display top 5 career recommendations
career_recommendations = list(zip(career_options, career_probs))
career_recommendations.sort(key=lambda x: x[1], reverse=True)

print("\\nTop Career Recommendations:")
for career, probability in career_recommendations[:5]:
    print(f"{career}: {probability:.2f}")
\`\`\`
`;

// Backend setup for storing student data
export const backendSetup = `
## Setting Up the Backend (MongoDB)

### Prerequisites
- Node.js installed
- MongoDB Atlas account or local MongoDB installation

### Step 1: Create MongoDB Database
1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database named 'career_guidance'
4. Create a collection named 'student_profiles'

### Step 2: Set Up Express.js Backend

1. Create a new directory for the backend:
\`\`\`bash
mkdir career-guidance-backend
cd career-guidance-backend
npm init -y
\`\`\`

2. Install required dependencies:
\`\`\`bash
npm install express mongoose cors dotenv
\`\`\`

3. Create a .env file:
\`\`\`
MONGODB_URI=your_mongodb_connection_string
PORT=5000
\`\`\`

4. Create server.js file:
\`\`\`javascript
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

// Student Profile Schema
const studentProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  academicScores: {
    math: Number,
    science: Number,
    humanities: Number,
    languages: Number
  },
  aptitudeScores: {
    logical: Number,
    verbal: Number,
    numerical: Number,
    spatial: Number
  },
  interests: [String],
  skills: [String],
  careerRecommendations: [{
    title: String,
    confidence: Number,
    feedback: { type: String, enum: ['positive', 'negative', 'neutral'] }
  }],
  createdAt: { type: Date, default: Date.now }
});

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);

// Routes
app.post('/api/profiles', async (req, res) => {
  try {
    const profile = new StudentProfile(req.body);
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/profiles/:email', async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ email: req.params.email });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/profiles/:email/recommendations', async (req, res) => {
  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { email: req.params.email },
      { careerRecommendations: req.body.recommendations },
      { new: true }
    );
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { email, careerTitle, feedback } = req.body;
    const profile = await StudentProfile.findOne({ email });
    
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    
    const careerIndex = profile.careerRecommendations.findIndex(
      c => c.title === careerTitle
    );
    
    if (careerIndex === -1) {
      return res.status(404).json({ error: 'Career recommendation not found' });
    }
    
    profile.careerRecommendations[careerIndex].feedback = feedback;
    await profile.save();
    
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export student data for model training (admin route)
app.get('/api/training-data', async (req, res) => {
  try {
    const profiles = await StudentProfile.find({
      'careerRecommendations.feedback': 'positive'
    });
    
    // Format data for training
    const trainingData = profiles.map(profile => {
      const recommendedCareer = profile.careerRecommendations.find(
        c => c.feedback === 'positive'
      );
      
      return {
        // Academic scores
        math_score: profile.academicScores.math,
        science_score: profile.academicScores.science,
        humanities_score: profile.academicScores.humanities,
        languages_score: profile.academicScores.languages,
        
        // Aptitude scores
        logical_score: profile.aptitudeScores.logical,
        verbal_score: profile.aptitudeScores.verbal,
        numerical_score: profile.aptitudeScores.numerical,
        spatial_score: profile.aptitudeScores.spatial,
        
        // Target variable
        recommended_career: recommendedCareer ? recommendedCareer.title : null
      };
    }).filter(data => data.recommended_career !== null);
    
    res.json(trainingData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

5. Start the server:
\`\`\`bash
node server.js
\`\`\`

### Step 3: Connect Frontend to Backend

1. Install axios in your React frontend:
\`\`\`bash
npm install axios
\`\`\`

2. Create an API service:
\`\`\`javascript
// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const saveStudentProfile = async (profileData) => {
  const response = await axios.post(\`\${API_URL}/profiles\`, profileData);
  return response.data;
};

export const getStudentProfile = async (email) => {
  const response = await axios.get(\`\${API_URL}/profiles/\${email}\`);
  return response.data;
};

export const saveCareerRecommendations = async (email, recommendations) => {
  const response = await axios.put(
    \`\${API_URL}/profiles/\${email}/recommendations\`, 
    { recommendations }
  );
  return response.data;
};

export const submitFeedback = async (email, careerTitle, feedback) => {
  const response = await axios.post(\`\${API_URL}/feedback\`, {
    email,
    careerTitle,
    feedback
  });
  return response.data;
};
\`\`\`
`;

// How to improve the system with feedback
export const improvingSystem = `
## Improving the KNN Model with User Feedback

Our system incorporates a feedback loop to continuously improve the career recommendations:

1. **Collecting User Feedback**:
   - After receiving career recommendations, users can provide feedback (positive/negative)
   - This feedback is stored in the database with their profile

2. **Retraining Process**:
   - Periodically (e.g., monthly), extract profiles with positive feedback
   - Use these validated profiles as additional training data
   - Retrain the KNN model with the expanded dataset
   - Evaluate the new model against a test set

3. **Implementing the Updated Model**:
   - If the new model shows improved metrics, deploy it to replace the current model
   - Track performance over time to measure system improvement

4. **Feature Importance Analysis**:
   - Analyze which student attributes are most predictive of successful career matches
   - Adjust the feature weights in the KNN algorithm accordingly
   - Consider removing features that show little predictive power

5. **Expanding Career Options**:
   - As more data is collected, expand the range of potential career recommendations
   - Group similar careers into clusters to improve recommendations for new or niche fields

This feedback loop creates a self-improving system that gets more accurate over time as more students
use the platform and provide feedback on their career recommendations.
`;

// Export all sections
export default {
  systemOverview,
  knnExplanation,
  knnModelSetup,
  backendSetup,
  improvingSystem
};
