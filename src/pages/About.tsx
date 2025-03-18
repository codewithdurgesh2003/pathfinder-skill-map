
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  GraduationCap, 
  Lightbulb, 
  BarChart, 
  Users, 
  Briefcase,
  ChevronRight 
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-career-blue to-career-purple py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About CareerGuide AI</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Empowering students to make informed career decisions through cutting-edge AI technology and personalized guidance.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 gradient-heading">Our Mission</h2>
            <p className="text-lg text-career-gray mb-8">
              At CareerGuide AI, we believe that choosing the right career path should be based on data-driven insights 
              rather than guesswork. Our mission is to help students and young professionals discover career paths that 
              align with their unique skills, interests, and aptitudes, ultimately leading to more fulfilling professional lives.
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-career-blue to-career-purple rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center gradient-heading">How Our Technology Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <Card className="card-shadow border-t-4 border-t-career-blue">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-career-lightblue flex items-center justify-center">
                    <Brain className="h-6 w-6 text-career-blue" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Data Collection & Analysis</h3>
                <p className="text-gray-600">
                  Our system collects information about your academic background, skills, interests, and 
                  personality traits through a comprehensive assessment process.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow border-t-4 border-t-career-purple">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-career-lightpurple flex items-center justify-center">
                    <BarChart className="h-6 w-6 text-career-purple" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Machine Learning Algorithms</h3>
                <p className="text-gray-600">
                  We use advanced machine learning algorithms, particularly KNN (K-Nearest Neighbors), to identify patterns 
                  and correlations between your profile and successful career paths.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow border-t-4 border-t-career-purple">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-career-lightpurple flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-career-purple" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Personalized Recommendations</h3>
                <p className="text-gray-600">
                  Based on the analysis, we generate personalized career recommendations that align with your 
                  unique profile, along with detailed roadmaps for each recommended path.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow border-t-4 border-t-career-blue">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-career-lightblue flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-career-blue" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Educational Guidance</h3>
                <p className="text-gray-600">
                  We provide information about educational institutions, courses, and resources that can help 
                  you build the necessary skills and qualifications for your chosen career path.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-3 text-center gradient-heading">Our Team</h2>
          <p className="text-lg text-career-gray text-center max-w-3xl mx-auto mb-12">
            CareerGuide AI was developed by a team of experts in education, career counseling, 
            machine learning, and software development.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
                  alt="Dr. Sarah Johnson" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Dr. Sarah Johnson</h3>
              <p className="text-career-purple mb-3">Education Expert</p>
              <p className="text-gray-600 text-sm">
                Ph.D. in Educational Psychology with over 15 years of experience in career counseling.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
                  alt="Dr. David Chen" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Dr. David Chen</h3>
              <p className="text-career-blue mb-3">AI Specialist</p>
              <p className="text-gray-600 text-sm">
                Machine Learning expert with a focus on predictive analytics and recommendation systems.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
                  alt="Emily Rodriguez" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Emily Rodriguez</h3>
              <p className="text-career-purple mb-3">Career Strategist</p>
              <p className="text-gray-600 text-sm">
                Industry expert with extensive experience in workforce development and future skills forecasting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-career-lightblue">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center gradient-heading">Why Choose CareerGuide AI</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-career-lightpurple flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-career-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Data-Driven Decisions</h3>
              <p className="text-gray-600">
                Make career decisions based on objective data and scientifically validated assessments, not just intuition.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-career-lightblue flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-career-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalized Approach</h3>
              <p className="text-gray-600">
                Receive recommendations tailored to your unique combination of skills, interests, and aptitudes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-career-lightpurple flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-career-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comprehensive Roadmaps</h3>
              <p className="text-gray-600">
                Get detailed step-by-step guidance on how to pursue your recommended career paths effectively.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-career-lightblue flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-career-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Educational Resources</h3>
              <p className="text-gray-600">
                Access information about colleges, courses, and learning resources aligned with your career goals.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-career-lightpurple flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-career-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Industry Insights</h3>
              <p className="text-gray-600">
                Stay informed about industry trends, job market projections, and salary expectations for different careers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-career-lightblue flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-career-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Future-Ready Guidance</h3>
              <p className="text-gray-600">
                Prepare for the future of work with recommendations that account for emerging trends and technological changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center gradient-heading">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-career-blue">How accurate are the career recommendations?</h3>
              <p className="text-gray-600">
                Our recommendations are based on advanced machine learning algorithms that analyze your profile against 
                thousands of data points. While no system is perfect, our recommendations have shown a high correlation 
                with career satisfaction in follow-up studies.
              </p>
            </div>
            
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-career-blue">Is my data secure and private?</h3>
              <p className="text-gray-600">
                Yes, we take data privacy very seriously. All user data is encrypted and stored securely. 
                We never share your personal information with third parties without your explicit consent.
              </p>
            </div>
            
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-career-blue">Can I change my assessment answers later?</h3>
              <p className="text-gray-600">
                Yes, you can retake the assessment at any time if your skills, interests, or circumstances change. 
                Our system will generate new recommendations based on your updated profile.
              </p>
            </div>
            
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-career-blue">How often is the career data updated?</h3>
              <p className="text-gray-600">
                We continuously update our database with the latest information about career paths, required skills, 
                educational resources, and industry trends to ensure our recommendations remain relevant and accurate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-career-lightpurple">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 gradient-heading">Get In Touch</h2>
          <p className="text-lg text-career-gray max-w-2xl mx-auto mb-8">
            Have questions or feedback about CareerGuide AI? We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="mailto:contact@careerguideai.com" 
              className="inline-flex items-center justify-center bg-career-purple hover:bg-career-blue text-white px-6 py-3 rounded-lg transition-colors"
            >
              Email Us <ChevronRight className="ml-2 h-4 w-4" />
            </a>
            <a 
              href="#" 
              className="inline-flex items-center justify-center bg-white text-career-purple hover:bg-gray-100 px-6 py-3 rounded-lg transition-colors"
            >
              Schedule a Demo <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
