
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import MaintenancePanel from "@/components/admin/MaintenancePanel";
import AnalyticsPanel from "@/components/admin/AnalyticsPanel";
import NotificationsPanel from "@/components/admin/NotificationsPanel";
import BookingPanel from "@/components/admin/BookingPanel";
import UsersPanel from "@/components/admin/UsersPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  Wrench, 
  Calendar, 
  Settings,
  Users,
  Bell
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is admin
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6" />
          Admin Dashboard
        </h1>
        
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full md:w-2/3 lg:w-1/2">
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <LayoutDashboard className="h-4 w-4" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-1">
              <Wrench className="h-4 w-4" /> Maintenance
            </TabsTrigger>
            <TabsTrigger value="booking" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Bookings
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 gap-4">
              <AnalyticsPanel />
            </div>
          </TabsContent>
          
          <TabsContent value="maintenance">
            <div className="grid grid-cols-1 gap-4">
              <MaintenancePanel />
            </div>
          </TabsContent>
          
          <TabsContent value="booking">
            <div className="grid grid-cols-1 gap-4">
              <BookingPanel />
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <div className="grid grid-cols-1 gap-4">
              <UsersPanel />
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="grid grid-cols-1 gap-4">
              <NotificationsPanel />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
