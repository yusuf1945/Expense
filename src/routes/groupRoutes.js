const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.post('/', groupController.createGroup);
router.post('/:id/members', groupController.addMember);
router.get('/:id/balance', groupController.getGroupBalance);

module.exports = router;
