import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// S3 Configuration for Supabase Storage
const s3Config = {
  endpoint: import.meta.env.VITE_S3_ENDPOINT,
  region: import.meta.env.VITE_S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: import.meta.env.VITE_S3_FORCE_PATH_STYLE === "true",
  signatureVersion: import.meta.env.VITE_S3_SIGNATURE_VERSION || "v4",
};

// Create S3 client
export const s3Client = new S3Client(s3Config);

// Default bucket
const DEFAULT_BUCKET = import.meta.env.VITE_DEFAULT_STORAGE_BUCKET ||
  "dfs-manager-files";

export class S3StorageService {
  private bucket: string;

  constructor(bucket: string = DEFAULT_BUCKET) {
    this.bucket = bucket;
  }

  /**
   * Upload a file to S3-compatible Supabase Storage
   */
  async uploadFile(
    key: string,
    file: File | Blob | ArrayBuffer,
    options?: {
      contentType?: string;
      metadata?: Record<string, string>;
    },
  ) {
    try {
      // Convert ArrayBuffer to Uint8Array for S3
      let body: Uint8Array | Blob | File;
      if (file instanceof ArrayBuffer) {
        body = new Uint8Array(file);
      } else {
        body = file;
      }

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body as any, // Type assertion for S3 compatibility
        ContentType: options?.contentType ||
          (file instanceof File ? file.type : "application/octet-stream"),
        Metadata: options?.metadata,
      });

      const result = await s3Client.send(command);

      return {
        success: true,
        data: {
          key,
          etag: result.ETag,
          bucket: this.bucket,
          url: `${s3Config.endpoint}/${this.bucket}/${key}`,
        },
        error: null,
      };
    } catch (error) {
      console.error("S3 Upload Error:", error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  /**
   * Download a file from S3-compatible Supabase Storage
   */
  async downloadFile(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const result = await s3Client.send(command);

      return {
        success: true,
        data: {
          body: result.Body,
          contentType: result.ContentType,
          contentLength: result.ContentLength,
          lastModified: result.LastModified,
          metadata: result.Metadata,
        },
        error: null,
      };
    } catch (error) {
      console.error("S3 Download Error:", error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Download failed",
      };
    }
  }

  /**
   * Delete a file from S3-compatible Supabase Storage
   */
  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await s3Client.send(command);

      return {
        success: true,
        data: { key },
        error: null,
      };
    } catch (error) {
      console.error("S3 Delete Error:", error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Delete failed",
      };
    }
  }

  /**
   * List files in S3-compatible Supabase Storage
   */
  async listFiles(prefix?: string, maxKeys: number = 1000) {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        MaxKeys: maxKeys,
      });

      const result = await s3Client.send(command);

      return {
        success: true,
        data: {
          files: result.Contents || [],
          isTruncated: result.IsTruncated,
          continuationToken: result.NextContinuationToken,
        },
        error: null,
      };
    } catch (error) {
      console.error("S3 List Error:", error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "List failed",
      };
    }
  }

  /**
   * Generate a pre-signed URL for secure file access
   */
  async getSignedUrl(
    key: string,
    operation: "GET" | "PUT" = "GET",
    expiresIn: number = 3600,
  ) {
    try {
      const command = operation === "GET"
        ? new GetObjectCommand({ Bucket: this.bucket, Key: key })
        : new PutObjectCommand({ Bucket: this.bucket, Key: key });

      const url = await getSignedUrl(s3Client, command, { expiresIn });

      return {
        success: true,
        data: { url, expiresIn },
        error: null,
      };
    } catch (error) {
      console.error("S3 Signed URL Error:", error);
      return {
        success: false,
        data: null,
        error: error instanceof Error
          ? error.message
          : "Signed URL generation failed",
      };
    }
  }

  /**
   * Upload multiple files in batch
   */
  async uploadFiles(
    files: Array<
      { key: string; file: File | Blob; metadata?: Record<string, string> }
    >,
  ) {
    const results = await Promise.allSettled(
      files.map(({ key, file, metadata }) =>
        this.uploadFile(key, file, {
          contentType: file instanceof File ? file.type : undefined,
          metadata,
        })
      ),
    );

    const successful = results
      .map((result, index) => ({ result, index }))
      .filter(({ result }) =>
        result.status === "fulfilled" && result.value.success
      )
      .map(({ result, index }) => ({
        key: files[index].key,
        data: (result as PromiseFulfilledResult<any>).value.data,
      }));

    const failed = results
      .map((result, index) => ({ result, index }))
      .filter(({ result }) =>
        result.status === "rejected" || !result.value.success
      )
      .map(({ result, index }) => ({
        key: files[index].key,
        error: result.status === "rejected"
          ? result.reason
          : (result as PromiseFulfilledResult<any>).value.error,
      }));

    return {
      successful,
      failed,
      total: files.length,
    };
  }
}

// Export singleton instance
export const s3Storage = new S3StorageService();

// Export helper functions for common operations
export const uploadToS3 = (
  key: string,
  file: File,
  metadata?: Record<string, string>,
) => s3Storage.uploadFile(key, file, { contentType: file.type, metadata });

export const downloadFromS3 = (key: string) => s3Storage.downloadFile(key);

export const deleteFromS3 = (key: string) => s3Storage.deleteFile(key);

export const getS3SignedUrl = (
  key: string,
  operation: "GET" | "PUT" = "GET",
  expiresIn: number = 3600,
) => s3Storage.getSignedUrl(key, operation, expiresIn);
