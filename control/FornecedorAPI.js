const express = require("express");
const { validaFornecedor } = require('../validators/FornecedorValidator');
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const auth = require("../helpers/authUtils");
const FornecedorDAO = require('../services/FornecedorDAO');

router.post("/", auth.validaJWT, validaFornecedor, async (req, res) => {
    try {
        let obj = await FornecedorDAO.create(req.body);
        if (obj) {
            res.json(sucess(obj, 'Fornecedor'));
        } else {
            res.status(500).json(fail("Falha ao salvar o novo fornecedor"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.put("/:id", auth.validaJWT, validaFornecedor, async (req, res) => {
    try {
        let existente = await FornecedorDAO.getById(req.params.id);
        if (!existente) {
            return res.status(404).json(fail("Fornecedor não encontrado"));
        }

        let [result] = await FornecedorDAO.update(req.params.id, req.body);
        if (result)
            res.json(sucess('Fornecedor atualizado com sucesso', 'message'));
        else
            res.status(500).json(fail("Nenhuma alteração realizada"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.delete("/:id", auth.validaJWT, async (req, res) => {
    try {
        let fornecedor = await FornecedorDAO.getById(req.params.id);
        if (!fornecedor) {
            return res.status(404).json(fail("Fornecedor não encontrado"));
        }

        let result = await FornecedorDAO.delete(fornecedor.codigo);
        if (result)
            res.json(sucess('Fornecedor excluído com sucesso', 'message'));
        else
            res.status(500).json(fail("Erro ao excluir fornecedor"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.get("/list", auth.validaJWT, async (req, res) => {
    try {
        let { pagina, limite } = req.query;

        if (pagina && limite) {
            let result = await FornecedorDAO.listPage(pagina, limite);
            if (result)
                res.json(sucess(result, 'Fornecedores página'));
            else
                res.status(500).json(fail("Erro ao listar fornecedores"));
        } else {
            let result = await FornecedorDAO.list();
            if (result)
                res.json(sucess(result, 'Fornecedores'));
            else
                res.status(500).json(fail("Erro ao listar fornecedores"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.get("/:id", auth.validaJWT, async (req, res) => {
    try {
        let fornecedor = await FornecedorDAO.getById(req.params.id);
        if (fornecedor) {
            res.json(sucess(fornecedor, 'Fornecedor'));
        } else {
            res.status(404).json(fail("Fornecedor não encontrado"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

module.exports = router;
