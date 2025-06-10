import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EnhancedFileUpload from '@/components/EnhancedFileUpload';
import { useIsMobile } from '@/hooks/use-mobile';

interface DocumentUpload {
  name: string;
  field: string;
  fileId?: number;
  required: boolean;
}

interface DocumentsUploadSectionProps {
  documents: {
    dayReportFileId?: number;
    veederRootFileId?: number;
    lottoReportFileId?: number;
    scratchOffReportFileId?: number;
  };
  onChange: (field: string, fileId: number) => void;
}

const DocumentsUploadSection: React.FC<DocumentsUploadSectionProps> = ({
  documents,
  onChange
}) => {
  const { toast } = useToast();

  const documentTypes: DocumentUpload[] = [
  {
    name: 'Day Report',
    field: 'dayReportFileId',
    fileId: documents.dayReportFileId,
    required: true
  },
  {
    name: 'Veeder Root Report',
    field: 'veederRootFileId',
    fileId: documents.veederRootFileId,
    required: true
  },
  {
    name: 'Lotto Report',
    field: 'lottoReportFileId',
    fileId: documents.lottoReportFileId,
    required: true
  },
  {
    name: 'Scratch Off Report',
    field: 'scratchOffReportFileId',
    fileId: documents.scratchOffReportFileId,
    required: true
  }];


  const uploadDocument = async (field: string, file: File) => {
    try {
      const { data: fileId, error } = await window.ezsite.apis.upload({
        filename: file.name,
        file
      });

      if (error) throw error;
      onChange(field, fileId);

      toast({
        title: 'Success',
        description: `${field.replace('FileId', '').replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} uploaded successfully`
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive'
      });
    }
  };

  const getStatus = (document: DocumentUpload) => {
    if (document.fileId) {
      return {
        icon: <CheckCircle className="w-4 h-4" data-id="sks67egpd" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx" />,
        text: 'Submitted',
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    } else {
      return {
        icon: <AlertCircle className="w-4 h-4" data-id="8s2y4ovqb" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx" />,
        text: 'Not Submitted',
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    }
  };

  const submittedCount = documentTypes.filter((doc) => doc.fileId).length;
  const totalCount = documentTypes.length;

  return (
    <Card className="bg-purple-50 border-purple-200" data-id="da6aamhvp" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
      <CardHeader data-id="04f953vf2" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
        <CardTitle className="text-purple-800 flex items-center justify-between" data-id="eov3p51ho" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
          <div className="flex items-center space-x-2" data-id="xkmyszizx" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
            <FileText className="w-5 h-5" data-id="gpnj8pian" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx" />
            <span data-id="fgfncjakl" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">Documents Upload</span>
          </div>
          <Badge
            variant="outline"
            className={submittedCount === totalCount ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} data-id="1oyappxv4" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">

            {submittedCount}/{totalCount} Submitted
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" data-id="b1v0lp0ox" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4" data-id="ejrimpm70" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
          <div className="flex items-center space-x-2" data-id="9gf12xieo" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
            <AlertCircle className="w-5 h-5 text-yellow-600" data-id="lcdowj33j" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx" />
            <span className="text-sm font-medium text-yellow-800" data-id="qkgnkiln4" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">Mandatory Submission Required</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1" data-id="5umjhai04" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
            All documents must be uploaded before submitting the sales report.
          </p>
        </div>

        <div className="space-y-4" data-id="c3b1nfead" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
          {documentTypes.map((document) => {
            const status = getStatus(document);

            return (
              <div key={document.field} className="border border-purple-200 rounded-lg p-4 bg-white" data-id="s0vf8sp06" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
                <div className="flex items-center justify-between mb-3" data-id="0ranf1d2m" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
                  <div className="flex items-center space-x-3" data-id="8d7hog8p6" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
                    <FileText className="w-5 h-5 text-purple-600" data-id="937z7hqa6" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx" />
                    <span className="font-medium" data-id="eg054l9zf" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">{document.name}</span>
                    {document.required &&
                    <Badge variant="destructive" className="text-xs" data-id="jvkob4m8d" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">Required</Badge>
                    }
                  </div>
                  <Badge className={status.color} data-id="x1vf9s4lc" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
                    <div className="flex items-center space-x-1" data-id="xp8646eiz" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
                      {status.icon}
                      <span data-id="yrum97r6j" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">{status.text}</span>
                    </div>
                  </Badge>
                </div>
                
                <div className="space-y-2" data-id="p5q0gbeh9" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
                  <EnhancedFileUpload
                    onFileSelect={(file) => uploadDocument(document.field, file)}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,image/*"
                    label={document.fileId ? 'Re-upload Document' : 'Upload Document'}
                    maxSize={15}
                    allowCamera={true}
                    className="w-full" data-id="2p4b12zre" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx" />

                </div>
                
                {document.fileId &&
                <div className="mt-2 text-xs text-green-600 flex items-center space-x-1" data-id="amy0jlo5g" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
                    <CheckCircle className="w-3 h-3" data-id="hckse27xo" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx" />
                    <span data-id="844ntkc2s" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">File uploaded successfully (ID: {document.fileId})</span>
                  </div>
                }
              </div>);

          })}
        </div>
        
        <div className="pt-4 border-t border-purple-200" data-id="a072ppect" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
          <div className="flex items-center justify-between text-sm" data-id="nj50gh2gq" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
            <span className="text-gray-600" data-id="8m2fenubm" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">Submission Progress:</span>
            <div className="flex items-center space-x-2" data-id="fsrr66fo2" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
              <div className="w-32 bg-gray-200 rounded-full h-2" data-id="q9p0jj421" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${submittedCount / totalCount * 100}%` }} data-id="od4i770z4" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx" />

              </div>
              <span className="font-medium text-purple-800" data-id="oc9hls9kc" data-path="src/components/SalesReportSections/DocumentsUploadSection.tsx">
                {Math.round(submittedCount / totalCount * 100)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>);

};

export default DocumentsUploadSection;