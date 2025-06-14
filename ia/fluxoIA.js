const respostas = require('./respostasBaseIA.json');

function responder(pergunta) {
  if (pergunta.toLowerCase().includes('ola')) {
    return respostas.saudacao;
  }
  return 'Pergunta não encontrada';
}

module.exports = { responder };
