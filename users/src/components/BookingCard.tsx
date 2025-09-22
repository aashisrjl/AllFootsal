
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  ExternalLink, 
  X,
  AlertTriangle
} from "lucide-react";
import { Booking } from "@/types";
import { facilities, pitches } from "@/data/mockData";
import { useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const { cancelBooking } = useBooking();
  const { user } = useAuth();
  const facility = facilities.find(f => f.id === booking.facilityId);
  const pitch = pitches.find(p => p.id === booking.pitchId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCancel = async () => {
    if (!user) return;
    
    await cancelBooking(booking.id, user.id);
  };

  // Check if the booking is in the future and not cancelled
  // Only allow cancellations for confirmed or pending bookings
  const canBeCancelled = 
    (booking.status === "confirmed" || booking.status === "pending") &&
    new Date(`${booking.date}T${booking.startTime}`) > new Date();

  // Check if the pitch or facility is under maintenance
  const isUnderMaintenance = pitch?.isUnderMaintenance || facility?.isUnderMaintenance;
  const maintenanceReason = pitch?.isUnderMaintenance 
    ? pitch.maintenanceReason 
    : facility?.isUnderMaintenance 
      ? facility.maintenanceReason 
      : "";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{pitch?.name} at {facility?.name}</CardTitle>
          <Badge className={getStatusColor(booking.status)} variant="outline">
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>{booking.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{booking.startTime} - {booking.endTime}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{facility?.location}</span>
        </div>
        {isUnderMaintenance && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-md mt-2">
            <AlertTriangle className="h-4 w-4" />
            <span>
              {maintenanceReason || "Currently under maintenance"}
            </span>
          </div>
        )}
        <div className="mt-2">
          <p className="font-medium">Total Price</p>
          <p className="text-green-600 font-semibold">NPR {booking.totalPrice}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {booking.status === "confirmed" && (
          <Button variant="outline" className="w-full flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Get Directions
          </Button>
        )}
        {booking.status === "completed" && (
          <Button variant="outline" className="w-full">Leave Review</Button>
        )}
        {canBeCancelled && (
          <Button 
            variant="outline" 
            className="w-full text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
            Cancel Booking
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookingCard;
