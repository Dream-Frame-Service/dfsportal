import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Upload, Download, Link, Trash2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { s3Storage, uploadToS3, getS3SignedUrl } from '@/services/s3StorageService';
import { testS3Connection, runAllS3Tests } from '@/utils/testS3Connection';

interface FileUploadResult {
  key: string;
  url?: string;
  error?: string;
  success: boolean;
}

export function S3StorageManager() {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [uploadResults, setUploadResults] = useState<FileUploadResult[]>([]);
  const { toast } = useToast();

  // Load files from storage
  const loadFiles = async () => {
    try {
      const result = await s3Storage.listFiles('dfs-manager/');
      if (result.success) {
        setFiles(result.data?.files || []);
        toast({
          title: "Files Loaded",
          description: `Found ${result.data?.files?.length || 0} files`
        });
      } else {
        throw new Error(result.error || 'Failed to load files');
      }
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error",
        description: "Failed to load files from storage",
        variant: "destructive"
      });
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    setUploadResults([]);

    try {
      const results: FileUploadResult[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const key = `dfs-manager/${Date.now()}-${file.name}`;
        
        const result = await uploadToS3(key, file, {
          'original-name': file.name,
          'upload-timestamp': new Date().toISOString(),
          'file-size': file.size.toString()
        });

        results.push({
          key,
          url: result.data?.url,
          error: result.error || undefined,
          success: result.success
        });
      }

      setUploadResults(results);
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.length - successCount;

      toast({
        title: "Upload Complete",
        description: `${successCount} files uploaded successfully${failCount > 0 ? `, ${failCount} failed` : ''}`,
        variant: failCount > 0 ? "destructive" : "default"
      });

      // Refresh file list
      await loadFiles();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload files",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Generate signed URL for file
  const generateSignedUrl = async (key: string) => {
    try {
      const result = await getS3SignedUrl(key, 'GET', 3600);
      if (result.success && result.data?.url) {
        // Copy to clipboard
        await navigator.clipboard.writeText(result.data.url);
        toast({
          title: "Signed URL Generated",
          description: "URL copied to clipboard (valid for 1 hour)"
        });
      } else {
        throw new Error(result.error || 'Failed to generate URL');
      }
    } catch (error) {
      console.error('Error generating signed URL:', error);
      toast({
        title: "Error",
        description: "Failed to generate signed URL",
        variant: "destructive"
      });
    }
  };

  // Delete file
  const deleteFile = async (key: string) => {
    try {
      const result = await s3Storage.deleteFile(key);
      if (result.success) {
        toast({
          title: "File Deleted",
          description: `File ${key} deleted successfully`
        });
        await loadFiles();
      } else {
        throw new Error(result.error || 'Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  // Test S3 connection
  const testConnection = async () => {
    setTesting(true);
    try {
      const results = await runAllS3Tests();
      setTestResults(results);
      
      toast({
        title: "S3 Tests Complete",
        description: "Check console for detailed results"
      });
    } catch (error) {
      console.error('Test error:', error);
      toast({
        title: "Test Error",
        description: "Failed to run S3 tests",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">S3 Storage Manager</h2>
          <p className="text-muted-foreground">
            Manage files using S3 protocol with Supabase Storage
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={testConnection} disabled={testing} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${testing ? 'animate-spin' : ''}`} />
            Test S3
          </Button>
          <Button onClick={loadFiles} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Configuration Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>S3 Endpoint:</strong> {import.meta.env.VITE_S3_ENDPOINT}<br />
          <strong>Region:</strong> {import.meta.env.VITE_S3_REGION}<br />
          <strong>Bucket:</strong> {import.meta.env.VITE_DEFAULT_STORAGE_BUCKET}
        </AlertDescription>
      </Alert>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Files
          </CardTitle>
          <CardDescription>
            Upload files to Supabase Storage using S3 protocol
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            
            {uploading && (
              <div className="text-center">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p>Uploading files...</p>
              </div>
            )}

            {uploadResults.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Upload Results:</h4>
                {uploadResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="truncate">{result.key}</span>
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "Success" : "Failed"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      <Card>
        <CardHeader>
          <CardTitle>Files in Storage</CardTitle>
          <CardDescription>
            Files stored in S3-compatible Supabase Storage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No files found. Upload some files to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium truncate">{file.Key}</p>
                    <p className="text-sm text-muted-foreground">
                      {file.Size} bytes • {new Date(file.LastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateSignedUrl(file.Key)}
                    >
                      <Link className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteFile(file.Key)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>S3 Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Connection Tests</h4>
                <div className="space-y-1">
                  {Object.entries(testResults.connection).map(([test, result]) => (
                    <div key={test} className="flex justify-between">
                      <span className="capitalize">{test.replace(/([A-Z])/g, ' $1')}</span>
                      <Badge variant={result ? "default" : "destructive"}>
                        {result ? "✅" : "❌"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Batch Upload</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Successful</span>
                    <Badge>{testResults.batch.successful.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Failed</span>
                    <Badge variant={testResults.batch.failed.length > 0 ? "destructive" : "default"}>
                      {testResults.batch.failed.length}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
