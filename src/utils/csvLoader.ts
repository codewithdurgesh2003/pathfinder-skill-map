
/**
 * Utility functions for loading and parsing CSV data
 */

import { loadLargeDataset, cacheData, getCachedData } from './dataLoader';

// Type definition for college data
export interface CollegeData {
  id: number;
  name: string;
  location: string;
  field: string;
  fees: string;
  rating: number;
  admissionRate: string;
  website: string;
}

/**
 * Parse CSV text into an array of college objects
 */
export const parseCollegeCsv = (csvText: string): CollegeData[] => {
  // Split the CSV text into lines
  const lines = csvText.split('\n');
  
  // The first line contains headers
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Set up mapping for different column names that might be in the CSV
  const columnMapping: Record<string, keyof CollegeData> = {
    'college name': 'name',
    'state': 'location',
    'fees': 'fees',
    'field': 'field',
    'rating': 'rating',
    'admission rate': 'admissionRate',
    'website': 'website'
  };
  
  // Parse each line into a college object
  const colleges: CollegeData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    // Handle quoted fields correctly (in case commas are inside quotes)
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    values.push(currentValue.trim());
    
    // Create a college object using headers as keys
    const college: Partial<CollegeData> = { id: i }; // Start with an ID
    
    // Map the CSV headers to our expected property names
    headers.forEach((header, index) => {
      if (index < values.length) {
        const headerLower = header.toLowerCase();
        const mappedHeader = columnMapping[headerLower] || headerLower as keyof CollegeData;
        let value = values[index].replace(/^"|"$/g, ''); // Remove quotes
        
        if (mappedHeader === 'rating' && value) {
          college[mappedHeader] = parseFloat(value);
        } else if (mappedHeader in columnMapping || mappedHeader in college) {
          // Only set the property if it's a valid key for CollegeData
          (college as any)[mappedHeader] = value;
        }
      }
    });
    
    // Set default values for any missing fields
    if (!college.rating) college.rating = generateRandomRating();
    if (!college.admissionRate) college.admissionRate = generateRandomAdmissionRate();
    if (!college.website) college.website = `https://example.com/${college.name?.toLowerCase().replace(/\s+/g, '')}`;
    
    colleges.push(college as CollegeData);
  }
  
  return colleges;
};

/**
 * Generate a random rating between 3.5 and 4.9
 */
const generateRandomRating = (): number => {
  return parseFloat((Math.random() * 1.4 + 3.5).toFixed(1));
};

/**
 * Generate a random admission rate between 10% and 60%
 */
const generateRandomAdmissionRate = (): string => {
  return `${Math.floor(Math.random() * 50 + 10)}%`;
};

/**
 * Load college data from a CSV file
 */
export const loadCollegeCsvFile = async (file: File): Promise<CollegeData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const colleges = parseCollegeCsv(csvText);
        
        // Cache the colleges data
        cacheData('collegesData', colleges, 60 * 24); // Cache for 24 hours
        
        resolve(colleges);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read CSV file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Get college data - either from cache or fallback to hardcoded data
 */
export const getCollegeData = (): CollegeData[] => {
  // Try to get data from cache first
  const cachedData = getCachedData<CollegeData[]>('collegesData');
  
  if (cachedData && cachedData.length > 0) {
    return cachedData;
  }
  
  // Otherwise return the fallback data
  return fallbackCollegeData;
};

