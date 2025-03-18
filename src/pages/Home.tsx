
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  GraduationCap, 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-career-lightblue to-career-lightpurple py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-heading leading-tight">
                Discover Your Perfect Career Path with AI Guidance
              </h1>
              <p className="text-gray-700 text-lg mb-8">
                Our intelligent system analyzes your skills, interests, and aptitude to recommend the ideal career path tailored just for you.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/assessment">
                  <Button size="lg" className="w-full sm:w-auto bg-career-purple hover:bg-career-blue transition-colors">
                    Start Assessment
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-career-purple text-career-purple hover:text-career-blue hover:border-career-blue">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 md:w-96 md:h-96 bg-white rounded-full shadow-xl flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Career Planning" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-career-purple rounded-full flex items-center justify-center text-white p-4 animate-float">
                  <div className="text-center">
                    <div className="font-bold text-xl">AI</div>
                    <div className="text-xs">Powered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 gradient-heading">How It Works</h2>
            <p className="text-career-gray max-w-2xl mx-auto">
              Our AI-powered career guidance system uses a simple yet effective approach to help you find your ideal career path.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-career-lightblue rounded-lg p-6 text-center card-shadow">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <BookOpen className="h-8 w-8 text-career-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-career-blue">1. Complete Assessment</h3>
              <p className="text-gray-600">
                Take our comprehensive assessment that evaluates your academic background, skills, interests, and personality traits.
              </p>
            </div>

            <div className="bg-career-lightpurple rounded-lg p-6 text-center card-shadow">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Brain className="h-8 w-8 text-career-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-career-purple">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI algorithm analyzes your profile and compares it with successful career patterns to find your best matches.
              </p>
            </div>

            <div className="bg-career-lightblue rounded-lg p-6 text-center card-shadow">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Target className="h-8 w-8 text-career-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-career-blue">3. Get Personalized Roadmap</h3>
              <p className="text-gray-600">
                Receive tailored career recommendations and detailed roadmaps to help you achieve your professional goals.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/assessment">
              <Button className="bg-career-purple hover:bg-career-blue transition-colors">
                Start Your Journey Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 gradient-heading">Why Choose CareerGuide AI</h2>
            <p className="text-career-gray max-w-2xl mx-auto">
              Our platform offers comprehensive career guidance with cutting-edge AI technology and expert insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 text-career-purple">
                  <Brain className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Recommendations</h3>
                <p className="text-gray-600">
                  Advanced machine learning algorithms analyze multiple factors to provide highly accurate career matches.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 text-career-blue">
                  <GraduationCap className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Educational Roadmaps</h3>
                <p className="text-gray-600">
                  Detailed guidance on educational paths, required skills, and training to achieve your career goals.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 text-career-purple">
                  <Briefcase className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Industry Insights</h3>
                <p className="text-gray-600">
                  Up-to-date information on job market trends, salary expectations, and future growth prospects.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 text-career-blue">
                  <TrendingUp className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Development</h3>
                <p className="text-gray-600">
                  Customized skill development plans to help you become a top candidate in your chosen field.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 text-career-purple">
                  <GraduationCap className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">College Recommendations</h3>
                <p className="text-gray-600">
                  Find the best educational institutions aligned with your career path and personal preferences.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 text-career-blue">
                  <Target className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aptitude Matching</h3>
                <p className="text-gray-600">
                  Scientifically validated assessments to ensure your natural talents align with recommended careers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-career-blue to-career-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Discover Your Ideal Career Path?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Take the first step towards a fulfilling career that matches your unique skills, interests, and personality.
          </p>
          <Link to="/assessment">
            <Button size="lg" variant="secondary" className="bg-white text-career-purple hover:bg-gray-100">
              Start Free Assessment <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
