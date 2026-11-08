const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const { describe, test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { MongoClient } = require("mongodb");

const {
  validarCodigo,
  validarRazaoSocial,
  validarCnpj,
  validarNomeContato,
  validarEmailContato,
  validarTelefoneContato,
  validarPrazoEntrega,
  validarMarcasAtendidas,
  validarAtivo,
  validarFornecedor,
} = require("../regrasFornecedores");

// ---------- Fornecedor real do Atlas ----------

describe("fornecedor no Atlas", () => {
  let client;
  let documento;

  before(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI não encontrada no arquivo .env");
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    // Busca um fornecedor real do banco de dados.
    // Substitua o filtro { codigo: "F001" } pelo código de um fornecedor existente no seu Atlas.
    documento = await client
      .db("LojaInformatica")
      .collection("fornecedores")
      .findOne({ codigo: "F001" });
  });

  after(async () => {
    if (client) {
      await client.close();
    }
  });

  test("encontra o fornecedor F001", () => {
    assert.ok(documento, "Fornecedor não encontrado no Atlas");
  });

  test("passa nas regras e devolve os campos limpos", () => {
    const fornecedor = validarFornecedor(documento);

    // Ajuste os valores esperados abaixo conforme os dados reais do seu documento F001
    assert.equal(fornecedor.codigo, "F001");
    assert.ok(
      fornecedor.razao_social.length >= 3 &&
        fornecedor.razao_social.length <= 100,
    );
    assert.equal(fornecedor.cnpj.length, 14);

    // Validação do objeto aninhado 'contato'
    assert.ok(fornecedor.contato.nome.length > 0);
    assert.ok(fornecedor.contato.email.includes("@"));
    assert.equal(fornecedor.contato.telefone.length, 10 || 11);

    assert.ok(fornecedor.prazo_entrega_dias >= 0);
    assert.ok(Array.isArray(fornecedor.marcas_atendidas));
    assert.equal(fornecedor.ativo, true); // Exemplo: ajuste conforme o estado real
  });
});
