import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Edit3,
  Plus,
  Pencil,
  Trash2,
  Eye,
  FileText,
  Settings,
  Info,
  X,
  MousePointer,
  Keyboard,
  Zap } from
'lucide-react';

interface VisualEditGuideProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const VisualEditGuide: React.FC<VisualEditGuideProps> = ({
  isOpen = false,
  onClose
}) => {
  const [currentTab, setCurrentTab] = useState<'features' | 'permissions' | 'tips'>('features');

  if (!isOpen) return null;

  const features = [
  {
    icon: <Plus className="w-5 h-5 text-blue-600" data-id="4g6yvrtk9" data-path="src/components/VisualEditGuide.tsx" />,
    title: "Create New Records",
    description: "Add new products, employees, sales reports, and more with comprehensive forms",
    examples: ["Add Product", "Create Employee", "New Sales Report", "Register Vendor"]
  },
  {
    icon: <Pencil className="w-5 h-5 text-yellow-600" data-id="30hch6374" data-path="src/components/VisualEditGuide.tsx" />,
    title: "Edit Existing Data",
    description: "Modify any existing records with full field editing capabilities",
    examples: ["Update product prices", "Edit employee details", "Modify sales data", "Change order status"]
  },
  {
    icon: <Trash2 className="w-5 h-5 text-red-600" data-id="wfr2bjjbt" data-path="src/components/VisualEditGuide.tsx" />,
    title: "Delete Records",
    description: "Remove outdated or incorrect records with confirmation prompts",
    examples: ["Remove old products", "Delete inactive employees", "Archive old reports"]
  },
  {
    icon: <Eye className="w-5 h-5 text-green-600" data-id="drst8mjqj" data-path="src/components/VisualEditGuide.tsx" />,
    title: "View & Search",
    description: "Browse all data with advanced search and filtering options",
    examples: ["Search products by barcode", "Filter employees by station", "Sort sales by date"]
  },
  {
    icon: <FileText className="w-5 h-5 text-purple-600" data-id="wq61nd4nz" data-path="src/components/VisualEditGuide.tsx" />,
    title: "Generate Reports",
    description: "Create and print detailed reports for various business needs",
    examples: ["Sales summary reports", "Employee lists", "License status reports"]
  }];


  const permissions = [
  { feature: "Products", create: true, edit: true, delete: true, view: true },
  { feature: "Employees", create: true, edit: true, delete: true, view: true },
  { feature: "Sales Reports", create: true, edit: true, delete: true, view: true },
  { feature: "Vendors", create: true, edit: true, delete: true, view: true },
  { feature: "Orders", create: true, edit: true, delete: true, view: true },
  { feature: "Licenses", create: true, edit: true, delete: true, view: true },
  { feature: "Salary Records", create: true, edit: true, delete: true, view: true },
  { feature: "Inventory Alerts", create: true, edit: true, delete: true, view: true }];


  const tips = [
  {
    icon: <MousePointer className="w-5 h-5 text-blue-600" data-id="2qug7fwnq" data-path="src/components/VisualEditGuide.tsx" />,
    title: "Quick Actions",
    tip: "Click any row in tables to quickly access edit options. Look for edit and delete buttons in the Actions column."
  },
  {
    icon: <Keyboard className="w-5 h-5 text-green-600" data-id="tjzowckf4" data-path="src/components/VisualEditGuide.tsx" />,
    title: "Search Shortcuts",
    tip: "Use the search boxes to quickly find specific records. Search works across multiple fields for comprehensive results."
  },
  {
    icon: <Zap className="w-5 h-5 text-yellow-600" data-id="itc3xo2p3" data-path="src/components/VisualEditGuide.tsx" />,
    title: "Real-time Updates",
    tip: "All changes are saved immediately and reflected across the system. No need to refresh pages to see updates."
  },
  {
    icon: <Settings className="w-5 h-5 text-purple-600" data-id="l9we35z2b" data-path="src/components/VisualEditGuide.tsx" />,
    title: "Form Validation",
    tip: "All forms include validation to ensure data integrity. Required fields are clearly marked with indicators."
  }];


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-id="d9rstzz04" data-path="src/components/VisualEditGuide.tsx">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden" data-id="pboabgl9n" data-path="src/components/VisualEditGuide.tsx">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-blue-50 border-b" data-id="feol3o4vv" data-path="src/components/VisualEditGuide.tsx">
          <div data-id="64i9wt5kr" data-path="src/components/VisualEditGuide.tsx">
            <CardTitle className="flex items-center space-x-2" data-id="j7kw9iayd" data-path="src/components/VisualEditGuide.tsx">
              <CheckCircle className="w-6 h-6 text-green-600" data-id="gwda8p1nh" data-path="src/components/VisualEditGuide.tsx" />
              <span data-id="hhtfj5r79" data-path="src/components/VisualEditGuide.tsx">Visual Editing Guide</span>
            </CardTitle>
            <CardDescription data-id="84w4ks66g" data-path="src/components/VisualEditGuide.tsx">
              Complete overview of all visual editing capabilities in DFS Manager Portal
            </CardDescription>
          </div>
          {onClose &&
          <Button variant="ghost" size="sm" onClick={onClose} data-id="o9hp6txpb" data-path="src/components/VisualEditGuide.tsx">
              <X className="w-4 h-4" data-id="7nbkz14za" data-path="src/components/VisualEditGuide.tsx" />
            </Button>
          }
        </CardHeader>

        <div className="flex border-b" data-id="ru6wt1lem" data-path="src/components/VisualEditGuide.tsx">
          {[
          { key: 'features', label: 'Features', icon: <Edit3 className="w-4 h-4" data-id="wwem3m4e3" data-path="src/components/VisualEditGuide.tsx" /> },
          { key: 'permissions', label: 'Permissions', icon: <Settings className="w-4 h-4" data-id="704era8q0" data-path="src/components/VisualEditGuide.tsx" /> },
          { key: 'tips', label: 'Tips', icon: <Info className="w-4 h-4" data-id="kt5r4l2kw" data-path="src/components/VisualEditGuide.tsx" /> }].
          map((tab) =>
          <Button
            key={tab.key}
            variant={currentTab === tab.key ? "default" : "ghost"}
            className="rounded-none flex-1"
            onClick={() => setCurrentTab(tab.key as any)} data-id="3mpg0606j" data-path="src/components/VisualEditGuide.tsx">

              {tab.icon}
              <span className="ml-2" data-id="hlirs7idx" data-path="src/components/VisualEditGuide.tsx">{tab.label}</span>
            </Button>
          )}
        </div>

        <CardContent className="p-6 overflow-y-auto max-h-[60vh]" data-id="6rqw5jht4" data-path="src/components/VisualEditGuide.tsx">
          {currentTab === 'features' &&
          <div className="space-y-6" data-id="ysy7m9w9k" data-path="src/components/VisualEditGuide.tsx">
              <div className="text-center mb-6" data-id="pn971bx5j" data-path="src/components/VisualEditGuide.tsx">
                <h3 className="text-lg font-semibold text-gray-900 mb-2" data-id="la1sbny5i" data-path="src/components/VisualEditGuide.tsx">Full Visual Editing Capabilities</h3>
                <p className="text-gray-600" data-id="1yj8qjmpr" data-path="src/components/VisualEditGuide.tsx">All features are enabled with complete CRUD operations</p>
              </div>
              
              <div className="grid gap-4" data-id="wvu3jbvr2" data-path="src/components/VisualEditGuide.tsx">
                {features.map((feature, index) =>
              <Card key={index} className="border-l-4 border-l-blue-500" data-id="8ky460r1e" data-path="src/components/VisualEditGuide.tsx">
                    <CardContent className="p-4" data-id="79tahbo6m" data-path="src/components/VisualEditGuide.tsx">
                      <div className="flex items-start space-x-3" data-id="qqo2p4vv6" data-path="src/components/VisualEditGuide.tsx">
                        <div className="p-2 bg-gray-50 rounded-lg" data-id="8c2e5ph9l" data-path="src/components/VisualEditGuide.tsx">
                          {feature.icon}
                        </div>
                        <div className="flex-1" data-id="alb9c4iqb" data-path="src/components/VisualEditGuide.tsx">
                          <h4 className="font-semibold text-gray-900 mb-1" data-id="vrwrst20h" data-path="src/components/VisualEditGuide.tsx">{feature.title}</h4>
                          <p className="text-gray-600 text-sm mb-3" data-id="xi57b55sm" data-path="src/components/VisualEditGuide.tsx">{feature.description}</p>
                          <div className="flex flex-wrap gap-2" data-id="64ewm3h34" data-path="src/components/VisualEditGuide.tsx">
                            {feature.examples.map((example, idx) =>
                        <Badge key={idx} variant="outline" className="text-xs" data-id="j5unu416l" data-path="src/components/VisualEditGuide.tsx">
                                {example}
                              </Badge>
                        )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              )}
              </div>
            </div>
          }

          {currentTab === 'permissions' &&
          <div className="space-y-6" data-id="5zk7ssig2" data-path="src/components/VisualEditGuide.tsx">
              <div className="text-center mb-6" data-id="3eueplvnf" data-path="src/components/VisualEditGuide.tsx">
                <h3 className="text-lg font-semibold text-gray-900 mb-2" data-id="rlfpbrkb7" data-path="src/components/VisualEditGuide.tsx">Permission Matrix</h3>
                <p className="text-gray-600" data-id="66ywibbx5" data-path="src/components/VisualEditGuide.tsx">All users have full access to all features</p>
              </div>

              <div className="overflow-x-auto" data-id="ht2e6ktt4" data-path="src/components/VisualEditGuide.tsx">
                <table className="w-full border-collapse border border-gray-200 rounded-lg" data-id="eosal5a8r" data-path="src/components/VisualEditGuide.tsx">
                  <thead data-id="lonht8l5n" data-path="src/components/VisualEditGuide.tsx">
                    <tr className="bg-gray-50" data-id="j4ryp7csg" data-path="src/components/VisualEditGuide.tsx">
                      <th className="border border-gray-200 p-3 text-left font-semibold" data-id="a5f10esuu" data-path="src/components/VisualEditGuide.tsx">Feature</th>
                      <th className="border border-gray-200 p-3 text-center font-semibold" data-id="qs9kzs80m" data-path="src/components/VisualEditGuide.tsx">Create</th>
                      <th className="border border-gray-200 p-3 text-center font-semibold" data-id="3ylh7y1za" data-path="src/components/VisualEditGuide.tsx">Edit</th>
                      <th className="border border-gray-200 p-3 text-center font-semibold" data-id="i1edvep1n" data-path="src/components/VisualEditGuide.tsx">Delete</th>
                      <th className="border border-gray-200 p-3 text-center font-semibold" data-id="jghe4swpg" data-path="src/components/VisualEditGuide.tsx">View</th>
                    </tr>
                  </thead>
                  <tbody data-id="ud5997rtv" data-path="src/components/VisualEditGuide.tsx">
                    {permissions.map((permission, index) =>
                  <tr key={index} className="hover:bg-gray-50" data-id="mv0su19ly" data-path="src/components/VisualEditGuide.tsx">
                        <td className="border border-gray-200 p-3 font-medium" data-id="bu3dgjak5" data-path="src/components/VisualEditGuide.tsx">{permission.feature}</td>
                        <td className="border border-gray-200 p-3 text-center" data-id="lxd2px5rf" data-path="src/components/VisualEditGuide.tsx">
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" data-id="j3flaom39" data-path="src/components/VisualEditGuide.tsx" />
                        </td>
                        <td className="border border-gray-200 p-3 text-center" data-id="397uy74ye" data-path="src/components/VisualEditGuide.tsx">
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" data-id="boiwuhnc2" data-path="src/components/VisualEditGuide.tsx" />
                        </td>
                        <td className="border border-gray-200 p-3 text-center" data-id="m9o1zpef3" data-path="src/components/VisualEditGuide.tsx">
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" data-id="scnsbz0zz" data-path="src/components/VisualEditGuide.tsx" />
                        </td>
                        <td className="border border-gray-200 p-3 text-center" data-id="eqzdsvhgg" data-path="src/components/VisualEditGuide.tsx">
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" data-id="rscjpsuqm" data-path="src/components/VisualEditGuide.tsx" />
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          }

          {currentTab === 'tips' &&
          <div className="space-y-6" data-id="p5qeym0i3" data-path="src/components/VisualEditGuide.tsx">
              <div className="text-center mb-6" data-id="f2nemnhy9" data-path="src/components/VisualEditGuide.tsx">
                <h3 className="text-lg font-semibold text-gray-900 mb-2" data-id="uyzdlu1mq" data-path="src/components/VisualEditGuide.tsx">Pro Tips for Visual Editing</h3>
                <p className="text-gray-600" data-id="n4kbzyid6" data-path="src/components/VisualEditGuide.tsx">Make the most of your editing experience</p>
              </div>

              <div className="grid gap-4" data-id="3cscugcx9" data-path="src/components/VisualEditGuide.tsx">
                {tips.map((tip, index) =>
              <Card key={index} className="border-l-4 border-l-green-500" data-id="a7b7pervo" data-path="src/components/VisualEditGuide.tsx">
                    <CardContent className="p-4" data-id="k2dphl29y" data-path="src/components/VisualEditGuide.tsx">
                      <div className="flex items-start space-x-3" data-id="sjoxm8opg" data-path="src/components/VisualEditGuide.tsx">
                        <div className="p-2 bg-gray-50 rounded-lg" data-id="khr2cwjke" data-path="src/components/VisualEditGuide.tsx">
                          {tip.icon}
                        </div>
                        <div className="flex-1" data-id="foa7vdsrj" data-path="src/components/VisualEditGuide.tsx">
                          <h4 className="font-semibold text-gray-900 mb-1" data-id="5bsbwtjxi" data-path="src/components/VisualEditGuide.tsx">{tip.title}</h4>
                          <p className="text-gray-600 text-sm" data-id="6ydw3cfhp" data-path="src/components/VisualEditGuide.tsx">{tip.tip}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              )}
              </div>

              <Card className="bg-blue-50 border-blue-200" data-id="4yon155qc" data-path="src/components/VisualEditGuide.tsx">
                <CardContent className="p-4" data-id="jfnmtr7xv" data-path="src/components/VisualEditGuide.tsx">
                  <div className="flex items-center space-x-3" data-id="eqeauj4b0" data-path="src/components/VisualEditGuide.tsx">
                    <Info className="w-6 h-6 text-blue-600" data-id="g942e16ng" data-path="src/components/VisualEditGuide.tsx" />
                    <div data-id="ztmq2izkz" data-path="src/components/VisualEditGuide.tsx">
                      <h4 className="font-semibold text-blue-900 mb-1" data-id="kufrk0lih" data-path="src/components/VisualEditGuide.tsx">Support & Documentation</h4>
                      <p className="text-blue-700 text-sm" data-id="tksgkuehh" data-path="src/components/VisualEditGuide.tsx">
                        Visual editing is fully enabled across all modules. All changes are automatically saved 
                        and synchronized across the system. For advanced features or support, refer to the 
                        built-in help sections in each module.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          }
        </CardContent>

        <div className="border-t p-4 bg-gray-50 flex justify-between items-center" data-id="cytfdpmga" data-path="src/components/VisualEditGuide.tsx">
          <div className="flex items-center space-x-2" data-id="jhxqn8bgs" data-path="src/components/VisualEditGuide.tsx">
            <CheckCircle className="w-5 h-5 text-green-600" data-id="az1zkz5fz" data-path="src/components/VisualEditGuide.tsx" />
            <span className="text-sm font-medium text-green-700" data-id="5rghfjir9" data-path="src/components/VisualEditGuide.tsx">Visual Editing Fully Enabled</span>
          </div>
          {onClose &&
          <Button onClick={onClose} data-id="upbbf055d" data-path="src/components/VisualEditGuide.tsx">
              Got it
            </Button>
          }
        </div>
      </Card>
    </div>);

};

export default VisualEditGuide;