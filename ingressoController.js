// Exemplo para ingressoController.js
exports.comprarIngresso = async (req, res) => {
  try {
    const { tipo, quantidade } = req.body;
    const userId = req.userId;

    if (!tipo || !quantidade || quantidade <= 0) {
      return res.status(400).json({ message: 'Dados inválidos!' });
    }

    const ingresso = await Ingresso.findOne({ tipo });
    if (!ingresso) {
      return res.status(404).json({ message: 'Tipo de ingresso não encontrado!' });
    }

    if (ingresso.quantidade < quantidade) {
      return res.status(400).json({ message: 'Quantidade indisponível!' });
    }

    ingresso.quantidade -= quantidade;
    await ingresso.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    user.ingressosComprados.push(ingresso._id);
    await user.save();

    res.status(200).json({ message: 'Ingresso comprado com sucesso!', ingresso });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao comprar ingresso', error: error.message });
  }
};