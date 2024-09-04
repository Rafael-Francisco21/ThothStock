const Joi = require("joi");

const CompraSchema = Joi.object({
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
    fornecedorId: Joi.number()
        .integer()
        .messages({
            'number.base': 'O fornecedorId deve ser um número.',
            'number.integer': 'O fornecedorId deve ser um número inteiro.',
            'any.required': 'O fornecedorId é obrigatório.'
        }),
    usuarioId: Joi.number()
        .integer()
        .messages({
            'number.base': 'O usuarioId deve ser um número.',
            'number.integer': 'O usuarioId deve ser um número inteiro.',
            'any.required': 'O usuarioId é obrigatório.'
        })
});

let validaCompra = (req, res, next) => {
    const { error } = CompraSchema.validate(req.body);
    if (error) {
        const mensagemErro = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ status: false, error: mensagemErro });
    }
    next();
}

module.exports = { validaCompra };
