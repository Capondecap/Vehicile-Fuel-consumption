/**
 * src/routes/api/recordRoutes.js  — Person 3
 *
 * Mounts (all protected by JWT middleware):
 *   GET  /api/records          → list records
 *   GET  /api/records/stats    → weekly + monthly stats
 *
 * IMPORTANT — route order matters:
 *   /stats must be declared BEFORE /:id so Express doesn't treat
 *   the string "stats" as a record ID parameter.
 *
 * This file is registered in app.js (Person 1) as:
 *   app.use('/api/records', require('./routes/api/recordRoutes'));
 *
 * POST/PUT/DELETE routes belong to Person 2.
 * When P2 merges, they add their routes into this file below the P3 block.
 */

const express        = require('express');
const jwtMiddleware  = require('../../middlewares/jwtMiddleware');
const { getRecords, getStats } = require('../../controllers/api/apiRecordController');

const router = express.Router();

// Apply JWT guard to every route in this file
router.use(jwtMiddleware);

// ── Person 3 routes ──────────────────────────────────────────────────────────

// GET /api/records/stats  ← must be before /:id
router.get('/stats', getStats);

// GET /api/records
router.get('/', getRecords);

// ── Person 2 adds their routes below this line when they merge ───────────────
// router.post('/',      createRecord);
// router.put('/:id',   updateRecord);
// router.delete('/:id', deleteRecord);

module.exports = router;
