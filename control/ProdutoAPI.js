const express = require("express");
const { validaProduto } = require('../validators/ProdutoValidator');
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const auth = require("../helpers/authUtils");
const ProdutoDAO = require('../services/ProdutoDAO.js');

router.post("/", auth.validaJWT, validaProduto, async (req, res) => {
    try {
        let obj = await ProdutoDAO.create(req.body);
        if (obj) {
            res.json(sucess(obj, 'Produto'));
        } else {
            res.status(500).json(fail("Falha ao salvar o novo produto"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.put("/:id", auth.validaJWT, validaProduto, async (req, res) => {
    try {
        let existente = await ProdutoDAO.getById(req.params.id);

        if (!existente) {
            return res.status(400).json(fail("Produto não encontrado")); 
        }

        let [result] = await ProdutoDAO.update(req.params.id, req.body);
        if (result)
            res.json(sucess('Produto atualizado com sucesso', 'message'));
        else
            res.status(500).json(fail("Nenhuma alteração realizada"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.delete("/:id", auth.validaJWT, auth.verificaAcesso(2), async (req, res) => {
    try {
        let produto = await ProdutoDAO.getById(req.params.id);

        if (!produto) {
            return res.status(404).json(fail("Produto não encontrado"));
        }

        let result = await ProdutoDAO.delete(produto.codigo);
        if (result)
            res.json(sucess('Produto excluído com sucesso', 'message'));
        else
            res.status(500).json(fail("Erro ao excluir produto"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.get("/list", auth.validaJWT, async (req, res) => {
    try {
        let { pagina, limite } = req.query;

        if (pagina && limite) {
            let result = await ProdutoDAO.listPage(pagina, limite);
            if (result)
                res.json(sucess(result, 'Produtos página'));
            else
                res.status(500).json(fail("Erro ao listar produtos"));
        } else {
            let result = await ProdutoDAO.list();
            if (result)
                res.json(sucess(result, 'Produtos'));
            else
                res.status(500).json(fail("Erro ao listar produtos"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.get("/:id", auth.validaJWT, async(req, res) =>{
    let produto = await ProdutoDAO.getById(req.params.id);
    
    if (produto){
        res.json(sucess(produto, 'Produto'));
    }else
        res.status(500).json(fail("Produto não encontrado"))
});

module.exports = router;
