const express = require('express');
const controller = require('../controllers/loanController');

const router = express.Router();

router.get('/', controller.getAllLoans);
router.get('/:id', controller.getLoanById);
router.post('/', controller.createLoan);

module.exports = router;
