const Joi = require("joi")

const ClienteSchema = Joi.object({
    nome: Joi.string()
        .min(5)
        .required()
        .messages({
            'string.base': 'O nome deve ser uma string.',
            'string.empty': 'O nome é obrigatório.',
            'string.min': 'O nome deve ter no mínimo 5 caracteres.'
        }),
    telefone: Joi.string()
        .required()
        .messages({
            'string.base': 'O telefone deve ser uma string.',
            'string.empty': 'O telefone é obrigatório.'
        }),
    email: Joi.string()
        .email()
        .messages({
            'string.base': 'O e-mail deve ser uma string.',
            'string.email': 'O e-mail deve ser válido.'
        }),
    endereco: Joi.string()
        .messages({
            'string.base': 'O endereço deve ser uma string.'
        }),
    cidade: Joi.string()
        .messages({
            'string.base': 'A cidade deve ser uma string.'
        }),
    bairro: Joi.string()
        .messages({
            'string.base': 'O bairro deve ser uma string.'
        }),
    cep: Joi.string()
        .messages({
            'string.base': 'O CEP deve ser uma string.'
        }),
    uf: Joi.string()
        .length(2)
        .messages({
            'string.base': 'O UF deve ser uma string.',
            'string.length': 'O UF deve ter exatamente 2 caracteres.'
        })
});

let validaCliente = (req, res, next) => {
    const { error } = ClienteSchema.validate(req.body);
    if (error) {
        const mensagemErro = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ status: false, error: mensagemErro });
    }
    next();
}

module.exports = { validaCliente };
