
// Available skills that students can select
export const skillOptions = [
  "Writing",
  "Research",
  "Communication",
  "Critical Thinking",
  "Problem Solving",
  "Analytical Skills",
  "Creativity",
  "Attention to Detail",
  "Time Management",
  "Leadership",
  "Teamwork",
  "Public Speaking",
  "Programming",
  "Data Analysis",
  "Artistic Skills",
  "Editing",
  "Storytelling",
  "Investigative Skills",
  "Empathy",
  "Patience",
  "Observation",
  "Mathematics",
  "Design",
];

// Available interests that students can select
export const interestOptions = [
  "Technology",
  "Science",
  "Arts",
  "Literature",
  "Politics",
  "History",
  "Psychology",
  "Sociology",
  "Media",
  "Journalism",
  "Education",
  "Business",
  "Finance",
  "Healthcare",
  "Environment",
  "Social Work",
  "Law",
  "Engineering",
  "Sports",
  "Travel",
  "Music",
  "Film",
  "Theatre",
];

// Student profile scoring weights for recommendation engine
export const recommendationWeights = {
  skillMatch: 0.6,      // 60% of the score comes from matching skills
  interestMatch: 0.3,   // 30% from matching interests
  academicMatch: 0.1    // 10% from academic performance
};
