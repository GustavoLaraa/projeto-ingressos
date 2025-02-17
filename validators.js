const { body } = require("express-validator");

exports.registerValidation = [
    body("nome").notEmpty().withMessage("Nome é obrigatório"),
    body("email").isEmail().withMessage("Email inválido"),
    body("senha").isLength({ min: 6 }).withMessage("A senha deve ter no mínimo 6 caracteres")
];
