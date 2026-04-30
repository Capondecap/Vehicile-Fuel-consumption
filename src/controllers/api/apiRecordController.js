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

const FuelRecord = require('../../models/FuelRecord');

// ---------------------------------------------------------------------------
// GET /api/records
// Headers: Authorization: Bearer <token>
// Response: { success, count, records: [...] }
// ---------------------------------------------------------------------------
async function getRecords(req, res, next) {
  try {
    const userId = req.user.id; // set by jwtMiddleware

    const rows = FuelRecord.getAll(userId);

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
