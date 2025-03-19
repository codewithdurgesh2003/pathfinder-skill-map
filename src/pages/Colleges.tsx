
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
  GraduationCap,
  BookOpen
} from "lucide-react";

// College data from CSV
const collegesData = [
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

// Extract unique fields (degrees)
const fieldOptions = ["All Degrees", ...new Set(collegesData.map(college => college.field))].sort();

// Extract unique locations (states)
const locationOptions = ["All Locations", ...new Set(collegesData.map(college => college.location))].sort();

const Colleges = () => {
  const [field, setField] = useState("All Degrees");
  const [location, setLocation] = useState("All Locations");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCollege, setSelectedCollege] = useState<any>(null);
  const itemsPerPage = 5;

  // Filter colleges based on selected field, location, and search query
  const filteredColleges = collegesData.filter((college) => {
    const fieldMatch = field === "All Degrees" || college.field === field;
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

  // Get degree display name
  const getDegreeFullName = (shortCode: string) => {
    const degreeMap: {[key: string]: string} = {
      "BA": "Bachelor of Arts",
      "BBA": "Bachelor of Business Administration",
      "BCom": "Bachelor of Commerce",
      "BSc Nursing": "Bachelor of Science in Nursing"
    };
    return degreeMap[shortCode] || shortCode;
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3 gradient-heading">College Recommendations</h1>
          <p className="text-career-gray max-w-2xl mx-auto">
            Find the best colleges and universities across India to pursue your desired degree based on your preferences.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-career-blue">Filter Colleges</CardTitle>
            <CardDescription>
              Select degree type and location to find the most suitable colleges for your education.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Degree Type</label>
                <Select value={field} onValueChange={setField}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option === "All Degrees" ? option : getDegreeFullName(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">State</label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
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
                    <BookOpen className="h-5 w-5 text-career-purple mt-0.5" />
                    <div>
                      <p className="font-medium">Degree Program</p>
                      <p className="text-gray-600">{getDegreeFullName(selectedCollege.field)}</p>
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
                  {selectedCollege.name} is an excellent choice for students interested in {getDegreeFullName(selectedCollege.field)}. 
                  Located in {selectedCollege.location}, the college provides a supportive environment for academic and 
                  professional growth with experienced faculty and strong industry connections.
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
                    <TableHead>Degree</TableHead>
                    <TableHead>State</TableHead>
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
