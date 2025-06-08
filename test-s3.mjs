import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const s3Config = {
  endpoint: process.env.VITE_S3_ENDPOINT,
  region: process.env.VITE_S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.VITE_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.VITE_S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: process.env.VITE_S3_FORCE_PATH_STYLE === 'true',
};

async function testS3Connection() {
  try {
    console.log('S3 Configuration:');
    console.log('- Endpoint:', s3Config.endpoint);
    console.log('- Region:', s3Config.region);
    console.log('- Access Key ID:', s3Config.credentials.accessKeyId ? '***' : 'NOT SET');
    console.log('- Secret Access Key:', s3Config.credentials.secretAccessKey ? '***' : 'NOT SET');
    console.log('- Force Path Style:', s3Config.forcePathStyle);
    
    const s3Client = new S3Client(s3Config);
    
    console.log('\nTesting S3 connection...');
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    
    console.log('✅ S3 connection successful!');
    console.log('Available buckets:', response.Buckets?.map(b => b.Name) || []);
    
    return { success: true, buckets: response.Buckets };
  } catch (error) {
    console.error('❌ S3 connection failed:', error.message);
    return { success: false, error: error.message };
  }
}

testS3Connection();
