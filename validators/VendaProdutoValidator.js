const Joi = require("joi");

const VendaProdutoSchema = Joi.object({
    quantidade: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'A quantidade deve ser um número.',
            'number.integer': 'A quantidade deve ser um número inteiro.',
            'number.min': 'A quantidade deve ser pelo menos 1.',
            'any.required': 'A quantidade é obrigatória.'
        }),
    unitario: Joi.number()
        .precision(2)
        .positive()
        .required()
        .messages({
            'number.base': 'O valor unitário deve ser um número.',
            'number.precision': 'O valor unitário deve ter no máximo 2 casas decimais.',
            'number.positive': 'O valor unitário deve ser um número positivo.',
            'any.required': 'O valor unitário é obrigatório.'
        }),
    total: Joi.number()
        .precision(2)
        .positive()
        .required()
        .messages({
            'number.base': 'O total deve ser um número.',
            'number.precision': 'O total deve ter no máximo 2 casas decimais.',
            'number.positive': 'O total deve ser um número positivo.',
            'any.required': 'O total é obrigatório.'
        }),
    vendaId: Joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'O ID da venda deve ser um número.',
            'number.integer': 'O ID da venda deve ser um número inteiro.',
            'any.required': 'O ID da venda é obrigatório.'
        }),
    produtoId: Joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'O ID do produto deve ser um número.',
            'number.integer': 'O ID do produto deve ser um número inteiro.',
            'any.required': 'O ID do produto é obrigatório.'
        })
});

let validaVendaProduto = (req, res, next) => {
    const { error } = VendaProdutoSchema.validate(req.body);
    if (error) {
        const mensagemErro = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ status: false, error: mensagemErro });
    }
    next();
};

module.exports = { validaVendaProduto };
