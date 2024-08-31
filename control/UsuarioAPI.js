const express = require("express")
const { validaUsuario, validaLogin } = require('../validators/UsuarioValidator');
const router = express.Router()

const { sucess, fail } = require("../helpers/resposta")
const auth = require("../helpers/authUtils")
const UsuarioDAO = require('../services/UsuarioDAO.js')

router.post("/", auth.validaJWT, validaUsuario, async (req, res) => {
    try {
        if (req.acesso > req.body.acesso) {
            return res.status(400).json(fail("Usuário não tem permissão de criar outro usuário com esse nível de acesso"));
        }

        let existente = await UsuarioDAO.getByEmail(req.body.email);

        if (existente) {
            return res.status(400).json(fail("E-mail já existente"));
        }

        let obj = await UsuarioDAO.create(req.body);
        delete obj.dataValues.senha;
        if (obj) {
            res.json(sucess(obj, 'Usuário'));
        } else {
            res.status(500).json(fail("Falha ao salvar o novo usuário"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.post("/login", validaLogin, async (req, res) => {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json(fail("Email e senha são obrigatórios."));
        }

        const existente = await UsuarioDAO.login(email, senha);

        if (existente) {
            delete existente.dataValues.senha;
            let resp = existente.dataValues
            const token = await auth.criaJWT(existente.dataValues);
            resp.token = token;
            return res.json(sucess(resp));
        } else {
            return res.status(401).json(fail("Usuário ou senha inválidos"));
        }
    } catch (error) {
        return res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.put("/:id", auth.validaJWT, validaUsuario, async (req, res) => {
    try {
        if (req.acesso >= req.body.acesso && req.acesso != 1 && req.params.id != req.user || req.acesso >= req.body.acesso && req.acesso != 1) {
            return res.status(400).json(fail("Usuário não tem permissão de editar outro usuário com esse nível de acesso"));
        }

        let existente = await UsuarioDAO.getByEmail(req.body.email);

        if (existente.dataValues.codigo != req.params.id) {
            return res.status(400).json(fail("E-mail já existente"));
        }

        let [result] = await UsuarioDAO.update(req.params.id, req.body);
        if (result)
            res.json(sucess('Usuário atualizado com sucesso', 'message'))
        else
            res.status(500).json(fail("Nenhuma alteração realizada"))
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.delete("/:id", auth.validaJWT, async (req, res) => {
    try {
        let usuario = await UsuarioDAO.getById(req.params.id);

        if (req.acesso >= usuario.acesso && req.acesso != 1 && req.params.id != usuario.codigo) {
            return res.status(400).json(fail("Usuário não tem permissão de excluir outro usuário com esse nível de acesso"));
        }

        if (usuario.acesso == 1) {
            quantAdm = await UsuarioDAO.quantAdm();
            if (quantAdm == 1)
                return res.status(400).json(fail("Usuário não pode ser excluido por ser o ultimo administrador"));
        }

        let result = await UsuarioDAO.delete(usuario.codigo);
        if (result)
            res.json(sucess('Usuário excluido com sucesso', 'message'))
        else
            res.status(500).json(fail("Erro ao excluir usuário"))
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.get("/list", auth.validaJWT, async (req, res) => {
    try {
        if (req.acesso > 2)
            return res.status(400).json(fail("Usuário não tem permissão para usar esse recurso"));

        let { pagina, limite } = req.query;

        if (pagina && limite) {
            let result = await UsuarioDAO.listPage(pagina, limite)
            if (result)
                res.json(sucess(result, 'Usuários pagina'));
            else
                res.status(500).json(fail("Erro ao listar usuários"))
        } else {
            let result = await UsuarioDAO.list()
            if (result)
                res.json(sucess(result, 'Usuários'));
            else
                res.status(500).json(fail("Erro ao listar usuários"))
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }

})


module.exports = router