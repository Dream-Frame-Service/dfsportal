import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Code,
  Shield,
  FileText,
  Clipboard } from
'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SafeText, SafeInput, withSafeRendering } from '@/components/SafeRenderer';
import useSafeForm from '@/hooks/use-safe-form';
import {
  sanitizeTextContent,
  sanitizeElementId,
  isValidAttributeValue,
  removeBOM } from
'@/utils/sanitizeHelper';
import {
  safeJSONParse,
  safeClipboard,
  safeFileReader } from
'@/utils/errorPreventionHelper';

const InvalidCharacterErrorDemo: React.FC = () => {
  const { toast } = useToast();
  const [testInput, setTestInput] = useState('');
  const [testResults, setTestResults] = useState<Array<{
    test: string;
    passed: boolean;
    message: string;
  }>>([]);

  // Safe form demonstration
  const { formData, updateField, handleSubmit, getFieldProps, hasErrors } = useSafeForm({
    name: '',
    email: '',
    message: ''
  }, {
    onSubmit: async (data) => {
      toast({
        title: 'Form Submitted Safely',
        description: 'All data was sanitized and validated successfully.'
      });
    }
  });

  const problemCharacterExamples = [
  { name: 'Zero Width Space', char: '\u200B', description: 'Invisible character that can break rendering' },
  { name: 'BOM (Byte Order Mark)', char: '\uFEFF', description: 'Can appear at start of files' },
  { name: 'Null Character', char: '\u0000', description: 'Control character that breaks DOM' },
  { name: 'Form Feed', char: '\f', description: 'Control character' },
  { name: 'Vertical Tab', char: '\v', description: 'Control character' },
  { name: 'Delete Character', char: '\u007F', description: 'Control character' }];


  const runCharacterTests = () => {
    const results: Array<{test: string;passed: boolean;message: string;}> = [];

    // Test 1: Basic sanitization
    try {
      const problematicString = 'Hello\u0000World\uFEFF\u200B';
      const sanitized = sanitizeTextContent(problematicString);
      const isClean = !sanitized.includes('\u0000') && !sanitized.includes('\uFEFF');
      results.push({
        test: 'Basic Sanitization',
        passed: isClean,
        message: isClean ? 'Problematic characters removed successfully' : 'Failed to remove problematic characters'
      });
    } catch (error) {
      results.push({
        test: 'Basic Sanitization',
        passed: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Test 2: Element ID sanitization
    try {
      const problematicId = 'my-id\u0000with\u200Bproblems';
      const sanitizedId = sanitizeElementId(problematicId);
      const isValidId = /^[a-zA-Z][a-zA-Z0-9\-_]*$/.test(sanitizedId);
      results.push({
        test: 'Element ID Sanitization',
        passed: isValidId,
        message: isValidId ? `Created valid ID: ${sanitizedId}` : `Invalid ID created: ${sanitizedId}`
      });
    } catch (error) {
      results.push({
        test: 'Element ID Sanitization',
        passed: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Test 3: Attribute validation
    try {
      const goodAttribute = 'normal-value';
      const badAttribute = 'value\u0000with\u007Fproblems';
      const goodResult = isValidAttributeValue(goodAttribute);
      const badResult = !isValidAttributeValue(badAttribute);
      results.push({
        test: 'Attribute Validation',
        passed: goodResult && badResult,
        message: goodResult && badResult ? 'Correctly identified valid and invalid attributes' : 'Failed to properly validate attributes'
      });
    } catch (error) {
      results.push({
        test: 'Attribute Validation',
        passed: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Test 4: BOM removal
    try {
      const bomString = '\uFEFFHello World';
      const cleaned = removeBOM(bomString);
      const bomRemoved = !cleaned.startsWith('\uFEFF');
      results.push({
        test: 'BOM Removal',
        passed: bomRemoved,
        message: bomRemoved ? 'BOM successfully removed' : 'Failed to remove BOM'
      });
    } catch (error) {
      results.push({
        test: 'BOM Removal',
        passed: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Test 5: JSON parsing safety
    try {
      const problematicJSON = '\uFEFF{"key": "value\u0000"}';
      const parsed = safeJSONParse(problematicJSON);
      const success = parsed && typeof parsed === 'object';
      results.push({
        test: 'Safe JSON Parsing',
        passed: success,
        message: success ? 'JSON parsed safely' : 'Failed to parse problematic JSON'
      });
    } catch (error) {
      results.push({
        test: 'Safe JSON Parsing',
        passed: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    setTestResults(results);

    const passedCount = results.filter((r) => r.passed).length;
    toast({
      title: 'Character Safety Tests Complete',
      description: `${passedCount}/${results.length} tests passed`,
      variant: passedCount === results.length ? 'default' : 'destructive'
    });
  };

  const insertProblematicCharacter = (char: string) => {
    setTestInput((prev) => prev + char);
  };

  const testClipboardSafety = async () => {
    try {
      // Test writing potentially problematic content
      const problematicText = 'Test\u0000with\uFEFFproblems\u200B';
      await safeClipboard.write(problematicText);

      // Test reading it back
      const readText = await safeClipboard.read();

      toast({
        title: 'Clipboard Test',
        description: `Successfully wrote and read text. Cleaned: ${readText.length < problematicText.length ? 'Yes' : 'No'}`
      });
    } catch (error) {
      toast({
        title: 'Clipboard Test Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    }
  };

  const testFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    safeFileReader(file).
    then((content) => {
      toast({
        title: 'File Read Successfully',
        description: `Read ${content.length} characters safely`
      });
      setTestInput(content.substring(0, 500)); // Show first 500 chars
    }).
    catch((error) => {
      toast({
        title: 'File Read Failed',
        description: error.message,
        variant: 'destructive'
      });
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" data-id="d48n0eovl" data-path="src/components/InvalidCharacterErrorDemo.tsx">
      <Card data-id="ypvbc30i6" data-path="src/components/InvalidCharacterErrorDemo.tsx">
        <CardHeader data-id="6ajruxnmn" data-path="src/components/InvalidCharacterErrorDemo.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="0qnsquivw" data-path="src/components/InvalidCharacterErrorDemo.tsx">
            <Shield className="w-5 h-5" data-id="chcnx2q0k" data-path="src/components/InvalidCharacterErrorDemo.tsx" />
            <span data-id="lrrj7gb4s" data-path="src/components/InvalidCharacterErrorDemo.tsx">InvalidCharacterError Prevention & Testing</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-id="qo5jl12cb" data-path="src/components/InvalidCharacterErrorDemo.tsx">
          <Tabs defaultValue="overview" className="w-full" data-id="sdfv9758g" data-path="src/components/InvalidCharacterErrorDemo.tsx">
            <TabsList className="grid w-full grid-cols-4" data-id="8238hqrzm" data-path="src/components/InvalidCharacterErrorDemo.tsx">
              <TabsTrigger value="overview" data-id="9wztrstnj" data-path="src/components/InvalidCharacterErrorDemo.tsx">Overview</TabsTrigger>
              <TabsTrigger value="testing" data-id="22nzfhs6t" data-path="src/components/InvalidCharacterErrorDemo.tsx">Testing</TabsTrigger>
              <TabsTrigger value="safe-form" data-id="qdzim21kv" data-path="src/components/InvalidCharacterErrorDemo.tsx">Safe Form</TabsTrigger>
              <TabsTrigger value="utilities" data-id="wkdg5mhlc" data-path="src/components/InvalidCharacterErrorDemo.tsx">Utilities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4" data-id="jvneg6ojk" data-path="src/components/InvalidCharacterErrorDemo.tsx">
              <Alert data-id="1dat534do" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                <AlertTriangle className="h-4 w-4" data-id="tfv1p4kky" data-path="src/components/InvalidCharacterErrorDemo.tsx" />
                <AlertDescription data-id="9rtozu5em" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                  InvalidCharacterError occurs when React tries to create DOM elements with invalid characters.
                  This usually happens with control characters, BOM, or zero-width characters in text content or attributes.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="ve9o05tzp" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                <Card data-id="qrhmzlv5b" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                  <CardHeader data-id="006tr3y03" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                    <CardTitle className="text-sm" data-id="vr4m7u58z" data-path="src/components/InvalidCharacterErrorDemo.tsx">Common Causes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2" data-id="0at56fkc6" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                    <ul className="text-sm space-y-1" data-id="qrlozy3jr" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                      <li data-id="c2i3ph6v0" data-path="src/components/InvalidCharacterErrorDemo.tsx">• Copy-pasted text with hidden characters</li>
                      <li data-id="ao4m0l2f3" data-path="src/components/InvalidCharacterErrorDemo.tsx">• File content with BOM (Byte Order Mark)</li>
                      <li data-id="ql35q9xdi" data-path="src/components/InvalidCharacterErrorDemo.tsx">• Control characters in form inputs</li>
                      <li data-id="km2qlbfuh" data-path="src/components/InvalidCharacterErrorDemo.tsx">• Invalid characters in element IDs or classes</li>
                      <li data-id="v6tafrgbk" data-path="src/components/InvalidCharacterErrorDemo.tsx">• Corrupted localStorage data</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card data-id="p0vbmjqn3" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                  <CardHeader data-id="ipzvkyd55" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                    <CardTitle className="text-sm" data-id="zs4e8qv7h" data-path="src/components/InvalidCharacterErrorDemo.tsx">Solutions Implemented</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2" data-id="mxx5fvnjg" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                    <ul className="text-sm space-y-1" data-id="h4pjw2eng" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                      <li data-id="wrotmjmwh" data-path="src/components/InvalidCharacterErrorDemo.tsx">• <Badge variant="outline" data-id="k4bzlpg3x" data-path="src/components/InvalidCharacterErrorDemo.tsx">Sanitization utilities</Badge></li>
                      <li data-id="td232ohw9" data-path="src/components/InvalidCharacterErrorDemo.tsx">• <Badge variant="outline" data-id="bp8rr514z" data-path="src/components/InvalidCharacterErrorDemo.tsx">Safe form handling</Badge></li>
                      <li data-id="mbt6z51xg" data-path="src/components/InvalidCharacterErrorDemo.tsx">• <Badge variant="outline" data-id="j7fcxk349" data-path="src/components/InvalidCharacterErrorDemo.tsx">Error boundary protection</Badge></li>
                      <li data-id="c85suh4y0" data-path="src/components/InvalidCharacterErrorDemo.tsx">• <Badge variant="outline" data-id="cizabe07m" data-path="src/components/InvalidCharacterErrorDemo.tsx">Input validation</Badge></li>
                      <li data-id="1knv89nop" data-path="src/components/InvalidCharacterErrorDemo.tsx">• <Badge variant="outline" data-id="t6snwgu6i" data-path="src/components/InvalidCharacterErrorDemo.tsx">Storage cleanup</Badge></li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card data-id="13q4tkcc6" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                <CardHeader data-id="t5sobmju6" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                  <CardTitle className="text-sm" data-id="8qhmhoc3v" data-path="src/components/InvalidCharacterErrorDemo.tsx">Problematic Characters</CardTitle>
                </CardHeader>
                <CardContent data-id="oep0vwfcb" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="dxoxq5fgx" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                    {problemCharacterExamples.map((example, index) =>
                    <div key={index} className="flex items-center justify-between p-3 border rounded" data-id="omh8o18qa" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                        <div data-id="lo8153fnn" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                          <div className="font-medium text-sm" data-id="fbrblb8kd" data-path="src/components/InvalidCharacterErrorDemo.tsx">{example.name}</div>
                          <div className="text-xs text-gray-600" data-id="njk4d4kqd" data-path="src/components/InvalidCharacterErrorDemo.tsx">{example.description}</div>
                        </div>
                        <Button
                        size="sm"
                        variant="outline"
                        onClick={() => insertProblematicCharacter(example.char)} data-id="szjbyzwpv" data-path="src/components/InvalidCharacterErrorDemo.tsx">

                          Insert
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testing" className="space-y-4" data-id="4er7jszd5" data-path="src/components/InvalidCharacterErrorDemo.tsx">
              <Card data-id="z5f44qu7z" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                <CardHeader data-id="x9tf3aftl" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                  <CardTitle className="text-sm" data-id="3ayy3sdkp" data-path="src/components/InvalidCharacterErrorDemo.tsx">Character Safety Tests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4" data-id="6bondqw9p" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                  <Button onClick={runCharacterTests} className="w-full" data-id="fhvk4ph2r" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                    <Code className="w-4 h-4 mr-2" data-id="8rw6ncnwu" data-path="src/components/InvalidCharacterErrorDemo.tsx" />
                    Run Safety Tests
                  </Button>

                  {testResults.length > 0 &&
                  <div className="space-y-2" data-id="lvo9g6nrd" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                      {testResults.map((result, index) =>
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded border ${
                      result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`
                      } data-id="uixaxnfal" data-path="src/components/InvalidCharacterErrorDemo.tsx">

                          {result.passed ?
                      <CheckCircle className="w-5 h-5 text-green-600" data-id="65j9pft2i" data-path="src/components/InvalidCharacterErrorDemo.tsx" /> :

                      <XCircle className="w-5 h-5 text-red-600" data-id="fikv0huyz" data-path="src/components/InvalidCharacterErrorDemo.tsx" />
                      }
                          <div className="flex-1" data-id="hok9bq4zy" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                            <div className="font-medium text-sm" data-id="m42xd6gy3" data-path="src/components/InvalidCharacterErrorDemo.tsx">{result.test}</div>
                            <div className="text-xs text-gray-600" data-id="0m3b9rfey" data-path="src/components/InvalidCharacterErrorDemo.tsx">{result.message}</div>
                          </div>
                        </div>
                    )}
                    </div>
                  }
                </CardContent>
              </Card>

              <Card data-id="8ox8jcp1z" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                <CardHeader data-id="rpfwsbe8h" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                  <CardTitle className="text-sm" data-id="s4x3915lw" data-path="src/components/InvalidCharacterErrorDemo.tsx">Test Input Area</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4" data-id="b1clgxiwv" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                  <div data-id="ioqlrhrle" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                    <Label htmlFor="test-input" data-id="pn6cj3kvq" data-path="src/components/InvalidCharacterErrorDemo.tsx">Test problematic characters here:</Label>
                    <Textarea
                      id="test-input"
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Paste or type text with potential problematic characters..."
                      rows={4} data-id="bn3t3e1iy" data-path="src/components/InvalidCharacterErrorDemo.tsx" />

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="oqjueiae6" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                    <div data-id="10q8he352" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                      <Label data-id="i0ise7id5" data-path="src/components/InvalidCharacterErrorDemo.tsx">Original (may contain problems):</Label>
                      <div className="p-2 bg-red-50 border rounded text-sm font-mono break-all" data-id="x35q19s9d" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                        {testInput || 'No input'}
                      </div>
                    </div>
                    <div data-id="tfs0niq9u" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                      <Label data-id="sxdwf0mj8" data-path="src/components/InvalidCharacterErrorDemo.tsx">Sanitized (safe for DOM):</Label>
                      <div className="p-2 bg-green-50 border rounded text-sm font-mono break-all" data-id="imq2xpeeg" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                        {sanitizeTextContent(testInput) || 'No input'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="safe-form" className="space-y-4" data-id="ezhr0pv15" data-path="src/components/InvalidCharacterErrorDemo.tsx">
              <Card data-id="v2ukakwoh" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                <CardHeader data-id="0j3ov3755" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                  <CardTitle className="text-sm" data-id="onx7e1kxa" data-path="src/components/InvalidCharacterErrorDemo.tsx">Safe Form Demo</CardTitle>
                </CardHeader>
                <CardContent data-id="qxk01iai7" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                  <form onSubmit={handleSubmit} className="space-y-4" data-id="xf2srqxol" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                    <div data-id="aw9ume47k" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                      <Label htmlFor="safe-name" data-id="kuu05lopx" data-path="src/components/InvalidCharacterErrorDemo.tsx">Name:</Label>
                      <SafeInput
                        {...getFieldProps('name')}
                        placeholder="Enter your name (will be automatically sanitized)" data-id="lad5oggzm" data-path="src/components/InvalidCharacterErrorDemo.tsx" />

                    </div>

                    <div data-id="j046am7ry" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                      <Label htmlFor="safe-email" data-id="o604ut1it" data-path="src/components/InvalidCharacterErrorDemo.tsx">Email:</Label>
                      <SafeInput
                        {...getFieldProps('email')}
                        type="email"
                        placeholder="Enter your email" data-id="dxn4izgmt" data-path="src/components/InvalidCharacterErrorDemo.tsx" />

                    </div>

                    <div data-id="yu9c1a89b" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                      <Label htmlFor="safe-message" data-id="mqqmm7cc7" data-path="src/components/InvalidCharacterErrorDemo.tsx">Message:</Label>
                      <Textarea
                        {...getFieldProps('message')}
                        placeholder="Enter a message (special characters will be sanitized)"
                        rows={4} data-id="goeenbeqp" data-path="src/components/InvalidCharacterErrorDemo.tsx" />

                    </div>

                    <Button type="submit" disabled={hasErrors} data-id="onc5qo624" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                      Submit Safe Form
                    </Button>

                    {hasErrors &&
                    <Alert variant="destructive" data-id="q3kooesl4" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                        <AlertTriangle className="h-4 w-4" data-id="hr68kv04z" data-path="src/components/InvalidCharacterErrorDemo.tsx" />
                        <AlertDescription data-id="jps45zl8m" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                          Form contains errors. Please check your input.
                        </AlertDescription>
                      </Alert>
                    }
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="utilities" className="space-y-4" data-id="zkc3pqulm" data-path="src/components/InvalidCharacterErrorDemo.tsx">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="4yjrnlokn" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                <Card data-id="7ndob9xai" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                  <CardHeader data-id="n9ga2crwf" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                    <CardTitle className="text-sm" data-id="xk0swclju" data-path="src/components/InvalidCharacterErrorDemo.tsx">Clipboard Safety</CardTitle>
                  </CardHeader>
                  <CardContent data-id="k8apxd5nu" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                    <Button onClick={testClipboardSafety} className="w-full" data-id="hm5ez6ygo" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                      <Clipboard className="w-4 h-4 mr-2" data-id="34bzdmwja" data-path="src/components/InvalidCharacterErrorDemo.tsx" />
                      Test Safe Clipboard Operations
                    </Button>
                  </CardContent>
                </Card>

                <Card data-id="e3twblikn" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                  <CardHeader data-id="akcclpkq0" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                    <CardTitle className="text-sm" data-id="wp2r4eigy" data-path="src/components/InvalidCharacterErrorDemo.tsx">File Safety</CardTitle>
                  </CardHeader>
                  <CardContent data-id="jd59o69dc" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                    <div data-id="6tapf6glf" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                      <Label htmlFor="file-test" data-id="znxttok0k" data-path="src/components/InvalidCharacterErrorDemo.tsx">Test file reading:</Label>
                      <Input
                        id="file-test"
                        type="file"
                        accept=".txt,.json,.csv"
                        onChange={testFileUpload} data-id="6wr80euv9" data-path="src/components/InvalidCharacterErrorDemo.tsx" />

                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card data-id="vajqis8v0" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                <CardHeader data-id="2mh3al7gw" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                  <CardTitle className="text-sm" data-id="sx2zs5iey" data-path="src/components/InvalidCharacterErrorDemo.tsx">Safe Text Rendering</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4" data-id="7irnz17m8" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                  <div data-id="tjecflgaf" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                    <Label data-id="815tg6kq6" data-path="src/components/InvalidCharacterErrorDemo.tsx">Test safe text rendering:</Label>
                    <Input
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Enter text to test safe rendering" data-id="l3hhgjjsz" data-path="src/components/InvalidCharacterErrorDemo.tsx" />

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="2qh93hu6a" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                    <div data-id="1hypzs0qo" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                      <Label data-id="qks2s2ubg" data-path="src/components/InvalidCharacterErrorDemo.tsx">Regular rendering:</Label>
                      <div className="p-2 border rounded bg-red-50" data-id="q1500qv0a" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                        <span data-id="bniwhzu6x" data-path="src/components/InvalidCharacterErrorDemo.tsx">{testInput}</span>
                      </div>
                    </div>
                    <div data-id="u7gu12v5z" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                      <Label data-id="0rme9z64g" data-path="src/components/InvalidCharacterErrorDemo.tsx">Safe rendering:</Label>
                      <div className="p-2 border rounded bg-green-50" data-id="54h9nhz6v" data-path="src/components/InvalidCharacterErrorDemo.tsx">
                        <SafeText data-id="g46ucfydy" data-path="src/components/InvalidCharacterErrorDemo.tsx">{testInput}</SafeText>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>);

};

export default withSafeRendering(InvalidCharacterErrorDemo);
