const mongoose = require('mongoose');
const { Ingresso, User } = require('../models');

exports.comprarIngresso = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { ingressoId, quantidade } = req.body;

    // Validação dos dados
    if (!ingressoId || !quantidade || quantidade <= 0) {
      return res.status(400).json({ message: 'Dados inválidos!' });
    }

    // Verifica se o ID do ingresso é válido
    if (!mongoose.Types.ObjectId.isValid(ingressoId)) {
      return res.status(400).json({ message: 'ID do ingresso inválido!' });
    }

    // Verifica se o ingresso existe
    const ingresso = await Ingresso.findById(ingressoId).session(session);
    if (!ingresso) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Ingresso não encontrado!' });
    }

    // Verifica se há ingressos suficientes
    if (ingresso.quantidade < quantidade) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Quantidade indisponível!' });
    }

    // Atualiza a quantidade de ingressos
    ingresso.quantidade -= quantidade;
    await ingresso.save({ session });

    // Adiciona o ingresso ao usuário
    const user = await User.findById(req.userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    user.ingressosComprados.push(ingressoId);
    await user.save({ session });

    // Confirma a transação
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Ingresso comprado com sucesso!', ingresso });
  } catch (error) {
    // Em caso de erro, cancela a transação
    await session.abortTransaction();
    session.endSession();
    console.error('Erro ao comprar ingresso:', error);
    res.status(500).json({ message: 'Erro ao comprar ingresso', error: error.message });
  }
};