
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlot } from "@/types";
import { useBooking } from "@/contexts/BookingContext";

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ timeSlots }) => {
  const { 
    selectedDate, 
    setSelectedDate, 
    selectTimeSlot, 
    selectedTimeSlotId 
  } = useBooking();

  // Convert selectedDate string to Date object for the Calendar component
  const dateObj = selectedDate ? new Date(selectedDate) : new Date();

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const dateStr = date.toISOString().split("T")[0];
      setSelectedDate(dateStr);
    }
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlotId: string) => {
    selectTimeSlot(timeSlotId === selectedTimeSlotId ? null : timeSlotId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={dateObj}
            onSelect={handleDateChange}
            className="rounded-md border"
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Time Slot</CardTitle>
        </CardHeader>
        <CardContent>
          {timeSlots.length > 0 ? (
            <div className="booking-grid">
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`time-slot ${
                    slot.isBooked
                      ? "time-slot-booked"
                      : slot.id === selectedTimeSlotId
                      ? "time-slot-selected"
                      : "time-slot-available"
                  }`}
                  onClick={() => {
                    if (!slot.isBooked) {
                      handleTimeSlotSelect(slot.id);
                    }
                  }}
                >
                  {slot.startTime}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No available time slots for this date. Please select another date.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSlotPicker;
