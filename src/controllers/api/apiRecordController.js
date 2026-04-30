/**
 * apiRecordController.js  — Person 3
 *
 * Handles all JSON responses for fuel record API routes:
 *   GET  /api/records          → list records for authenticated user (JWT)
 *   GET  /api/records/stats    → weekly + monthly expenditure summary (JWT)
 *
 * NOTE: POST/PUT/DELETE /api/records belong to Person 2's scope.
 *       Do not add CRUD mutation handlers here — P2 may add them to this file
 *       when they merge, or create their own controller. Coordinate with P2.
 */

const { computeSummary, aggregateByWeek, aggregateByMonth } = require('../../services/fuelService');

// ---------------------------------------------------------------------------
// FuelRecord model — P2 owns this. Mock fallback for solo development.
// ---------------------------------------------------------------------------
let FuelRecord;
try {
  FuelRecord = require('../../models/FuelRecord');
} catch {
  // ── MOCK (remove after P2 merges) ─────────────────────────────────────────
  FuelRecord = {
    findAll: async ({ where }) => [
      { id: 1, userId: where.userId, date: '2025-06-02', vehicleType: 'Car',        liters: 40, distanceKm: 480, totalCost: 2800 },
      { id: 2, userId: where.userId, date: '2025-06-09', vehicleType: 'Motorcycle', liters: 10, distanceKm: 180, totalCost:  700 },
      { id: 3, userId: where.userId, date: '2025-06-16', vehicleType: 'Car',        liters: 35, distanceKm: 420, totalCost: 2450 },
      { id: 4, userId: where.userId, date: '2025-06-23', vehicleType: 'Car',        liters: 42, distanceKm: 504, totalCost: 2940 },
      { id: 5, userId: where.userId, date: '2025-07-07', vehicleType: 'Motorcycle', liters:  8, distanceKm: 160, totalCost:  560 },
      { id: 6, userId: where.userId, date: '2025-07-14', vehicleType: 'Car',        liters: 50, distanceKm: 600, totalCost: 3500 },
      { id: 7, userId: where.userId, date: '2025-07-21', vehicleType: 'Car',        liters: 38, distanceKm: 456, totalCost: 2660 },
    ],
  };
  // ──────────────────────────────────────────────────────────────────────────
}

// ---------------------------------------------------------------------------
// GET /api/records
// Headers: Authorization: Bearer <token>
// Response: { success, count, records: [...] }
// ---------------------------------------------------------------------------
async function getRecords(req, res, next) {
  try {
    const userId = req.user.id; // set by jwtMiddleware

    const rows = await FuelRecord.findAll({ where: { userId } });

    // Attach km/L efficiency to every record in the response
    const records = rows.map((r) => ({
      id:            r.id,
      date:          r.date,
      vehicleType:   r.vehicleType,
      liters:        r.liters,
      distanceKm:    r.distanceKm,
      totalCost:     r.totalCost,
      efficiencyKmL: r.liters > 0
        ? Math.round((r.distanceKm / r.liters) * 100) / 100
        : 0,
    }));

    return res.status(200).json({ success: true, count: records.length, records });
  } catch (err) {
    return next(err);
  }
}

// ---------------------------------------------------------------------------
// GET /api/records/stats
// Headers: Authorization: Bearer <token>
// Query:   ?groupBy=week|month|both  (default: both)
// Response: { success, groupBy, data: { weekly?: [...], monthly?: [...] } }
// ---------------------------------------------------------------------------
async function getStats(req, res, next) {
  try {
    const userId  = req.user.id;
    const groupBy = req.query.groupBy || 'both'; // 'week' | 'month' | 'both'

    let data = {};

    if (groupBy === 'week') {
      data.weekly = await aggregateByWeek(userId);
    } else if (groupBy === 'month') {
      data.monthly = await aggregateByMonth(userId);
    } else {
      // 'both' — default
      const summary = await computeSummary(userId);
      data.weekly  = summary.weekly;
      data.monthly = summary.monthly;
    }

    return res.status(200).json({ success: true, groupBy, data });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getRecords, getStats };
