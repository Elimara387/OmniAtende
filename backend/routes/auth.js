const express = require('express');
const bcrypt = require('bcryptjs');
const data = require('../utils/data');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  const users = data.read('usuarios.json');
  const user = users.find(u => u.usuario === usuario);
  if (!user || !bcrypt.compareSync(senha, user.senha)) {
    return res.status(401).json({ erro: 'Credenciais invalidas' });
  }
  req.session.user = { usuario: user.usuario, tipo: user.tipo };
  logger.log(user.usuario, 'login');
  res.json({ sucesso: true, tipo: user.tipo });
});

router.post('/logout', (req, res) => {
  if (req.session.user) logger.log(req.session.user.usuario, 'logout');
  req.session.destroy(() => res.json({ sucesso: true }));
});

module.exports = router;
