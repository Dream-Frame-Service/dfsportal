import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit3, Trash2, Eye, Settings, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const QuickAccessToolbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const getQuickActions = () => {
    const path = location.pathname;

    if (path.startsWith('/products')) {
      return [
      {
        label: 'Add Product',
        icon: <Plus className="w-4 h-4" data-id="5fk53fpwm" data-path="src/components/QuickAccessToolbar.tsx" />,
        action: () => navigate('/products/new'),
        color: 'bg-green-600 hover:bg-green-700'
      },
      {
        label: 'View All',
        icon: <Eye className="w-4 h-4" data-id="kob79bkjm" data-path="src/components/QuickAccessToolbar.tsx" />,
        action: () => navigate('/products'),
        color: 'bg-brand-600 hover:bg-brand-700'
      }];

    } else if (path.startsWith('/employees')) {
      return [
      {
        label: 'Add Employee',
        icon: <Plus className="w-4 h-4" data-id="zowf15lo1" data-path="src/components/QuickAccessToolbar.tsx" />,
        action: () => navigate('/employees/new'),
        color: 'bg-green-600 hover:bg-green-700'
      },
      {
        label: 'View All',
        icon: <Eye className="w-4 h-4" data-id="d6yiat8rs" data-path="src/components/QuickAccessToolbar.tsx" />,
        action: () => navigate('/employees'),
        color: 'bg-brand-600 hover:bg-brand-700'
      }];

    } else if (path.startsWith('/sales')) {
      return [
      {
        label: 'New Report',
        icon: <Plus className="w-4 h-4" data-id="95lnri14q" data-path="src/components/QuickAccessToolbar.tsx" />,
        action: () => navigate('/sales/new'),
        color: 'bg-green-600 hover:bg-green-700'
      },
      {
        label: 'View Reports',
        icon: <Eye className="w-4 h-4" data-id="sv88fma01" data-path="src/components/QuickAccessToolbar.tsx" />,
        action: () => navigate('/sales'),
        color: 'bg-brand-600 hover:bg-brand-700'
      }];

    } else if (path.startsWith('/vendors')) {
      return [
      {
        label: 'Add Vendor',
        icon: <Plus className="w-4 h-4" data-id="9xg8us7me" data-path="src/components/QuickAccessToolbar.tsx" />,
        action: () => navigate('/vendors/new'),
        color: 'bg-green-600 hover:bg-green-700'
      },
      {
        label: 'View All',
        icon: <Eye className="w-4 h-4" data-id="h0fytdm0f" data-path="src/components/QuickAccessToolbar.tsx" />,
        action: () => navigate('/vendors'),
        color: 'bg-brand-600 hover:bg-brand-700'
      }];

    } else if (path.startsWith('/orders')) {
      return [
      {
        label: 'Create Order',
        icon: <Plus className="w-4 h-4" data-id="bxm4v3a07" data-path="src/components/QuickAccessToolbar.tsx" />,
        action: () => navigate('/orders/new'),
        color: 'bg-green-600 hover:bg-green-700'
      },
      {
        label: 'View Orders',
        icon: <Eye className="w-4 h-4" data-id="hm1vobg22" data-path="src/components/QuickAccessToolbar.tsx" />,
        action: () => navigate('/orders'),
        color: 'bg-brand-600 hover:bg-brand-700'
      }];

    } else if (path.startsWith('/licenses')) {
      return [
      {
        label: 'Add License',
        icon: <Plus className="w-4 h-4" data-id="98a6sei2n" data-path="src/components/QuickAccessToolbar.tsx" />,
        action: () => navigate('/licenses/new'),
        color: 'bg-green-600 hover:bg-green-700'
      },
      {
        label: 'View All',
        icon: <Eye className="w-4 h-4" data-id="yg0y4z8hl" data-path="src/components/QuickAccessToolbar.tsx" />,
        action: () => navigate('/licenses'),
        color: 'bg-brand-600 hover:bg-brand-700'
      }];

    }

    return [
    {
      label: 'Dashboard',
      icon: <Eye className="w-4 h-4" data-id="91hdcwo3k" data-path="src/components/QuickAccessToolbar.tsx" />,
      action: () => navigate('/dashboard'),
      color: 'bg-brand-600 hover:bg-brand-700'
    }];

  };

  const quickActions = getQuickActions();

  return (
    <Card className="fixed bottom-6 right-6 z-50 shadow-lg border-2 border-brand-200 bg-white/95 backdrop-blur-sm" data-id="zlr1tvknt" data-path="src/components/QuickAccessToolbar.tsx">
      <CardContent className="p-3" data-id="7dgnca0yl" data-path="src/components/QuickAccessToolbar.tsx">
        <div className="flex items-center space-x-2" data-id="w35icsqiw" data-path="src/components/QuickAccessToolbar.tsx">
          <div className="flex items-center space-x-1" data-id="24bqjiya0" data-path="src/components/QuickAccessToolbar.tsx">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" data-id="bdfu1bgho" data-path="src/components/QuickAccessToolbar.tsx"></div>
            <span className="text-xs font-medium text-gray-700" data-id="m8xd37282" data-path="src/components/QuickAccessToolbar.tsx">Visual Edit Mode</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 h-auto" data-id="30h44soqb" data-path="src/components/QuickAccessToolbar.tsx">

            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} data-id="d7ijfw7o2" data-path="src/components/QuickAccessToolbar.tsx" />
          </Button>
        </div>
        
        {isExpanded &&
        <div className="mt-3 pt-3 border-t border-gray-200" data-id="f9dzvvezh" data-path="src/components/QuickAccessToolbar.tsx">
            <div className="grid grid-cols-1 gap-2 min-w-[200px]" data-id="1kck5pqcd" data-path="src/components/QuickAccessToolbar.tsx">
              <div className="text-xs font-medium text-gray-500 mb-2" data-id="kvah4n02k" data-path="src/components/QuickAccessToolbar.tsx">Quick Actions:</div>
              {quickActions.map((action, index) =>
            <Button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white text-xs h-8 justify-start`} data-id="7ulj0h58y" data-path="src/components/QuickAccessToolbar.tsx">

                  {action.icon}
                  <span className="ml-2" data-id="guk0dw24g" data-path="src/components/QuickAccessToolbar.tsx">{action.label}</span>
                </Button>
            )}
              
              <div className="border-t border-gray-200 mt-2 pt-2" data-id="ihvnhjlrt" data-path="src/components/QuickAccessToolbar.tsx">
                <div className="text-xs text-gray-500 flex items-center space-x-1" data-id="rlcu1zn3h" data-path="src/components/QuickAccessToolbar.tsx">
                  <Settings className="w-3 h-3" data-id="ozo5v7tmf" data-path="src/components/QuickAccessToolbar.tsx" />
                  <span data-id="njc9y3iww" data-path="src/components/QuickAccessToolbar.tsx">All features unlocked</span>
                </div>
              </div>
            </div>
          </div>
        }
      </CardContent>
    </Card>);

};

export default QuickAccessToolbar;