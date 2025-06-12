var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { r as reactExports, j as jsxRuntimeExports } from "./react-vendor-DX0Gaxph.js";
import { u as useToast, B as Button, A as Alert, m as AlertDescription, C as Card, d as CardHeader, e as CardTitle, f as CardDescription, g as CardContent, l as Badge } from "./admin-core-DFYqoWCM.js";
import { P as PutObjectCommand, S as S3Client, G as GetObjectCommand, D as DeleteObjectCommand, L as ListObjectsV2Command, g as getSignedUrl } from "./aws-sdk-DF6-bWA6.js";
import "./vendor-ChWeSoXy.js";
import { Y as RefreshCw, ac as CircleAlert, bs as Upload, bT as Link, ao as Trash2 } from "./ui-components-E8Qujiw2.js";
import "./supabase-DWlqU2OS.js";
const s3Config = {
  endpoint: "https://vetufvhzmawjbsumtplq.supabase.co/storage/v1/s3",
  region: "us-east-1",
  credentials: {
    accessKeyId: "25c2ac3c18cd1c6dcc3d0e3ee5e72315",
    secretAccessKey: "141113786127df9081860447503c52bed4bed4a066d49bc079118faabf2d10af"
  },
  forcePathStyle: true,
  signatureVersion: "v4"
};
const s3Client = new S3Client(s3Config);
const DEFAULT_BUCKET = "dfs-manager-files";
class S3StorageService {
  constructor(bucket = DEFAULT_BUCKET) {
    __publicField(this, "bucket");
    this.bucket = bucket;
  }
  /**
   * Upload a file to S3-compatible Supabase Storage
   */
  async uploadFile(key, file, options) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: (options == null ? void 0 : options.contentType) || (file instanceof File ? file.type : "application/octet-stream"),
        Metadata: options == null ? void 0 : options.metadata
      });
      const result = await s3Client.send(command);
      return {
        success: true,
        data: {
          key,
          etag: result.ETag,
          bucket: this.bucket,
          url: `${s3Config.endpoint}/${this.bucket}/${key}`
        },
        error: null
      };
    } catch (error) {
      console.error("S3 Upload Error:", error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Upload failed"
      };
    }
  }
  /**
   * Download a file from S3-compatible Supabase Storage
   */
  async downloadFile(key) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key
      });
      const result = await s3Client.send(command);
      return {
        success: true,
        data: {
          body: result.Body,
          contentType: result.ContentType,
          contentLength: result.ContentLength,
          lastModified: result.LastModified,
          metadata: result.Metadata
        },
        error: null
      };
    } catch (error) {
      console.error("S3 Download Error:", error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Download failed"
      };
    }
  }
  /**
   * Delete a file from S3-compatible Supabase Storage
   */
  async deleteFile(key) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key
      });
      await s3Client.send(command);
      return {
        success: true,
        data: { key },
        error: null
      };
    } catch (error) {
      console.error("S3 Delete Error:", error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Delete failed"
      };
    }
  }
  /**
   * List files in S3-compatible Supabase Storage
   */
  async listFiles(prefix, maxKeys = 1e3) {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        MaxKeys: maxKeys
      });
      const result = await s3Client.send(command);
      return {
        success: true,
        data: {
          files: result.Contents || [],
          isTruncated: result.IsTruncated,
          continuationToken: result.NextContinuationToken
        },
        error: null
      };
    } catch (error) {
      console.error("S3 List Error:", error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "List failed"
      };
    }
  }
  /**
   * Generate a pre-signed URL for secure file access
   */
  async getSignedUrl(key, operation = "GET", expiresIn = 3600) {
    try {
      const command = operation === "GET" ? new GetObjectCommand({ Bucket: this.bucket, Key: key }) : new PutObjectCommand({ Bucket: this.bucket, Key: key });
      const url = await getSignedUrl(s3Client, command, { expiresIn });
      return {
        success: true,
        data: { url, expiresIn },
        error: null
      };
    } catch (error) {
      console.error("S3 Signed URL Error:", error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Signed URL generation failed"
      };
    }
  }
  /**
   * Upload multiple files in batch
   */
  async uploadFiles(files) {
    const results = await Promise.allSettled(
      files.map(
        ({ key, file, metadata }) => this.uploadFile(key, file, {
          contentType: file instanceof File ? file.type : void 0,
          metadata
        })
      )
    );
    const successful = results.map((result, index) => ({ result, index })).filter(({ result }) => result.status === "fulfilled" && result.value.success).map(({ result, index }) => ({
      key: files[index].key,
      data: result.value.data
    }));
    const failed = results.map((result, index) => ({ result, index })).filter(({ result }) => result.status === "rejected" || !result.value.success).map(({ result, index }) => ({
      key: files[index].key,
      error: result.status === "rejected" ? result.reason : result.value.error
    }));
    return {
      successful,
      failed,
      total: files.length
    };
  }
}
const s3Storage = new S3StorageService();
const uploadToS3 = (key, file, metadata) => s3Storage.uploadFile(key, file, { contentType: file.type, metadata });
const downloadFromS3 = (key) => s3Storage.downloadFile(key);
const getS3SignedUrl = (key, operation = "GET", expiresIn = 3600) => s3Storage.getSignedUrl(key, operation, expiresIn);
async function testS3Connection() {
  var _a, _b, _c, _d, _e, _f, _g;
  console.log("🧪 Testing S3 Protocol Connection to Supabase Storage...");
  const results = {
    connection: false,
    upload: false,
    download: false,
    list: false,
    signedUrl: false,
    cleanup: false
  };
  try {
    console.log("\n1️⃣ Testing S3 connection...");
    const listResult = await s3Storage.listFiles("", 10);
    if (listResult.success) {
      console.log("✅ S3 connection successful");
      console.log(`📁 Found ${((_b = (_a = listResult.data) == null ? void 0 : _a.files) == null ? void 0 : _b.length) || 0} files in bucket`);
      results.connection = true;
      results.list = true;
    } else {
      console.log("❌ S3 connection failed:", listResult.error);
      return results;
    }
    console.log("\n2️⃣ Testing file upload...");
    const testContent = new Blob(["Hello from S3 protocol test!"], { type: "text/plain" });
    const testKey = `test-files/s3-test-${Date.now()}.txt`;
    const uploadResult = await uploadToS3(testKey, new File([testContent], "test.txt", { type: "text/plain" }), {
      "test-type": "s3-protocol-test",
      "timestamp": (/* @__PURE__ */ new Date()).toISOString()
    });
    if (uploadResult.success) {
      console.log("✅ File upload successful");
      console.log(`📤 Uploaded: ${testKey}`);
      console.log(`🔗 URL: ${(_c = uploadResult.data) == null ? void 0 : _c.url}`);
      results.upload = true;
    } else {
      console.log("❌ File upload failed:", uploadResult.error);
    }
    console.log("\n3️⃣ Testing signed URL generation...");
    const signedUrlResult = await getS3SignedUrl(testKey, "GET", 300);
    if (signedUrlResult.success) {
      console.log("✅ Signed URL generation successful");
      console.log(`🔐 Signed URL: ${(_e = (_d = signedUrlResult.data) == null ? void 0 : _d.url) == null ? void 0 : _e.substring(0, 100)}...`);
      results.signedUrl = true;
    } else {
      console.log("❌ Signed URL generation failed:", signedUrlResult.error);
    }
    console.log("\n4️⃣ Testing file download...");
    const downloadResult = await downloadFromS3(testKey);
    if (downloadResult.success) {
      console.log("✅ File download successful");
      console.log(`📥 Content-Type: ${(_f = downloadResult.data) == null ? void 0 : _f.contentType}`);
      console.log(`📦 Content-Length: ${(_g = downloadResult.data) == null ? void 0 : _g.contentLength} bytes`);
      results.download = true;
    } else {
      console.log("❌ File download failed:", downloadResult.error);
    }
    console.log("\n5️⃣ Cleaning up test file...");
    const deleteResult = await s3Storage.deleteFile(testKey);
    if (deleteResult.success) {
      console.log("✅ Test file deleted successfully");
      results.cleanup = true;
    } else {
      console.log("❌ Test file deletion failed:", deleteResult.error);
    }
  } catch (error) {
    console.error("❌ S3 Test Error:", error);
  }
  console.log("\n📊 S3 Protocol Test Results:");
  console.log(`🔌 Connection: ${results.connection ? "✅" : "❌"}`);
  console.log(`📋 List Files: ${results.list ? "✅" : "❌"}`);
  console.log(`📤 Upload: ${results.upload ? "✅" : "❌"}`);
  console.log(`📥 Download: ${results.download ? "✅" : "❌"}`);
  console.log(`🔐 Signed URL: ${results.signedUrl ? "✅" : "❌"}`);
  console.log(`🧹 Cleanup: ${results.cleanup ? "✅" : "❌"}`);
  const allTestsPassed = Object.values(results).every((result) => result === true);
  console.log(`
${allTestsPassed ? "🎉 All S3 tests passed!" : "⚠️ Some S3 tests failed"}`);
  return results;
}
async function testS3BatchUpload() {
  console.log("\n🔄 Testing S3 Batch Upload...");
  const testFiles = [
    {
      key: `batch-test/file1-${Date.now()}.txt`,
      file: new File([new Blob(["Test file 1"])], "file1.txt", { type: "text/plain" }),
      metadata: { type: "batch-test", index: "1" }
    },
    {
      key: `batch-test/file2-${Date.now()}.txt`,
      file: new File([new Blob(["Test file 2"])], "file2.txt", { type: "text/plain" }),
      metadata: { type: "batch-test", index: "2" }
    },
    {
      key: `batch-test/file3-${Date.now()}.txt`,
      file: new File([new Blob(["Test file 3"])], "file3.txt", { type: "text/plain" }),
      metadata: { type: "batch-test", index: "3" }
    }
  ];
  const batchResult = await s3Storage.uploadFiles(testFiles);
  console.log(`📊 Batch Upload Results:`);
  console.log(`✅ Successful: ${batchResult.successful.length}/${batchResult.total}`);
  console.log(`❌ Failed: ${batchResult.failed.length}/${batchResult.total}`);
  if (batchResult.successful.length > 0) {
    console.log("📤 Successfully uploaded:");
    batchResult.successful.forEach(({ key }) => console.log(`  - ${key}`));
  }
  if (batchResult.failed.length > 0) {
    console.log("❌ Failed uploads:");
    batchResult.failed.forEach(({ key, error }) => console.log(`  - ${key}: ${error}`));
  }
  console.log("\n🧹 Cleaning up batch test files...");
  for (const { key } of testFiles) {
    await s3Storage.deleteFile(key);
  }
  return batchResult;
}
async function runAllS3Tests() {
  console.log("🚀 Running Complete S3 Protocol Test Suite...");
  const connectionTest = await testS3Connection();
  const batchTest = await testS3BatchUpload();
  return {
    connection: connectionTest,
    batch: batchTest
  };
}
function S3StorageManager() {
  const [files, setFiles] = reactExports.useState([]);
  const [uploading, setUploading] = reactExports.useState(false);
  const [testing, setTesting] = reactExports.useState(false);
  const [testResults, setTestResults] = reactExports.useState(null);
  const [uploadResults, setUploadResults] = reactExports.useState([]);
  const { toast } = useToast();
  const loadFiles = async () => {
    var _a, _b, _c;
    try {
      const result = await s3Storage.listFiles("dfs-manager/");
      if (result.success) {
        setFiles(((_a = result.data) == null ? void 0 : _a.files) || []);
        toast({
          title: "Files Loaded",
          description: `Found ${((_c = (_b = result.data) == null ? void 0 : _b.files) == null ? void 0 : _c.length) || 0} files`
        });
      } else {
        throw new Error(result.error || "Failed to load files");
      }
    } catch (error) {
      console.error("Error loading files:", error);
      toast({
        title: "Error",
        description: "Failed to load files from storage",
        variant: "destructive"
      });
    }
  };
  const handleFileUpload = async (event) => {
    var _a;
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    setUploading(true);
    setUploadResults([]);
    try {
      const results = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const key = `dfs-manager/${Date.now()}-${file.name}`;
        const result = await uploadToS3(key, file, {
          "original-name": file.name,
          "upload-timestamp": (/* @__PURE__ */ new Date()).toISOString(),
          "file-size": file.size.toString()
        });
        results.push({
          key,
          url: (_a = result.data) == null ? void 0 : _a.url,
          error: result.error || void 0,
          success: result.success
        });
      }
      setUploadResults(results);
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.length - successCount;
      toast({
        title: "Upload Complete",
        description: `${successCount} files uploaded successfully${failCount > 0 ? `, ${failCount} failed` : ""}`,
        variant: failCount > 0 ? "destructive" : "default"
      });
      await loadFiles();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Error",
        description: "Failed to upload files",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  const generateSignedUrl = async (key) => {
    var _a;
    try {
      const result = await getS3SignedUrl(key, "GET", 3600);
      if (result.success && ((_a = result.data) == null ? void 0 : _a.url)) {
        await navigator.clipboard.writeText(result.data.url);
        toast({
          title: "Signed URL Generated",
          description: "URL copied to clipboard (valid for 1 hour)"
        });
      } else {
        throw new Error(result.error || "Failed to generate URL");
      }
    } catch (error) {
      console.error("Error generating signed URL:", error);
      toast({
        title: "Error",
        description: "Failed to generate signed URL",
        variant: "destructive"
      });
    }
  };
  const deleteFile = async (key) => {
    try {
      const result = await s3Storage.deleteFile(key);
      if (result.success) {
        toast({
          title: "File Deleted",
          description: `File ${key} deleted successfully`
        });
        await loadFiles();
      } else {
        throw new Error(result.error || "Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };
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
      console.error("Test error:", error);
      toast({
        title: "Test Error",
        description: "Failed to run S3 tests",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "S3 Storage Manager" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Manage files using S3 protocol with Supabase Storage" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: testConnection, disabled: testing, variant: "outline", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-4 h-4 mr-2 ${testing ? "animate-spin" : ""}` }),
          "Test S3"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: loadFiles, variant: "outline", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 mr-2" }),
          "Refresh"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "S3 Endpoint:" }),
        " ",
        "https://vetufvhzmawjbsumtplq.supabase.co/storage/v1/s3",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Region:" }),
        " ",
        "us-east-1",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Bucket:" }),
        " ",
        "dfs-manager-files"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-5 h-5" }),
          "Upload Files"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Upload files to Supabase Storage using S3 protocol" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "file",
            multiple: true,
            onChange: handleFileUpload,
            disabled: uploading,
            className: "block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          }
        ),
        uploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-6 h-6 animate-spin mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Uploading files..." })
        ] }),
        uploadResults.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold", children: "Upload Results:" }),
          uploadResults.map((result, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 bg-slate-50 rounded", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: result.key }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: result.success ? "default" : "destructive", children: result.success ? "Success" : "Failed" })
          ] }, index))
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Files in Storage" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Files stored in S3-compatible Supabase Storage" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: files.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground py-8", children: "No files found. Upload some files to get started." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: files.map((file, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate", children: file.Key }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            file.Size,
            " bytes • ",
            new Date(file.LastModified).toLocaleDateString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => generateSignedUrl(file.Key),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => deleteFile(file.Key),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
            }
          )
        ] })
      ] }, index)) }) })
    ] }),
    testResults && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "S3 Test Results" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-2", children: "Connection Tests" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: Object.entries(testResults.connection).map(([test, result]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: test.replace(/([A-Z])/g, " $1") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: result ? "default" : "destructive", children: result ? "✅" : "❌" })
          ] }, test)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-2", children: "Batch Upload" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Successful" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { children: testResults.batch.successful.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Failed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: testResults.batch.failed.length > 0 ? "destructive" : "default", children: testResults.batch.failed.length })
            ] })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  S3StorageManager
};
