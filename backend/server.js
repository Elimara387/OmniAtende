const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const fluxoIA = require('../ia/fluxoIA');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'omniatende', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

function readData(file) {
  const filePath = path.join(__dirname, '../data', file);
  return JSON.parse(fs.readFileSync(filePath));
}

app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  const users = readData('usuarios.json');
  const user = users.find(u => u.usuario === usuario && u.senha === senha);
  if (user) {
    req.session.user = { usuario: user.usuario, tipo: user.tipo };
    return res.json({ sucesso: true, tipo: user.tipo });
  }
  res.status(401).json({ sucesso: false });
});

function autorizado(req, res, next) {
  if (!req.session.user) return res.status(401).end();
  next();
}

app.get('/produtos', autorizado, (req, res) => {
  const produtos = readData('produtos.json');
  res.json(produtos);
});

app.get('/entregas', autorizado, (req, res) => {
  const entregas = readData('entregas.json');
  res.json(entregas);
});

app.get('/suporte', autorizado, (req, res) => {
  const suporte = readData('suporte.json');
  res.json(suporte);
});

app.post('/ia', autorizado, (req, res) => {
  const { pergunta } = req.body;
  const resposta = fluxoIA.responder(pergunta);
  res.json({ resposta });
});

app.get('/dashboard', autorizado, (req, res) => {
  const produtos = readData('produtos.json');
  const entregas = readData('entregas.json');
  const totalVendas = produtos.reduce((acc, p) => acc + p.vendidos * p.preco, 0);
  const pedidos = produtos.reduce((acc, p) => acc + p.vendidos, 0);
  res.json({ totalVendas, pedidos, entregas });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
