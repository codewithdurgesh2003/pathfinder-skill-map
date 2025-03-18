
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Building, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Search,
  GraduationCap
} from "lucide-react";

// Mock colleges data
const collegesData = [
  {
    id: 1,
    name: "Tech University",
    location: "California, USA",
    field: "Computer Science",
    fees: "$25,000 / year",
    rating: 4.8,
    admissionRate: "15%",
    website: "https://example.com/techuniversity",
  },
  {
    id: 2,
    name: "Data Science Institute",
    location: "New York, USA",
    field: "Data Science",
    fees: "$28,000 / year",
    rating: 4.7,
    admissionRate: "18%",
    website: "https://example.com/datascienceinstitute",
  },
  {
    id: 3,
    name: "Design Academy",
    location: "California, USA",
    field: "Design",
    fees: "$22,000 / year",
    rating: 4.5,
    admissionRate: "25%",
    website: "https://example.com/designacademy",
  },
  {
    id: 4,
    name: "Engineering College",
    location: "Texas, USA",
    field: "Engineering",
    fees: "$23,000 / year",
    rating: 4.6,
    admissionRate: "30%",
    website: "https://example.com/engineeringcollege",
  },
  {
    id: 5,
    name: "Business School",
    location: "Massachusetts, USA",
    field: "Business",
    fees: "$30,000 / year",
    rating: 4.9,
    admissionRate: "12%",
    website: "https://example.com/businessschool",
  },
  {
    id: 6,
    name: "Medical University",
    location: "Pennsylvania, USA",
    field: "Healthcare",
    fees: "$35,000 / year",
    rating: 4.8,
    admissionRate: "8%",
    website: "https://example.com/medicaluniversity",
  },
  {
    id: 7,
    name: "Arts College",
    location: "New York, USA",
    field: "Arts",
    fees: "$20,000 / year",
    rating: 4.4,
    admissionRate: "35%",
    website: "https://example.com/artscollege",
  },
  {
    id: 8,
    name: "Science Institute",
    location: "Illinois, USA",
    field: "Science",
    fees: "$26,000 / year",
    rating: 4.6,
    admissionRate: "22%",
    website: "https://example.com/scienceinstitute",
  },
  {
    id: 9,
    name: "Media School",
    location: "California, USA",
    field: "Media",
    fees: "$24,000 / year",
    rating: 4.3,
    admissionRate: "40%",
    website: "https://example.com/mediaschool",
  },
  {
    id: 10,
    name: "Law University",
    location: "Washington, USA",
    field: "Law",
    fees: "$32,000 / year",
    rating: 4.7,
    admissionRate: "15%",
    website: "https://example.com/lawuniversity",
  },
  {
    id: 11,
    name: "Marketing Institute",
    location: "Florida, USA",
    field: "Marketing",
    fees: "$23,000 / year",
    rating: 4.4,
    admissionRate: "30%",
    website: "https://example.com/marketinginstitute",
  },
  {
    id: 12,
    name: "Environmental Studies College",
    location: "Oregon, USA",
    field: "Environment",
    fees: "$21,000 / year",
    rating: 4.5,
    admissionRate: "28%",
    website: "https://example.com/environmentalcollege",
  },
];

const fieldOptions = [
  "All Fields",
  "Computer Science",
  "Data Science",
  "Design",
  "Engineering",
  "Business",
  "Healthcare",
  "Arts",
  "Science",
  "Media",
  "Law",
  "Marketing",
  "Environment",
];

const locationOptions = [
  "All Locations",
  "California, USA",
  "New York, USA",
  "Texas, USA",
  "Massachusetts, USA",
  "Pennsylvania, USA",
  "Illinois, USA",
  "Washington, USA",
  "Florida, USA",
  "Oregon, USA",
];

const Colleges = () => {
  const [field, setField] = useState("All Fields");
  const [location, setLocation] = useState("All Locations");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCollege, setSelectedCollege] = useState<any>(null);
  const itemsPerPage = 5;

  // Filter colleges based on selected field, location, and search query
  const filteredColleges = collegesData.filter((college) => {
    const fieldMatch = field === "All Fields" || college.field === field;
    const locationMatch = location === "All Locations" || college.location === location;
    const searchMatch = college.name.toLowerCase().includes(searchQuery.toLowerCase());
    return fieldMatch && locationMatch && searchMatch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredColleges.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedColleges = filteredColleges.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const viewCollegeDetails = (college: any) => {
    setSelectedCollege(college);
  };

  const closeCollegeDetails = () => {
    setSelectedCollege(null);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3 gradient-heading">College Recommendations</h1>
          <p className="text-career-gray max-w-2xl mx-auto">
            Find the best colleges and universities to pursue your desired career path based on your preferences.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-career-blue">Filter Colleges</CardTitle>
            <CardDescription>
              Select field of study and location to find the most suitable colleges.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Field of Study</label>
                <Select value={field} onValueChange={setField}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Location</label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by college name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedCollege ? (
          <Card className="card-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-xl text-career-blue">{selectedCollege.name}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={closeCollegeDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back to list
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 text-career-purple mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{selectedCollege.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <GraduationCap className="h-5 w-5 text-career-purple mt-0.5" />
                    <div>
                      <p className="font-medium">Field of Study</p>
                      <p className="text-gray-600">{selectedCollege.field}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Building className="h-5 w-5 text-career-purple mt-0.5" />
                    <div>
                      <p className="font-medium">Tuition Fees</p>
                      <p className="text-gray-600">{selectedCollege.fees}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Rating</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(selectedCollege.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-gray-600">{selectedCollege.rating}/5</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Admission Rate</p>
                    <p className="text-gray-600">{selectedCollege.admissionRate}</p>
                  </div>
                  <div>
                    <p className="font-medium">Website</p>
                    <a
                      href={selectedCollege.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-career-blue hover:underline"
                    >
                      Visit College Website
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-career-lightblue rounded-lg">
                <h3 className="font-semibold text-career-blue mb-2">Why This College?</h3>
                <p className="text-gray-700">
                  {selectedCollege.name} is an excellent choice for students interested in {selectedCollege.field}. 
                  With state-of-the-art facilities, experienced faculty, and strong industry connections, 
                  the college provides a supportive environment for academic and professional growth.
                </p>
              </div>

              <div className="mt-6">
                <Button className="bg-career-purple hover:bg-career-blue">
                  Apply Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>College Name</TableHead>
                    <TableHead>Field</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Fees</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedColleges.map((college) => (
                    <TableRow key={college.id}>
                      <TableCell className="font-medium">{college.name}</TableCell>
                      <TableCell>{college.field}</TableCell>
                      <TableCell>{college.location}</TableCell>
                      <TableCell>{college.fees}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewCollegeDetails(college)}
                          className="text-career-purple border-career-purple hover:bg-career-lightpurple"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index}
                      variant={currentPage === index + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(index + 1)}
                      className={
                        currentPage === index + 1
                          ? "bg-career-purple hover:bg-career-blue"
                          : ""
                      }
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {filteredColleges.length === 0 && (
          <div className="text-center py-10">
            <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Colleges Found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search criteria to find colleges.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Colleges;
