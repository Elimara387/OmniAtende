const express = require('express');
const data = require('../utils/data');
const { ensureAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', ensureAuth, requireRole(['desenvolvedora']), (req, res) => {
  const logs = data.read('logs.json');
  res.json(logs);
});

module.exports = router;
