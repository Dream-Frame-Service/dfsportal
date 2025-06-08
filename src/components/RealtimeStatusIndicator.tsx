import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface RealtimeStatusIndicatorProps {
  isConnected: boolean;
  lastUpdate?: Date | null;
  className?: string;
  showLabel?: boolean;
}

const RealtimeStatusIndicator: React.FC<RealtimeStatusIndicatorProps> = ({
  isConnected,
  lastUpdate,
  className = '',
  showLabel = true
}) => {
  const formatLastUpdate = (date: Date | null) => {
    if (!date) return 'No updates yet';

    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) {// Less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) {// Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    } else if (diff < 86400000) {// Less than 1 day
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const statusIcon = isConnected ?
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} data-id="zhdrxkd1y" data-path="src/components/RealtimeStatusIndicator.tsx">

      <Wifi className="h-3 w-3" data-id="j4zx8xtva" data-path="src/components/RealtimeStatusIndicator.tsx" />
    </motion.div> :

  <WifiOff className="h-3 w-3" data-id="xafhwdjw3" data-path="src/components/RealtimeStatusIndicator.tsx" />;


  const statusColor = isConnected ? 'bg-green-500' : 'bg-red-500';
  const statusText = isConnected ? 'Connected' : 'Disconnected';

  return (
    <TooltipProvider data-id="e7tk57n3l" data-path="src/components/RealtimeStatusIndicator.tsx">
      <Tooltip data-id="8ljh7eygw" data-path="src/components/RealtimeStatusIndicator.tsx">
        <TooltipTrigger asChild data-id="mbz2qwtqs" data-path="src/components/RealtimeStatusIndicator.tsx">
          <div className={`flex items-center gap-2 ${className}`} data-id="e7y3hdxen" data-path="src/components/RealtimeStatusIndicator.tsx">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusColor} text-white text-xs`} data-id="j2qbb7cpl" data-path="src/components/RealtimeStatusIndicator.tsx">
              {statusIcon}
              {showLabel && <span data-id="dxvvbkc88" data-path="src/components/RealtimeStatusIndicator.tsx">{statusText}</span>}
            </div>
            {lastUpdate &&
            <Badge variant="outline" className="text-xs" data-id="lyfwwlzsu" data-path="src/components/RealtimeStatusIndicator.tsx">
                <RefreshCw className="h-3 w-3 mr-1" data-id="nbssfhehs" data-path="src/components/RealtimeStatusIndicator.tsx" />
                {formatLastUpdate(lastUpdate)}
              </Badge>
            }
          </div>
        </TooltipTrigger>
        <TooltipContent data-id="km3jha7xd" data-path="src/components/RealtimeStatusIndicator.tsx">
          <div className="text-sm" data-id="kj5s6j14p" data-path="src/components/RealtimeStatusIndicator.tsx">
            <div className="font-medium" data-id="z5xqg9q5b" data-path="src/components/RealtimeStatusIndicator.tsx">Real-time Status</div>
            <div data-id="rkb6tn0qg" data-path="src/components/RealtimeStatusIndicator.tsx">Status: {statusText}</div>
            {lastUpdate &&
            <div data-id="mz630p4hd" data-path="src/components/RealtimeStatusIndicator.tsx">Last update: {formatLastUpdate(lastUpdate)}</div>
            }
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>);

};

export default RealtimeStatusIndicator;