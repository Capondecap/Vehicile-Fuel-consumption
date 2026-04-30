const VEHICLE_TYPES = ['Car', 'Motorcycle'];

function validateFuelRecord({ date, vehicleType, liters, distanceKm, totalCost }) {
  if (!date || !vehicleType || !liters || !distanceKm || !totalCost) {
    return 'All fields are required.';
  }
  if (!VEHICLE_TYPES.includes(vehicleType)) {
    return 'Vehicle type must be Car or Motorcycle.';
  }
  if (parseFloat(liters) <= 0 || parseFloat(distanceKm) <= 0 || parseFloat(totalCost) <= 0) {
    return 'Liters, distance, and cost must be positive numbers.';
  }
  return null;
}

module.exports = { validateFuelRecord };
