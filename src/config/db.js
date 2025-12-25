const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Verify MONGODB_URI is loaded
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI is not defined in environment variables');
      console.error('💡 Make sure .env file exists in project root and contains MONGODB_URI');
      process.exit(1);
    }

    // Debug: Show which URI is being used (mask password for security)
    const uriForLog = process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@');
    console.log('🔍 MONGO URI:', uriForLog);
    
    // Check if wrong cluster is being used
    if (process.env.MONGODB_URI.includes('cluster0.mongodb.net')) {
      console.error('❌ ERROR: Wrong cluster detected! URI contains cluster0.mongodb.net');
      console.error('💡 Your .env should use: exp.hwrzhm7.mongodb.net');
      console.error('💡 Possible causes:');
      console.error('   1. Windows environment variable override (check with: echo $Env:MONGODB_URI)');
      console.error('   2. Another .env file in a parent directory');
      console.error('   3. Hardcoded value elsewhere in code');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    if (err.message.includes('ENOTFOUND') || err.message.includes('querySrv')) {
      console.error('💡 DNS Error: Check if your MongoDB URI hostname is correct');
      console.error('💡 If using exp.hwrzhm7.mongodb.net, verify it matches your Atlas cluster');
    } else if (err.message.includes('ECONNREFUSED') || err.message.includes('MongoNetworkError')) {
      console.error('💡 Tip: Check MongoDB Atlas IP whitelist settings');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
