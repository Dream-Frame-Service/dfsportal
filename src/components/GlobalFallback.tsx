import { Button } from '@/components/ui/button';

const GlobalFallback: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
    <h1 className="text-xl font-semibold text-gray-800">
      Oops, something went wrong.
    </h1>
    <Button onClick={() => window.location.reload()}>
      Reload page
    </Button>
  </div>
);

export default GlobalFallback;
