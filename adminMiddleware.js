module.exports = (req, res, next) => {
    if (!req.isAdmin) {
      return res.status(403).json({ message: 'Acesso negado! Apenas administradores podem realizar esta ação.' });
    }
    next();
  };