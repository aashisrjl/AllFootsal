
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

  // Helper to format date as YYYY-MM-DD in local timezone
  const formatDateLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Convert selectedDate string (YYYY-MM-DD) to a local Date object for the Calendar
  const dateObj = React.useMemo(() => {
    if (!selectedDate) return new Date();
    const [year, month, day] = selectedDate.split('-').map(Number);
    return new Date(year, month - 1, day);
  }, [selectedDate]);

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const dateStr = formatDateLocal(date);
      setSelectedDate(dateStr);
    }
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlotId: string) => {
    selectTimeSlot(timeSlotId === selectedTimeSlotId ? null : timeSlotId);
  };

  const isPastSlot = (startTime: string) => {
    if (!selectedDate) return false;
    
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    
    if (selectedDate < todayStr) return true;
    if (selectedDate > todayStr) return false;
    
    // If it's today, check the time
    const [hours, minutes] = startTime.split(':').map(Number);
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);
    
    return slotTime < now;
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
                    slot.isBooked || isPastSlot(slot.startTime)
                      ? "time-slot-booked opacity-60 cursor-not-allowed"
                      : slot.id === selectedTimeSlotId
                      ? "time-slot-selected"
                      : "time-slot-available"
                  }`}
                  onClick={() => {
                    if (!slot.isBooked && !isPastSlot(slot.startTime)) {
                      handleTimeSlotSelect(slot.id);
                    }
                  }}
                >
                  {slot.startTime}
                  {isPastSlot(slot.startTime) && !slot.isBooked && (
                    <span className="text-[10px] block font-normal opacity-70">Passed</span>
                  )}
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
