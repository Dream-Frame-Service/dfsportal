import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter } from
'@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Station {
  id: number;
  station_name: string;
  address: string;
  phone: string;
  operating_hours: string;
  manager_name: string;
  status: string;
  last_updated: string;
  created_by: number;
}

interface StationEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  station: Station | null;
  onSave: () => void;
}

export default function StationEditDialog({
  open,
  onOpenChange,
  station,
  onSave
}: StationEditDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    station_name: '',
    address: '',
    phone: '',
    operating_hours: '',
    manager_name: '',
    status: 'Active'
  });

  useEffect(() => {
    if (station) {
      setFormData({
        station_name: station.station_name,
        address: station.address,
        phone: station.phone,
        operating_hours: station.operating_hours,
        manager_name: station.manager_name,
        status: station.status
      });
    }
  }, [station]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!station) return;

    setLoading(true);
    try {
      console.log('Updating station:', station.id, formData);

      const updateData = {
        id: station.id,
        ...formData,
        last_updated: new Date().toISOString(),
        created_by: station.created_by
      };

      const { error } = await window.ezsite.apis.tableUpdate(12599, updateData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Station information updated successfully"
      });

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating station:', error);
      toast({
        title: "Error",
        description: error?.toString() || "Failed to update station information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.station_name && formData.address && formData.phone &&
  formData.operating_hours && formData.manager_name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} data-id="gnvd0cdoc" data-path="src/components/StationEditDialog.tsx">
      <DialogContent className="sm:max-w-[500px]" data-id="qe8l4o124" data-path="src/components/StationEditDialog.tsx">
        <DialogHeader data-id="39ssrfxke" data-path="src/components/StationEditDialog.tsx">
          <DialogTitle data-id="pha3u2qby" data-path="src/components/StationEditDialog.tsx">Edit Station Information</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4" data-id="7yomz4hhx" data-path="src/components/StationEditDialog.tsx">
          <div className="grid grid-cols-1 gap-4" data-id="lwjjnicqp" data-path="src/components/StationEditDialog.tsx">
            <div className="space-y-2" data-id="eihdhbh9b" data-path="src/components/StationEditDialog.tsx">
              <Label htmlFor="station_name" data-id="6pvyqmavg" data-path="src/components/StationEditDialog.tsx">Station Name</Label>
              <Input
                id="station_name"
                value={formData.station_name}
                onChange={(e) => handleInputChange('station_name', e.target.value)}
                placeholder="Enter station name"
                required data-id="hdxhkvscp" data-path="src/components/StationEditDialog.tsx" />

            </div>

            <div className="space-y-2" data-id="15avg3zq0" data-path="src/components/StationEditDialog.tsx">
              <Label htmlFor="address" data-id="37m32k6h4" data-path="src/components/StationEditDialog.tsx">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter station address"
                required data-id="qxkbd65im" data-path="src/components/StationEditDialog.tsx" />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="k8r29mffd" data-path="src/components/StationEditDialog.tsx">
              <div className="space-y-2" data-id="tzxy5uhc0" data-path="src/components/StationEditDialog.tsx">
                <Label htmlFor="phone" data-id="incqb657q" data-path="src/components/StationEditDialog.tsx">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(718) 555-0100"
                  required data-id="uwydcfos4" data-path="src/components/StationEditDialog.tsx" />

              </div>

              <div className="space-y-2" data-id="a4ud4bw0u" data-path="src/components/StationEditDialog.tsx">
                <Label htmlFor="status" data-id="6yvn8rz6x" data-path="src/components/StationEditDialog.tsx">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)} data-id="1r8xjkka1" data-path="src/components/StationEditDialog.tsx">
                  <SelectTrigger data-id="bujodlo5z" data-path="src/components/StationEditDialog.tsx">
                    <SelectValue placeholder="Select status" data-id="eea6u5rq6" data-path="src/components/StationEditDialog.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="30zhqlgck" data-path="src/components/StationEditDialog.tsx">
                    <SelectItem value="Active" data-id="vy6hriqro" data-path="src/components/StationEditDialog.tsx">Active</SelectItem>
                    <SelectItem value="Inactive" data-id="ppfyzwyui" data-path="src/components/StationEditDialog.tsx">Inactive</SelectItem>
                    <SelectItem value="Maintenance" data-id="c8jc5bsn8" data-path="src/components/StationEditDialog.tsx">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2" data-id="2l4zqf1l7" data-path="src/components/StationEditDialog.tsx">
              <Label htmlFor="operating_hours" data-id="f61nt2qrg" data-path="src/components/StationEditDialog.tsx">Operating Hours</Label>
              <Input
                id="operating_hours"
                value={formData.operating_hours}
                onChange={(e) => handleInputChange('operating_hours', e.target.value)}
                placeholder="24/7 or 6:00 AM - 12:00 AM"
                required data-id="jtnfcsbtt" data-path="src/components/StationEditDialog.tsx" />

            </div>

            <div className="space-y-2" data-id="2b7j0sx3l" data-path="src/components/StationEditDialog.tsx">
              <Label htmlFor="manager_name" data-id="uw77zo35r" data-path="src/components/StationEditDialog.tsx">Manager Name</Label>
              <Input
                id="manager_name"
                value={formData.manager_name}
                onChange={(e) => handleInputChange('manager_name', e.target.value)}
                placeholder="Enter manager name"
                required data-id="a8sqzhj7x" data-path="src/components/StationEditDialog.tsx" />

            </div>
          </div>

          <DialogFooter className="gap-2" data-id="1sysad1i4" data-path="src/components/StationEditDialog.tsx">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} data-id="tlao3ahxh" data-path="src/components/StationEditDialog.tsx">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !isFormValid}
              className="min-w-[100px]" data-id="uyo8juuok" data-path="src/components/StationEditDialog.tsx">

              {loading ?
              <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" data-id="sylpr793n" data-path="src/components/StationEditDialog.tsx" />
                  Saving...
                </> :

              'Save Changes'
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);

}