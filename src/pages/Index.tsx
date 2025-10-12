
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronRight, MapPin, Star, Users, Trophy, TrendingUp, Target } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FacilityCard from "@/components/FacilityCard";
import { facilities } from "@/data/mockData";

const Index = () => {
  // Display only the first 3 facilities on the homepage
  const featuredFacilities = facilities.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 md:py-32 relative overflow-hidden">
        <div className="wave-decoration animate-fade-in"></div>
        <div className="container mx-auto px-4 md:px-6 hero-content animate-fade-in">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Ultimate Futsal Hub<br />
              <span className="text-green-100">Connect, Play, Grow</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-green-50 max-w-2xl">
              Empowering Futsal Owners, Players, and Fans across Nepal
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-green-50 text-lg px-8 py-6 h-auto hover-scale">
                <Link to="/facilities">Explore Facilities</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto hover-scale">
                <Link to="/register">Join the Community</Link>
              </Button>
            </div>
            <div className="mt-6">
              <p className="text-green-50 mb-3">Are you a facility owner?</p>
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto hover-scale">
                <Link to="/footsal-register">Register Your Futsal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Transforming Futsal into a Connected, Competitive Community
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div>
                <h3 className="text-primary font-semibold text-lg mb-3">Mission Statement:</h3>
                <p className="text-muted-foreground">
                  At Goal Futsal Nepal, we're on a mission to elevate the game of futsal by creating a technology-driven ecosystem that brings together players, owners, and fans.
                </p>
              </div>
              
              <div>
                <h3 className="text-primary font-semibold text-lg mb-3">Our Vision:</h3>
                <p className="text-muted-foreground">
                  To build a vibrant, interconnected futsal community where every match, rating, and tournament contributes to a dynamic ecosystem that supports growth.
                </p>
              </div>
              
              <div>
                <h3 className="text-primary font-semibold text-lg mb-3">Our Values:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Innovation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Community</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Transparency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Growth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted/30 animate-fade-in">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Booking a futsal pitch has never been easier. Follow these simple steps to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border hover-scale transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find a Facility</h3>
              <p className="text-muted-foreground">
                Browse through our collection of top-rated futsal facilities in your area.
              </p>
            </div>

            <div className="text-center p-6 bg-card rounded-lg shadow-sm border hover-scale transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                <CalendarDays className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Select a Time Slot</h3>
              <p className="text-muted-foreground">
                Choose a date and time that works for you from the available slots.
              </p>
            </div>

            <div className="text-center p-6 bg-card rounded-lg shadow-sm border hover-scale transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                <Star className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Your Game</h3>
              <p className="text-muted-foreground">
                Confirm your booking and enjoy your game. It's that simple!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Facilities Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Facilities</h2>
            <Button asChild variant="ghost" className="gap-1">
              <Link to="/facilities">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFacilities.map((facility, index) => (
              <div key={facility.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <FacilityCard facility={facility} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtOS45NC04LjA2LTE4LTE4LTE4UzAgOC4wNiAwIDE4czguMDYgMTggMTggMTggMTgtOC4wNiAxOC0xOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-green-50">
            Join thousands of players who book their futsal sessions through Goal Futsal Nepal. Experience seamless booking and premium facilities.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-green-50 text-lg px-8 py-6 h-auto hover-scale">
            <Link to="/facilities">Book Your Pitch Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
