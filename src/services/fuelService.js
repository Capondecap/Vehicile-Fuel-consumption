// Business logic layer for fuel records — validation and delegation to FuelRecord model.
const FuelRecord = require('../models/FuelRecord');

const VALID_VEHICLE_TYPES = ['Car', 'Motorcycle'];

function validateRecordData(data) {
  const liters = parseFloat(data.liters);
  const distanceKm = parseFloat(data.distanceKm);
  const totalCost = parseFloat(data.totalCost);

  if (!data.date) return 'Date is required.';
  if (!VALID_VEHICLE_TYPES.includes(data.vehicleType)) return 'Vehicle type must be Car or Motorcycle.';
  if (isNaN(liters) || liters <= 0) return 'Liters must be a positive number.';
  if (isNaN(distanceKm) || distanceKm <= 0) return 'Distance must be a positive number.';
  if (isNaN(totalCost) || totalCost <= 0) return 'Total cost must be a positive number.';
  return null;
}

const fuelService = {
  getAllRecords(userId) {
    return FuelRecord.getAll(userId);
  },

  getRecord(id) {
    return FuelRecord.getById(id);
  },

  createRecord(userId, data) {
    const error = validateRecordData(data);
    if (error) return { error };
    const record = FuelRecord.create({ ...data, userId });
    return { record };
  },

  updateRecord(id, data) {
    const error = validateRecordData(data);
    if (error) return { error };
    const record = FuelRecord.update(id, data);
    if (!record) return { error: 'Record not found.' };
    return { record };
  },

  deleteRecord(id) {
    const deleted = FuelRecord.delete(id);
    if (!deleted) return { error: 'Record not found.' };
    return { success: true };
  },
};

module.exports = fuelService;