// Fallback college data (the same as currently in Colleges.tsx)
export const fallbackCollegeData: CollegeData[] = [
  {
    id: 1,
    name: "Andhra University College of Arts and Commerce",
    location: "Andhra Pradesh",
    field: "BA",
    fees: "₹25,000 / year",
    rating: 4.5,
    admissionRate: "22%",
    website: "https://example.com/andhrauniversity",
  },
  {
    id: 2,
    name: "Sri Venkateswara University",
    location: "Andhra Pradesh",
    field: "BA",
    fees: "₹24,000 / year",
    rating: 4.3,
    admissionRate: "25%",
    website: "https://example.com/srivenkateswara",
  },
  {
    id: 3,
    name: "Acharya Nagarjuna University",
    location: "Andhra Pradesh",
    field: "BA",
    fees: "₹18,000 / year",
    rating: 4.2,
    admissionRate: "30%",
    website: "https://example.com/nagarjuna",
  },
  {
    id: 4,
    name: "GITAM University",
    location: "Andhra Pradesh",
    field: "BBA",
    fees: "₹1,25,000 / year",
    rating: 4.7,
    admissionRate: "15%",
    website: "https://example.com/gitam",
  },
  {
    id: 5,
    name: "Andhra University",
    location: "Andhra Pradesh",
    field: "BBA",
    fees: "₹60,000 / year",
    rating: 4.4,
    admissionRate: "20%",
    website: "https://example.com/andhrauniv",
  },
  {
    id: 6,
    name: "KL University",
    location: "Andhra Pradesh",
    field: "BBA",
    fees: "₹1,10,000 / year",
    rating: 4.6,
    admissionRate: "18%",
    website: "https://example.com/kluniversity",
  },
  {
    id: 7,
    name: "Andhra University",
    location: "Andhra Pradesh",
    field: "BCom",
    fees: "₹50,000 / year",
    rating: 4.4,
    admissionRate: "23%",
    website: "https://example.com/andhrauni",
  },
  {
    id: 8,
    name: "St. Joseph's College",
    location: "Andhra Pradesh",
    field: "BCom",
    fees: "₹60,000 / year",
    rating: 4.6,
    admissionRate: "19%",
    website: "https://example.com/stjosephap",
  },
  {
    id: 9,
    name: "Andhra Medical College",
    location: "Andhra Pradesh",
    field: "BSc Nursing",
    fees: "₹40,000 / year",
    rating: 4.8,
    admissionRate: "12%",
    website: "https://example.com/amc",
  },
  {
    id: 10,
    name: "Rajiv Gandhi University",
    location: "Arunachal Pradesh",
    field: "BA",
    fees: "₹15,000 / year",
    rating: 4.1,
    admissionRate: "35%",
    website: "https://example.com/rgu",
  },
  {
    id: 11,
    name: "Himalayan University",
    location: "Arunachal Pradesh",
    field: "BA",
    fees: "₹12,000 / year",
    rating: 4.0,
    admissionRate: "40%",
    website: "https://example.com/himalayan",
  },
  {
    id: 12,
    name: "Himalayan University",
    location: "Arunachal Pradesh",
    field: "BBA",
    fees: "₹70,000 / year",
    rating: 4.2,
    admissionRate: "28%",
    website: "https://example.com/himalayanunibba",
  },
  {
    id: 13,
    name: "Arunachal University",
    location: "Arunachal Pradesh",
    field: "BCom",
    fees: "₹40,000 / year",
    rating: 3.9,
    admissionRate: "45%",
    website: "https://example.com/arunachaluni",
  },
  {
    id: 14,
    name: "Cotton University",
    location: "Assam",
    field: "BA",
    fees: "₹16,000 / year",
    rating: 4.3,
    admissionRate: "30%",
    website: "https://example.com/cotton",
  },
  {
    id: 15,
    name: "Gauhati University",
    location: "Assam",
    field: "BA",
    fees: "₹14,000 / year",
    rating: 4.4,
    admissionRate: "28%",
    website: "https://example.com/gauhati",
  },
  {
    id: 16,
    name: "Assam Don Bosco University",
    location: "Assam",
    field: "BBA",
    fees: "₹1,10,000 / year",
    rating: 4.5,
    admissionRate: "20%",
    website: "https://example.com/donbosco",
  },
  {
    id: 17,
    name: "Gauhati University",
    location: "Assam",
    field: "BCom",
    fees: "₹50,000 / year",
    rating: 4.2,
    admissionRate: "32%",
    website: "https://example.com/gauhatiuniv",
  },
  {
    id: 18,
    name: "Christ University",
    location: "Karnataka",
    field: "BA",
    fees: "₹90,000 / year",
    rating: 4.8,
    admissionRate: "15%",
    website: "https://example.com/christ",
  },
  {
    id: 19,
    name: "Christ University",
    location: "Karnataka",
    field: "BBA",
    fees: "₹1,30,000 / year",
    rating: 4.9,
    admissionRate: "12%",
    website: "https://example.com/christbba",
  },
  {
    id: 20,
    name: "St. Xavier's College, Mumbai",
    location: "Maharashtra",
    field: "BA",
    fees: "₹13,900 / year",
    rating: 4.7,
    admissionRate: "18%",
    website: "https://example.com/xaviers",
  },
  {
    id: 21,
    name: "NMIMS University",
    location: "Maharashtra",
    field: "BBA",
    fees: "₹2,50,000 / year",
    rating: 4.9,
    admissionRate: "10%",
    website: "https://example.com/nmims",
  },
  {
    id: 22,
    name: "University of Delhi",
    location: "Delhi",
    field: "BA",
    fees: "₹15,000 / year",
    rating: 4.8,
    admissionRate: "15%",
    website: "https://example.com/du",
  },
  {
    id: 23,
    name: "Loyola College of Arts and Sciences",
    location: "Tamil Nadu",
    field: "BBA",
    fees: "₹1,20,000 / year",
    rating: 4.7,
    admissionRate: "18%",
    website: "https://example.com/loyola",
  },
  {
    id: 24,
    name: "Stella Maris College",
    location: "Tamil Nadu",
    field: "BCom",
    fees: "₹1,00,000 / year",
    rating: 4.6,
    admissionRate: "20%",
    website: "https://example.com/stella",
  },
  {
    id: 25,
    name: "St. Xavier's College, Kolkata",
    location: "West Bengal",
    field: "BCom",
    fees: "₹75,000 / year",
    rating: 4.7,
    admissionRate: "16%",
    website: "https://example.com/xavierskolkata",
  },
];
