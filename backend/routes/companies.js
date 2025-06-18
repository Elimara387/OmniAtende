const express = require('express');
const bcrypt = require('bcryptjs');
const data = require('../utils/data');
const { ensureAuth, requireRole } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/', ensureAuth, requireRole(['desenvolvedora']), (req, res) => {
  const { nome, usuario, senha } = req.body;
  const companies = data.read('empresas.json');
  const users = data.read('usuarios.json');
  const id = companies.length + 1;
  companies.push({ id, nome });
  data.write('empresas.json', companies);
  const hashed = bcrypt.hashSync(senha, 8);
  users.push({ id: users.length + 1, usuario, senha: hashed, tipo: 'dono', empresaId: id });
  data.write('usuarios.json', users);
  logger.log(req.session.user.usuario, `cadastro empresa ${nome}`);
  res.json({ sucesso: true });
});

module.exports = router;
