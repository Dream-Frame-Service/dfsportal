import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Database, Zap, Clock, TrendingUp, Trash2, RefreshCw, Activity, HardDrive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'motion/react';

interface CacheEntry {
  key: string;
  data: any;
  timestamp: Date;
  lastAccessed: Date;
  accessCount: number;
  ttl: number;
  size: number;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  source: string;
}

interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  evictionCount: number;
  prefetchHits: number;
  memoryUsage: number;
  averageAccessTime: number;
}

interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  evictionPolicy: 'lru' | 'lfu' | 'ttl' | 'priority';
  prefetchEnabled: boolean;
  compressionEnabled: boolean;
  persistToDisk: boolean;
  maxMemoryUsage: number;
}

const IntelligentCacheManager: React.FC = () => {
  const [cacheEntries, setCacheEntries] = useState<CacheEntry[]>([]);
  const [cacheStats, setCacheStats] = useState<CacheStats>({
    totalEntries: 0,
    totalSize: 0,
    hitRate: 0,
    missRate: 0,
    evictionCount: 0,
    prefetchHits: 0,
    memoryUsage: 0,
    averageAccessTime: 0
  });
  const [config, setConfig] = useState<CacheConfig>({
    maxSize: 1000,
    defaultTTL: 300000, // 5 minutes
    evictionPolicy: 'lru',
    prefetchEnabled: true,
    compressionEnabled: true,
    persistToDisk: false,
    maxMemoryUsage: 100 // MB
  });
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [filterTag, setFilterTag] = useState('');
  const [sortBy, setSortBy] = useState<'timestamp' | 'accessed' | 'count' | 'size'>('accessed');
  const intervalRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Simulate cache operations
  useEffect(() => {
    if (isMonitoring) {
      intervalRef.current = setInterval(() => {
        simulateCacheActivity();
        updateCacheStats();
        performMaintenance();
      }, 2000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMonitoring, config]);

  const simulateCacheActivity = useCallback(() => {
    // Simulate random cache access and updates
    if (Math.random() < 0.3) {
      addCacheEntry();
    }

    if (Math.random() < 0.5 && cacheEntries.length > 0) {
      accessRandomEntry();
    }

    if (Math.random() < 0.1) {
      prefetchData();
    }
  }, [cacheEntries]);

  const addCacheEntry = () => {
    const tables = ['products', 'employees', 'sales', 'orders', 'licenses'];
    const operations = ['list', 'detail', 'search', 'filter'];
    const table = tables[Math.floor(Math.random() * tables.length)];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    const entry: CacheEntry = {
      key: `${table}_${operation}_${Date.now()}`,
      data: generateMockData(table),
      timestamp: new Date(),
      lastAccessed: new Date(),
      accessCount: 1,
      ttl: config.defaultTTL,
      size: Math.floor(Math.random() * 50000) + 1000, // 1KB to 50KB
      tags: [table, operation],
      priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
      source: 'api'
    };

    setCacheEntries((prev) => {
      const newEntries = [entry, ...prev];
      // Apply eviction policy if needed
      return applyEvictionPolicy(newEntries);
    });
  };

  const generateMockData = (table: string) => {
    const mockData = {
      products: { id: 1, name: 'Sample Product', price: 9.99, category: 'Electronics' },
      employees: { id: 1, name: 'John Doe', position: 'Manager', station: 'MOBIL' },
      sales: { id: 1, total: 150.00, date: new Date().toISOString() },
      orders: { id: 1, status: 'pending', amount: 75.50 },
      licenses: { id: 1, name: 'Business License', expiry: '2024-12-31' }
    };

    return mockData[table as keyof typeof mockData] || { id: 1, data: 'sample' };
  };

  const accessRandomEntry = () => {
    const randomIndex = Math.floor(Math.random() * cacheEntries.length);
    const entry = cacheEntries[randomIndex];

    setCacheEntries((prev) => prev.map((e, index) =>
    index === randomIndex ?
    {
      ...e,
      lastAccessed: new Date(),
      accessCount: e.accessCount + 1
    } :
    e
    ));
  };

  const prefetchData = () => {
    if (!config.prefetchEnabled) return;

    // Simulate prefetching related data
    const relatedTables = ['vendors', 'categories', 'reports'];
    const table = relatedTables[Math.floor(Math.random() * relatedTables.length)];

    const prefetchEntry: CacheEntry = {
      key: `prefetch_${table}_${Date.now()}`,
      data: generateMockData(table),
      timestamp: new Date(),
      lastAccessed: new Date(),
      accessCount: 0,
      ttl: config.defaultTTL * 0.5, // Shorter TTL for prefetched data
      size: Math.floor(Math.random() * 20000) + 500,
      tags: [table, 'prefetch'],
      priority: 'low',
      source: 'prefetch'
    };

    setCacheEntries((prev) => [prefetchEntry, ...prev]);
  };

  const applyEvictionPolicy = (entries: CacheEntry[]): CacheEntry[] => {
    if (entries.length <= config.maxSize) return entries;

    const sortedEntries = [...entries];

    switch (config.evictionPolicy) {
      case 'lru':
        sortedEntries.sort((a, b) => a.lastAccessed.getTime() - b.lastAccessed.getTime());
        break;
      case 'lfu':
        sortedEntries.sort((a, b) => a.accessCount - b.accessCount);
        break;
      case 'ttl':
        sortedEntries.sort((a, b) => a.timestamp.getTime() + a.ttl - (b.timestamp.getTime() + b.ttl));
        break;
      case 'priority': {
        const priorityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
        sortedEntries.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      }
    }

    const evicted = sortedEntries.slice(0, sortedEntries.length - config.maxSize);
    setCacheStats((prev) => ({ ...prev, evictionCount: prev.evictionCount + evicted.length }));

    return sortedEntries.slice(sortedEntries.length - config.maxSize);
  };

  const performMaintenance = () => {
    const now = new Date();

    // Remove expired entries
    setCacheEntries((prev) => {
      const validEntries = prev.filter((entry) => {
        const isExpired = now.getTime() - entry.timestamp.getTime() > entry.ttl;
        return !isExpired;
      });

      const expiredCount = prev.length - validEntries.length;
      if (expiredCount > 0) {
        setCacheStats((prevStats) => ({
          ...prevStats,
          evictionCount: prevStats.evictionCount + expiredCount
        }));
      }

      return validEntries;
    });
  };

  const updateCacheStats = () => {
    const totalSize = cacheEntries.reduce((sum, entry) => sum + entry.size, 0);
    const totalAccess = cacheEntries.reduce((sum, entry) => sum + entry.accessCount, 0);
    const prefetchHits = cacheEntries.filter((e) => e.source === 'prefetch' && e.accessCount > 0).length;

    setCacheStats((prev) => ({
      ...prev,
      totalEntries: cacheEntries.length,
      totalSize,
      hitRate: Math.random() * 20 + 80, // Simulate 80-100% hit rate
      missRate: Math.random() * 20, // Simulate 0-20% miss rate
      prefetchHits,
      memoryUsage: totalSize / 1024 / 1024, // Convert to MB
      averageAccessTime: Math.random() * 50 + 10 // 10-60ms
    }));
  };

  const clearCache = () => {
    setCacheEntries([]);
    setCacheStats((prev) => ({ ...prev, evictionCount: prev.evictionCount + prev.totalEntries }));
    toast({
      title: "Cache Cleared",
      description: "All cache entries have been removed"
    });
  };

  const invalidateTag = (tag: string) => {
    const before = cacheEntries.length;
    setCacheEntries((prev) => prev.filter((entry) => !entry.tags.includes(tag)));
    const after = cacheEntries.filter((entry) => !entry.tags.includes(tag)).length;

    toast({
      title: "Tag Invalidated",
      description: `Removed ${before - after} entries with tag "${tag}"`
    });
  };

  const refreshEntry = async (key: string) => {
    setCacheEntries((prev) => prev.map((entry) =>
    entry.key === key ?
    {
      ...entry,
      timestamp: new Date(),
      lastAccessed: new Date(),
      accessCount: entry.accessCount + 1
    } :
    entry
    ));

    toast({
      title: "Entry Refreshed",
      description: `Updated cache entry: ${key}`
    });
  };

  const getFilteredEntries = () => {
    let filtered = cacheEntries;

    if (filterTag) {
      filtered = filtered.filter((entry) =>
      entry.tags.some((tag) => tag.toLowerCase().includes(filterTag.toLowerCase()))
      );
    }

    // Sort entries
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'accessed':
          return b.lastAccessed.getTime() - a.lastAccessed.getTime();
        case 'count':
          return b.accessCount - a.accessCount;
        case 'size':
          return b.size - a.size;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':return 'bg-gray-500';
      case 'medium':return 'bg-blue-500';
      case 'high':return 'bg-orange-500';
      case 'critical':return 'bg-red-500';
      default:return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6" data-id="qy5kgnhq7" data-path="src/components/IntelligentCacheManager.tsx">
      {/* Header Stats */}
      <Card data-id="i3qi0yft9" data-path="src/components/IntelligentCacheManager.tsx">
        <CardHeader data-id="bwcl0j1fa" data-path="src/components/IntelligentCacheManager.tsx">
          <div className="flex items-center justify-between" data-id="6utqrs49a" data-path="src/components/IntelligentCacheManager.tsx">
            <CardTitle className="flex items-center gap-2" data-id="86ufggteq" data-path="src/components/IntelligentCacheManager.tsx">
              <Database className="h-5 w-5" data-id="dmz1copkb" data-path="src/components/IntelligentCacheManager.tsx" />
              Intelligent Cache Manager
            </CardTitle>
            <div className="flex items-center gap-2" data-id="rxnnpwxaw" data-path="src/components/IntelligentCacheManager.tsx">
              <Badge variant={isMonitoring ? "default" : "secondary"} data-id="htmssuar6" data-path="src/components/IntelligentCacheManager.tsx">
                {isMonitoring ? "Monitoring" : "Paused"}
              </Badge>
              <Button
                onClick={() => setIsMonitoring(!isMonitoring)}
                variant={isMonitoring ? "destructive" : "default"}
                size="sm" data-id="xikojxmrb" data-path="src/components/IntelligentCacheManager.tsx">

                {isMonitoring ? "Pause" : "Start"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent data-id="ux5bz8ljr" data-path="src/components/IntelligentCacheManager.tsx">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4" data-id="mz90qem8u" data-path="src/components/IntelligentCacheManager.tsx">
            <div className="text-center" data-id="4b4af6s2d" data-path="src/components/IntelligentCacheManager.tsx">
              <div className="text-2xl font-bold text-blue-600" data-id="iyemje83w" data-path="src/components/IntelligentCacheManager.tsx">{cacheStats.totalEntries}</div>
              <div className="text-sm text-gray-600" data-id="ur3cx6qr3" data-path="src/components/IntelligentCacheManager.tsx">Entries</div>
            </div>
            <div className="text-center" data-id="awzm22ep1" data-path="src/components/IntelligentCacheManager.tsx">
              <div className="text-2xl font-bold text-green-600" data-id="ed4thwzfr" data-path="src/components/IntelligentCacheManager.tsx">{formatSize(cacheStats.totalSize)}</div>
              <div className="text-sm text-gray-600" data-id="qss5rkssl" data-path="src/components/IntelligentCacheManager.tsx">Total Size</div>
            </div>
            <div className="text-center" data-id="xaygl9n6s" data-path="src/components/IntelligentCacheManager.tsx">
              <div className="text-2xl font-bold text-purple-600" data-id="t21dy30h4" data-path="src/components/IntelligentCacheManager.tsx">{cacheStats.hitRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600" data-id="mpj5wux8j" data-path="src/components/IntelligentCacheManager.tsx">Hit Rate</div>
            </div>
            <div className="text-center" data-id="4fcttngu9" data-path="src/components/IntelligentCacheManager.tsx">
              <div className="text-2xl font-bold text-orange-600" data-id="lyxhjv98r" data-path="src/components/IntelligentCacheManager.tsx">{cacheStats.missRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600" data-id="ghkt1ivcl" data-path="src/components/IntelligentCacheManager.tsx">Miss Rate</div>
            </div>
            <div className="text-center" data-id="e0bzwmva2" data-path="src/components/IntelligentCacheManager.tsx">
              <div className="text-2xl font-bold text-red-600" data-id="mwooenjdx" data-path="src/components/IntelligentCacheManager.tsx">{cacheStats.evictionCount}</div>
              <div className="text-sm text-gray-600" data-id="4il7my1ek" data-path="src/components/IntelligentCacheManager.tsx">Evictions</div>
            </div>
            <div className="text-center" data-id="tfccxr5p6" data-path="src/components/IntelligentCacheManager.tsx">
              <div className="text-2xl font-bold text-indigo-600" data-id="j3cgltf3r" data-path="src/components/IntelligentCacheManager.tsx">{cacheStats.prefetchHits}</div>
              <div className="text-sm text-gray-600" data-id="qer74qobs" data-path="src/components/IntelligentCacheManager.tsx">Prefetch Hits</div>
            </div>
            <div className="text-center" data-id="phvje512c" data-path="src/components/IntelligentCacheManager.tsx">
              <div className="text-2xl font-bold text-pink-600" data-id="6rzz3y64t" data-path="src/components/IntelligentCacheManager.tsx">{cacheStats.memoryUsage.toFixed(1)} MB</div>
              <div className="text-sm text-gray-600" data-id="nffvicjiu" data-path="src/components/IntelligentCacheManager.tsx">Memory</div>
            </div>
            <div className="text-center" data-id="au4h0zdel" data-path="src/components/IntelligentCacheManager.tsx">
              <div className="text-2xl font-bold text-teal-600" data-id="9d2a0z0im" data-path="src/components/IntelligentCacheManager.tsx">{cacheStats.averageAccessTime.toFixed(0)}ms</div>
              <div className="text-sm text-gray-600" data-id="1kv8j18q2" data-path="src/components/IntelligentCacheManager.tsx">Avg Access</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="entries" className="w-full" data-id="jlox2ywyy" data-path="src/components/IntelligentCacheManager.tsx">
        <TabsList className="grid w-full grid-cols-3" data-id="26cz1x8hs" data-path="src/components/IntelligentCacheManager.tsx">
          <TabsTrigger value="entries" data-id="6etj4n95n" data-path="src/components/IntelligentCacheManager.tsx">Cache Entries ({cacheEntries.length})</TabsTrigger>
          <TabsTrigger value="analytics" data-id="fe27ckk1l" data-path="src/components/IntelligentCacheManager.tsx">Analytics</TabsTrigger>
          <TabsTrigger value="settings" data-id="pzukcmww2" data-path="src/components/IntelligentCacheManager.tsx">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4" data-id="tc73vlj59" data-path="src/components/IntelligentCacheManager.tsx">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between" data-id="3okovlbt2" data-path="src/components/IntelligentCacheManager.tsx">
            <div className="flex gap-2" data-id="6a433gxcl" data-path="src/components/IntelligentCacheManager.tsx">
              <Input
                placeholder="Filter by tag..."
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="w-48" data-id="81kdh8sv8" data-path="src/components/IntelligentCacheManager.tsx" />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-md" data-id="bz8czthra" data-path="src/components/IntelligentCacheManager.tsx">

                <option value="accessed" data-id="cefl7d6ik" data-path="src/components/IntelligentCacheManager.tsx">Last Accessed</option>
                <option value="timestamp" data-id="kanbxjucq" data-path="src/components/IntelligentCacheManager.tsx">Created</option>
                <option value="count" data-id="tchtj0g66" data-path="src/components/IntelligentCacheManager.tsx">Access Count</option>
                <option value="size" data-id="w3h6x8far" data-path="src/components/IntelligentCacheManager.tsx">Size</option>
              </select>
            </div>
            <div className="flex gap-2" data-id="y5ds6fpji" data-path="src/components/IntelligentCacheManager.tsx">
              <Button size="sm" variant="outline" onClick={clearCache} data-id="ss1crxxpt" data-path="src/components/IntelligentCacheManager.tsx">
                <Trash2 className="h-4 w-4 mr-1" data-id="g6ue7xqei" data-path="src/components/IntelligentCacheManager.tsx" />
                Clear All
              </Button>
              <Button size="sm" variant="outline" onClick={() => invalidateTag('products')} data-id="avsywgrk9" data-path="src/components/IntelligentCacheManager.tsx">
                Invalidate Products
              </Button>
            </div>
          </div>

          <ScrollArea className="h-96" data-id="a0aa4ue0u" data-path="src/components/IntelligentCacheManager.tsx">
            <div className="space-y-3" data-id="v8bkm9l17" data-path="src/components/IntelligentCacheManager.tsx">
              <AnimatePresence data-id="qsbjlsvfi" data-path="src/components/IntelligentCacheManager.tsx">
                {getFilteredEntries().map((entry, index) =>
                <motion.div
                  key={entry.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.02 }} data-id="nc88qo7if" data-path="src/components/IntelligentCacheManager.tsx">

                    <Card className="border-l-4" style={{ borderLeftColor: getPriorityColor(entry.priority).replace('bg-', '#') }} data-id="lm0l5epys" data-path="src/components/IntelligentCacheManager.tsx">
                      <CardContent className="pt-4" data-id="vvbq1wa5q" data-path="src/components/IntelligentCacheManager.tsx">
                        <div className="flex items-center justify-between mb-3" data-id="qwlzss7j4" data-path="src/components/IntelligentCacheManager.tsx">
                          <div className="flex items-center gap-3" data-id="1i8cc8yv7" data-path="src/components/IntelligentCacheManager.tsx">
                            <div className="flex items-center gap-2" data-id="o894m8r4h" data-path="src/components/IntelligentCacheManager.tsx">
                              {entry.source === 'prefetch' && <Zap className="h-4 w-4 text-yellow-500" data-id="fk6cdr3l5" data-path="src/components/IntelligentCacheManager.tsx" />}
                              {entry.source === 'api' && <Database className="h-4 w-4 text-blue-500" data-id="4ty1mxgxq" data-path="src/components/IntelligentCacheManager.tsx" />}
                              <div data-id="f9kbjez0o" data-path="src/components/IntelligentCacheManager.tsx">
                                <p className="font-medium text-sm" data-id="u3c49jm45" data-path="src/components/IntelligentCacheManager.tsx">{entry.key}</p>
                                <p className="text-xs text-gray-600" data-id="4b1uko0xi" data-path="src/components/IntelligentCacheManager.tsx">
                                  {entry.source} • {formatSize(entry.size)} • {entry.accessCount} hits
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2" data-id="ah8xqhrlf" data-path="src/components/IntelligentCacheManager.tsx">
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(entry.priority)} text-white`} data-id="nf4pf1czu" data-path="src/components/IntelligentCacheManager.tsx">
                              {entry.priority}
                            </Badge>
                            <Button
                            size="sm"
                            variant="outline"
                            onClick={() => refreshEntry(entry.key)} data-id="q6mapya1s" data-path="src/components/IntelligentCacheManager.tsx">

                              <RefreshCw className="h-3 w-3" data-id="jctevgd59" data-path="src/components/IntelligentCacheManager.tsx" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs" data-id="jq7z259sg" data-path="src/components/IntelligentCacheManager.tsx">
                          <div data-id="mhhg5ixe4" data-path="src/components/IntelligentCacheManager.tsx">
                            <p className="font-medium" data-id="hjk51zv0f" data-path="src/components/IntelligentCacheManager.tsx">Created:</p>
                            <p data-id="g81q8d95j" data-path="src/components/IntelligentCacheManager.tsx">{entry.timestamp.toLocaleTimeString()}</p>
                          </div>
                          <div data-id="uobl6omh4" data-path="src/components/IntelligentCacheManager.tsx">
                            <p className="font-medium" data-id="gskjw3zh9" data-path="src/components/IntelligentCacheManager.tsx">Last Accessed:</p>
                            <p data-id="54o2fxf09" data-path="src/components/IntelligentCacheManager.tsx">{entry.lastAccessed.toLocaleTimeString()}</p>
                          </div>
                          <div data-id="wh98vlyde" data-path="src/components/IntelligentCacheManager.tsx">
                            <p className="font-medium" data-id="ng4djyy4q" data-path="src/components/IntelligentCacheManager.tsx">TTL Remaining:</p>
                            <p data-id="wg8dd9xn6" data-path="src/components/IntelligentCacheManager.tsx">{Math.max(0, Math.round((entry.ttl - (Date.now() - entry.timestamp.getTime())) / 1000))}s</p>
                          </div>
                          <div data-id="hvzwsrepe" data-path="src/components/IntelligentCacheManager.tsx">
                            <p className="font-medium" data-id="qwqwobwg0" data-path="src/components/IntelligentCacheManager.tsx">Tags:</p>
                            <div className="flex gap-1 mt-1" data-id="wcqqkfkxe" data-path="src/components/IntelligentCacheManager.tsx">
                              {entry.tags.map((tag) =>
                            <Badge key={tag} variant="secondary" className="text-xs" data-id="z9ybus3u1" data-path="src/components/IntelligentCacheManager.tsx">
                                  {tag}
                                </Badge>
                            )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3" data-id="gdr9cha9f" data-path="src/components/IntelligentCacheManager.tsx">
                          <div className="flex justify-between text-xs mb-1" data-id="fkdgotrkd" data-path="src/components/IntelligentCacheManager.tsx">
                            <span data-id="4xy7k61f5" data-path="src/components/IntelligentCacheManager.tsx">TTL Progress</span>
                            <span data-id="bm6z3yhtv" data-path="src/components/IntelligentCacheManager.tsx">{Math.round((Date.now() - entry.timestamp.getTime()) / entry.ttl * 100)}%</span>
                          </div>
                          <Progress
                          value={(Date.now() - entry.timestamp.getTime()) / entry.ttl * 100}
                          className="h-1" data-id="jr7o75gbl" data-path="src/components/IntelligentCacheManager.tsx" />

                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4" data-id="ztufffekx" data-path="src/components/IntelligentCacheManager.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="a3psant25" data-path="src/components/IntelligentCacheManager.tsx">
            <Card data-id="bw0v8nuhg" data-path="src/components/IntelligentCacheManager.tsx">
              <CardHeader data-id="dawxaxrng" data-path="src/components/IntelligentCacheManager.tsx">
                <CardTitle className="flex items-center gap-2" data-id="671zvjn5x" data-path="src/components/IntelligentCacheManager.tsx">
                  <TrendingUp className="h-5 w-5" data-id="5b0ywb9yx" data-path="src/components/IntelligentCacheManager.tsx" />
                  Cache Performance
                </CardTitle>
              </CardHeader>
              <CardContent data-id="wbe2jnv8q" data-path="src/components/IntelligentCacheManager.tsx">
                <div className="space-y-4" data-id="1ozap2v1l" data-path="src/components/IntelligentCacheManager.tsx">
                  <div data-id="hn0tjowux" data-path="src/components/IntelligentCacheManager.tsx">
                    <div className="flex justify-between mb-2" data-id="0ot6rawji" data-path="src/components/IntelligentCacheManager.tsx">
                      <span data-id="pb06eed5r" data-path="src/components/IntelligentCacheManager.tsx">Hit Rate</span>
                      <span data-id="ejm5593kl" data-path="src/components/IntelligentCacheManager.tsx">{cacheStats.hitRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={cacheStats.hitRate} className="h-3" data-id="oqe4t3yxq" data-path="src/components/IntelligentCacheManager.tsx" />
                  </div>
                  <div data-id="dpeh5hvsa" data-path="src/components/IntelligentCacheManager.tsx">
                    <div className="flex justify-between mb-2" data-id="vt6sznaw4" data-path="src/components/IntelligentCacheManager.tsx">
                      <span data-id="7ssbrwakr" data-path="src/components/IntelligentCacheManager.tsx">Memory Usage</span>
                      <span data-id="t79oagczo" data-path="src/components/IntelligentCacheManager.tsx">{cacheStats.memoryUsage.toFixed(1)} / {config.maxMemoryUsage} MB</span>
                    </div>
                    <Progress value={cacheStats.memoryUsage / config.maxMemoryUsage * 100} className="h-3" data-id="7bufmotrd" data-path="src/components/IntelligentCacheManager.tsx" />
                  </div>
                  <div data-id="o7ujo9mi0" data-path="src/components/IntelligentCacheManager.tsx">
                    <div className="flex justify-between mb-2" data-id="v1mgx06y2" data-path="src/components/IntelligentCacheManager.tsx">
                      <span data-id="49bj768cx" data-path="src/components/IntelligentCacheManager.tsx">Cache Utilization</span>
                      <span data-id="fw3hzocpy" data-path="src/components/IntelligentCacheManager.tsx">{cacheStats.totalEntries} / {config.maxSize}</span>
                    </div>
                    <Progress value={cacheStats.totalEntries / config.maxSize * 100} className="h-3" data-id="bbdab8ssx" data-path="src/components/IntelligentCacheManager.tsx" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-id="ydlclac37" data-path="src/components/IntelligentCacheManager.tsx">
              <CardHeader data-id="wox3soblo" data-path="src/components/IntelligentCacheManager.tsx">
                <CardTitle className="flex items-center gap-2" data-id="cvzgh4tmx" data-path="src/components/IntelligentCacheManager.tsx">
                  <Activity className="h-5 w-5" data-id="7ndr8kwfw" data-path="src/components/IntelligentCacheManager.tsx" />
                  Activity Metrics
                </CardTitle>
              </CardHeader>
              <CardContent data-id="kpbwvc98m" data-path="src/components/IntelligentCacheManager.tsx">
                <div className="space-y-4" data-id="8883xbscs" data-path="src/components/IntelligentCacheManager.tsx">
                  <div className="flex justify-between" data-id="o3p5jikbx" data-path="src/components/IntelligentCacheManager.tsx">
                    <span data-id="yyosxz1cl" data-path="src/components/IntelligentCacheManager.tsx">Average Access Time:</span>
                    <Badge variant="outline" data-id="0zs6yz3vk" data-path="src/components/IntelligentCacheManager.tsx">{cacheStats.averageAccessTime.toFixed(0)}ms</Badge>
                  </div>
                  <div className="flex justify-between" data-id="l28besnfd" data-path="src/components/IntelligentCacheManager.tsx">
                    <span data-id="he4c77x4a" data-path="src/components/IntelligentCacheManager.tsx">Prefetch Success:</span>
                    <Badge variant="outline" data-id="1s3r2vudw" data-path="src/components/IntelligentCacheManager.tsx">{cacheStats.prefetchHits} hits</Badge>
                  </div>
                  <div className="flex justify-between" data-id="672pcgwto" data-path="src/components/IntelligentCacheManager.tsx">
                    <span data-id="ca6hn2wfa" data-path="src/components/IntelligentCacheManager.tsx">Total Evictions:</span>
                    <Badge variant="outline" data-id="yhdvh9ksi" data-path="src/components/IntelligentCacheManager.tsx">{cacheStats.evictionCount}</Badge>
                  </div>
                  <div className="flex justify-between" data-id="hpbwdmwok" data-path="src/components/IntelligentCacheManager.tsx">
                    <span data-id="yjmrr1a3v" data-path="src/components/IntelligentCacheManager.tsx">Cache Efficiency:</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800" data-id="k9e6leyv1" data-path="src/components/IntelligentCacheManager.tsx">
                      {((cacheStats.hitRate - cacheStats.missRate) / 100 * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4" data-id="l31hp7gea" data-path="src/components/IntelligentCacheManager.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="mqj7sw08n" data-path="src/components/IntelligentCacheManager.tsx">
            <Card data-id="8w6k10n9c" data-path="src/components/IntelligentCacheManager.tsx">
              <CardHeader data-id="s4yujv0rk" data-path="src/components/IntelligentCacheManager.tsx">
                <CardTitle data-id="7o7vavc4d" data-path="src/components/IntelligentCacheManager.tsx">Cache Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-id="p1xfzserj" data-path="src/components/IntelligentCacheManager.tsx">
                <div className="space-y-2" data-id="rx5xj2bb4" data-path="src/components/IntelligentCacheManager.tsx">
                  <Label data-id="ixe500hj3" data-path="src/components/IntelligentCacheManager.tsx">Max Cache Size: {config.maxSize} entries</Label>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={config.maxSize}
                    onChange={(e) => setConfig((prev) => ({ ...prev, maxSize: Number(e.target.value) }))}
                    className="w-full" data-id="c58lji8ot" data-path="src/components/IntelligentCacheManager.tsx" />

                </div>

                <div className="space-y-2" data-id="vybsb1o1e" data-path="src/components/IntelligentCacheManager.tsx">
                  <Label data-id="rg66j4aoy" data-path="src/components/IntelligentCacheManager.tsx">Default TTL: {Math.round(config.defaultTTL / 1000)}s</Label>
                  <input
                    type="range"
                    min="30"
                    max="3600"
                    step="30"
                    value={config.defaultTTL / 1000}
                    onChange={(e) => setConfig((prev) => ({ ...prev, defaultTTL: Number(e.target.value) * 1000 }))}
                    className="w-full" data-id="8wfit2vqg" data-path="src/components/IntelligentCacheManager.tsx" />

                </div>

                <div className="space-y-2" data-id="9pipg45jt" data-path="src/components/IntelligentCacheManager.tsx">
                  <Label data-id="vu5fa2pay" data-path="src/components/IntelligentCacheManager.tsx">Max Memory Usage: {config.maxMemoryUsage} MB</Label>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={config.maxMemoryUsage}
                    onChange={(e) => setConfig((prev) => ({ ...prev, maxMemoryUsage: Number(e.target.value) }))}
                    className="w-full" data-id="ddwot98zl" data-path="src/components/IntelligentCacheManager.tsx" />

                </div>

                <div className="space-y-2" data-id="kgtoh01dt" data-path="src/components/IntelligentCacheManager.tsx">
                  <Label data-id="203tjss9o" data-path="src/components/IntelligentCacheManager.tsx">Eviction Policy</Label>
                  <select
                    value={config.evictionPolicy}
                    onChange={(e) => setConfig((prev) => ({ ...prev, evictionPolicy: e.target.value as any }))}
                    className="w-full px-3 py-2 border rounded-md" data-id="04qhnaipo" data-path="src/components/IntelligentCacheManager.tsx">

                    <option value="lru" data-id="idljsc8o9" data-path="src/components/IntelligentCacheManager.tsx">Least Recently Used (LRU)</option>
                    <option value="lfu" data-id="aw8132s1w" data-path="src/components/IntelligentCacheManager.tsx">Least Frequently Used (LFU)</option>
                    <option value="ttl" data-id="si1req8hr" data-path="src/components/IntelligentCacheManager.tsx">Time To Live (TTL)</option>
                    <option value="priority" data-id="jj94dj07x" data-path="src/components/IntelligentCacheManager.tsx">Priority Based</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card data-id="6jydzluo9" data-path="src/components/IntelligentCacheManager.tsx">
              <CardHeader data-id="63z21xkpe" data-path="src/components/IntelligentCacheManager.tsx">
                <CardTitle data-id="fr04aov2c" data-path="src/components/IntelligentCacheManager.tsx">Advanced Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-id="r4fn04h9l" data-path="src/components/IntelligentCacheManager.tsx">
                <div className="flex items-center justify-between" data-id="eno02p09y" data-path="src/components/IntelligentCacheManager.tsx">
                  <div data-id="pftdano2p" data-path="src/components/IntelligentCacheManager.tsx">
                    <Label className="text-sm font-medium" data-id="713i57oub" data-path="src/components/IntelligentCacheManager.tsx">Enable Prefetching</Label>
                    <p className="text-xs text-gray-600" data-id="k2s84fpk8" data-path="src/components/IntelligentCacheManager.tsx">Automatically cache related data</p>
                  </div>
                  <Switch
                    checked={config.prefetchEnabled}
                    onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, prefetchEnabled: checked }))} data-id="jghxzab9f" data-path="src/components/IntelligentCacheManager.tsx" />

                </div>

                <div className="flex items-center justify-between" data-id="6ug8hgtjb" data-path="src/components/IntelligentCacheManager.tsx">
                  <div data-id="r9k59pk5z" data-path="src/components/IntelligentCacheManager.tsx">
                    <Label className="text-sm font-medium" data-id="lg1esldhc" data-path="src/components/IntelligentCacheManager.tsx">Enable Compression</Label>
                    <p className="text-xs text-gray-600" data-id="i65ecwqlv" data-path="src/components/IntelligentCacheManager.tsx">Compress cached data to save memory</p>
                  </div>
                  <Switch
                    checked={config.compressionEnabled}
                    onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, compressionEnabled: checked }))} data-id="w4umssd6b" data-path="src/components/IntelligentCacheManager.tsx" />

                </div>

                <div className="flex items-center justify-between" data-id="ymtwn5zxa" data-path="src/components/IntelligentCacheManager.tsx">
                  <div data-id="c0agjpdw9" data-path="src/components/IntelligentCacheManager.tsx">
                    <Label className="text-sm font-medium" data-id="zvake4ms2" data-path="src/components/IntelligentCacheManager.tsx">Persist to Disk</Label>
                    <p className="text-xs text-gray-600" data-id="jvm1glw3n" data-path="src/components/IntelligentCacheManager.tsx">Save cache to local storage</p>
                  </div>
                  <Switch
                    checked={config.persistToDisk}
                    onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, persistToDisk: checked }))} data-id="e6qy6ypha" data-path="src/components/IntelligentCacheManager.tsx" />

                </div>

                <Alert data-id="xjvlsmf9h" data-path="src/components/IntelligentCacheManager.tsx">
                  <HardDrive className="h-4 w-4" data-id="cq3bywe7u" data-path="src/components/IntelligentCacheManager.tsx" />
                  <AlertDescription data-id="kq72rmuqc" data-path="src/components/IntelligentCacheManager.tsx">
                    Intelligent caching improves performance by storing frequently accessed data in memory.
                    Adjust settings based on your application's memory constraints and access patterns.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>);

};

export default IntelligentCacheManager;
