const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const { describe, test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { MongoClient } = require("mongodb");

const {
  validarCodigo,
  validarCodigoCliente,
  validarTipo,
  validarCodigoReferencia,
  validarNota,
  validarComentario,
  validarData,
  validarAvaliacao,
} = require("../regrasAvaliacoes");

// ---------- Avaliação real do Atlas ----------

describe("avaliacao no Atlas", () => {
  let client;
  let documento;

  before(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI não encontrada no arquivo .env");
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    // Busca uma avaliação real do banco de dados.
    // Substitua o filtro { codigo: "AV001" } pelo código de uma avaliação existente no seu Atlas.
    documento = await client
      .db("LojaInformatica")
      .collection("avaliacoes")
      .findOne({ codigo: "AV001" });
  });

  after(async () => {
    if (client) {
      await client.close();
    }
  });

  test("encontra a avaliação AV001", () => {
    assert.ok(documento, "Avaliação não encontrada no Atlas");
  });

  test("passa nas regras e devolve os campos limpos", () => {
    const avaliacao = validarAvaliacao(documento);

    // Ajuste os valores esperados abaixo conforme os dados reais do seu documento AV001
    assert.equal(avaliacao.codigo, "AV001");
    assert.equal(avaliacao.codigo_cliente, "C001");
    assert.equal(avaliacao.tipo, "pedido");
    assert.equal(avaliacao.codigo_referencia, "PED001");
    assert.equal(avaliacao.nota, 5);
    assert.ok(
      avaliacao.comentario.length >= 5 && avaliacao.comentario.length <= 500,
    );
    assert.ok(avaliacao.data instanceof Date);
  });
});
