
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { Booking } from "@/types";
import { bookings, facilities, pitches } from "@/data/mockData";

const BookingPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Simulated query - would connect to a real API in production
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => Promise.resolve(bookings),
    staleTime: 60000,
  });

  // Filter bookings based on search term and status filter
  const filteredBookings = bookingsData?.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facilities.find(f => f.id === booking.facilityId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pitches.find(p => p.id === booking.pitchId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" ? true : booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

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

  const handleUpdateStatus = (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    // This would call an API endpoint in a real app
    console.log(`Updating booking ${bookingId} to ${newStatus}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Booking Management
        </h2>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Pitch</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => {
                  const facility = facilities.find(f => f.id === booking.facilityId);
                  const pitch = pitches.find(p => p.id === booking.pitchId);
                  
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-xs">{booking.id.slice(0, 8)}</TableCell>
                      <TableCell>{facility?.name || "Unknown"}</TableCell>
                      <TableCell>{pitch?.name || "Unknown"}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>{booking.startTime} - {booking.endTime}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)} variant="outline">
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">NPR {booking.totalPrice}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {booking.status === "pending" && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 gap-1 text-green-600"
                                onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="hidden sm:inline">Confirm</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 gap-1 text-red-600"
                                onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                              >
                                <XCircle className="h-4 w-4" />
                                <span className="hidden sm:inline">Cancel</span>
                              </Button>
                            </>
                          )}
                          {booking.status === "confirmed" && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 gap-1"
                            >
                              <Clock className="h-4 w-4" />
                              <span className="hidden sm:inline">Complete</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default BookingPanel;
