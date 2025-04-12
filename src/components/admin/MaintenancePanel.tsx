
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, 
  CheckCircle, 
  Tool, 
  Building2,
  CircleOff
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { facilities, pitches, toggleFacilityMaintenance, togglePitchMaintenance } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

const MaintenancePanel: React.FC = () => {
  const [facilityReason, setFacilityReason] = useState<{[key: string]: string}>({});
  const [pitchReason, setPitchReason] = useState<{[key: string]: string}>({});

  const handleToggleFacilityMaintenance = (facilityId: string, currentStatus: boolean) => {
    const reason = facilityReason[facilityId] || "";
    const newStatus = !currentStatus;
    
    toggleFacilityMaintenance(facilityId, newStatus, reason);
    
    toast({
      title: newStatus ? "Facility Disabled" : "Facility Enabled",
      description: newStatus 
        ? `The facility has been put under maintenance.${reason ? ` Reason: ${reason}` : ''}`
        : "The facility is now operational.",
    });
    
    // Clear the reason after toggling
    if (!newStatus) {
      setFacilityReason(prev => {
        const updated = {...prev};
        delete updated[facilityId];
        return updated;
      });
    }
  };

  const handleTogglePitchMaintenance = (pitchId: string, currentStatus: boolean) => {
    const reason = pitchReason[pitchId] || "";
    const newStatus = !currentStatus;
    
    togglePitchMaintenance(pitchId, newStatus, reason);
    
    toast({
      title: newStatus ? "Pitch Disabled" : "Pitch Enabled",
      description: newStatus 
        ? `The pitch has been put under maintenance.${reason ? ` Reason: ${reason}` : ''}`
        : "The pitch is now operational.",
    });
    
    // Clear the reason after toggling
    if (!newStatus) {
      setPitchReason(prev => {
        const updated = {...prev};
        delete updated[pitchId];
        return updated;
      });
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tool className="h-5 w-5" />
          Maintenance Mode
        </CardTitle>
        <CardDescription>
          Temporarily disable facilities or pitches for maintenance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="facilities">
          <TabsList className="mb-4">
            <TabsTrigger value="facilities" className="flex items-center gap-1">
              <Building2 className="h-4 w-4" /> Facilities
            </TabsTrigger>
            <TabsTrigger value="pitches" className="flex items-center gap-1">
              <CircleOff className="h-4 w-4" /> Pitches
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="facilities">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Facility Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Maintenance Reason</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilities.map((facility) => (
                  <TableRow key={facility.id}>
                    <TableCell className="font-medium">{facility.name}</TableCell>
                    <TableCell>{facility.location}</TableCell>
                    <TableCell>
                      {facility.isUnderMaintenance ? (
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Under Maintenance
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Operational
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {facility.isUnderMaintenance ? (
                        facility.maintenanceReason || "No reason provided"
                      ) : (
                        <Textarea 
                          placeholder="Reason for maintenance..." 
                          className="h-10 resize-none"
                          value={facilityReason[facility.id] || ""}
                          onChange={(e) => 
                            setFacilityReason(prev => ({
                              ...prev,
                              [facility.id]: e.target.value
                            }))
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant={facility.isUnderMaintenance ? "default" : "destructive"}
                        size="sm"
                        onClick={() => handleToggleFacilityMaintenance(facility.id, facility.isUnderMaintenance || false)}
                      >
                        {facility.isUnderMaintenance ? "Enable Facility" : "Disable Facility"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="pitches">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pitch Name</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Maintenance Reason</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pitches.map((pitch) => {
                  const facility = facilities.find(f => f.id === pitch.facilityId);
                  return (
                    <TableRow key={pitch.id}>
                      <TableCell className="font-medium">{pitch.name}</TableCell>
                      <TableCell>{facility?.name}</TableCell>
                      <TableCell>
                        {pitch.isUnderMaintenance || facility?.isUnderMaintenance ? (
                          <Badge variant="outline" className="bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Under Maintenance
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Operational
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {facility?.isUnderMaintenance ? (
                          "Facility under maintenance"
                        ) : pitch.isUnderMaintenance ? (
                          pitch.maintenanceReason || "No reason provided"
                        ) : (
                          <Textarea 
                            placeholder="Reason for maintenance..." 
                            className="h-10 resize-none"
                            value={pitchReason[pitch.id] || ""}
                            onChange={(e) => 
                              setPitchReason(prev => ({
                                ...prev,
                                [pitch.id]: e.target.value
                              }))
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant={pitch.isUnderMaintenance ? "default" : "destructive"}
                          size="sm"
                          disabled={facility?.isUnderMaintenance}
                          onClick={() => handleTogglePitchMaintenance(pitch.id, pitch.isUnderMaintenance || false)}
                        >
                          {pitch.isUnderMaintenance ? "Enable Pitch" : "Disable Pitch"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MaintenancePanel;
