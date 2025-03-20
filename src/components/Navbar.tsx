
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, GraduationCap, Home, Info, LogOut, User } from "lucide-react";
import { isUserLoggedIn, getCurrentUser, logoutUser } from "@/utils/dataLoader";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check login status on component mount and when routes change
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = isUserLoggedIn();
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        const user = getCurrentUser();
        setUserName(user?.name || user?.email || "User");
      }
    };
    
    checkLoginStatus();
    
    // Add event listener for storage changes (for logout in other tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === 'currentUser') {
        checkLoginStatus();
      }
    });
    
    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setUserName("");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-career-purple" />
            <span className="font-bold text-lg gradient-heading">CareerGuide AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-career-gray hover:text-career-purple transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/exams" 
              className="flex items-center space-x-1 text-career-gray hover:text-career-purple transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Exams</span>
            </Link>
            <Link 
              to="/colleges" 
              className="flex items-center space-x-1 text-career-gray hover:text-career-purple transition-colors"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Colleges</span>
            </Link>
            <Link 
              to="/about" 
              className="flex items-center space-x-1 text-career-gray hover:text-career-purple transition-colors"
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
            
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-1 text-career-gray">
                  <User className="h-4 w-4" />
                  <span>{userName}</span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 border-career-purple text-career-purple hover:bg-career-lightpurple"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Link to="/assessment">
                <Button className="bg-career-purple hover:bg-career-blue text-white transition-colors">
                  Start Assessment
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-career-gray focus:outline-none">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-3">
            <Link 
              to="/" 
              className="flex items-center space-x-2 py-2 px-3 text-career-gray hover:bg-career-lightpurple rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/exams" 
              className="flex items-center space-x-2 py-2 px-3 text-career-gray hover:bg-career-lightpurple rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-4 w-4" />
              <span>Exams</span>
            </Link>
            <Link 
              to="/colleges" 
              className="flex items-center space-x-2 py-2 px-3 text-career-gray hover:bg-career-lightpurple rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Colleges</span>
            </Link>
            <Link 
              to="/about" 
              className="flex items-center space-x-2 py-2 px-3 text-career-gray hover:bg-career-lightpurple rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
            
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-2 py-2 px-3 text-career-gray">
                  <User className="h-4 w-4" />
                  <span>{userName}</span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-1 border-career-purple text-career-purple hover:bg-career-lightpurple"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Link 
                to="/assessment" 
                className="block"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button className="w-full bg-career-purple hover:bg-career-blue text-white transition-colors">
                  Start Assessment
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
