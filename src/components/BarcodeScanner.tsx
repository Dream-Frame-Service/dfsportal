import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ComponentErrorBoundary } from './ErrorBoundary';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  triggerText?: string;
  disabled?: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, triggerText = "Scan Barcode", disabled = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions."
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsScanning(false);
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        // Simple barcode detection simulation
        // In a real implementation, you would use a library like ZXing or QuaggaJS
        const simulatedBarcode = Math.random().toString(36).substr(2, 12).toUpperCase();
        onScan(simulatedBarcode);
        setIsOpen(false);
        stopCamera();

        toast({
          title: "Barcode Scanned",
          description: `Detected barcode: ${simulatedBarcode}`
        });
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  return (
    <ComponentErrorBoundary
      componentName="BarcodeScanner"
      severity="medium"
      minHeight="200px" data-id="3pibg6ms7" data-path="src/components/BarcodeScanner.tsx">

      <Dialog open={isOpen} onOpenChange={setIsOpen} data-id="39q67l96m" data-path="src/components/BarcodeScanner.tsx">
      <DialogTrigger asChild data-id="avk5syt1n" data-path="src/components/BarcodeScanner.tsx">
        <Button type="button" variant="outline" size="sm" disabled={disabled} data-id="y6ol20tpr" data-path="src/components/BarcodeScanner.tsx">
          <Camera className="w-4 h-4 mr-2" data-id="st0einn3s" data-path="src/components/BarcodeScanner.tsx" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" data-id="3crr5yoy5" data-path="src/components/BarcodeScanner.tsx">
        <DialogHeader data-id="pcs34g8fb" data-path="src/components/BarcodeScanner.tsx">
          <DialogTitle data-id="vr2r4ah79" data-path="src/components/BarcodeScanner.tsx">Scan Barcode</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4" data-id="m2yxl59b5" data-path="src/components/BarcodeScanner.tsx">
          <div className="relative w-full max-w-sm aspect-video bg-black rounded-lg overflow-hidden" data-id="jv41adqnn" data-path="src/components/BarcodeScanner.tsx">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover" data-id="umo9yuczd" data-path="src/components/BarcodeScanner.tsx" />

            <canvas
                ref={canvasRef}
                className="hidden" data-id="1zqrqnpg4" data-path="src/components/BarcodeScanner.tsx" />

            {!isScanning &&
              <div className="absolute inset-0 flex items-center justify-center text-white" data-id="4n61y3quc" data-path="src/components/BarcodeScanner.tsx">
                <div className="text-center" data-id="0yw8fuk6s" data-path="src/components/BarcodeScanner.tsx">
                  <Camera className="w-12 h-12 mx-auto mb-2" data-id="blxgzp25x" data-path="src/components/BarcodeScanner.tsx" />
                  <p data-id="ebyr1flvg" data-path="src/components/BarcodeScanner.tsx">Initializing camera...</p>
                </div>
              </div>
              }
          </div>
          <div className="flex space-x-2" data-id="ga2zy4vyi" data-path="src/components/BarcodeScanner.tsx">
            <Button onClick={captureFrame} disabled={!isScanning} data-id="gdiold53r" data-path="src/components/BarcodeScanner.tsx">
              Capture
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} data-id="6hay25d0q" data-path="src/components/BarcodeScanner.tsx">
              <X className="w-4 h-4 mr-2" data-id="62fns4deb" data-path="src/components/BarcodeScanner.tsx" />
              Cancel
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-center" data-id="ypqys8ed6" data-path="src/components/BarcodeScanner.tsx">
            Position the barcode within the camera view and click Capture
          </p>
        </div>
      </DialogContent>
      </Dialog>
    </ComponentErrorBoundary>);


};

export default BarcodeScanner;