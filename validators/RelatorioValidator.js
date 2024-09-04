const Joi = require("joi");

const relatorioVendasSchema = Joi.object({
    dataInicio: Joi.date()
        .required()
        .messages({
            'date.base': 'A data de início deve ser uma data válida.',
            'any.required': 'A data de início é obrigatória.'
        }),
    dataFim: Joi.date()
        .required()
        .messages({
            'date.base': 'A data de fim deve ser uma data válida.',
            'any.required': 'A data de fim é obrigatória.'
        }),
    clienteId: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'O ID do cliente deve ser um número.',
            'number.integer': 'O ID do cliente deve ser um número inteiro.',
            'number.positive': 'O ID do cliente deve ser um número positivo.'
        }),
    produtoId: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'O ID do produto deve ser um número.',
            'number.integer': 'O ID do produto deve ser um número inteiro.',
            'number.positive': 'O ID do produto deve ser um número positivo.'
        }),
    usuarioId: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'O ID do usuário deve ser um número.',
            'number.integer': 'O ID do usuário deve ser um número inteiro.',
            'number.positive': 'O ID do usuário deve ser um número positivo.'
        })
});

const relatorioComprasSchema = Joi.object({
    dataInicio: Joi.date()
        .required()
        .messages({
            'date.base': 'A data de início deve ser uma data válida.',
            'any.required': 'A data de início é obrigatória.'
        }),
    dataFim: Joi.date()
        .required()
        .messages({
            'date.base': 'A data de fim deve ser uma data válida.',
            'any.required': 'A data de fim é obrigatória.'
        }),
    fornecedorId: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'O ID do fornecedor deve ser um número.',
            'number.integer': 'O ID do fornecedor deve ser um número inteiro.',
            'number.positive': 'O ID do fornecedor deve ser um número positivo.'
        }),
    produtoId: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'O ID do produto deve ser um número.',
            'number.integer': 'O ID do produto deve ser um número inteiro.',
            'number.positive': 'O ID do produto deve ser um número positivo.'
        }),
    usuarioId: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'O ID do usuário deve ser um número.',
            'number.integer': 'O ID do usuário deve ser um número inteiro.',
            'number.positive': 'O ID do usuário deve ser um número positivo.'
        })
});

const lucroBrutoSchema = Joi.object({
    dataInicio: Joi.date()
        .required()
        .messages({
            'date.base': 'A data de início deve ser uma data válida.',
            'any.required': 'A data de início é obrigatória.'
        }),
    dataFim: Joi.date()
        .required()
        .messages({
            'date.base': 'A data de fim deve ser uma data válida.',
            'any.required': 'A data de fim é obrigatória.'
        })
});

const totalVendaSchema = Joi.object({
    dataInicio: Joi.date()
        .required()
        .messages({
            'date.base': 'A data de início deve ser uma data válida.',
            'any.required': 'A data de início é obrigatória.'
        }),
    dataFim: Joi.date()
        .required()
        .messages({
            'date.base': 'A data de fim deve ser uma data válida.',
            'any.required': 'A data de fim é obrigatória.'
        })
});




module.exports = {
    relatorioVendasSchema,
    relatorioComprasSchema,
    lucroBrutoSchema,
    totalVendaSchema
};
