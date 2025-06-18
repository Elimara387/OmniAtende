const data = require('./data');

function log(user, acao) {
  const logs = data.read('logs.json');
  logs.push({ usuario: user, acao, data: new Date().toISOString() });
  data.write('logs.json', logs);
}

module.exports = { log };
