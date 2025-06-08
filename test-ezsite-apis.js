// Test script to verify ezsite.apis initialization
// Run this in the browser console to test the fix

console.log('🧪 Testing ezsite.apis initialization...');

// Test 1: Check if window.ezsite exists
if (typeof window.ezsite === 'undefined') {
  console.error('❌ window.ezsite is not defined');
} else {
  console.log('✅ window.ezsite is defined');
}

// Test 2: Check if window.ezsite.apis exists
if (typeof window.ezsite?.apis === 'undefined') {
  console.error('❌ window.ezsite.apis is not defined');
} else {
  console.log('✅ window.ezsite.apis is defined');
}

// Test 3: Check if required methods exist
const requiredMethods = [
  'tablePage',
  'tableCreate', 
  'tableUpdate',
  'tableDelete',
  'getUserInfo',
  'register',
  'sendEmail',
  'upload'
];

requiredMethods.forEach(method => {
  if (typeof window.ezsite?.apis?.[method] === 'function') {
    console.log(`✅ window.ezsite.apis.${method} is available`);
  } else {
    console.error(`❌ window.ezsite.apis.${method} is missing`);
  }
});

// Test 4: Test a simple API call (getUserInfo)
if (window.ezsite?.apis?.getUserInfo) {
  console.log('🔄 Testing getUserInfo...');
  window.ezsite.apis.getUserInfo()
    .then(result => {
      console.log('✅ getUserInfo test successful:', result);
    })
    .catch(error => {
      console.warn('⚠️ getUserInfo test failed (expected if not logged in):', error);
    });
}

console.log('🧪 Test complete! Check results above.');
