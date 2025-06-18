const express = require('express');
const fluxoIA = require('../../ia/fluxoIA');
const { ensureAuth } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/', ensureAuth, (req, res) => {
  const { pergunta } = req.body;
  const resposta = fluxoIA.responder(pergunta);
  logger.log(req.session.user.usuario, 'pergunta ia');
  res.json({ resposta });
});

module.exports = router;
