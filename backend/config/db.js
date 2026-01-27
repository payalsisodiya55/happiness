const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URI_PROD || 'mongodb://localhost:27017/chalo_sawari';

  console.log('🔌 Attempting to connect to MongoDB...');
  console.log(`📡 URI: ${mongoURI.replace(/:([^@]+)@/, ':****@')}`); // Mask password if present

  const connectionOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000, // Increased timeout
    socketTimeoutMS: 45000,
    bufferCommands: true,
  };

  while (true) {
    try {
      const conn = await mongoose.connect(mongoURI, connectionOptions);

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);
      console.log(`🔌 Connection State: ${conn.connection.readyState}`);

      // Handle connection events
      mongoose.connection.on('connected', () => {
        console.log('🎉 Mongoose connected to MongoDB');
      });

      mongoose.connection.on('error', (err) => {
        console.error('❌ Mongoose connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ Mongoose disconnected from MongoDB');
      });

      // One-time fix: drop invalid compound multikey index on Vehicle.operatingArea
      try {
        const Vehicle = require('../models/Vehicle');
        const indexes = await Vehicle.collection.indexes();
        const badIndexName = 'operatingArea.cities_1_operatingArea.states_1';
        const hasBad = indexes.some(ix => ix.name === badIndexName);
        if (hasBad) {
          await Vehicle.collection.dropIndex(badIndexName);
          console.log(`🧹 Dropped invalid Vehicle index: ${badIndexName}`);
        }
      } catch (fixErr) {
        console.log('ℹ️ Vehicle index check:', fixErr?.message || fixErr);
      }

      return conn; // Success, exit loop
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);

      // Detailed error logging
      if (error.message.includes('ECONNREFUSED')) {
        console.error('💡 TIP: Check if your local MongoDB server is running on port 27017');
      }

      console.log('🔄 Retrying connection in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

module.exports = connectDB;
