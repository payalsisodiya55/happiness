const Penalty = require('../models/Penalty');

/**
 * SLA Penalty Calculator
 * Handles all penalty calculations based on Service Level Agreement rules
 */
class PenaltyCalculator {

  /**
   * Calculate cancellation penalty based on time difference
   * @param {Object} booking - Booking object
   * @param {Date} cancelledAt - When the booking was cancelled
   * @returns {Object} Penalty details
   */
  static calculateCancellationPenalty(booking, cancelledAt) {
    const departureTime = new Date(`${booking.tripDetails.date}T${booking.tripDetails.time}`);
    const timeDiff = departureTime - cancelledAt;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    // SLA Rules for cancellation penalties
    if (hoursDiff <= 0.5) {
      // Within 30 minutes of acceptance
      return {
        type: 'cancellation_30min_after_acceptance',
        amount: 100,
        reason: 'Cancellation within 30 minutes of booking acceptance'
      };
    } else if (hoursDiff <= 3) {
      // Within 3 hours of departure
      return {
        type: 'cancellation_3h_within',
        amount: 500,
        reason: 'Cancellation within 3 hours of departure'
      };
    } else if (hoursDiff <= 12) {
      // Within 12 hours of departure
      return {
        type: 'cancellation_12h_within',
        amount: 300,
        reason: 'Cancellation within 12 hours of departure'
      };
    } else {
      // 12 hours before departure
      return {
        type: 'cancellation_12h_before',
        amount: 300,
        reason: 'Cancellation 12 hours before departure'
      };
    }
  }

  /**
   * Get penalty amount for specific violation type
   * @param {string} type - Penalty type
   * @returns {number} Penalty amount
   */
  static getPenaltyAmount(type) {
    const penaltyAmounts = {
      'cancellation_12h_before': 300,
      'cancellation_12h_within': 300,
      'cancellation_3h_within': 500,
      'cancellation_30min_after_acceptance': 100,
      'wrong_car_assigned': 200,
      'wrong_driver_assigned': 200,
      'cng_car_no_carrier': 200,
      'journey_not_completed_in_app': 100,
      'car_not_clean': 200,
      'car_not_good_condition': 250,
      'driver_misbehaved': 200
    };
    return penaltyAmounts[type] || 0;
  }

  /**
   * Get penalty reason for specific type
   * @param {string} type - Penalty type
   * @returns {string} Human readable reason
   */
  static getPenaltyReason(type) {
    const reasons = {
      'cancellation_12h_before': 'Cancellation 12 hours before departure - ₹300 fine',
      'cancellation_12h_within': 'Cancellation within 12 hours of departure - ₹300 fine',
      'cancellation_3h_within': 'Cancellation within 3 hours of departure - ₹500 fine',
      'cancellation_30min_after_acceptance': 'Cancellation within 30 minutes of acceptance - ₹100 fine',
      'wrong_car_assigned': 'Sending a car different from the one selected in the app - ₹200 fine',
      'wrong_driver_assigned': 'Sending a different driver to the customer than the one selected in the driver app - ₹200 fine',
      'cng_car_no_carrier': 'If a CNG car is provided in the sedan category, it must have a carrier. Adequate boot space in the trunk must be ensured - ₹200 fine',
      'journey_not_completed_in_app': 'Driver did not complete the journey in the app and it was not completed through the customer - ₹100 fine',
      'car_not_clean': 'Car is not clean - ₹200 fine',
      'car_not_good_condition': 'Car is not in good condition - ₹250 fine',
      'driver_misbehaved': 'Driver misbehaved with the customer - ₹200 fine'
    };
    return reasons[type] || 'SLA Violation';
  }

  /**
   * Validate if penalty can be applied
   * @param {string} type - Penalty type
   * @param {Object} context - Additional context (booking, driver, etc.)
   * @returns {boolean} Whether penalty can be applied
   */
  static canApplyPenalty(type, context = {}) {
    // Add validation logic here based on business rules
    // For example, some penalties might only apply in certain conditions

    switch (type) {
      case 'cng_car_no_carrier':
        // Only applies to CNG cars in sedan category
        return context.vehicle?.fuelType === 'cng' && context.vehicle?.type === 'sedan';

      case 'wrong_car_assigned':
      case 'wrong_driver_assigned':
        // These require booking context
        return !!context.booking;

      default:
        return true;
    }
  }

  /**
   * Create penalty record
   * @param {Object} penaltyData - Penalty data
   * @returns {Object} Created penalty
   */
  static async createPenalty(penaltyData) {
    const penalty = new Penalty({
      driver: penaltyData.driverId,
      type: penaltyData.type,
      amount: penaltyData.amount,
      reason: penaltyData.reason,
      booking: penaltyData.bookingId || null,
      appliedBy: penaltyData.appliedBy,
      status: 'active'
    });

    return await penalty.save();
  }

  /**
   * Apply penalty to driver (deduct from wallet)
   * @param {string} driverId - Driver ID
   * @param {Object} penaltyData - Penalty data
   * @returns {Object} Result
   */
  static async applyPenaltyToDriver(driverId, penaltyData) {
    const Driver = require('../models/Driver');

    const driver = await Driver.findById(driverId);
    if (!driver) {
      throw new Error('Driver not found');
    }

    // Apply penalty using driver's method
    await driver.applyPenalty(
      penaltyData.type,
      penaltyData.amount,
      penaltyData.reason,
      penaltyData.bookingId,
      penaltyData.appliedBy
    );

    // Create penalty record
    const penalty = await this.createPenalty({
      driverId,
      type: penaltyData.type,
      amount: penaltyData.amount,
      reason: penaltyData.reason,
      bookingId: penaltyData.bookingId,
      appliedBy: penaltyData.appliedBy
    });

    return { driver, penalty };
  }
}

module.exports = PenaltyCalculator;

