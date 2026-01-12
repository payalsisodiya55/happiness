const mongoose = require('mongoose');
require('dotenv').config();
const Driver = require('../models/Driver');

async function addSampleWalletTransactions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI_PROD);

    // Find the first driver
    const driver = await Driver.findOne();
    if (!driver) {
      console.log('No drivers found in database');
      return;
    }

    console.log(`Adding sample transactions for driver: ${driver.firstName} ${driver.lastName}`);

    // Sample transactions
    const sampleTransactions = [
      {
        type: 'credit',
        amount: 850,
        description: 'Trip Payment - BK-2024-001',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        type: 'credit',
        amount: 420,
        description: 'Trip Payment - BK-2024-002',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      },
      {
        type: 'debit',
        amount: 2000,
        description: 'Payout to Bank Account',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      },
      {
        type: 'credit',
        amount: 1200,
        description: 'Trip Payment - BK-2024-003',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        type: 'credit',
        amount: 150,
        description: 'Tip from Passenger',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ];

    // Add transactions to driver's wallet
    if (!driver.earnings) driver.earnings = {};
    if (!driver.earnings.wallet) driver.earnings.wallet = { balance: 0, transactions: [] };

    // Calculate new balance
    let balance = 0;
    sampleTransactions.forEach(tx => {
      if (tx.type === 'credit') {
        balance += tx.amount;
      } else if (tx.type === 'debit') {
        balance -= tx.amount;
      }
    });

    driver.earnings.wallet.transactions = sampleTransactions;
    driver.earnings.wallet.balance = Math.max(0, balance); // Ensure balance doesn't go negative

    await driver.save();

    console.log(`✅ Added ${sampleTransactions.length} sample transactions`);
    console.log(`✅ Updated wallet balance to ₹${driver.earnings.wallet.balance}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

addSampleWalletTransactions();
