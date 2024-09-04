const Joi = require("joi");

const ProdutoSchema = Joi.object({
    descricao: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.base': 'A descrição deve ser uma string.',
            'string.empty': 'A descrição é obrigatória.',
            'string.min': 'A descrição deve ter no mínimo 3 caracteres.'
        }),
    custo: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'O custo deve ser um número.',
            'number.positive': 'O custo deve ser um valor positivo.',
            'any.required': 'O custo é obrigatório.'
        }),
    valor: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'O valor deve ser um número.',
            'number.positive': 'O valor deve ser um valor positivo.',
            'any.required': 'O valor é obrigatório.'
        }),
    estoque: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'O estoque deve ser um número.',
            'number.integer': 'O estoque deve ser um número inteiro.',
            'number.min': 'O estoque deve ser maior ou igual a 0.',
            'any.required': 'O estoque é obrigatório.'
        })
});

let validaProduto = (req, res, next) => {
    const { error } = ProdutoSchema.validate(req.body);
    if (error) {
        const mensagemErro = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ status: false, error: mensagemErro });
    }
    next();
}

module.exports = { validaProduto };
