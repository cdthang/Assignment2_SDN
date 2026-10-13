const express = require('express');
const controller = require('../controllers/memberController');

const router = express.Router();

router.get('/', controller.getAllMembers);
router.get('/:id', controller.getMemberById);
router.post('/', controller.createMember);
router.put('/:id', controller.updateMember);
router.delete('/:id', controller.deleteMember);

module.exports = router;