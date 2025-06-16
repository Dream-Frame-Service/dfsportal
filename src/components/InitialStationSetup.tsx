import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Building, MapPin, Phone, Clock, User, CheckCircle,
  Plus, Edit, Trash2, AlertTriangle, Save, Loader2 } from
'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Station {
  id?: number;
  station_name: string;
  address: string;
  phone: string;
  operating_hours: string;
  manager_name: string;
  status: string;
  last_updated?: string;
  created_by?: number;
}

const InitialStationSetup: React.FC = () => {
  const { toast } = useToast();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const defaultStations = [
  {
    station_name: 'MOBIL',
    address: '',
    phone: '',
    operating_hours: '24/7',
    manager_name: '',
    status: 'Active'
  },
  {
    station_name: 'AMOCO ROSEDALE',
    address: '',
    phone: '',
    operating_hours: '24/7',
    manager_name: '',
    status: 'Active'
  },
  {
    station_name: 'AMOCO BROOKLYN',
    address: '',
    phone: '',
    operating_hours: '24/7',
    manager_name: '',
    status: 'Active'
  }];


  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      setLoading(true);
      // Using direct Supabase query instead of legacy API
      const { data, error } = await supabase
        .from('stations')
        .select('*')
        .order('station_name', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error loading stations:', error);
        setStations([]);
        return;
      }

      setStations(data?.List || []);
    } catch (error) {
      console.error('Error loading stations:', error);
      toast({
        title: "Error",
        description: "Failed to load stations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupDefaultStations = async () => {
    try {
      setLoading(true);

      for (const station of defaultStations) {
        const { error } = await supabase
          .from('stations')
          .insert({
            ...station,
            last_updated: new Date().toISOString(),
            created_by: 1 // Default to system user
          });

        if (error) {
          throw new Error(`Failed to create ${station.station_name}: ${error}`);
        }
      }

      toast({
        title: "Success!",
        description: "Default stations created successfully. Please update their details."
      });

      await loadStations();
    } catch (error) {
      console.error('Error setting up stations:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to setup stations.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveStation = async (station: Station) => {
    try {
      setLoading(true);

      const stationData = {
        ...station,
        last_updated: new Date().toISOString(),
        created_by: station.created_by || 1
      };

      let error;
      if (station.id) {
        // Update existing station
        ({ error } = await supabase
          .from('stations')
          .update(stationData)
          .eq('id', station.id));
      } else {
        // Create new station
        ({ error } = await supabase
          .from('stations')
          .insert(stationData));
      }

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success!",
        description: `Station ${station.station_name} ${station.id ? 'updated' : 'created'} successfully.`
      });

      setEditingStation(null);
      setIsCreating(false);
      await loadStations();
    } catch (error) {
      console.error('Error saving station:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save station.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteStation = async (stationId: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('stations')
        .delete()
        .eq('id', stationId);

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success!",
        description: "Station deleted successfully."
      });

      await loadStations();
    } catch (error) {
      console.error('Error deleting station:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete station.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const StationForm: React.FC<{station: Station;onSave: (station: Station) => void;onCancel: () => void;}> = ({
    station,
    onSave,
    onCancel
  }) => {
    const [formData, setFormData] = useState<Station>(station);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <Card data-id="f8htt69vh" data-path="src/components/InitialStationSetup.tsx">
        <CardHeader data-id="tj7wi838o" data-path="src/components/InitialStationSetup.tsx">
          <CardTitle className="flex items-center gap-2" data-id="vmqxtbv3r" data-path="src/components/InitialStationSetup.tsx">
            <Building className="h-5 w-5" data-id="6yske7kmk" data-path="src/components/InitialStationSetup.tsx" />
            {station.id ? 'Edit Station' : 'Add New Station'}
          </CardTitle>
        </CardHeader>
        <CardContent data-id="b1hm59qrd" data-path="src/components/InitialStationSetup.tsx">
          <form onSubmit={handleSubmit} className="space-y-4" data-id="48amhn0l8" data-path="src/components/InitialStationSetup.tsx">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="kpd09o6yo" data-path="src/components/InitialStationSetup.tsx">
              <div className="space-y-2" data-id="7f1lw3plf" data-path="src/components/InitialStationSetup.tsx">
                <Label htmlFor="station_name" data-id="6tpa9ni16" data-path="src/components/InitialStationSetup.tsx">Station Name</Label>
                <Input
                  id="station_name"
                  value={formData.station_name}
                  onChange={(e) => setFormData({ ...formData, station_name: e.target.value })}
                  placeholder="e.g., MOBIL, AMOCO ROSEDALE"
                  required data-id="arug6jwe6" data-path="src/components/InitialStationSetup.tsx" />

              </div>
              
              <div className="space-y-2" data-id="stvv1lkno" data-path="src/components/InitialStationSetup.tsx">
                <Label htmlFor="manager_name" data-id="b35wtxrsy" data-path="src/components/InitialStationSetup.tsx">Manager Name</Label>
                <Input
                  id="manager_name"
                  value={formData.manager_name}
                  onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                  placeholder="Station manager name" data-id="51rotlq1c" data-path="src/components/InitialStationSetup.tsx" />

              </div>
            </div>

            <div className="space-y-2" data-id="vswlni1l7" data-path="src/components/InitialStationSetup.tsx">
              <Label htmlFor="address" data-id="ahshjc6cx" data-path="src/components/InitialStationSetup.tsx">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Complete station address"
                rows={2} data-id="22ug4tuav" data-path="src/components/InitialStationSetup.tsx" />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="7mkuulanj" data-path="src/components/InitialStationSetup.tsx">
              <div className="space-y-2" data-id="ih1t9pezl" data-path="src/components/InitialStationSetup.tsx">
                <Label htmlFor="phone" data-id="d95ugrbkw" data-path="src/components/InitialStationSetup.tsx">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567" data-id="9xqvg7043" data-path="src/components/InitialStationSetup.tsx" />

              </div>
              
              <div className="space-y-2" data-id="rbh7cjjb2" data-path="src/components/InitialStationSetup.tsx">
                <Label htmlFor="operating_hours" data-id="trn7is1qp" data-path="src/components/InitialStationSetup.tsx">Operating Hours</Label>
                <Select
                  value={formData.operating_hours}
                  onValueChange={(value) => setFormData({ ...formData, operating_hours: value })} data-id="7mb16xnni" data-path="src/components/InitialStationSetup.tsx">

                  <SelectTrigger data-id="50q04dtz1" data-path="src/components/InitialStationSetup.tsx">
                    <SelectValue placeholder="Select operating hours" data-id="t6sbqgye4" data-path="src/components/InitialStationSetup.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="f70wavej0" data-path="src/components/InitialStationSetup.tsx">
                    <SelectItem value="24/7" data-id="ikqmy3c2d" data-path="src/components/InitialStationSetup.tsx">24/7</SelectItem>
                    <SelectItem value="6:00 AM - 12:00 AM" data-id="qdar2yf64" data-path="src/components/InitialStationSetup.tsx">6:00 AM - 12:00 AM</SelectItem>
                    <SelectItem value="5:00 AM - 11:00 PM" data-id="g6905g7ce" data-path="src/components/InitialStationSetup.tsx">5:00 AM - 11:00 PM</SelectItem>
                    <SelectItem value="6:00 AM - 10:00 PM" data-id="cayfen8tf" data-path="src/components/InitialStationSetup.tsx">6:00 AM - 10:00 PM</SelectItem>
                    <SelectItem value="Custom" data-id="tnk6ocp2d" data-path="src/components/InitialStationSetup.tsx">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2" data-id="x68rjnhvt" data-path="src/components/InitialStationSetup.tsx">
              <Label htmlFor="status" data-id="md4clin0r" data-path="src/components/InitialStationSetup.tsx">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })} data-id="stmho3inc" data-path="src/components/InitialStationSetup.tsx">

                <SelectTrigger data-id="lnwerd5me" data-path="src/components/InitialStationSetup.tsx">
                  <SelectValue placeholder="Select status" data-id="9osl20y2r" data-path="src/components/InitialStationSetup.tsx" />
                </SelectTrigger>
                <SelectContent data-id="kntmbquoe" data-path="src/components/InitialStationSetup.tsx">
                  <SelectItem value="Active" data-id="jcqgwujw6" data-path="src/components/InitialStationSetup.tsx">Active</SelectItem>
                  <SelectItem value="Inactive" data-id="1raoqovx3" data-path="src/components/InitialStationSetup.tsx">Inactive</SelectItem>
                  <SelectItem value="Maintenance" data-id="0f7aq68kj" data-path="src/components/InitialStationSetup.tsx">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator data-id="djk7kf8yd" data-path="src/components/InitialStationSetup.tsx" />

            <div className="flex gap-2" data-id="4mm6dxwoc" data-path="src/components/InitialStationSetup.tsx">
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2" data-id="vwfpmnbgo" data-path="src/components/InitialStationSetup.tsx">

                {loading ?
                <Loader2 className="h-4 w-4 animate-spin" data-id="i3gupz3sz" data-path="src/components/InitialStationSetup.tsx" /> :

                <Save className="h-4 w-4" data-id="zkp8czimo" data-path="src/components/InitialStationSetup.tsx" />
                }
                {station.id ? 'Update Station' : 'Create Station'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading} data-id="3ozzhlskc" data-path="src/components/InitialStationSetup.tsx">

                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>);

  };

  if (loading && stations.length === 0) {
    return (
      <Card data-id="tndw9p4et" data-path="src/components/InitialStationSetup.tsx">
        <CardContent className="pt-6" data-id="tpsgrjn0g" data-path="src/components/InitialStationSetup.tsx">
          <div className="flex items-center justify-center py-12" data-id="grrz1tw4d" data-path="src/components/InitialStationSetup.tsx">
            <Loader2 className="h-8 w-8 animate-spin" data-id="jou4cw0y8" data-path="src/components/InitialStationSetup.tsx" />
            <span className="ml-2" data-id="ijpw49g32" data-path="src/components/InitialStationSetup.tsx">Loading stations...</span>
          </div>
        </CardContent>
      </Card>);

  }

  return (
    <div className="space-y-6" data-id="pugw8jjo9" data-path="src/components/InitialStationSetup.tsx">
      {/* Header */}
      <div className="flex items-center justify-between" data-id="esfbqfvbj" data-path="src/components/InitialStationSetup.tsx">
        <div data-id="e7nau3n1x" data-path="src/components/InitialStationSetup.tsx">
          <h2 className="text-2xl font-bold" data-id="gk8sn4rea" data-path="src/components/InitialStationSetup.tsx">Station Configuration</h2>
          <p className="text-gray-600" data-id="zram280tn" data-path="src/components/InitialStationSetup.tsx">
            Set up your gas stations: MOBIL, AMOCO ROSEDALE, and AMOCO BROOKLYN
          </p>
        </div>
        <div className="flex gap-2" data-id="wpkudlzqv" data-path="src/components/InitialStationSetup.tsx">
          {stations.length === 0 &&
          <Button onClick={setupDefaultStations} disabled={loading} data-id="vjedu6mje" data-path="src/components/InitialStationSetup.tsx">
              <Plus className="h-4 w-4 mr-2" data-id="j0lp7rmmy" data-path="src/components/InitialStationSetup.tsx" />
              Setup Default Stations
            </Button>
          }
          <Button onClick={() => setIsCreating(true)} disabled={loading} data-id="9zyekz9xd" data-path="src/components/InitialStationSetup.tsx">
            <Plus className="h-4 w-4 mr-2" data-id="dfi0gyb9t" data-path="src/components/InitialStationSetup.tsx" />
            Add Station
          </Button>
        </div>
      </div>

      {/* Setup Instructions */}
      {stations.length === 0 &&
      <Alert data-id="16x9k16y5" data-path="src/components/InitialStationSetup.tsx">
          <Building className="h-4 w-4" data-id="ylncxd722" data-path="src/components/InitialStationSetup.tsx" />
          <AlertDescription data-id="jx4e4m02p" data-path="src/components/InitialStationSetup.tsx">
            <strong data-id="4y3dsl9k6" data-path="src/components/InitialStationSetup.tsx">Get Started:</strong> Click "Setup Default Stations" to create the three main stations 
            (MOBIL, AMOCO ROSEDALE, AMOCO BROOKLYN), then update their details with your specific information.
          </AlertDescription>
        </Alert>
      }

      {/* Station Form */}
      {(editingStation || isCreating) &&
      <StationForm
        station={editingStation || {
          station_name: '',
          address: '',
          phone: '',
          operating_hours: '24/7',
          manager_name: '',
          status: 'Active'
        }}
        onSave={saveStation}
        onCancel={() => {
          setEditingStation(null);
          setIsCreating(false);
        }} data-id="3kszf6okg" data-path="src/components/InitialStationSetup.tsx" />

      }

      {/* Stations List */}
      {stations.length > 0 &&
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-id="muaxax031" data-path="src/components/InitialStationSetup.tsx">
          {stations.map((station) =>
        <Card key={station.id} className="hover:shadow-lg transition-shadow" data-id="44z2ou8it" data-path="src/components/InitialStationSetup.tsx">
              <CardHeader data-id="nfxsfg4ip" data-path="src/components/InitialStationSetup.tsx">
                <div className="flex items-center justify-between" data-id="aqwyk4fg9" data-path="src/components/InitialStationSetup.tsx">
                  <CardTitle className="flex items-center gap-2" data-id="ku0wmrhdv" data-path="src/components/InitialStationSetup.tsx">
                    <Building className="h-5 w-5" data-id="n97e2bk7b" data-path="src/components/InitialStationSetup.tsx" />
                    {station.station_name}
                  </CardTitle>
                  <Badge
                className={
                station.status === 'Active' ? 'bg-green-100 text-green-800' :
                station.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
                } data-id="kydz8m4xa" data-path="src/components/InitialStationSetup.tsx">

                    {station.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent data-id="l06kgn48p" data-path="src/components/InitialStationSetup.tsx">
                <div className="space-y-3" data-id="9s32b2bvy" data-path="src/components/InitialStationSetup.tsx">
                  {station.address &&
              <div className="flex items-start gap-2 text-sm" data-id="ac77die8p" data-path="src/components/InitialStationSetup.tsx">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" data-id="7esgf3nri" data-path="src/components/InitialStationSetup.tsx" />
                      <span className="text-gray-600" data-id="07s99yw3w" data-path="src/components/InitialStationSetup.tsx">{station.address}</span>
                    </div>
              }
                  
                  {station.phone &&
              <div className="flex items-center gap-2 text-sm" data-id="b7086jbn1" data-path="src/components/InitialStationSetup.tsx">
                      <Phone className="h-4 w-4 text-gray-500" data-id="43cl1splp" data-path="src/components/InitialStationSetup.tsx" />
                      <span className="text-gray-600" data-id="h9alzuavm" data-path="src/components/InitialStationSetup.tsx">{station.phone}</span>
                    </div>
              }
                  
                  <div className="flex items-center gap-2 text-sm" data-id="kzpt1j52d" data-path="src/components/InitialStationSetup.tsx">
                    <Clock className="h-4 w-4 text-gray-500" data-id="ujb8qlk5a" data-path="src/components/InitialStationSetup.tsx" />
                    <span className="text-gray-600" data-id="no3jwy0wt" data-path="src/components/InitialStationSetup.tsx">{station.operating_hours}</span>
                  </div>
                  
                  {station.manager_name &&
              <div className="flex items-center gap-2 text-sm" data-id="44bjw0oz9" data-path="src/components/InitialStationSetup.tsx">
                      <User className="h-4 w-4 text-gray-500" data-id="w7fvg7lzk" data-path="src/components/InitialStationSetup.tsx" />
                      <span className="text-gray-600" data-id="t2q2gvswu" data-path="src/components/InitialStationSetup.tsx">{station.manager_name}</span>
                    </div>
              }

                  {!station.address || !station.phone || !station.manager_name ?
              <Alert className="mt-3" data-id="w7l2cyops" data-path="src/components/InitialStationSetup.tsx">
                      <AlertTriangle className="h-4 w-4" data-id="6jv4dgozu" data-path="src/components/InitialStationSetup.tsx" />
                      <AlertDescription className="text-xs" data-id="ae8cxeda1" data-path="src/components/InitialStationSetup.tsx">
                        Some information is missing. Please complete the station details.
                      </AlertDescription>
                    </Alert> :

              <div className="flex items-center gap-2 text-sm text-green-600 mt-3" data-id="j4qty1lyb" data-path="src/components/InitialStationSetup.tsx">
                      <CheckCircle className="h-4 w-4" data-id="onwzs1pi0" data-path="src/components/InitialStationSetup.tsx" />
                      <span data-id="297s5qe6k" data-path="src/components/InitialStationSetup.tsx">Setup complete</span>
                    </div>
              }
                </div>

                <div className="flex gap-2 mt-4" data-id="un8mbe6ru" data-path="src/components/InitialStationSetup.tsx">
                  <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingStation(station)}
                disabled={loading} data-id="qqog2hbr4" data-path="src/components/InitialStationSetup.tsx">

                    <Edit className="h-4 w-4 mr-1" data-id="ddzszmlvk" data-path="src/components/InitialStationSetup.tsx" />
                    Edit
                  </Button>
                  
                  <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${station.station_name}?`)) {
                    deleteStation(station.id!);
                  }
                }}
                disabled={loading}
                className="text-red-600 hover:text-red-700" data-id="re1ocyxr0" data-path="src/components/InitialStationSetup.tsx">

                    <Trash2 className="h-4 w-4 mr-1" data-id="0etz7ely8" data-path="src/components/InitialStationSetup.tsx" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
        )}
        </div>
      }

      {/* Setup Progress Summary */}
      {stations.length > 0 &&
      <Card data-id="voeksdqiv" data-path="src/components/InitialStationSetup.tsx">
          <CardHeader data-id="pt7epn296" data-path="src/components/InitialStationSetup.tsx">
            <CardTitle data-id="o41h1dn9n" data-path="src/components/InitialStationSetup.tsx">Setup Progress</CardTitle>
          </CardHeader>
          <CardContent data-id="9govh083d" data-path="src/components/InitialStationSetup.tsx">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="z3uim6421" data-path="src/components/InitialStationSetup.tsx">
              <div className="text-center" data-id="ux9uz9y7s" data-path="src/components/InitialStationSetup.tsx">
                <div className="text-2xl font-bold text-blue-600" data-id="n50jcn1x9" data-path="src/components/InitialStationSetup.tsx">{stations.length}</div>
                <p className="text-sm text-gray-600" data-id="st2om0dnp" data-path="src/components/InitialStationSetup.tsx">Stations Created</p>
              </div>
              <div className="text-center" data-id="36k8cvl4l" data-path="src/components/InitialStationSetup.tsx">
                <div className="text-2xl font-bold text-green-600" data-id="j92w5r3hw" data-path="src/components/InitialStationSetup.tsx">
                  {stations.filter((s) => s.address && s.phone && s.manager_name).length}
                </div>
                <p className="text-sm text-gray-600" data-id="n3euqto25" data-path="src/components/InitialStationSetup.tsx">Fully Configured</p>
              </div>
              <div className="text-center" data-id="ci5a2ziq0" data-path="src/components/InitialStationSetup.tsx">
                <div className="text-2xl font-bold text-yellow-600" data-id="zf07x1wgw" data-path="src/components/InitialStationSetup.tsx">
                  {stations.filter((s) => s.status === 'Active').length}
                </div>
                <p className="text-sm text-gray-600" data-id="gv13ohiaf" data-path="src/components/InitialStationSetup.tsx">Active Stations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};

export default InitialStationSetup;
