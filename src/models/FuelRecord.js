// In-memory CRUD model for fuel records with auto-calculated efficiency field.
const db = require('../config/db');

let nextId = 1;

const FuelRecord = {
  getAll(userId) {
    return db.records.filter((r) => r.userId === userId);
  },

  getById(id) {
    return db.records.find((r) => r.id === id) || null;
  },

  create(data) {
    const record = {
      id: nextId++,
      userId: data.userId,
      date: data.date,
      vehicleType: data.vehicleType,
      liters: parseFloat(data.liters),
      distanceKm: parseFloat(data.distanceKm),
      totalCost: parseFloat(data.totalCost),
      efficiency: parseFloat(data.distanceKm) / parseFloat(data.liters),
    };
    db.records.push(record);
    return record;
  },

  update(id, data) {
    const index = db.records.findIndex((r) => r.id === id);
    if (index === -1) return null;
    const updated = {
      ...db.records[index],
      date: data.date,
      vehicleType: data.vehicleType,
      liters: parseFloat(data.liters),
      distanceKm: parseFloat(data.distanceKm),
      totalCost: parseFloat(data.totalCost),
      efficiency: parseFloat(data.distanceKm) / parseFloat(data.liters),
    };
    db.records[index] = updated;
    return updated;
  },

  delete(id) {
    const index = db.records.findIndex((r) => r.id === id);
    if (index === -1) return false;
    db.records.splice(index, 1);
    return true;
  },
};

module.exports = FuelRecord;
