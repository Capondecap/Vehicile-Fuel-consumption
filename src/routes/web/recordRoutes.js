// Express router for fuel record web routes — all routes require authentication.
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const recordController = require('../../controllers/web/recordController');

router.use(authMiddleware);

router.get('/', recordController.index);
router.get('/create', recordController.getCreate);
router.post('/create', recordController.postCreate);
router.get('/:id/edit', recordController.getEdit);
router.post('/:id/edit', recordController.postEdit);
router.post('/:id/delete', recordController.postDelete);

module.exports = router;
