import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Database, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAdminAccess from '@/hooks/use-admin-access';

interface DatabaseConnectionAlertProps {
  connections: number;
  max: number;
  showDetails?: boolean;
  className?: string;
}

const DatabaseConnectionAlert: React.FC<DatabaseConnectionAlertProps> = ({
  connections = 85,
  max = 100,
  showDetails = true,
  className = ""
}) => {
  const { hasMonitoringAccess } = useAdminAccess();
  const navigate = useNavigate();
  const percentage = connections / max * 100;

  // Return null if user doesn't have monitoring access
  if (!hasMonitoringAccess) {
    return null;
  }

  // Only show alert if connection usage is high
  if (percentage < 70) {
    return null;
  }

  const getVariant = () => {
    if (percentage >= 85) return 'destructive';
    return 'default';
  };

  const getStatusText = () => {
    if (percentage >= 85) return 'CRITICAL';
    if (percentage >= 70) return 'WARNING';
    return 'NORMAL';
  };

  const handleViewDetails = () => {
    navigate('/admin/database-monitoring');
  };

  return (
    <Alert variant={getVariant()} className={className} data-id="jsbxzuugp" data-path="src/components/DatabaseConnectionAlert.tsx">
      <AlertTriangle className="h-4 w-4" data-id="x4pow1idn" data-path="src/components/DatabaseConnectionAlert.tsx" />
      <AlertTitle className="flex items-center justify-between" data-id="nwwdczxrw" data-path="src/components/DatabaseConnectionAlert.tsx">
        <span data-id="s47lhdfmk" data-path="src/components/DatabaseConnectionAlert.tsx">High Database Connection Usage</span>
        <Badge variant="outline" className="ml-2" data-id="q8cncq5kj" data-path="src/components/DatabaseConnectionAlert.tsx">
          <Database className="h-3 w-3 mr-1" data-id="71grk5uh4" data-path="src/components/DatabaseConnectionAlert.tsx" />
          {getStatusText()}
        </Badge>
      </AlertTitle>
      <AlertDescription className="space-y-3" data-id="5oh60jyq8" data-path="src/components/DatabaseConnectionAlert.tsx">
        <div className="flex items-center justify-between" data-id="uzwji47p7" data-path="src/components/DatabaseConnectionAlert.tsx">
          <span data-id="7odcbwqmt" data-path="src/components/DatabaseConnectionAlert.tsx">Current connections: <strong data-id="sc1ig9yp2" data-path="src/components/DatabaseConnectionAlert.tsx">{connections}/{max}</strong></span>
          <span className="text-sm" data-id="b9l1sinkb" data-path="src/components/DatabaseConnectionAlert.tsx">({percentage.toFixed(1)}% capacity)</span>
        </div>
        
        {showDetails &&
        <>
            <div className="text-sm text-muted-foreground" data-id="yvfds32l3" data-path="src/components/DatabaseConnectionAlert.tsx">
              {percentage >= 85 ?
            "Database connections are critically high. Immediate action required to prevent service disruption." :

            "Database connection usage is elevated. Monitor closely and consider optimization."
            }
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3" data-id="ar7v6xb5i" data-path="src/components/DatabaseConnectionAlert.tsx">
              <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              className="flex items-center space-x-1" data-id="pyssmj94g" data-path="src/components/DatabaseConnectionAlert.tsx">

                <ExternalLink className="h-3 w-3" data-id="75l29vi4c" data-path="src/components/DatabaseConnectionAlert.tsx" />
                <span data-id="i92k9o63k" data-path="src/components/DatabaseConnectionAlert.tsx">View Details</span>
              </Button>
            </div>
          </>
        }
      </AlertDescription>
    </Alert>);

};

export default DatabaseConnectionAlert;
