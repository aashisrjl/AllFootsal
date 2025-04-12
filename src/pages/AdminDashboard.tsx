
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import MaintenancePanel from "@/components/admin/MaintenancePanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  Wrench, 
  Calendar, 
  Settings,
  Users,
  Bell
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is admin
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <LayoutDashboard className="h-6 w-6" />
        Admin Dashboard
      </h1>
      
      <Tabs defaultValue="maintenance" className="space-y-4">
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
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-8 border rounded-lg flex items-center justify-center">
              <p className="text-lg text-muted-foreground">Analytics Dashboard (Coming Soon)</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="maintenance">
          <div className="grid grid-cols-1 gap-4">
            <MaintenancePanel />
          </div>
        </TabsContent>
        
        <TabsContent value="booking">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-8 border rounded-lg flex items-center justify-center">
              <p className="text-lg text-muted-foreground">Booking Management (Coming Soon)</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-8 border rounded-lg flex items-center justify-center">
              <p className="text-lg text-muted-foreground">User Management (Coming Soon)</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-8 border rounded-lg flex items-center justify-center">
              <p className="text-lg text-muted-foreground">Settings (Coming Soon)</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
