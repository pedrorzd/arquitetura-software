const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const { describe, test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { MongoClient } = require("mongodb");

const {
  validarCodigo,
  validarNome,
  validarDescricao,
  validarAtivo,
  validarCategoria,
} = require("../regrasCategorias");

// ---------- Categoria real do Atlas ----------

describe("categoria no Atlas", () => {
  let client;
  let documento;

  before(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI não encontrada no arquivo .env");
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    // Busca uma categoria real do banco de dados.
    // Substitua o filtro { codigo: "CAT001" } pelo código de uma categoria existente no seu Atlas.
    documento = await client
      .db("LojaInformatica")
      .collection("categorias")
      .findOne({ codigo: "CAT001" });
  });

  after(async () => {
    if (client) {
      await client.close();
    }
  });

  test("encontra a categoria CAT001", () => {
    assert.ok(documento, "Categoria não encontrada no Atlas");
  });

  test("passa nas regras e devolve os campos limpos", () => {
    const categoria = validarCategoria(documento);

    // Ajuste os valores esperados abaixo conforme os dados reais do seu documento CAT001
    assert.equal(categoria.codigo, "CAT001");
    assert.equal(categoria.nome, "Notebooks"); // Exemplo: ajuste conforme o nome real
    assert.equal(categoria.descricao, "Computadores portáteis para uso geral"); // Exemplo: ajuste conforme a descrição real
    assert.equal(categoria.ativo, true); // Exemplo: ajuste conforme o estado real
  });
});
