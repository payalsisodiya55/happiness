const mongoose = require('mongoose');
require('dotenv').config();
const Driver = require('../models/Driver');

async function checkWalletTransactions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI_PROD);
    const drivers = await Driver.find().limit(3);
    console.log('Checking wallet transactions for drivers:');

    drivers.forEach((driver, index) => {
      const transactions = driver.earnings?.wallet?.transactions || [];
      console.log(`Driver ${index + 1}: ${driver.firstName} ${driver.lastName}`);
      console.log(`  Balance: ₹${driver.earnings?.wallet?.balance || 0}`);
      console.log(`  Transactions: ${transactions.length}`);
      if (transactions.length > 0) {
        transactions.slice(0, 2).forEach((tx, txIndex) => {
          console.log(`    ${txIndex + 1}. ${tx.type} ₹${tx.amount} - ${tx.description} (${tx.date})`);
        });
      }
      console.log('');
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkWalletTransactions();
