const express = require("express")
const path = require("path")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use("/usuario", require("./control/UsuarioAPI"))
app.use("/cliente", require("./control/ClienteAPI"))
app.use("/produto", require("./control/ProdutoAPI"))
app.use("/venda", require("./control/VendaAPI"))
app.use("/venpro", require("./control/VendaProdutoAPI"))
app.use("/fornecedor", require("./control/FornecedorAPI"))
// app.use("/compra", require("./control/CompraAPI"))
// app.use("/compro", require("./control/ComProAPI"))
// app.use("/install", require('./control/InstallAPI'))

app.listen(3000, () => {
    console.log("Listenning...")
})