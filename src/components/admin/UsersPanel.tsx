
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Users,
  Search,
  RefreshCw,
  MoreHorizontal,
  UserCog,
  ShieldAlert,
  UserX,
  Mail,
} from "lucide-react";
import { bookings } from "@/data/mockData";
import { User } from "@/types";

// Mock users data (in a real app, this would come from an API)
const mockUsers: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "user"
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user"
  },
  {
    id: "user3",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin"
  },
  {
    id: "user4",
    name: "Staff Member",
    email: "staff@example.com",
    role: "staff"
  },
  {
    id: "user5",
    name: "Regular User",
    email: "user@example.com",
    role: "user"
  }
];

const UsersPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Simulated query - would connect to a real API in production
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => Promise.resolve(mockUsers),
    staleTime: 60000,
  });

  // Get booking counts for each user
  const userBookingCounts = bookings.reduce((acc: Record<string, number>, booking) => {
    acc[booking.userId] = (acc[booking.userId] || 0) + 1;
    return acc;
  }, {});

  // Filter users based on search term
  const filteredUsers = usersData?.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800" variant="outline">Admin</Badge>;
      case "staff":
        return <Badge className="bg-blue-100 text-blue-800" variant="outline">Staff</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800" variant="outline">User</Badge>;
    }
  };

  const handleUpdateRole = (userId: string, newRole: 'user' | 'staff' | 'admin') => {
    // This would call an API endpoint in a real app
    console.log(`Updating user ${userId} to role ${newRole}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Management
        </h2>
        
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{userBookingCounts[user.id] || 0}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleUpdateRole(user.id, "user")}
                            className="cursor-pointer"
                          >
                            <UserCog className="h-4 w-4 mr-2" />
                            Set as User
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUpdateRole(user.id, "staff")}
                            className="cursor-pointer"
                          >
                            <UserCog className="h-4 w-4 mr-2" />
                            Set as Staff
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUpdateRole(user.id, "admin")}
                            className="cursor-pointer"
                          >
                            <ShieldAlert className="h-4 w-4 mr-2" />
                            Set as Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-blue-600">
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600">
                            <UserX className="h-4 w-4 mr-2" />
                            Disable Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default UsersPanel;
