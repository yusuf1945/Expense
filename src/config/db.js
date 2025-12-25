const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ MONGODB_URI is not defined in .env');
      process.exit(1);
    }

    // Mask password in logs
    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.log('🔍 Connecting to:', maskedUri);

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

