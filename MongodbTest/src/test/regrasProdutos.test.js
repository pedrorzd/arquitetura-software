const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});

const { describe, test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { MongoClient } = require("mongodb");

const {
  validarCodigo,
  validarNome,
  validarCodigoExterno,
  validarPreco,
  validarEstoque,
  validarGarantia,
  validarEspecificacoes,
  validarAtivo,
  validarProduto
} = require("../regrasProdutos");

// ---------- Produto real do Atlas ----------

describe("produto no Atlas", () => {
  let client;
  let documento;

  before(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI não encontrada no arquivo .env");
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    // Busca um produto real do banco de dados.
    // Substitua o filtro { codigo: "P001" } pelo código de um produto existente no seu Atlas.
    documento = await client
      .db("LojaInformatica")
      .collection("produtos")
      .findOne({ codigo: "P001" });
  });

  after(async () => {
    if (client) {
      await client.close();
    }
  });

  test("encontra o produto P001", () => {
    assert.ok(documento, "Produto não encontrado no Atlas");
  });

  test("passa nas regras e devolve os campos limpos", () => {
    const produto = validarProduto(documento);

    // Ajuste os valores esperados abaixo conforme os dados reais do seu documento P001
    
    // Validação de IDs
    assert.equal(produto.codigo, "P001");
    assert.ok(produto.codigo_categoria.length >= 3); // Formato EX: CAT001 ou MAR001
    
    // Validação de Marca (pode ser null)
    if (produto.codigo_marca !== null) {
      assert.ok(produto.codigo_marca.length >= 3);
    } else {
      assert.equal(produto.codigo_marca, null);
    }

    // Validação de Texto
    assert.ok(produto.nome.length >= 3 && produto.nome.length <= 100);

    // Validação Numérica
    assert.ok(produto.preco >= 0);
    assert.ok(produto.estoque >= 0);
    assert.ok(produto.garantia_meses >= 0);

    // Validação de Objeto
    assert.ok(typeof produto.especificacoes === "object" && produto.especificacoes !== null);

    // Validação de Booleano
    assert.equal(produto.ativo, true); // Exemplo: ajuste conforme o estado real
  });
});