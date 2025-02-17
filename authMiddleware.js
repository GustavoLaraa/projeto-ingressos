const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso negado! Token não fornecido ou inválido.' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado!' });
  }
};