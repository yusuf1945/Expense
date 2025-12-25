// Diagnostic script to check MongoDB URI configuration
require('dotenv').config();

console.log('\n🔍 MongoDB URI Configuration Check\n');
console.log('=' .repeat(50));

// Check .env file
if (process.env.MONGODB_URI) {
  const uri = process.env.MONGODB_URI;
  const maskedUri = uri.replace(/:[^:@]+@/, ':****@');
  
  console.log('✅ MONGODB_URI found in .env');
  console.log('📋 URI (password masked):', maskedUri);
  
  // Check for wrong cluster
  if (uri.includes('cluster0.mongodb.net')) {
    console.log('\n❌ PROBLEM DETECTED: Wrong cluster!');
    console.log('   URI contains: cluster0.mongodb.net');
    console.log('   Should contain: exp.hwrzhm7.mongodb.net');
  } else if (uri.includes('exp.hwrzhm7.mongodb.net')) {
    console.log('✅ Correct cluster: exp.hwrzhm7.mongodb.net');
  }
  
  // Check for database name
  if (uri.match(/mongodb\+srv:\/\/[^/]+\/(\w+)/)) {
    const dbName = uri.match(/mongodb\+srv:\/\/[^/]+\/(\w+)/)[1];
    console.log('✅ Database name:', dbName);
  } else {
    console.log('⚠️  No database name in URI (will use default)');
  }
} else {
  console.log('❌ MONGODB_URI not found in .env file');
  console.log('💡 Make sure .env exists in project root');
}

// Check Windows environment variable (if on Windows)
if (process.platform === 'win32') {
  console.log('\n' + '='.repeat(50));
  console.log('🪟 Windows Environment Variable Check');
  console.log('\nRun this command in PowerShell to check:');
  console.log('   echo $Env:MONGODB_URI');
  console.log('\nIf it shows a value with cluster0.mongodb.net:');
  console.log('   1. Delete it: setx MONGODB_URI ""');
  console.log('   2. Close PowerShell completely');
  console.log('   3. Reopen PowerShell and try again');
}

console.log('\n' + '='.repeat(50));
console.log('✅ Diagnostic complete\n');


