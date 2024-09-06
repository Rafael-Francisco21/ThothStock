const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = [
  './index.js',
  './control/ClienteAPI.js',
  './control/CompraAPI.js',
  './control/CompraProdutoAPI.js',
  './control/FornecedorAPI.js',
  './control/InstallAPI.js',
  './control/ProdutoAPI.js',
  './control/RelatorioAPI.js',
  './control/UsuarioAPI.js',
  './control/VendaAPI.js',
  './control/VendaProdutoAPI.js'
];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
  require('./index'); // Inicia o servidor automaticamente após gerar a documentação
}).catch(error => {
  console.error("Erro ao gerar documentação Swagger:", error);
});
