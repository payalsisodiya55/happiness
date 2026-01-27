const mongoose = require('mongoose');
const Driver = require('../models/Driver');
const User = require('../models/User');
const Payment = require('../models/Payment');
require('dotenv').config();

// Connect to DB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI_PROD || process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const debugWallet = async () => {
    await connectDB();

    try {
        // 1. Find a valid driver
        console.log('Finding a driver...');
        const driver = await Driver.findOne({ isApproved: true }); // Get an active driver

        if (!driver) {
            console.log('No driver found to test.');
            process.exit(1);
        }

        console.log(`Testing with Driver: ${driver.firstName} ${driver.lastName} (${driver._id})`);
        console.log(`Current Balance: ${driver.earnings?.wallet?.balance}`);

        // 2. Try addEarnings method
        console.log('--- Attempting addEarnings method ---');
        try {
            await driver.addEarnings(1, 'Test Debug Credit');
            console.log('✅ addEarnings SUCCESS');
        } catch (error) {
            console.error('❌ addEarnings FAILED:', error.message);
            if (error.errors) {
                Object.keys(error.errors).forEach(key => {
                    console.error(`   Validation Error [${key}]: ${error.errors[key].message}`);
                });
            }
        }

        // 3. Try Manual Update (Mocking the fallback)
        console.log('--- Attempting Manual Update ---');
        try {
            // Re-fetch to clear changes if any
            const driverManual = await Driver.findById(driver._id);
            if (!driverManual.earnings) driverManual.earnings = { wallet: { balance: 0, transactions: [] } };

            driverManual.earnings.wallet.balance += 1;
            driverManual.earnings.wallet.transactions.push({
                type: 'credit',
                amount: 1,
                description: 'Test Manual Credit',
                date: new Date()
            });
            await driverManual.save();
            console.log('✅ Manual Update SUCCESS');
        } catch (error) {
            console.error('❌ Manual Update FAILED:', error.message);
            if (error.errors) {
                Object.keys(error.errors).forEach(key => {
                    console.error(`   Validation Error [${key}]: ${error.errors[key].message}`);
                });
            }
        }

    } catch (err) {
        console.error('General Error:', err);
    } finally {
        console.log('Done.');
        process.exit(0);
    }
};

debugWallet();
