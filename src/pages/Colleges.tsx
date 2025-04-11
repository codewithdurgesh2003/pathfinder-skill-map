
import { useState, useEffect } from "react";
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
  BookOpen,
  Upload
} from "lucide-react";
import { CollegeData, getCollegeData } from "@/utils/csvLoader";
import { toast } from "sonner";
import FileUploader from "@/components/FileUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Colleges = () => {
  const [collegesData, setCollegesData] = useState<CollegeData[]>([]);
  const [field, setField] = useState("All Degrees");
  const [location, setLocation] = useState("All Locations");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCollege, setSelectedCollege] = useState<CollegeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("browse");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const loadInitialData = () => {
      try {
        const data = getCollegeData();
        setCollegesData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading college data:", error);
        toast.error("Failed to load college data");
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleCollegeDataUploaded = (data: CollegeData[]) => {
    console.log(`Setting ${data.length} colleges from uploaded file`);
    setCollegesData(data);
    setActiveTab("browse");
    toast.success(`Loaded ${data.length} colleges from CSV file`);
  };

  const fieldOptions = (() => {
    const uniqueFields = [...new Set(collegesData.map(college => college.field || "").filter(Boolean))];
    return ["All Degrees", ...uniqueFields.sort()];
  })();

  const locationOptions = (() => {
    const uniqueLocations = [...new Set(collegesData.map(college => college.location || "").filter(Boolean))];
    return ["All Locations", ...uniqueLocations.sort()];
  })();

  const filteredColleges = collegesData.filter((college) => {
    const fieldMatch = field === "All Degrees" || (college.field && college.field === field);
    const locationMatch = location === "All Locations" || (college.location && college.location === location);
    
    const searchMatch = !searchQuery || 
      (college.name && college.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return fieldMatch && locationMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredColleges.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedColleges = filteredColleges.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const viewCollegeDetails = (college: CollegeData) => {
    setSelectedCollege(college);
  };

  const closeCollegeDetails = () => {
    setSelectedCollege(null);
  };

  const getDegreeFullName = (shortCode: string) => {
    const degreeMap: {[key: string]: string} = {
      "BA": "Bachelor of Arts",
      "BBA": "Bachelor of Business Administration",
      "BCom": "Bachelor of Commerce",
      "BSc Nursing": "Bachelor of Science in Nursing",
      "BTech": "Bachelor of Technology",
      "MBBS": "Bachelor of Medicine and Bachelor of Surgery",
      "BDS": "Bachelor of Dental Surgery",
      "LLB": "Bachelor of Laws",
      "B.Arch": "Bachelor of Architecture",
      "B.Ed": "Bachelor of Education",
      "BHM": "Bachelor of Hotel Management"
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Colleges</TabsTrigger>
            <TabsTrigger value="upload">Upload CSV</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4">
            <FileUploader 
              title="Upload College Data" 
              description="Upload a CSV file with college information to view and filter through the data."
              acceptedFileTypes=".csv" 
              uploadType="colleges"
              onFileUploaded={handleCollegeDataUploaded}
            />
          </TabsContent>
          
          <TabsContent value="browse">
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
                        {fieldOptions.map((option, index) => (
                          <SelectItem key={`field-${index}`} value={option}>
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
                        {locationOptions.map((option, index) => (
                          <SelectItem key={`location-${index}`} value={option}>
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
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredColleges.length} colleges
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Items per page:</label>
                    <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                      setItemsPerPage(parseInt(value));
                      setCurrentPage(1);
                    }}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-career-purple"></div>
              </div>
            ) : selectedCollege ? (
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
                      {paginatedColleges.length > 0 ? (
                        paginatedColleges.map((college) => (
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <GraduationCap className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No colleges found matching your criteria.</p>
                            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or upload a new CSV file.</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

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
                      {totalPages <= 7 ? (
                        [...Array(totalPages)].map((_, index) => (
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
                        ))
                      ) : (
                        <>
                          {/* First page */}
                          <Button
                            variant={currentPage === 1 ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(1)}
                            className={currentPage === 1 ? "bg-career-purple hover:bg-career-blue" : ""}
                          >
                            1
                          </Button>
                          
                          {/* Ellipsis if not near first page */}
                          {currentPage > 3 && <span className="mx-1">...</span>}
                          
                          {/* Pages around current page */}
                          {Array.from({length: 3}, (_, i) => {
                            const pageNum = Math.min(Math.max(currentPage - 1 + i, 2), totalPages - 1);
                            if (pageNum <= 1 || pageNum >= totalPages) return null;
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => goToPage(pageNum)}
                                className={currentPage === pageNum ? "bg-career-purple hover:bg-career-blue" : ""}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                          
                          {/* Ellipsis if not near last page */}
                          {currentPage < totalPages - 2 && <span className="mx-1">...</span>}
                          
                          {/* Last page */}
                          <Button
                            variant={currentPage === totalPages ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(totalPages)}
                            className={currentPage === totalPages ? "bg-career-purple hover:bg-career-blue" : ""}
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
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

            {filteredColleges.length === 0 && !isLoading && !paginatedColleges.length && (
              <div className="text-center py-10">
                <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Colleges Found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search criteria to find colleges.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("upload")}
                  className="mx-auto"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload College Data
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Colleges;
