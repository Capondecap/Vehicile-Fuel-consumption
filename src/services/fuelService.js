/**
 * fuelService.js  — Person 3  (statistics slice only)
 *
 * IMPORTANT — ownership split:
 *   Person 2 owns:  createRecord, getRecords, updateRecord, deleteRecord
 *   Person 3 owns:  aggregateByWeek, aggregateByMonth, computeSummary
 *
 * P2 will likely add their CRUD functions into this same file when they merge.
 * To avoid conflicts: P3 only adds the THREE functions below, at the BOTTOM.
 * Do not touch any functions P2 has written above this block.
 *
 * This file imports FuelRecord — the model P2 owns. During dev we use the
 * mock below so P3 can run independently.
 */

// ---------------------------------------------------------------------------
// Model import — swap comment when P2 merges their model
// ---------------------------------------------------------------------------
let FuelRecord;
try {
  FuelRecord = require('../models/FuelRecord'); // P2's real model
} catch {
  // ── MOCK (remove after P2 merges) ─────────────────────────────────────────
  FuelRecord = {
    findAll: async ({ where }) => {
      const all = [
        { id: 1, userId: where.userId, date: '2025-06-02', vehicleType: 'Car',        liters: 40, distanceKm: 480, totalCost: 2800 },
        { id: 2, userId: where.userId, date: '2025-06-09', vehicleType: 'Motorcycle', liters: 10, distanceKm: 180, totalCost:  700 },
        { id: 3, userId: where.userId, date: '2025-06-16', vehicleType: 'Car',        liters: 35, distanceKm: 420, totalCost: 2450 },
        { id: 4, userId: where.userId, date: '2025-06-23', vehicleType: 'Car',        liters: 42, distanceKm: 504, totalCost: 2940 },
        { id: 5, userId: where.userId, date: '2025-07-07', vehicleType: 'Motorcycle', liters:  8, distanceKm: 160, totalCost:  560 },
        { id: 6, userId: where.userId, date: '2025-07-14', vehicleType: 'Car',        liters: 50, distanceKm: 600, totalCost: 3500 },
        { id: 7, userId: where.userId, date: '2025-07-21', vehicleType: 'Car',        liters: 38, distanceKm: 456, totalCost: 2660 },
      ];
      return all;
    },
  };
  // ──────────────────────────────────────────────────────────────────────────
}

const { getISOWeekLabel, getMonthLabel, formatMonthLabel } = require('../utils/dateUtils');

// ---------------------------------------------------------------------------
// ── Person 3 functions start here ──────────────────────────────────────────
// ---------------------------------------------------------------------------

/**
 * Rounds a number to 2 decimal places (avoids floating-point noise in output).
 */
function round2(n) {
  return Math.round(n * 100) / 100;
}

/**
 * Builds a group accumulator bucket.
 */
function emptyBucket(label) {
  return { label, totalCost: 0, totalLiters: 0, totalKm: 0, recordCount: 0 };
}

/**
 * Finalise a bucket: add derived fields, round everything.
 */
function finaliseBucket(bucket) {
  return {
    ...bucket,
    totalCost:    round2(bucket.totalCost),
    totalLiters:  round2(bucket.totalLiters),
    totalKm:      round2(bucket.totalKm),
    avgEfficiency: bucket.totalLiters > 0
      ? round2(bucket.totalKm / bucket.totalLiters)
      : 0,                                       // km/L average
  };
}

/**
 * aggregateByWeek(userId)
 *
 * Fetches all records for the user and groups them by ISO week.
 * Returns an array sorted chronologically:
 * [
 *   { label: '2025-W24', totalCost, totalLiters, totalKm, recordCount, avgEfficiency },
 *   ...
 * ]
 */
async function aggregateByWeek(userId) {
  const records = await FuelRecord.findAll({ where: { userId } });
  const map = {};

  for (const r of records) {
    const key = getISOWeekLabel(r.date);
    if (!map[key]) map[key] = emptyBucket(key);
    map[key].totalCost   += Number(r.totalCost);
    map[key].totalLiters += Number(r.liters);
    map[key].totalKm     += Number(r.distanceKm);
    map[key].recordCount += 1;
  }

  return Object.values(map)
    .sort((a, b) => a.label.localeCompare(b.label))
    .map(finaliseBucket);
}

/**
 * aggregateByMonth(userId)
 *
 * Fetches all records for the user and groups them by calendar month.
 * Returns an array sorted chronologically:
 * [
 *   { label: '2025-06', displayLabel: 'June 2025', totalCost, ... },
 *   ...
 * ]
 */
async function aggregateByMonth(userId) {
  const records = await FuelRecord.findAll({ where: { userId } });
  const map = {};

  for (const r of records) {
    const key = getMonthLabel(r.date);
    if (!map[key]) map[key] = emptyBucket(key);
    map[key].totalCost   += Number(r.totalCost);
    map[key].totalLiters += Number(r.liters);
    map[key].totalKm     += Number(r.distanceKm);
    map[key].recordCount += 1;
  }

  return Object.values(map)
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((bucket) => ({ ...finaliseBucket(bucket), displayLabel: formatMonthLabel(bucket.label) }));
}

/**
 * computeSummary(userId)
 *
 * Convenience function used by the stats API endpoint.
 * Returns both breakdowns in one call.
 */
async function computeSummary(userId) {
  const [weekly, monthly] = await Promise.all([
    aggregateByWeek(userId),
    aggregateByMonth(userId),
  ]);
  return { weekly, monthly };
}

// ---------------------------------------------------------------------------
// ── Person 3 functions end here ────────────────────────────────────────────
// ---------------------------------------------------------------------------

module.exports = {
  // P3 exports — do NOT remove
  aggregateByWeek,
  aggregateByMonth,
  computeSummary,

  // P2 will add their exports here when they merge:
  // createRecord, getRecordById, getRecordsByUser, updateRecord, deleteRecord
};