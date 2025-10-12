
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { toast } from "@/components/ui/use-toast";

interface BookingSummaryProps {
  facilityId: string;
  facilityName: string;
  pitchName: string;
  pricePerHour: number;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  facilityId,
  facilityName,
  pitchName,
  pricePerHour,
}) => {
  const { isAuthenticated, user } = useAuth();
  const { selectedDate, selectedTimeSlotId, availableTimeSlots, createBooking } = useBooking();

  const selectedTimeSlot = availableTimeSlots.find(
    (slot) => slot.id === selectedTimeSlotId
  );

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to book a futsal pitch.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTimeSlotId || !user) {
      return;
    }

    try {
      const booking = await createBooking(
        user.id,
        facilityId,
        pricePerHour
      );

      if (booking) {
        toast({
          title: "Booking Successful!",
          description: `You have successfully booked ${pitchName} at ${facilityName} for ${booking.date} from ${booking.startTime} to ${booking.endTime}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error while booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Facility</p>
          <p>{facilityName}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Pitch</p>
          <p>{pitchName}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Date</p>
          <p>{selectedDate}</p>
        </div>
        {selectedTimeSlot && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Time</p>
            <p>{`${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime}`}</p>
          </div>
        )}
        <div className="space-y-1">
          <p className="text-sm font-medium">Price</p>
          <p className="text-green-600 font-semibold">NPR {pricePerHour}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleBooking}
          disabled={!selectedTimeSlotId || !isAuthenticated}
          className="w-full"
        >
          {isAuthenticated ? "Confirm Booking" : "Login to Book"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingSummary;
