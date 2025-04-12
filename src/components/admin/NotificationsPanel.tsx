
import React, { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import {
  Bell,
  Calendar,
  Check,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Save,
  Send,
  Settings,
  Star,
  Smartphone
} from "lucide-react";

type NotificationType = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  template: string;
  icon: React.ReactNode;
};

const NotificationsPanel: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState<NotificationType[]>([
    {
      id: "booking-confirmation",
      name: "Booking Confirmation",
      description: "Sent when a user successfully books a pitch",
      enabled: true,
      template: "Dear {name},\n\nYour booking has been confirmed for {pitch} at {facility} on {date} at {time}.\n\nThank you for choosing Goal Futsal Nepal!",
      icon: <Check className="h-4 w-4" />
    },
    {
      id: "booking-reminder",
      name: "Booking Reminder",
      description: "Sent 24 hours before a scheduled booking",
      enabled: true,
      template: "Dear {name},\n\nThis is a reminder that you have a booking for {pitch} at {facility} tomorrow at {time}.\n\nWe look forward to seeing you!",
      icon: <Clock className="h-4 w-4" />
    },
    {
      id: "booking-cancelled",
      name: "Booking Cancellation",
      description: "Sent when a booking is cancelled",
      enabled: true,
      template: "Dear {name},\n\nYour booking for {pitch} at {facility} on {date} at {time} has been cancelled.\n\nWe hope to see you again soon!",
      icon: <Calendar className="h-4 w-4" />
    },
    {
      id: "review-request",
      name: "Review Request",
      description: "Sent after a completed booking",
      enabled: false,
      template: "Dear {name},\n\nThank you for playing at {facility}. We hope you enjoyed your experience.\n\nPlease take a moment to rate and review your experience.",
      icon: <Star className="h-4 w-4" />
    }
  ]);
  
  const [smsNotifications, setSmsNotifications] = useState<NotificationType[]>([
    {
      id: "sms-confirmation",
      name: "SMS Confirmation",
      description: "Brief booking confirmation via SMS",
      enabled: false,
      template: "Goal Futsal: Your booking for {pitch} at {facility} on {date} at {time} is confirmed. Ref: {booking_id}",
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      id: "sms-reminder",
      name: "SMS Reminder",
      description: "Booking reminder via SMS",
      enabled: false,
      template: "Goal Futsal Reminder: You have a booking for {pitch} at {facility} tomorrow at {time}.",
      icon: <Bell className="h-4 w-4" />
    }
  ]);

  const [selectedNotification, setSelectedNotification] = useState<NotificationType | null>(emailNotifications[0]);
  const [editingTemplate, setEditingTemplate] = useState("");

  const handleSelectNotification = (notification: NotificationType) => {
    setSelectedNotification(notification);
    setEditingTemplate(notification.template);
  };

  const handleToggleNotification = (id: string, type: "email" | "sms") => {
    if (type === "email") {
      setEmailNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
        )
      );
      
      if (selectedNotification?.id === id) {
        setSelectedNotification(prev => prev ? { ...prev, enabled: !prev.enabled } : null);
      }
    } else {
      setSmsNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
        )
      );
      
      if (selectedNotification?.id === id) {
        setSelectedNotification(prev => prev ? { ...prev, enabled: !prev.enabled } : null);
      }
    }
  };

  const handleSaveTemplate = () => {
    if (!selectedNotification) return;
    
    const isEmail = emailNotifications.some(n => n.id === selectedNotification.id);
    
    if (isEmail) {
      setEmailNotifications(prev => 
        prev.map(notif => 
          notif.id === selectedNotification.id ? { ...notif, template: editingTemplate } : notif
        )
      );
    } else {
      setSmsNotifications(prev => 
        prev.map(notif => 
          notif.id === selectedNotification.id ? { ...notif, template: editingTemplate } : notif
        )
      );
    }
    
    setSelectedNotification(prev => prev ? { ...prev, template: editingTemplate } : null);
    
    toast({
      title: "Template Saved",
      description: "Notification template has been updated successfully.",
    });
  };

  const handleSendTest = () => {
    toast({
      title: "Test Sent",
      description: "A test notification has been sent to the admin email.",
    });
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications Management
        </CardTitle>
        <CardDescription>
          Customize the notifications sent to users and test them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email">
          <TabsList className="mb-4">
            <TabsTrigger value="email" className="flex items-center gap-1">
              <Mail className="h-4 w-4" /> Email Notifications
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-1">
              <Smartphone className="h-4 w-4" /> SMS Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <TabsContent value="email" className="m-0">
                <div className="border rounded-lg">
                  <div className="p-3 border-b bg-muted/50">
                    <h3 className="font-medium">Email Templates</h3>
                  </div>
                  <div className="divide-y">
                    {emailNotifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-3 flex justify-between items-center cursor-pointer hover:bg-muted/30 ${selectedNotification?.id === notification.id ? 'bg-muted/30' : ''}`}
                        onClick={() => handleSelectNotification(notification)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-footsal-green">{notification.icon}</span>
                          <span>{notification.name}</span>
                        </div>
                        <Switch 
                          checked={notification.enabled} 
                          onCheckedChange={() => handleToggleNotification(notification.id, "email")}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="sms" className="m-0">
                <div className="border rounded-lg">
                  <div className="p-3 border-b bg-muted/50">
                    <h3 className="font-medium">SMS Templates</h3>
                  </div>
                  <div className="divide-y">
                    {smsNotifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-3 flex justify-between items-center cursor-pointer hover:bg-muted/30 ${selectedNotification?.id === notification.id ? 'bg-muted/30' : ''}`}
                        onClick={() => handleSelectNotification(notification)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-footsal-green">{notification.icon}</span>
                          <span>{notification.name}</span>
                        </div>
                        <Switch 
                          checked={notification.enabled} 
                          onCheckedChange={() => handleToggleNotification(notification.id, "sms")}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="m-0">
                <div className="border rounded-lg">
                  <div className="p-3 border-b bg-muted/50">
                    <h3 className="font-medium">Notification Settings</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Email Notifications</label>
                        <Switch checked={true} />
                      </div>
                      <p className="text-xs text-gray-500">Enable or disable all email notifications</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">SMS Notifications</label>
                        <Switch checked={false} />
                      </div>
                      <p className="text-xs text-gray-500">Enable or disable all SMS notifications</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email From Name</label>
                      <Input defaultValue="Goal Futsal Nepal" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Reply-To Email</label>
                      <Input defaultValue="noreply@goalfutsal.com.np" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">SMS Sender ID</label>
                      <Input defaultValue="GoalFutsal" />
                    </div>
                    
                    <Button className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
            
            <div className="md:col-span-2">
              {selectedNotification ? (
                <div className="border rounded-lg h-full flex flex-col">
                  <div className="p-3 border-b bg-muted/50 flex justify-between items-center">
                    <h3 className="font-medium flex items-center gap-2">
                      {selectedNotification.icon}
                      {selectedNotification.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${selectedNotification.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {selectedNotification.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4 flex-1 flex flex-col">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">{selectedNotification.description}</p>
                      <div className="bg-gray-50 border rounded p-2 text-xs">
                        <p className="text-gray-500 mb-1">Available variables:</p>
                        <div className="flex flex-wrap gap-1">
                          <span className="bg-gray-200 px-1.5 py-0.5 rounded">{'{name}'}</span>
                          <span className="bg-gray-200 px-1.5 py-0.5 rounded">{'{facility}'}</span>
                          <span className="bg-gray-200 px-1.5 py-0.5 rounded">{'{pitch}'}</span>
                          <span className="bg-gray-200 px-1.5 py-0.5 rounded">{'{date}'}</span>
                          <span className="bg-gray-200 px-1.5 py-0.5 rounded">{'{time}'}</span>
                          <span className="bg-gray-200 px-1.5 py-0.5 rounded">{'{booking_id}'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <label className="text-sm font-medium">Template</label>
                      <Textarea
                        className="h-56 font-mono text-sm mt-2"
                        value={editingTemplate}
                        onChange={(e) => setEditingTemplate(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handleSendTest}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Test
                      </Button>
                      <Button onClick={handleSaveTemplate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg h-full flex items-center justify-center p-8 text-center text-gray-500">
                  <div>
                    <Bell className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>Select a notification template from the list to edit.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;
