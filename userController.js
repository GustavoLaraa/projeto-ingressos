exports.createUser = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Este e-mail já está em uso!' });
    }

    const user = new User({ nome, email, senha });
    await user.save();

    // Remove a senha da resposta
    const userResponse = { ...user._doc };
    delete userResponse.senha;

    res.status(201).json({ message: 'Usuário criado com sucesso!', user: userResponse });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
  }
};