
import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, History, Award, Trophy, Target } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-footsal-dark">About Goal Futsal Nepal</h1>
          
          <div className="prose max-w-none mb-10">
            <p className="text-lg text-gray-700 mb-6">
              Goal Futsal Nepal is the premier platform for booking futsal facilities across Nepal. 
              Founded in 2020, we've been connecting players with the best futsal facilities, 
              making it easier than ever to find and book a pitch.
            </p>
            
            <div className="relative mb-16">
              <img 
                src="/images/facility1.jpg" 
                alt="Futsal facility" 
                className="w-full h-[300px] object-cover rounded-lg shadow-md"
              />
              <div className="absolute -bottom-8 left-8 right-8 bg-white p-4 rounded-lg shadow-lg">
                <p className="text-footsal-dark font-medium">
                  Our mission is to promote futsal throughout Nepal and make quality facilities 
                  accessible to everyone.
                </p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="mission" className="mb-12">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="mission" className="flex-1">Our Mission</TabsTrigger>
              <TabsTrigger value="team" className="flex-1">Our Team</TabsTrigger>
              <TabsTrigger value="history" className="flex-1">Our History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mission">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-footsal-green" />
                      Accessibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Making futsal accessible to everyone across Nepal, from casual players
                      to serious athletes.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-footsal-green" />
                      Quality
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Partnering with the highest quality facilities to ensure the best
                      playing experience for all users.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-footsal-green" />
                      Community
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Building a vibrant futsal community that promotes sportsmanship, 
                      teamwork and healthy competition.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="team">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                  <div className="rounded-lg bg-gray-100 p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-footsal-green flex items-center justify-center text-white font-bold text-xl">
                      RK
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Raj Kumar</h3>
                      <p className="text-gray-600">Founder & CEO</p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-gray-100 p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-footsal-green flex items-center justify-center text-white font-bold text-xl">
                      SP
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Sita Poudel</h3>
                      <p className="text-gray-600">Operations Manager</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="rounded-lg bg-gray-100 p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-footsal-green flex items-center justify-center text-white font-bold text-xl">
                      AT
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Arun Thapa</h3>
                      <p className="text-gray-600">Technical Director</p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-gray-100 p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-footsal-green flex items-center justify-center text-white font-bold text-xl">
                      NG
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Nisha Gurung</h3>
                      <p className="text-gray-600">Customer Relations</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-footsal-green" />
                    Our Journey
                  </CardTitle>
                  <CardDescription>
                    From a small idea to Nepal's leading futsal booking platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-24 font-semibold text-footsal-green">2020</div>
                      <div>
                        <h4 className="font-medium">Founded in Kathmandu</h4>
                        <p className="text-gray-600">
                          Goal Futsal Nepal was launched with just 5 partner facilities.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-24 font-semibold text-footsal-green">2021</div>
                      <div>
                        <h4 className="font-medium">Expanded to Pokhara</h4>
                        <p className="text-gray-600">
                          Added 10 new facilities and reached 5,000 active users.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-24 font-semibold text-footsal-green">2022</div>
                      <div>
                        <h4 className="font-medium">National Coverage</h4>
                        <p className="text-gray-600">
                          Expanded to 15 cities across Nepal with over 50 facilities.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-24 font-semibold text-footsal-green">2023</div>
                      <div>
                        <h4 className="font-medium">Mobile App Launch</h4>
                        <p className="text-gray-600">
                          Released our mobile application and reached 20,000 users.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-24 font-semibold text-footsal-green">2024</div>
                      <div>
                        <h4 className="font-medium">Corporate Partnerships</h4>
                        <p className="text-gray-600">
                          Launched corporate packages and organized national tournaments.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-footsal-green" /> Our Values
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><span className="font-medium">Integrity</span> - Transparent booking and pricing.</li>
              <li><span className="font-medium">Excellence</span> - Partnering with quality facilities only.</li>
              <li><span className="font-medium">Innovation</span> - Continuously improving our platform.</li>
              <li><span className="font-medium">Community</span> - Building a futsal community in Nepal.</li>
              <li><span className="font-medium">Accessibility</span> - Making futsal available to everyone.</li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <Link 
              to="/contact" 
              className="bg-footsal-green hover:bg-footsal-green/90 text-white px-6 py-3 rounded-md font-medium inline-flex items-center gap-2"
            >
              <Users className="h-5 w-5" />
              Get in Touch With Us
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
