import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import toast from 'react-hot-toast';
import { createBooking, createPayment } from "@/lib/futsalApi";
import { Loader2, Banknote, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const { isAuthenticated } = useAuth();
  const { selectedDate, selectedTimeSlotId, availableTimeSlots, selectedPitchId } = useBooking();
  const navigate = useNavigate();

  const [gateway, setGateway] = useState<'cash'|'esewa'|'khalti'>('cash');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedTimeSlot = availableTimeSlots.find(
    (slot) => slot.id === selectedTimeSlotId
  );

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to book a futsal pitch.");
      return;
    }

    if (!selectedTimeSlotId || !selectedPitchId) {
      toast.error("Please select a valid time slot.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Hit createBooking API
      const bookingData = {
        pitch_id: selectedPitchId,
        timeslot_id: selectedTimeSlotId,
        booking_date: selectedDate,
        amount: pricePerHour,
        notes: "No additional notes"
      };

      const bookingRes = await createBooking(facilityId, bookingData);
      
      let newBookingId = bookingRes?.data?.id;

      if (!newBookingId) {
          toast.error("Booking succeeded but backend failed to return ID for digital payment. Please contact support.");
          return navigate('/bookings');
      }

      // 2. Hit createPayment API
      const paymentRes = await createPayment(facilityId, {
        booking_id: newBookingId,
        gateway: gateway
      });

      // 3. Handle Gateway Responses
      localStorage.setItem("last_futsal_id", facilityId);
      
      if (gateway === 'cash') {
        toast.success("Booking placed successfully. Please pay upon arrival.", { duration: 5000 });
        navigate('/bookings');
      } else if (gateway === 'khalti') {
        if (paymentRes?.data?.payment_url) {
            window.location.href = paymentRes.data.payment_url;
        } else {
            toast.error("Redirection URL not found for Khalti. Redirecting to bookings history.");
            navigate('/bookings');
        }
      } else if (gateway === 'esewa') {
        toast.success("eSewa Payment initiated", { description: "Processing redirect..."});
        
        // eSewa requires a POST request with form data
        const esewaData = paymentRes.data;
        const isLive = esewaData.isLive;
        const ESEWA_URL = isLive 
            ? "https://epay.esewa.com.np/api/epay/main/v2/form" 
            : "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = ESEWA_URL;

        for (const key in esewaData) {
            if (['amount', 'tax_amount', 'total_amount', 'transaction_uuid', 'product_code', 'product_service_charge', 'product_delivery_charge', 'success_url', 'failure_url', 'signed_field_names', 'signature'].includes(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = esewaData[key];
                form.appendChild(hiddenField);
            }
        }

        document.body.appendChild(form);
        form.submit();
      }

    } catch (error: any) {
      console.error("Booking Error:", error);
      toast.error(error.response?.data?.message || "There was an error while booking. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-border shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] rounded-3xl sticky top-24 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
      <CardHeader className="bg-muted/50 pb-6 border-b border-border">
        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          Booking Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border border-dashed">
            <p className="text-sm font-medium text-muted-foreground">Facility</p>
            <p className="font-bold text-foreground text-right">{facilityName}</p>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-border border-dashed">
            <p className="text-sm font-medium text-muted-foreground">Pitch</p>
            <p className="font-bold text-foreground">{pitchName}</p>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-border border-dashed">
            <p className="text-sm font-medium text-muted-foreground">Date</p>
            <p className="font-bold text-foreground">{selectedDate}</p>
            </div>
            
            {selectedTimeSlot ? (
            <div className="flex justify-between items-center pb-3 border-b border-border border-dashed">
                <p className="text-sm font-medium text-muted-foreground">Time</p>
                <p className="font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-lg">
                    {`${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime}`}
                </p>
            </div>
            ) : (
            <div className="flex justify-between items-center pb-3 border-b border-border border-dashed text-muted-foreground">
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm italic text-right">Please select a time slot on the left</p>
            </div>
            )}
            
            <div className="flex justify-between items-center pt-2">
            <p className="text-base font-bold text-foreground">Total Price</p>
            <p className="text-2xl text-emerald-500 font-extrabold flex items-center gap-1">
                <span className="text-sm text-emerald-600">NPR</span> {pricePerHour}
            </p>
            </div>
        </div>

        {/* Payment Selection Form */}
        <div className="pt-4">
            <p className="text-sm font-bold text-foreground mb-3">Select Payment Method</p>
            <div className="grid grid-cols-1 gap-3">
                
                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${gateway === 'cash' ? 'border-emerald-500 bg-emerald-500/10' : 'border-border hover:border-emerald-500/30'}`}>
                    <input type="radio" className="hidden" name="gateway" value="cash" checked={gateway === 'cash'} onChange={() => setGateway('cash')} />
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${gateway === 'cash' ? 'border-emerald-500' : 'border-muted-foreground/30'}`}>
                        {gateway === 'cash' && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
                    </div>
                    <Banknote className={`h-5 w-5 ${gateway === 'cash' ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                    <span className={`font-semibold ${gateway === 'cash' ? 'text-emerald-500' : 'text-muted-foreground'}`}>Pay with Cash on site</span>
                </label>
                
                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${gateway === 'esewa' ? 'border-[#60b545] bg-[#60b545]/10' : 'border-border hover:border-[#60b545]/30'}`}>
                    <input type="radio" className="hidden" name="gateway" value="esewa" checked={gateway === 'esewa'} onChange={() => setGateway('esewa')} />
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${gateway === 'esewa' ? 'border-[#60b545]' : 'border-muted-foreground/30'}`}>
                        {gateway === 'esewa' && <div className="h-2 w-2 rounded-full bg-[#60b545]" />}
                    </div>
                    <div className="h-6 flex items-center font-extrabold text-[#60b545] text-lg leading-none tracking-tight">esewa</div>
                </label>
 
                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${gateway === 'khalti' ? 'border-[#5C2D91] bg-[#5C2D91]/10' : 'border-border hover:border-[#5C2D91]/30'}`}>
                    <input type="radio" className="hidden" name="gateway" value="khalti" checked={gateway === 'khalti'} onChange={() => setGateway('khalti')} />
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${gateway === 'khalti' ? 'border-[#5C2D91]' : 'border-muted-foreground/30'}`}>
                        {gateway === 'khalti' && <div className="h-2 w-2 rounded-full bg-[#5C2D91]" />}
                    </div>
                    <div className="h-6 flex items-center font-extrabold text-[#5C2D91] text-lg leading-none tracking-tight">KHALTI</div>
                </label>

            </div>
        </div>

      </CardContent>
      <CardFooter className="bg-muted/50 pt-4 pb-6 px-6 border-t border-border flex flex-col gap-3">
        <Button
          onClick={handleBooking}
          disabled={!selectedTimeSlotId || !isAuthenticated || isProcessing}
          className={`w-full h-14 rounded-xl font-bold text-[16px] shadow-lg transition-transform ${gateway === 'cash' ? 'bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-1 shadow-emerald-500/20 text-emerald-950' : gateway === 'esewa' ? 'bg-[#60b545] hover:bg-[#4d9735] hover:-translate-y-1 shadow-[#60b545]/20 text-white' : 'bg-[#5C2D91] hover:bg-[#4a2474] hover:-translate-y-1 shadow-[#5C2D91]/20 text-white'}`}
        >
          {isProcessing ? (
             <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Processing Secure Server</>
          ) : !isAuthenticated ? (
            "Login to Validate Booking"
          ) : !selectedTimeSlotId ? (
             "Select a Time Slot First"
          ) : (
            `Confirm & Pay via ${gateway === 'cash' ? 'Cash' : gateway === 'esewa' ? 'eSewa' : 'Khalti'}`
          )}
        </Button>
        <p className="text-center w-full text-xs text-muted-foreground font-medium leading-relaxed">By clicking confirm, you agree to the facility's cancellation rules and terms of service.</p>
      </CardFooter>
    </Card>
  );
};

export default BookingSummary;
