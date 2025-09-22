
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingCard from "@/components/BookingCard";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { Button } from "@/components/ui/button";
import { CalendarDays, List, Grid, Trash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserBookings = () => {
  const { isAuthenticated, user } = useAuth();
  const { userBookings, fetchUserBookings } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchUserBookings(user.id);
    }
  }, [isAuthenticated, user, fetchUserBookings, navigate]);

  // Group bookings by status
  const upcomingBookings = userBookings.filter(b => b.status === "confirmed");
  const pastBookings = userBookings.filter(b => b.status === "completed");
  const pendingBookings = userBookings.filter(b => b.status === "pending");
  const cancelledBookings = userBookings.filter(b => b.status === "cancelled");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <Button asChild>
              <a href="/facilities" className="gap-2">
                <CalendarDays className="h-4 w-4" />
                Book New Session
              </a>
            </Button>
          </div>
          
          {userBookings.length > 0 ? (
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-8">
                <TabsTrigger value="upcoming" className="gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Upcoming ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="gap-2">
                  <List className="h-4 w-4" />
                  Pending ({pendingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="gap-2">
                  <Grid className="h-4 w-4" />
                  Past ({pastBookings.length})
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="gap-2">
                  <Trash className="h-4 w-4" />
                  Cancelled ({cancelledBookings.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                {upcomingBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No upcoming bookings.</p>
                    <Button asChild variant="outline" className="mt-4">
                      <a href="/facilities">Browse Facilities</a>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pending">
                {pendingBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No pending bookings.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                {pastBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No past bookings.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="cancelled">
                {cancelledBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cancelledBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No cancelled bookings.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-4">No Bookings Yet</h2>
              <p className="text-muted-foreground mb-8">
                You haven't made any futsal bookings yet. Browse our facilities and book your first session now.
              </p>
              <Button asChild>
                <a href="/facilities">Browse Facilities</a>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserBookings;
