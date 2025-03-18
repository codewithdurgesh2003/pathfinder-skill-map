
// Career data with required skills
export interface Career {
  title: string;
  requiredSkills: string[];
}

export const careers: Career[] = [
  {
    title: "Journalist",
    requiredSkills: ["Writing", "Research", "Communication", "Investigative Skills", "Critical Thinking"],
  },
  {
    title: "Writer/Author",
    requiredSkills: ["Creativity", "Writing", "Editing", "Research", "Storytelling"],
  },
  {
    title: "Historian",
    requiredSkills: ["Research", "Writing", "Analytical Skills", "Attention to Detail", "Critical Thinking"],
  },
  {
    title: "Sociologist",
    requiredSkills: ["Research", "Analytical Skills", "Communication", "Critical Thinking", "Data Analysis"],
  },
  {
    title: "Psychologist",
    requiredSkills: ["Empathy", "Communication", "Analytical Skills", "Patience", "Research"],
  },
  {
    title: "Political Scientist",
    requiredSkills: ["Research", "Analytical Skills", "Communication", "Critical Thinking", "Writing"],
  },
  {
    title: "Artist",
    requiredSkills: ["Creativity", "Artistic Skills", "Attention to Detail", "Patience", "Observation"],
  },
  // You can add more career data from your CSV here
];
