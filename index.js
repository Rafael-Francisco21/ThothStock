const express = require("express")
const path = require("path")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use("/usurario", require("./control/UsuarioAPI"))
app.use("/compra", require("./control/CompraAPI"))
app.use("/compro", require("./control/ComProAPI"))
app.use("/venda", require("./control/VendaAPI"))
app.use("/venpro", require("./control/VenProAPI"))
app.use("/produto", require("./control/ProdutoAPI"))
app.use("/cliente", require("./control/ClienteAPI"))
app.use("/fornecedor", require("./control/FornecedorAPI"))
app.use("/install", require('./control/InstallAPI'))

app.listen(3000, () => {
    console.log("Listenning...")
})