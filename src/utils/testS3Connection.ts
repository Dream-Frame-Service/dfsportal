import { s3Storage, uploadToS3, downloadFromS3, getS3SignedUrl } from '../services/s3StorageService';

/**
 * Test S3 protocol connection to Supabase Storage
 */
export async function testS3Connection() {
  console.log('🧪 Testing S3 Protocol Connection to Supabase Storage...');

  const results = {
    connection: false,
    upload: false,
    download: false,
    list: false,
    signedUrl: false,
    cleanup: false
  };

  try {
    // Test 1: List files (basic connection test)
    console.log('\n1️⃣ Testing S3 connection...');
    const listResult = await s3Storage.listFiles('', 10);
    
    if (listResult.success) {
      console.log('✅ S3 connection successful');
      console.log(`📁 Found ${listResult.data?.files?.length || 0} files in bucket`);
      results.connection = true;
      results.list = true;
    } else {
      console.log('❌ S3 connection failed:', listResult.error);
      return results;
    }

    // Test 2: Upload a test file
    console.log('\n2️⃣ Testing file upload...');
    const testContent = new Blob(['Hello from S3 protocol test!'], { type: 'text/plain' });
    const testKey = `test-files/s3-test-${Date.now()}.txt`;
    
    const uploadResult = await uploadToS3(testKey, new File([testContent], 'test.txt', { type: 'text/plain' }), {
      'test-type': 's3-protocol-test',
      'timestamp': new Date().toISOString()
    });

    if (uploadResult.success) {
      console.log('✅ File upload successful');
      console.log(`📤 Uploaded: ${testKey}`);
      console.log(`🔗 URL: ${uploadResult.data?.url}`);
      results.upload = true;
    } else {
      console.log('❌ File upload failed:', uploadResult.error);
    }

    // Test 3: Generate signed URL
    console.log('\n3️⃣ Testing signed URL generation...');
    const signedUrlResult = await getS3SignedUrl(testKey, 'GET', 300);
    
    if (signedUrlResult.success) {
      console.log('✅ Signed URL generation successful');
      console.log(`🔐 Signed URL: ${signedUrlResult.data?.url?.substring(0, 100)}...`);
      results.signedUrl = true;
    } else {
      console.log('❌ Signed URL generation failed:', signedUrlResult.error);
    }

    // Test 4: Download the test file
    console.log('\n4️⃣ Testing file download...');
    const downloadResult = await downloadFromS3(testKey);
    
    if (downloadResult.success) {
      console.log('✅ File download successful');
      console.log(`📥 Content-Type: ${downloadResult.data?.contentType}`);
      console.log(`📦 Content-Length: ${downloadResult.data?.contentLength} bytes`);
      results.download = true;
    } else {
      console.log('❌ File download failed:', downloadResult.error);
    }

    // Test 5: Cleanup - delete test file
    console.log('\n5️⃣ Cleaning up test file...');
    const deleteResult = await s3Storage.deleteFile(testKey);
    
    if (deleteResult.success) {
      console.log('✅ Test file deleted successfully');
      results.cleanup = true;
    } else {
      console.log('❌ Test file deletion failed:', deleteResult.error);
    }

  } catch (error) {
    console.error('❌ S3 Test Error:', error);
  }

  // Summary
  console.log('\n📊 S3 Protocol Test Results:');
  console.log(`🔌 Connection: ${results.connection ? '✅' : '❌'}`);
  console.log(`📋 List Files: ${results.list ? '✅' : '❌'}`);
  console.log(`📤 Upload: ${results.upload ? '✅' : '❌'}`);
  console.log(`📥 Download: ${results.download ? '✅' : '❌'}`);
  console.log(`🔐 Signed URL: ${results.signedUrl ? '✅' : '❌'}`);
  console.log(`🧹 Cleanup: ${results.cleanup ? '✅' : '❌'}`);

  const allTestsPassed = Object.values(results).every(result => result === true);
  console.log(`\n${allTestsPassed ? '🎉 All S3 tests passed!' : '⚠️ Some S3 tests failed'}`);

  return results;
}

/**
 * Test batch upload functionality
 */
export async function testS3BatchUpload() {
  console.log('\n🔄 Testing S3 Batch Upload...');

  const testFiles = [
    { 
      key: `batch-test/file1-${Date.now()}.txt`, 
      file: new File([new Blob(['Test file 1'])], 'file1.txt', { type: 'text/plain' }),
      metadata: { type: 'batch-test', index: '1' }
    },
    { 
      key: `batch-test/file2-${Date.now()}.txt`, 
      file: new File([new Blob(['Test file 2'])], 'file2.txt', { type: 'text/plain' }),
      metadata: { type: 'batch-test', index: '2' }
    },
    { 
      key: `batch-test/file3-${Date.now()}.txt`, 
      file: new File([new Blob(['Test file 3'])], 'file3.txt', { type: 'text/plain' }),
      metadata: { type: 'batch-test', index: '3' }
    }
  ];

  const batchResult = await s3Storage.uploadFiles(testFiles);

  console.log(`📊 Batch Upload Results:`);
  console.log(`✅ Successful: ${batchResult.successful.length}/${batchResult.total}`);
  console.log(`❌ Failed: ${batchResult.failed.length}/${batchResult.total}`);

  if (batchResult.successful.length > 0) {
    console.log('📤 Successfully uploaded:');
    batchResult.successful.forEach(({ key }) => console.log(`  - ${key}`));
  }

  if (batchResult.failed.length > 0) {
    console.log('❌ Failed uploads:');
    batchResult.failed.forEach(({ key, error }) => console.log(`  - ${key}: ${error}`));
  }

  // Cleanup batch test files
  console.log('\n🧹 Cleaning up batch test files...');
  for (const { key } of testFiles) {
    await s3Storage.deleteFile(key);
  }

  return batchResult;
}

// Export helper for running all tests
export async function runAllS3Tests() {
  console.log('🚀 Running Complete S3 Protocol Test Suite...');
  
  const connectionTest = await testS3Connection();
  const batchTest = await testS3BatchUpload();
  
  return {
    connection: connectionTest,
    batch: batchTest
  };
}
