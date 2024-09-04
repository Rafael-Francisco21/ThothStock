const Joi = require("joi");

const VendaSchema = Joi.object({
    data: Joi.date()
        .required()
        .messages({
            'date.base': 'A data deve ser uma data válida.',
            'any.required': 'A data é obrigatória.'
        }),
    total: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'O total deve ser um número.',
            'number.positive': 'O total deve ser um valor positivo.',
            'any.required': 'O total é obrigatório.'
        }),
    clienteId: Joi.number()
        .integer()
        .positive()
        .messages({
            'number.base': 'O código do cliente deve ser um número.',
            'number.integer': 'O código do cliente deve ser um número inteiro.',
            'number.positive': 'O código do cliente deve ser um valor positivo.',
            'any.required': 'O código do cliente é obrigatório.'
        }),
    usuarioId: Joi.number()
        .integer()
        .positive()
        .messages({
            'number.base': 'O código do usuário deve ser um número.',
            'number.integer': 'O código do usuário deve ser um número inteiro.',
            'number.positive': 'O código do usuário deve ser um valor positivo.',
            'any.required': 'O código do usuário é obrigatório.'
        })
});

let validaVenda = (req, res, next) => {
    const { error } = VendaSchema.validate(req.body);
    if (error) {
        const mensagemErro = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ status: false, error: mensagemErro });
    }
    next();
}

module.exports = { validaVenda };
