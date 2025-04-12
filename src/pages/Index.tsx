
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronRight, MapPin, Star } from "lucide-react";
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
      <section className="hero-gradient text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Book Your Futsal Pitch in Minutes
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Find and book the best futsal facilities across Nepal. No hassle, no waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-footsal-green hover:bg-footsal-green/90">
                <Link to="/facilities">Browse Facilities</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white text-footsal-green hover:bg-gray-100">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Booking a futsal pitch has never been easier. Follow these simple steps to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-footsal-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-footsal-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find a Facility</h3>
              <p className="text-gray-600">
                Browse through our collection of top-rated futsal facilities in your area.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-footsal-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="h-6 w-6 text-footsal-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Select a Time Slot</h3>
              <p className="text-gray-600">
                Choose a date and time that works for you from the available slots.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-footsal-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-footsal-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Your Game</h3>
              <p className="text-gray-600">
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
            {featuredFacilities.map((facility) => (
              <FacilityCard key={facility.id} facility={facility} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-footsal-dark text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of players who book their futsal sessions through Goal Futsal Nepal.
          </p>
          <Button asChild size="lg" className="bg-footsal-green hover:bg-footsal-green/90">
            <Link to="/facilities">Book Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
