
# Career Guidance System Setup Guide

This guide will help you set up the Career Guidance System on your local machine, including:

1. Frontend React Application
2. Python ML Model for Career Recommendations
3. MongoDB Backend for User Data Storage

## 1. Frontend Setup

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn

### Installation Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd career-guidance-system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## 2. Python ML Model Setup

### Prerequisites
- Python 3.8+ installed
- pip (Python package manager)
- Google Colab (for training and testing models)

### Setup Python Environment
1. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install required packages:
   ```bash
   pip install flask pandas scikit-learn numpy matplotlib seaborn flask-cors
   ```

### Python ML Server Setup
1. Create a folder named `python_ml` in the project root
2. Create a new file `app.py` in the `python_ml` folder:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Path to the model file
MODEL_PATH = 'career_knn_model.pkl'
SCALER_PATH = 'career_scaler.pkl'
CSV_PATH = 'student_data.csv'

# Load model and scaler if they exist
def load_model_and_scaler():
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        return model, scaler
    else:
        # Train a new model if files don't exist
        return train_model()

# Train a new model from CSV data
def train_model():
    if not os.path.exists(CSV_PATH):
        # Create a sample dataset if none exists
        create_sample_dataset()
    
    # Load and prepare data
    data = pd.read_csv(CSV_PATH)
    
    # Basic preprocessing
    # (In a real application, this would be more sophisticated)
    X = data.drop('recommended_career', axis=1)
    y = data['recommended_career']
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train KNN model
    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(X_scaled, y)
    
    # Save model and scaler
    joblib.dump(knn, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    
    return knn, scaler

# Create a sample dataset for initial training
def create_sample_dataset():
    # Create a simple sample dataset
    # In a real application, you'd have actual data
    sample_data = {
        'interests_technical': [5, 3, 4, 2, 5, 1],
        'interests_creative': [2, 5, 3, 4, 2, 5],
        'skills_analytical': [4, 3, 5, 2, 4, 3],
        'skills_communication': [3, 4, 2, 5, 3, 4],
        'academic_science': [5, 2, 4, 3, 5, 2],
        'academic_humanities': [2, 5, 3, 4, 2, 5],
        'recommended_career': [
            'Software Engineer', 
            'Graphic Designer', 
            'Data Scientist', 
            'Marketing Manager',
            'Systems Analyst',
            'Content Writer'
        ]
    }
    
    pd.DataFrame(sample_data).to_csv(CSV_PATH, index=False)

# Pre-load model
model, scaler = load_model_and_scaler()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.json
        
        # Extract features
        features = [
            data.get('interests_technical', 3),
            data.get('interests_creative', 3),
            data.get('skills_analytical', 3),
            data.get('skills_communication', 3),
            data.get('academic_science', 3),
            data.get('academic_humanities', 3)
        ]
        
        # Convert to numpy array and reshape
        features_array = np.array(features).reshape(1, -1)
        
        # Scale features
        scaled_features = scaler.transform(features_array)
        
        # Get prediction
        prediction = model.predict(scaled_features)
        
        # Get probabilities for all classes
        probabilities = model.predict_proba(scaled_features)[0]
        classes = model.classes_
        
        # Create sorted predictions with probabilities
        predictions_with_probs = [
            {"career": cls, "score": int(prob * 100)} 
            for cls, prob in zip(classes, probabilities)
        ]
        
        # Sort by probability (descending)
        sorted_predictions = sorted(
            predictions_with_probs, 
            key=lambda x: x["score"], 
            reverse=True
        )
        
        # Return top 5 predictions
        return jsonify({
            "predictions": sorted_predictions[:5],
            "accuracy": 0.85,  # In a real app, use cross-validation metrics
            "model": "KNN",
            "features_used": [
                "interests_technical", 
                "interests_creative", 
                "skills_analytical", 
                "skills_communication",
                "academic_science",
                "academic_humanities"
            ]
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/train', methods=['POST'])
def retrain_model():
    try:
        # Get new training data
        data = request.json.get('data', [])
        
        if not data:
            return jsonify({"error": "No training data provided"}), 400
        
        # Convert to DataFrame
        df = pd.DataFrame(data)
        
        # Save and append to existing CSV
        if os.path.exists(CSV_PATH):
            existing_data = pd.read_csv(CSV_PATH)
            combined_data = pd.concat([existing_data, df], ignore_index=True)
            combined_data.to_csv(CSV_PATH, index=False)
        else:
            df.to_csv(CSV_PATH, index=False)
        
        # Retrain the model
        global model, scaler
        model, scaler = train_model()
        
        return jsonify({"success": True, "message": "Model retrained successfully"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

3. Run the Flask server:
   ```bash
   cd python_ml
   python app.py
   ```

4. The ML API will be available at `http://localhost:5000`

### Google Colab Integration (For Model Training)

1. Create a new Colab notebook
2. Add the following code to train and evaluate the model:

```python
# Install required packages
!pip install pandas scikit-learn numpy matplotlib seaborn

# Import libraries
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# Create or upload sample data
# In a real scenario, you'd upload your actual student data CSV
# This is just a sample for demonstration
data = {
    'interests_technical': [5, 3, 4, 2, 5, 1, 4, 5, 2, 3] * 10,
    'interests_creative': [2, 5, 3, 4, 2, 5, 3, 2, 5, 4] * 10,
    'skills_analytical': [4, 3, 5, 2, 4, 3, 5, 4, 3, 2] * 10,
    'skills_communication': [3, 4, 2, 5, 3, 4, 2, 3, 4, 5] * 10,
    'academic_science': [5, 2, 4, 3, 5, 2, 4, 5, 2, 3] * 10,
    'academic_humanities': [2, 5, 3, 4, 2, 5, 3, 2, 4, 5] * 10,
    'recommended_career': (
        ['Software Engineer', 'Graphic Designer', 'Data Scientist', 'Marketing Manager',
         'Systems Analyst', 'Content Writer', 'Software Engineer', 'Data Scientist', 
         'Graphic Designer', 'Marketing Manager'] * 10
    )
}

df = pd.DataFrame(data)

# Display dataset
print("Dataset shape:", df.shape)
df.head()

# Split features and target
X = df.drop('recommended_career', axis=1)
y = df['recommended_career']

# Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Find the best k value
k_values = list(range(1, 31, 2))
cross_val_scores = []

for k in k_values:
    knn = KNeighborsClassifier(n_neighbors=k)
    scores = cross_val_score(knn, X_train_scaled, y_train, cv=5)
    cross_val_scores.append(scores.mean())

# Plot k values vs accuracy
plt.figure(figsize=(10, 6))
plt.plot(k_values, cross_val_scores, 'o-')
plt.xlabel('Number of Neighbors (k)')
plt.ylabel('Cross-Validation Accuracy')
plt.title('Optimal k Value')
plt.grid(True)
plt.show()

# Find the best k
best_k = k_values[cross_val_scores.index(max(cross_val_scores))]
print(f"Best k value: {best_k}")

# Train the model with best k
knn = KNeighborsClassifier(n_neighbors=best_k)
knn.fit(X_train_scaled, y_train)

# Evaluate on test set
y_pred = knn.predict(X_test_scaled)
accuracy = (y_pred == y_test).mean()
print(f"Test Accuracy: {accuracy:.4f}")

# Classification report
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Confusion matrix
plt.figure(figsize=(10, 8))
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=knn.classes_, 
            yticklabels=knn.classes_)
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix')
plt.show()

# Feature importance (for KNN we'll use a simple approach)
feature_names = X.columns
importances = []

for i, feature in enumerate(feature_names):
    X_temp = X_train_scaled.copy()
    np.random.shuffle(X_temp[:, i])  # Shuffle one feature
    y_pred_shuffled = knn.predict(X_temp)
    accuracy_shuffled = (y_pred_shuffled == y_train.values).mean()
    importance = accuracy - accuracy_shuffled
    importances.append(importance)

# Plot feature importances
plt.figure(figsize=(10, 6))
plt.bar(feature_names, importances)
plt.xlabel('Features')
plt.ylabel('Importance')
plt.title('Feature Importance')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# Save the model (for download)
import joblib
joblib.dump(knn, 'career_knn_model.pkl')
joblib.dump(scaler, 'career_scaler.pkl')

print("Model training complete!")
```

3. Run the notebook in Google Colab
4. Download the trained model files to use in your Flask app

## 3. MongoDB Backend Setup

### Prerequisites
- MongoDB (local installation or MongoDB Atlas account)
- Node.js and npm/yarn

### Setting Up MongoDB Atlas (Cloud Option)
1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Set up database access (username and password)
4. Set up network access (IP whitelist)
5. Get your connection string

### Setting Up Express Backend
1. Create a folder named `backend` in the project root
2. Initialize a new npm project:
   ```bash
   cd backend
   npm init -y
   ```

3. Install dependencies:
   ```bash
   npm install express mongoose cors dotenv
   ```

4. Create a `.env` file in the `backend` folder:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5001
   ```

5. Create a new file `server.js` in the `backend` folder:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  interests: { type: Object },
  skills: { type: Object },
  academics: { type: Object },
  testResults: { type: Array, default: [] },
  recommendations: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Routes
// GET health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// POST register/login user
app.post('/users', async (req, res) => {
  try {
    const { email, ...userData } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Update or insert user (upsert)
    const user = await User.findOneAndUpdate(
      { email },
      { ...userData, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    
    res.json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET user by email
app.get('/users/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update test results
app.put('/users/:email/test-results', async (req, res) => {
  try {
    const { testResults } = req.body;
    
    if (!testResults) {
      return res.status(400).json({ error: 'Test results are required' });
    }
    
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { 
        $push: { testResults: testResults },
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating test results:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update career recommendations
app.put('/users/:email/recommendations', async (req, res) => {
  try {
    const { recommendations } = req.body;
    
    if (!recommendations) {
      return res.status(400).json({ error: 'Recommendations are required' });
    }
    
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { 
        recommendations,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating recommendations:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all users (for ML training data)
app.get('/ml-training-data', async (req, res) => {
  try {
    // Only return necessary fields
    const users = await User.find(
      { testResults: { $exists: true, $ne: [] } },
      { 
        'interests': 1, 
        'skills': 1, 
        'academics': 1, 
        'recommendations.title': 1 
      }
    );
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching training data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

6. Start the backend server:
   ```bash
   node server.js
   ```

7. The backend API will be available at `http://localhost:5001`

## 4. Integrating the Components

### Update Frontend to Connect to Backend
1. Make sure your React app is configured to call the backend APIs
2. Update relevant components to fetch/save data to MongoDB
3. Configure Python ML service integration

### Running the Complete System
1. Start the MongoDB backend:
   ```bash
   cd backend
   node server.js
   ```

2. Start the Python ML server:
   ```bash
   cd python_ml
   python app.py
   ```

3. Start the React frontend:
   ```bash
   cd career-guidance-system
   npm run dev
   ```

## 5. Development Workflow

### Making Changes to the ML Model
1. Modify the Colab notebook to improve the model
2. Train and evaluate the model in Colab
3. Download the updated model
4. Replace the model files in the `python_ml` folder

### Processing Large Datasets
1. Place your CSV files in the appropriate directory
2. Use the Python scripts to process and prepare the data
3. For very large datasets, consider batch processing in the Colab notebook

### Updating the MongoDB Schema
1. Modify the schema in `server.js`
2. Run database migrations if necessary (for production)

## 6. Deployment Considerations

### For the Frontend
- Build the React app: `npm run build`
- Deploy the build folder to a hosting service like Netlify, Vercel, or GitHub Pages

### For the Python ML Backend
- Deploy to a service like Heroku, PythonAnywhere, or Google Cloud Run
- Consider containerizing with Docker for easier deployment

### For the MongoDB Backend
- Deploy to a service like Heroku, Railway, or Google Cloud Run
- Keep using MongoDB Atlas for the database

## 7. Troubleshooting

### Common Issues
- CORS errors: Make sure CORS is properly configured in both backend services
- MongoDB connection errors: Verify your connection string and network permissions
- Python module imports: Ensure all required libraries are installed

### Getting Help
- Check the error logs in each component
- Consult the documentation for specific libraries
- Search for solutions on Stack Overflow or GitHub issues

---

This setup guide should help you get the complete Career Guidance System running on your local machine. For production deployment, additional steps and security considerations would be needed.
