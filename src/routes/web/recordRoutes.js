const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { csrfSynchronisedProtection } = require('../../config/csrf');
const recordController = require('../../controllers/web/recordController');

router.use(authMiddleware);

router.get('/', recordController.index);
router.get('/create', recordController.getCreate);
router.post('/create', csrfSynchronisedProtection, recordController.postCreate);
router.get('/:id/edit', recordController.getEdit);
router.post('/:id/edit', csrfSynchronisedProtection, recordController.postEdit);
router.post('/:id/delete', csrfSynchronisedProtection, recordController.postDelete);

module.exports = router;
