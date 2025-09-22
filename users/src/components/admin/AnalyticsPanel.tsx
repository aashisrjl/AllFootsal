
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { CalendarDays, TrendingUp, Users, CreditCard, Clock, Award } from "lucide-react";

// Mock data for the charts
const weeklyData = [
  { day: "Sun", bookings: 14, earnings: 7000 },
  { day: "Mon", bookings: 22, earnings: 11000 },
  { day: "Tue", bookings: 18, earnings: 9000 },
  { day: "Wed", bookings: 25, earnings: 12500 },
  { day: "Thu", bookings: 28, earnings: 14000 },
  { day: "Fri", bookings: 35, earnings: 17500 },
  { day: "Sat", bookings: 40, earnings: 20000 },
];

const monthlyData = [
  { month: "Jan", bookings: 120, earnings: 60000 },
  { month: "Feb", bookings: 150, earnings: 75000 },
  { month: "Mar", bookings: 180, earnings: 90000 },
  { month: "Apr", bookings: 200, earnings: 100000 },
  { month: "May", bookings: 210, earnings: 105000 },
  { month: "Jun", bookings: 190, earnings: 95000 },
  { month: "Jul", bookings: 220, earnings: 110000 },
  { month: "Aug", bookings: 240, earnings: 120000 },
  { month: "Sep", bookings: 250, earnings: 125000 },
  { month: "Oct", bookings: 230, earnings: 115000 },
  { month: "Nov", bookings: 260, earnings: 130000 },
  { month: "Dec", bookings: 280, earnings: 140000 },
];

const timeSlotData = [
  { name: "9-10 AM", value: 15 },
  { name: "10-11 AM", value: 18 },
  { name: "11-12 PM", value: 22 },
  { name: "12-1 PM", value: 25 },
  { name: "1-2 PM", value: 28 },
  { name: "2-3 PM", value: 30 },
  { name: "3-4 PM", value: 35 },
  { name: "4-5 PM", value: 45 },
  { name: "5-6 PM", value: 50 },
  { name: "6-7 PM", value: 60 },
  { name: "7-8 PM", value: 55 },
  { name: "8-9 PM", value: 40 },
];

const facilityData = [
  { name: "Thamel Futsal", value: 35 },
  { name: "Lagankhel Futsal", value: 25 },
  { name: "Balaju Futsal", value: 20 },
  { name: "Baneshwor Futsal", value: 15 },
  { name: "Other Facilities", value: 5 },
];

const topCustomersData = [
  { name: "Ram Sharma", bookings: 28 },
  { name: "Hari Thapa", bookings: 24 },
  { name: "Sita Poudel", bookings: 22 },
  { name: "Anish Gurung", bookings: 20 },
  { name: "Bikash KC", bookings: 18 },
  { name: "Nisha Tamang", bookings: 17 },
  { name: "Pramod Shrestha", bookings: 15 },
  { name: "Sabina Rai", bookings: 14 },
  { name: "Deepak Karki", bookings: 13 },
  { name: "Priya Bhatt", bookings: 12 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsPanel: React.FC = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Analytics Dashboard
        </CardTitle>
        <CardDescription>
          Track bookings, revenues, and user engagement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Bookings</p>
                      <p className="text-2xl font-bold">2,547</p>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> 
                    <span>+12.5% from last month</span>
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Active Users</p>
                      <p className="text-2xl font-bold">1,284</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> 
                    <span>+8.3% from last month</span>
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold">₹1,274,500</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded-full text-green-600">
                      <CreditCard className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> 
                    <span>+15.2% from last month</span>
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Peak Hours</p>
                      <p className="text-2xl font-bold">5 PM - 7 PM</p>
                    </div>
                    <div className="p-2 bg-orange-50 rounded-full text-orange-600">
                      <Clock className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on data from last 30 days
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Weekly Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="bookings" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Popular Time Slots</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={timeSlotData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Bookings" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Facility Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={facilityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {facilityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 overflow-auto pr-2">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-muted-foreground border-b">
                          <th className="font-medium pb-2">Customer</th>
                          <th className="font-medium pb-2">Bookings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topCustomersData.map((customer, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-2.5">
                              <div className="flex items-center gap-2">
                                {index < 3 && (
                                  <Award className={`h-4 w-4 ${
                                    index === 0 ? 'text-yellow-500' : 
                                    index === 1 ? 'text-gray-400' : 'text-amber-700'
                                  }`} />
                                )}
                                <span className={index < 3 ? 'font-medium' : ''}>{customer.name}</span>
                              </div>
                            </td>
                            <td className="py-2.5">{customer.bookings}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="bookings">
            <div className="mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Monthly Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="bookings" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* More booking data could be added here */}
          </TabsContent>
          
          <TabsContent value="revenue">
            <div className="mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                        <Legend />
                        <Bar dataKey="earnings" name="Revenue (₹)" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* More revenue data could be added here */}
          </TabsContent>
          
          <TabsContent value="users">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top 10 Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topCustomersData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="bookings" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* More user analytics could be added here */}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsPanel;
