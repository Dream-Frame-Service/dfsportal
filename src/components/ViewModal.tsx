import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Eye,
  Edit,
  Trash2,
  Download,
  X,
  Calendar,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  FileText,
  Hash,
  Clock } from
'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ViewModalField {
  key: string;
  label: string;
  value: any;
  type?: 'text' | 'date' | 'currency' | 'badge' | 'email' | 'phone' | 'boolean' | 'number';
  icon?: React.ComponentType<{className?: string;}>;
  badgeColor?: string;
  hidden?: boolean;
}

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
  fields: ViewModalField[];
  onEdit?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
  loading?: boolean;
  subtitle?: string;
}

const ViewModal: React.FC<ViewModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  fields,
  onEdit,
  onDelete,
  onExport,
  canEdit = true,
  canDelete = true,
  canExport = true,
  loading = false,
  subtitle
}) => {
  const formatValue = (field: ViewModalField) => {
    const { value, type } = field;

    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400" data-id="eg4d7pspi" data-path="src/components/ViewModal.tsx">N/A</span>;
    }

    switch (type) {
      case 'date':
        return new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);

      case 'badge':
        return (
          <Badge
            className={`${field.badgeColor || 'bg-gray-500'} text-white`} data-id="x906u9mra" data-path="src/components/ViewModal.tsx">

            {value}
          </Badge>);


      case 'email':
        return (
          <a
            href={`mailto:${value}`}
            className="text-blue-600 hover:underline flex items-center space-x-1" data-id="a6iub5ee0" data-path="src/components/ViewModal.tsx">

            <Mail className="w-3 h-3" data-id="dc7d4hhek" data-path="src/components/ViewModal.tsx" />
            <span data-id="q2mydccuf" data-path="src/components/ViewModal.tsx">{value}</span>
          </a>);


      case 'phone':
        return (
          <a
            href={`tel:${value}`}
            className="text-blue-600 hover:underline flex items-center space-x-1" data-id="nuhsy37sj" data-path="src/components/ViewModal.tsx">

            <Phone className="w-3 h-3" data-id="qb6guqeq8" data-path="src/components/ViewModal.tsx" />
            <span data-id="kuqiof57c" data-path="src/components/ViewModal.tsx">{value}</span>
          </a>);


      case 'boolean':
        return (
          <Badge variant={value ? "default" : "secondary"} data-id="gegcyesci" data-path="src/components/ViewModal.tsx">
            {value ? 'Yes' : 'No'}
          </Badge>);


      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;

      default:
        return String(value);
    }
  };

  const getFieldIcon = (field: ViewModalField) => {
    if (field.icon) {
      const IconComponent = field.icon;
      return <IconComponent className="w-4 h-4 text-gray-500" data-id="pxwmzj6nq" data-path="src/components/ViewModal.tsx" />;
    }

    // Default icons based on field type
    switch (field.type) {
      case 'date':
        return <Calendar className="w-4 h-4 text-gray-500" data-id="dx5da2ui8" data-path="src/components/ViewModal.tsx" />;
      case 'currency':
        return <DollarSign className="w-4 h-4 text-gray-500" data-id="jzu89y4zl" data-path="src/components/ViewModal.tsx" />;
      case 'email':
        return <Mail className="w-4 h-4 text-gray-500" data-id="0i8lnaxzb" data-path="src/components/ViewModal.tsx" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-gray-500" data-id="xyddvflg4" data-path="src/components/ViewModal.tsx" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" data-id="pqgnw3oti" data-path="src/components/ViewModal.tsx" />;
    }
  };

  const visibleFields = fields.filter((field) => !field.hidden);

  return (
    <Dialog open={isOpen} onOpenChange={onClose} data-id="1spnnfehd" data-path="src/components/ViewModal.tsx">
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden" data-id="r1s13gxmf" data-path="src/components/ViewModal.tsx">
        <AnimatePresence data-id="wjg0rodt6" data-path="src/components/ViewModal.tsx">
          {isOpen &&
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }} data-id="n2suiat6z" data-path="src/components/ViewModal.tsx">

              <DialogHeader className="border-b pb-4" data-id="wfsnqaelc" data-path="src/components/ViewModal.tsx">
                <div className="flex items-center justify-between" data-id="40v0f6g4j" data-path="src/components/ViewModal.tsx">
                  <div className="flex items-center space-x-2" data-id="xf7xssves" data-path="src/components/ViewModal.tsx">
                    <Eye className="w-6 h-6 text-blue-600" data-id="7p8dsmser" data-path="src/components/ViewModal.tsx" />
                    <div data-id="ffnn5txeq" data-path="src/components/ViewModal.tsx">
                      <DialogTitle className="text-xl font-bold" data-id="z10ds52c0" data-path="src/components/ViewModal.tsx">{title}</DialogTitle>
                      {subtitle &&
                    <DialogDescription className="mt-1" data-id="7h176hhe6" data-path="src/components/ViewModal.tsx">
                          {subtitle}
                        </DialogDescription>
                    }
                    </div>
                  </div>
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700" data-id="1kk88evz3" data-path="src/components/ViewModal.tsx">

                    <X className="w-4 h-4" data-id="l153o3qwv" data-path="src/components/ViewModal.tsx" />
                  </Button>
                </div>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh] pr-4" data-id="dovhg5kd3" data-path="src/components/ViewModal.tsx">
                <div className="space-y-6 py-6" data-id="pzk5e66gg" data-path="src/components/ViewModal.tsx">
                  {loading ?
                <div className="space-y-4" data-id="xoc9k096b" data-path="src/components/ViewModal.tsx">
                      {[...Array(6)].map((_, i) =>
                  <div key={i} className="flex items-center space-x-3" data-id="waffhsdc4" data-path="src/components/ViewModal.tsx">
                          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" data-id="jze120wre" data-path="src/components/ViewModal.tsx" />
                          <div className="flex-1 space-y-2" data-id="zx7j8jama" data-path="src/components/ViewModal.tsx">
                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" data-id="pgiq21q7q" data-path="src/components/ViewModal.tsx" />
                            <div className="h-4 bg-gray-100 rounded w-32 animate-pulse" data-id="onb16hh3y" data-path="src/components/ViewModal.tsx" />
                          </div>
                        </div>
                  )}
                    </div> :

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="bus93rbed" data-path="src/components/ViewModal.tsx">
                      {visibleFields.map((field, index) =>
                  <motion.div
                    key={field.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="space-y-2" data-id="e8kod921q" data-path="src/components/ViewModal.tsx">

                          <div className="flex items-center space-x-2" data-id="c55w3f9sk" data-path="src/components/ViewModal.tsx">
                            {getFieldIcon(field)}
                            <span className="text-sm font-medium text-gray-700" data-id="i51xxegnw" data-path="src/components/ViewModal.tsx">
                              {field.label}
                            </span>
                          </div>
                          <div className="pl-6" data-id="mmioapncn" data-path="src/components/ViewModal.tsx">
                            <div className="text-sm text-gray-900 font-medium" data-id="q8epzn863" data-path="src/components/ViewModal.tsx">
                              {formatValue(field)}
                            </div>
                          </div>
                        </motion.div>
                  )}
                    </div>
                }
                </div>
              </ScrollArea>

              <Separator data-id="8en97nf9r" data-path="src/components/ViewModal.tsx" />

              <div className="flex items-center justify-between pt-4" data-id="zj0zae8gw" data-path="src/components/ViewModal.tsx">
                <div className="flex items-center space-x-2 text-xs text-gray-500" data-id="60mtn8uht" data-path="src/components/ViewModal.tsx">
                  <Clock className="w-3 h-3" data-id="2iydpgvpt" data-path="src/components/ViewModal.tsx" />
                  <span data-id="rnxol4sol" data-path="src/components/ViewModal.tsx">Press V to view, E to edit, D to delete</span>
                </div>
                
                <div className="flex items-center space-x-2" data-id="hz3keznwy" data-path="src/components/ViewModal.tsx">
                  {canExport && onExport &&
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  className="flex items-center space-x-1" data-id="tdzl6c1z6" data-path="src/components/ViewModal.tsx">

                      <Download className="w-4 h-4" data-id="iiabd4w3u" data-path="src/components/ViewModal.tsx" />
                      <span data-id="pmwmm87qj" data-path="src/components/ViewModal.tsx">Export</span>
                    </Button>
                }
                  
                  {canDelete && onDelete &&
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="text-red-600 hover:text-red-700 flex items-center space-x-1" data-id="zo2fpqdnl" data-path="src/components/ViewModal.tsx">

                      <Trash2 className="w-4 h-4" data-id="30b0dyce0" data-path="src/components/ViewModal.tsx" />
                      <span data-id="e7h8yctkf" data-path="src/components/ViewModal.tsx">Delete</span>
                    </Button>
                }
                  
                  {canEdit && onEdit &&
                <Button
                  size="sm"
                  onClick={onEdit}
                  className="flex items-center space-x-1" data-id="wx4xo3akr" data-path="src/components/ViewModal.tsx">

                      <Edit className="w-4 h-4" data-id="rx53i1y98" data-path="src/components/ViewModal.tsx" />
                      <span data-id="m4yvovp8c" data-path="src/components/ViewModal.tsx">Edit</span>
                    </Button>
                }
                </div>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </DialogContent>
    </Dialog>);

};

export default ViewModal;