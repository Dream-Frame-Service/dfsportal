import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Building2 } from 'lucide-react';

interface StationSelectorProps {
  onStationSelect: (station: string) => void;
}

const stations = [
{
  id: 'MOBIL',
  name: 'MOBIL',
  location: 'Far Rockaway',
  description: 'Gas station with convenience store',
  color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
},
{
  id: 'AMOCO ROSEDALE',
  name: 'AMOCO',
  location: 'Rosedale',
  description: 'Full service gas station',
  color: 'bg-green-50 border-green-200 hover:bg-green-100'
},
{
  id: 'AMOCO BROOKLYN',
  name: 'AMOCO',
  location: 'Brooklyn',
  description: 'Full service gas station',
  color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
}];


const StationSelector: React.FC<StationSelectorProps> = ({ onStationSelect }) => {
  return (
    <Card data-id="irusfxzsh" data-path="src/components/StationSelector.tsx">
      <CardHeader className="text-center" data-id="p10v19tal" data-path="src/components/StationSelector.tsx">
        <CardTitle className="flex items-center justify-center space-x-2" data-id="511h91uuu" data-path="src/components/StationSelector.tsx">
          <Building2 className="w-6 h-6" data-id="06foisws4" data-path="src/components/StationSelector.tsx" />
          <span data-id="0ljlq0fp7" data-path="src/components/StationSelector.tsx">Select Station</span>
        </CardTitle>
        <CardDescription data-id="hy1pfwcbu" data-path="src/components/StationSelector.tsx">
          Choose the station to create a daily sales report for
        </CardDescription>
      </CardHeader>
      <CardContent data-id="c7k8k06b0" data-path="src/components/StationSelector.tsx">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="cgf5rbft6" data-path="src/components/StationSelector.tsx">
          {stations.map((station) =>
          <Button
            key={station.id}
            variant="outline"
            className={`h-auto p-6 flex flex-col items-center space-y-3 ${station.color} transition-all duration-200`}
            onClick={() => onStationSelect(station.id)} data-id="mr4v38vsu" data-path="src/components/StationSelector.tsx">

              <MapPin className="w-8 h-8" data-id="4h8cuvkxj" data-path="src/components/StationSelector.tsx" />
              <div className="text-center" data-id="5wz2tqz9n" data-path="src/components/StationSelector.tsx">
                <div className="font-semibold text-lg" data-id="uwcv5f80d" data-path="src/components/StationSelector.tsx">{station.name}</div>
                <div className="text-sm text-muted-foreground" data-id="pazyvv5ll" data-path="src/components/StationSelector.tsx">{station.location}</div>
                <div className="text-xs text-muted-foreground mt-1" data-id="bav564feg" data-path="src/components/StationSelector.tsx">{station.description}</div>
              </div>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>);

};

export default StationSelector;
