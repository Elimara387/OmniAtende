const express = require('express');
const multer = require('multer');
const csv = require('csv-parse/sync');
const fs = require('fs');
const data = require('../utils/data');
const { ensureAuth } = require('../middleware/auth');
const logger = require('../utils/logger');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.get('/', ensureAuth, (req, res) => {
  const produtos = data.read('produtos.json');
  res.json(produtos);
});

router.post('/upload', ensureAuth, upload.single('arquivo'), (req, res) => {
  const content = fs.readFileSync(req.file.path);
  const records = csv.parse(content, { columns: true });
  const produtos = data.read('produtos.json');
  records.forEach(r => {
    produtos.push({ id: produtos.length + 1, nome: r.nome, preco: Number(r.preco), vendidos: 0 });
  });
  data.write('produtos.json', produtos);
  fs.unlinkSync(req.file.path);
  logger.log(req.session.user.usuario, 'upload produtos');
  res.json({ sucesso: true, adicionados: records.length });
});

module.exports = router;
