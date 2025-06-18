function ensureAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({erro: 'Nao autorizado'});
  next();
}

function requireRole(roles) {
  return function(req, res, next) {
    if (!req.session.user || !roles.includes(req.session.user.tipo)) {
      return res.status(403).json({erro: 'Sem permissao'});
    }
    next();
  };
}

module.exports = { ensureAuth, requireRole };
