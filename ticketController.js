const mongoose = require('mongoose');
const Ticket = require('../models/ticket');
const User = require('../models/User');

// Listar todos os ingressos
const listarTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar tickets', error: error.message });
  }
};

// Criar um novo ingresso (apenas administradores)
const criarTicket = async (req, res) => {
  try {
    const { tipo, preco, quantidade, descricao } = req.body;

    if (!tipo || !preco || !quantidade) {
      return res.status(400).json({ message: 'Tipo, preço e quantidade são obrigatórios!' });
    }

    const novoIngresso = await Ticket.create({ tipo, preco, quantidade, descricao });
    res.status(201).json({ message: 'Ingresso criado com sucesso!', ingresso: novoIngresso });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar ingresso', error: error.message });
  }
};

// Atualizar um ingresso (apenas administradores)
const atualizarTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, preco, quantidade, descricao } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID do ingresso inválido!' });
    }

    const ingresso = await Ticket.findById(id);
    if (!ingresso) {
      return res.status(404).json({ message: 'Ingresso não encontrado!' });
    }

    if (quantidade < 0) {
      return res.status(400).json({ message: 'A quantidade não pode ser negativa!' });
    }

    ingresso.tipo = tipo || ingresso.tipo;
    ingresso.preco = preco || ingresso.preco;
    ingresso.quantidade = quantidade || ingresso.quantidade;
    ingresso.descricao = descricao || ingresso.descricao;

    await ingresso.save();
    res.status(200).json({ message: 'Ingresso atualizado com sucesso!', ingresso });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar ingresso', error: error.message });
  }
};

// Deletar um ingresso (apenas administradores)
const deletarTicket = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID do ingresso inválido!' });
    }

    const ingresso = await Ticket.findByIdAndDelete(id);
    if (!ingresso) {
      return res.status(404).json({ message: 'Ingresso não encontrado!' });
    }

    res.status(200).json({ message: 'Ingresso deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar ingresso', error: error.message });
  }
};

// Comprar ingresso (usuários autenticados)
const comprarTicket = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { tipo, quantidade } = req.body;
    const userId = req.userId;

    if (!tipo || !quantidade || quantidade <= 0) {
      return res.status(400).json({ message: 'Dados inválidos!' });
    }

    const ingresso = await Ticket.findOne({ tipo }).session(session);
    if (!ingresso) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Tipo de ingresso não encontrado!' });
    }

    if (ingresso.quantidade < quantidade) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Quantidade indisponível!' });
    }

    ingresso.quantidade -= quantidade;
    await ingresso.save({ session });

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    user.ticketsComprados.push(ingresso._id);
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Ingresso comprado com sucesso!', ingresso });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Erro ao comprar ingresso:', error);
    res.status(500).json({ message: 'Erro ao comprar ingresso', error: error.message });
  }
};

// Histórico de compras (usuários autenticados)
const historicoCompras = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('ticketsComprados');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }
    res.status(200).json({ tickets: user.ticketsComprados });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar histórico de compras', error: error.message });
  }
};

module.exports = {
  listarTickets,
  criarTicket,
  atualizarTicket,
  deletarTicket,
  comprarTicket,
  historicoCompras
};
