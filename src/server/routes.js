const express = require('express');
const loanInfo = require('./studentLoan');
const router = new express.Router();

router.get('/api/currentrates', loanInfo.getLoanInfo);

module.exports = router;
