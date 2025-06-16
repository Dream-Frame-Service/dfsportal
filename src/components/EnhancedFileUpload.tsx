import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Camera, FileText, Image, X, RotateCcw, Check, Loader2, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { compressImage, formatFileSize, isImageFile, type CompressionResult } from '@/utils/imageCompression';

interface EnhancedFileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  currentFile?: string;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
  allowCamera?: boolean; // Option to disable camera for non-image uploads
}

const EnhancedFileUpload: React.FC<EnhancedFileUploadProps> = ({
  onFileSelect,
  accept = "image/*",
  label = "Upload File",
  currentFile,
  maxSize = 10,
  className = "",
  disabled = false,
  allowCamera = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();

  // Check if the accept type includes images
  const isImageUpload = accept.includes('image');
  const shouldShowCamera = allowCamera && isImageUpload;

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive"
      });
      return false;
    }

    // Check file type if accept is specified
    if (accept && accept !== "*/*") {
      const acceptedTypes = accept.split(',').map((type) => type.trim());
      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        } else if (type.includes('*')) {
          const baseType = type.split('/')[0];
          return file.type.startsWith(baseType);
        } else {
          return file.type === type;
        }
      });

      if (!isAccepted) {
        toast({
          title: "Invalid file type",
          description: `Please select a file of type: ${accept}`,
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const processFile = async (file: File) => {
    // Check if it's an image and larger than 1MB
    const needsCompression = isImageFile(file) && file.size > 1024 * 1024;

    if (needsCompression) {
      setIsCompressing(true);
      try {
        const result = await compressImage(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          quality: 0.8,
          initialQuality: 0.8
        });

        setCompressionResult(result);

        if (result.wasCompressed) {
          toast({
            title: "Image compressed",
            description: `File size reduced from ${formatFileSize(result.originalSize)} to ${formatFileSize(result.compressedSize)} (${result.compressionRatio.toFixed(1)}x smaller)`,
            duration: 5000
          });
        }

        onFileSelect(result.file);
        setIsOpen(false);
      } catch (error) {
        console.error('Compression failed:', error);
        toast({
          title: "Compression failed",
          description: "Using original file instead",
          variant: "destructive"
        });
        onFileSelect(file);
        setIsOpen(false);
      } finally {
        setIsCompressing(false);
      }
    } else {
      onFileSelect(file);
      setIsOpen(false);
      toast({
        title: "File selected",
        description: `${file.name} has been selected successfully`
      });
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      await processFile(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startCamera = async () => {
    setIsCameraLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'environment' // Use back camera on mobile if available
        }
      });

      setCameraStream(stream);
      setShowCamera(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to take photos",
        variant: "destructive"
      });
    } finally {
      setIsCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
    setCapturedImage(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
      }
    }
  };

  const confirmCapture = async () => {
    if (capturedImage && canvasRef.current) {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `captured-${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });

          if (validateFile(file)) {
            stopCamera();
            await processFile(file);
            toast({
              title: "Photo captured",
              description: "Photo has been captured successfully"
            });
          }
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const closeDialog = () => {
    stopCamera();
    setIsOpen(false);
  };

  const getFileIcon = () => {
    if (isImageUpload) {
      return <Image className="h-4 w-4" data-id="s00ni63sv" data-path="src/components/EnhancedFileUpload.tsx" />;
    }
    return <FileText className="h-4 w-4" data-id="qshbpzxgb" data-path="src/components/EnhancedFileUpload.tsx" />;
  };

  return (
    <div className={className} data-id="28a897lqr" data-path="src/components/EnhancedFileUpload.tsx">
      <Dialog open={isOpen} onOpenChange={setIsOpen} data-id="bepxqjckf" data-path="src/components/EnhancedFileUpload.tsx">
        <DialogTrigger asChild data-id="z3faij0d2" data-path="src/components/EnhancedFileUpload.tsx">
          <Button
            variant="outline"
            disabled={disabled}
            className="w-full flex items-center gap-2" data-id="t1rspq6qi" data-path="src/components/EnhancedFileUpload.tsx">

            {getFileIcon()}
            {label}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-id="9mn6e0kph" data-path="src/components/EnhancedFileUpload.tsx">
          <DialogHeader data-id="bt6bnsl33" data-path="src/components/EnhancedFileUpload.tsx">
            <DialogTitle className="flex items-center gap-2" data-id="t8cim5qfq" data-path="src/components/EnhancedFileUpload.tsx">
              {getFileIcon()}
              {label}
            </DialogTitle>
          </DialogHeader>

          {!showCamera ?
          <div className="space-y-4" data-id="ajndwulj2" data-path="src/components/EnhancedFileUpload.tsx">
              {/* Current file display */}
              {currentFile &&
            <Card data-id="6a3smxs3r" data-path="src/components/EnhancedFileUpload.tsx">
                  <CardContent className="p-4" data-id="pd6aksu51" data-path="src/components/EnhancedFileUpload.tsx">
                    <div className="flex items-center justify-between" data-id="i6hki4rpq" data-path="src/components/EnhancedFileUpload.tsx">
                      <span className="text-sm text-gray-600" data-id="szbtuxohh" data-path="src/components/EnhancedFileUpload.tsx">Current file:</span>
                      <Badge variant="secondary" data-id="iae45fgy2" data-path="src/components/EnhancedFileUpload.tsx">{currentFile}</Badge>
                    </div>
                  </CardContent>
                </Card>
            }

              {/* Upload options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="r9vlqzkb6" data-path="src/components/EnhancedFileUpload.tsx">
                {/* File upload option */}
                <Card className="cursor-pointer hover:bg-gray-50 transition-colors" data-id="h91w96m2g" data-path="src/components/EnhancedFileUpload.tsx">
                  <CardContent className="p-6" data-id="otelxb92x" data-path="src/components/EnhancedFileUpload.tsx">
                    <Button
                    variant="ghost"
                    className="w-full h-auto p-0 flex flex-col items-center gap-3"
                    onClick={() => fileInputRef.current?.click()} data-id="ge5fl7cm8" data-path="src/components/EnhancedFileUpload.tsx">

                      <div className="p-4 bg-blue-100 rounded-full" data-id="beki9ayfi" data-path="src/components/EnhancedFileUpload.tsx">
                        <Upload className="h-8 w-8 text-blue-600" data-id="uovt8mj4f" data-path="src/components/EnhancedFileUpload.tsx" />
                      </div>
                      <div className="text-center" data-id="vjfu6smw8" data-path="src/components/EnhancedFileUpload.tsx">
                        <h3 className="font-semibold" data-id="25bza49x8" data-path="src/components/EnhancedFileUpload.tsx">Upload From File</h3>
                        <p className="text-sm text-gray-500 mt-1" data-id="escx2h8bs" data-path="src/components/EnhancedFileUpload.tsx">
                          Choose a file from your device
                        </p>
                      </div>
                    </Button>
                  </CardContent>
                </Card>

                {/* Camera option */}
                {shouldShowCamera &&
              <Card className="cursor-pointer hover:bg-gray-50 transition-colors" data-id="afan0j4jm" data-path="src/components/EnhancedFileUpload.tsx">
                    <CardContent className="p-6" data-id="imwm0gy0s" data-path="src/components/EnhancedFileUpload.tsx">
                      <Button
                    variant="ghost"
                    className="w-full h-auto p-0 flex flex-col items-center gap-3"
                    onClick={startCamera}
                    disabled={isCameraLoading} data-id="b85cnn2vi" data-path="src/components/EnhancedFileUpload.tsx">

                        <div className="p-4 bg-green-100 rounded-full" data-id="lnix4ai1o" data-path="src/components/EnhancedFileUpload.tsx">
                          <Camera className="h-8 w-8 text-green-600" data-id="tncve2dth" data-path="src/components/EnhancedFileUpload.tsx" />
                        </div>
                        <div className="text-center" data-id="ebsr6zrgi" data-path="src/components/EnhancedFileUpload.tsx">
                          <h3 className="font-semibold" data-id="kzmlckl5i" data-path="src/components/EnhancedFileUpload.tsx">Take A Picture</h3>
                          <p className="text-sm text-gray-500 mt-1" data-id="54zw6iu52" data-path="src/components/EnhancedFileUpload.tsx">
                            {isCameraLoading ? 'Loading camera...' : 'Use your camera to capture'}
                          </p>
                        </div>
                      </Button>
                    </CardContent>
                </Card>
              }
              </div>

              {/* Compression status */}
              {isCompressing &&
            <Card className="border-blue-200 bg-blue-50" data-id="orgi2knzb" data-path="src/components/EnhancedFileUpload.tsx">
                  <CardContent className="p-4" data-id="u3nhnobw1" data-path="src/components/EnhancedFileUpload.tsx">
                    <div className="flex items-center gap-3" data-id="w58roef90" data-path="src/components/EnhancedFileUpload.tsx">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" data-id="3bbqg8m6o" data-path="src/components/EnhancedFileUpload.tsx" />
                      <div data-id="lzgckt22h" data-path="src/components/EnhancedFileUpload.tsx">
                        <p className="font-medium text-blue-800" data-id="jbnh98nc2" data-path="src/components/EnhancedFileUpload.tsx">Compressing image...</p>
                        <p className="text-sm text-blue-600" data-id="jjwtng8jt" data-path="src/components/EnhancedFileUpload.tsx">Optimizing file size for better performance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            }

              {/* File type info */}
              <div className="text-center text-sm text-gray-500" data-id="72b9ko7qb" data-path="src/components/EnhancedFileUpload.tsx">
                <p data-id="j5om62lms" data-path="src/components/EnhancedFileUpload.tsx">Accepted file types: {accept}</p>
                <p data-id="frapsjolz" data-path="src/components/EnhancedFileUpload.tsx">Maximum file size: {maxSize}MB</p>
                {isImageFile({ type: accept } as File) &&
              <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200" data-id="d6e1rbnh5" data-path="src/components/EnhancedFileUpload.tsx">
                    <div className="flex items-center justify-center gap-2 text-green-700" data-id="58uwv7s4q" data-path="src/components/EnhancedFileUpload.tsx">
                      <Zap className="h-4 w-4" data-id="eowz576wz" data-path="src/components/EnhancedFileUpload.tsx" />
                      <span className="text-xs font-medium" data-id="b7ml71nrw" data-path="src/components/EnhancedFileUpload.tsx">Auto-compression enabled for images &gt;1MB</span>
                    </div>
                  </div>
              }
              </div>
            </div> : (

          /* Camera interface */
          <div className="space-y-4" data-id="e9h50j0qb" data-path="src/components/EnhancedFileUpload.tsx">
              <div className="flex items-center justify-between" data-id="yjfg4olcu" data-path="src/components/EnhancedFileUpload.tsx">
                <h3 className="text-lg font-semibold" data-id="wavuww0ah" data-path="src/components/EnhancedFileUpload.tsx">Camera</h3>
                <Button variant="ghost" size="sm" onClick={closeDialog} data-id="2pefry38n" data-path="src/components/EnhancedFileUpload.tsx">
                  <X className="h-4 w-4" data-id="4lgdm8ags" data-path="src/components/EnhancedFileUpload.tsx" />
                </Button>
              </div>

              <div className="relative bg-black rounded-lg overflow-hidden" data-id="l1bwqp81w" data-path="src/components/EnhancedFileUpload.tsx">
                {!capturedImage ?
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 md:h-96 object-cover" data-id="v9u3clu7c" data-path="src/components/EnhancedFileUpload.tsx" /> :


              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-64 md:h-96 object-cover" data-id="5if3pxpxy" data-path="src/components/EnhancedFileUpload.tsx" />

              }
                
                {/* Hidden canvas for capture */}
                <canvas ref={canvasRef} className="hidden" data-id="tlhxi398w" data-path="src/components/EnhancedFileUpload.tsx" />
              </div>

              <div className="flex justify-center gap-4" data-id="6yfmmbhry" data-path="src/components/EnhancedFileUpload.tsx">
                {!capturedImage ?
              <>
                    <Button onClick={capturePhoto} className="flex items-center gap-2" data-id="2ei8u6uhx" data-path="src/components/EnhancedFileUpload.tsx">
                      <Camera className="h-4 w-4" data-id="gy6hdxk3j" data-path="src/components/EnhancedFileUpload.tsx" />
                      Capture
                    </Button>
                    <Button variant="outline" onClick={stopCamera} data-id="18j6yyzci" data-path="src/components/EnhancedFileUpload.tsx">
                      Cancel
                    </Button>
                  </> :

              <>
                    <Button onClick={confirmCapture} className="flex items-center gap-2" data-id="ayvxnzku1" data-path="src/components/EnhancedFileUpload.tsx">
                      <Check className="h-4 w-4" data-id="tfsxgolu8" data-path="src/components/EnhancedFileUpload.tsx" />
                      Use This Photo
                    </Button>
                    <Button variant="outline" onClick={retakePhoto} className="flex items-center gap-2" data-id="dbatyj76m" data-path="src/components/EnhancedFileUpload.tsx">
                      <RotateCcw className="h-4 w-4" data-id="3u9t16jif" data-path="src/components/EnhancedFileUpload.tsx" />
                      Retake
                    </Button>
                  </>
              }
              </div>
            </div>)
          }
        </DialogContent>
      </Dialog>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden" data-id="y897ysif0" data-path="src/components/EnhancedFileUpload.tsx" />

    </div>);

};

export default EnhancedFileUpload;
