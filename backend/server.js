const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
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

function writeData(file, data) {
  const filePath = path.join(__dirname, '../data', file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  const users = readData('usuarios.json');
  const user = users.find(u => u.usuario === usuario);
  if (user && bcrypt.compareSync(senha, user.senha)) {
    req.session.user = { usuario: user.usuario, tipo: user.tipo };
    return res.json({ sucesso: true, tipo: user.tipo });
  }
  res.status(401).json({ sucesso: false });
});

function autorizado(req, res, next) {
  if (!req.session.user) return res.status(401).end();
  next();
}

function roleRequired(...roles) {
  return (req, res, next) => {
    if (!req.session.user || !roles.includes(req.session.user.tipo)) {
      return res.status(403).end();
    }
    next();
  };
}

app.post('/usuarios', roleRequired('dono', 'desenvolvedora'), (req, res) => {
  const { usuario, senha, tipo } = req.body;
  const users = readData('usuarios.json');
  if (users.find(u => u.usuario === usuario)) {
    return res.status(400).json({ erro: 'Usuário já existe' });
  }
  const novo = { id: users.length + 1, usuario, senha: bcrypt.hashSync(senha, 10), tipo };
  users.push(novo);
  writeData('usuarios.json', users);
  res.json(novo);
});

app.get('/produtos', autorizado, (req, res) => {
  const produtos = readData('produtos.json');
  res.json(produtos);
});

app.get('/entregas', autorizado, (req, res) => {
  const entregas = readData('entregas.json');
  res.json(entregas);
});

app.get('/pedidos', autorizado, (req, res) => {
  const pedidos = readData('pedidos.json');
  res.json(pedidos);
});

app.get('/catalogo', autorizado, (req, res) => {
  const catalogo = readData('catalogo.json');
  res.json(catalogo);
});

app.get('/empresa', autorizado, (req, res) => {
  const empresa = readData('empresa.json');
  res.json(empresa);
});

app.get('/relatorios', autorizado, (req, res) => {
  const relatorios = readData('relatorios.json');
  res.json(relatorios);
});

app.post('/relatorios', roleRequired('dono', 'desenvolvedora'), (req, res) => {
  const relatorios = readData('relatorios.json');
  const novo = { id: relatorios.length + 1, ...req.body };
  relatorios.push(novo);
  writeData('relatorios.json', relatorios);
  res.json(novo);
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
