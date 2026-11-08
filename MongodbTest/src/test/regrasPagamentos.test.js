const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});

const { describe, test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { MongoClient } = require("mongodb");

const {
  validarCodigo,
  validarCodigoPedido,
  validarForma,
  validarValor,
  validarParcelas,
  validarStatus,
  validarData,
  validarTransacaoId,
  validarPagamento
} = require("../regrasPagamentos");

// ---------- Pagamento real do Atlas ----------

describe("pagamento no Atlas", () => {
  let client;
  let documento;

  before(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI não encontrada no arquivo .env");
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    // Busca um pagamento real do banco de dados.
    // Substitua o filtro { codigo: "PG001" } pelo código de um pagamento existente no seu Atlas.
    documento = await client
      .db("LojaInformatica")
      .collection("pagamentos")
      .findOne({ codigo: "PG001" });
  });

  after(async () => {
    if (client) {
      await client.close();
    }
  });

  test("encontra o pagamento PG001", () => {
    assert.ok(documento, "Pagamento não encontrado no Atlas");
  });

  test("passa nas regras e devolve os campos limpos", () => {
    const pagamento = validarPagamento(documento);

    // Ajuste os valores esperados abaixo conforme os dados reais do seu documento PG001
    
    // Validação de IDs
    assert.equal(pagamento.codigo, "PG001");
    assert.equal(pagamento.codigo_pedido, "PE001"); // Exemplo: ajuste conforme o pedido real

    // Validação de Forma e Status
    const formasPermitidas = ["pix", "cartao_credito", "boleto", "cartao_debito"];
    const statusPermitidos = ["aprovado", "pendente", "estornado"];
    
    assert.ok(formasPermitidas.includes(pagamento.forma));
    assert.ok(statusPermitidos.includes(pagamento.status));

    // Validação Numérica
    assert.ok(pagamento.valor >= 0);
    assert.ok(pagamento.parcelas >= 1);

    // Validação de Data
    assert.ok(pagamento.data instanceof Date);

    // Validação de Transação ID (pode ser null ou string não vazia)
    if (pagamento.transacao_id !== null) {
      assert.ok(typeof pagamento.transacao_id === "string" && pagamento.transacao_id.trim().length > 0);
    } else {
      assert.equal(pagamento.transacao_id, null);
    }
  });
});