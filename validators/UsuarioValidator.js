const Joi = require("joi")

const UsuarioSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': 'O e-mail deve ser uma string.',
            'string.empty': 'O e-mail é obrigatório.',
            'string.email': 'O e-mail deve ser válido.'
        }),
    nome: Joi.string()
        .min(10)
        .required()
        .messages({
            'string.base': 'O nome deve ser uma string.',
            'string.empty': 'O nome é obrigatório.',
            'string.min': 'O nome deve ter no mínimo 10 caracteres.',
            'string.max': 'O nome deve ter no máximo 30 caracteres.'
        }),
    senha: Joi.string()
        .min(8)
        .max(30)
        .required()
        .messages({
            'string.base': 'A senha deve ser uma string.',
            'string.empty': 'A senha é obrigatória.',
            'string.min': 'A senha deve ter no mínimo 8 caracteres.',
            'string.max': 'A senha deve ter no máximo 30 caracteres.'
        }),
    acesso: Joi.number()
        .required()
        .messages({
            'string.empty': 'O nivel de acesso é obrigatória.',
        })
})
const LoginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': 'O e-mail deve ser uma string.',
            'string.empty': 'O e-mail é obrigatório.',
            'string.email': 'O e-mail deve ser válido.'
        }),
    senha: Joi.string()
        .min(8)
        .max(30)
        .required()
        .messages({
            'string.base': 'A senha deve ser uma string.',
            'string.empty': 'A senha é obrigatória.',
            'string.min': 'A senha deve ter no mínimo 8 caracteres.',
            'string.max': 'A senha deve ter no máximo 30 caracteres.'
        })
})

let validaUsuario = (req, res, next) => {
    const { error } = UsuarioSchema.validate(req.body);
    if (error) {
        const mensagemErro = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ status: false, error: mensagemErro });
    }
    next();
}

let validaLogin = (req, res, next) => {
    const { error } = LoginSchema.validate(req.body);
    if (error) {
        const mensagemErro = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ status: false, error: mensagemErro });
    }
    next();
}



module.exports = { validaUsuario, validaLogin };
