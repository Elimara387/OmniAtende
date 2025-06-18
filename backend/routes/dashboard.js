const express = require('express');
const data = require('../utils/data');
const { ensureAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', ensureAuth, (req, res) => {
  const produtos = data.read('produtos.json');
  const entregas = data.read('entregas.json');
  const totalVendas = produtos.reduce((acc, p) => acc + p.vendidos * p.preco, 0);
  const pedidos = produtos.reduce((acc, p) => acc + p.vendidos, 0);
  res.json({ totalVendas, pedidos, entregas });
});

module.exports = router;
