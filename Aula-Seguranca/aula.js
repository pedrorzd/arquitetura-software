// token ana => 1.admin.1793925569864.899e92
// token joao => 2.cliente.1793926795933.b09ba4

// ============================================================
// BLOCO 1 — IMPORTAÇÕES
// http  -> cria o servidor web (vem no Node, não precisa instalar)
// crypto -> gera o hash que usamos como "assinatura" do token
// ============================================================
const http = require('http')
const crypto = require('crypto')

// ============================================================
// BLOCO 2 — DADOS EM MEMÓRIA
// Arrays que fazem o papel do banco de dados. Como isso está
// em memória, tudo é apagado quando o servidor reinicia.
// ============================================================
const usuarios = [
{ id: 1, nome: 'Ana', role: 'admin' },    // única com poder de admin
{ id: 2, nome: 'João', role: 'cliente' }  // usuário comum
]
const pedidos = [
{ id: 101, dono: 1, valor: 890 },  // pedido da Ana
{ id: 102, dono: 2, valor: 120 }   // pedido do João
]

// BLOCO 3 — SERVIDOR INSEGURO (porta 3000)
// Responde QUALQUER requisição com TODOS os dados.
// Sem login, sem token, sem verificação de nada.
// É de propósito: este é o "antes" da aula.
//

http.createServer((req, res) => {
res.setHeader('Content-Type', 'application/json')
res.end(JSON.stringify({ usuarios, pedidos }, null, 2))
}).listen(3000, () => console.log('INSEGURO -> http://localhost:3000'))

// ============================================================
// BLOCO 4 — SEGREDO E LISTA DE REVOGADOS
// SEGREDO = chave que só o servidor conhece. Sem ela, não é
// possível gerar uma assinatura válida.
// revogados = conjunto de tokens que já fizeram logout.
// Vivia em memória, então é apagado no restart.
// ============================================================
const SEGREDO = 'abc'
const revogados = new Set()


// BLOCO 5 — FUNÇÃO ASSINAR
// Recebe um texto (id.role.exp) e devolve um hash de 6 chars.
// O hash é calculado COM o segredo. Isso significa:
// - o servidor consegue recalcular a qualquer momento
// - o cliente não consegue, porque não tem o segredo
// Mudar qualquer caractere do texto muda o hash inteiro.
// ============================================================
const assinar = d => crypto.createHash('md5').update(d +
SEGREDO).digest('hex').slice(0, 6)

// BLOCO 6 — LER TOKEN (a autenticação)
// Extrai o token do header Authorization e responde:
// "sei quem você é" (objeto) ou "não sei" (null).
// São QUATRO checagens, nesta ordem:
//   1. existe header?
//   2. o token já foi revogado por logout?
//   3. a assinatura confere?
//   4. ainda não expirou?
// Se qualquer uma falhar, retorna null e a rota devolve 401.
// ============================================================
function lerToken(req) {
const header = req.headers.authorization
if (!header) return null                              
// 1. sem header, sem identidade
const token = header.replace('Bearer ', '')           
if (revogados.has(token)) return null                 
// remove o prefixo
// 2. token revogado
const [id, role, exp, assinatura] = token.split('.')  // separa os 4 campos
if (assinatura !== assinar(`${id}.${role}.${exp}`)) return null  // 3. assinatura errada
if (Number(exp) < Date.now()) return null             
// 4. prazo vencido
return { id: +id, role }                              
// +id converte texto em número
}


// ============================================================
// BLOCO 7 — HELPER DE RESPOSTA
// Evita repetir writeHead + end em cada rota.
// Recebe status (200, 401, 403...) e o corpo em objeto.
// ============================================================
function responder(res, status, corpo) {
res.writeHead(status, { 'Content-Type': 'application/json' })
res.end(JSON.stringify(corpo, null, 2))
}

// ============================================================
// BLOCO 8 — SERVIDOR SEGURO (porta 3001)
// Aqui as rotas são verificadas uma a uma, em ordem.
// ============================================================
http.createServer((req, res) => {
const url = new URL(req.url, 'http://localhost')
// ---------- 8.1 LOGIN: a porta de entrada ----------
// Recebe ?id=1 e devolve um token assinado.
// É a ÚNICA rota que não exige token, porque é ela que o cria.
// Em sistema real, aqui entraria a verificação de senha.
if (url.pathname === '/login') {
const u = usuarios.find(x => x.id === Number(url.searchParams.get('id')))
if (!u) return responder(res, 404, { erro: 'usuário não existe' })
const exp = Date.now() + 60_000  // validade de 1 minuto (curta, para a aula)
const token = `${u.id}.${u.role}.${exp}.${assinar(`${u.id}.${u.role}.${exp}`)}`
// Monta: id . role . expiração . assinatura
return responder(res, 200, { token })
}

// ---------- 8.2 AUTENTICAÇÃO (vale para tudo abaixo) ----------
// Uma linha só, aplicada a todas as rotas seguintes.
// Se não houver usuário válido, o servidor para aqui com 401.
const user = lerToken(req)
if (!user) return responder(res, 401, { erro: 'quem é você?' })


// ---------- 8.3 LOGOUT ----------
// Só chega aqui quem tem token válido (por causa do bloco 8.2).
// Adiciona o token na lista de revogados e devolve 200.
// Depois disso, lerToken passa a recusá-lo.
if (url.pathname === '/logout') {
revogados.add(req.headers.authorization.replace('Bearer ', ''))
return responder(res, 200, { ok: 'token revogado' })
}


// ---------- 8.4 PERFIL (só autenticação) ----------
// Devolve os dados do próprio token. Qualquer usuário logado
// acessa — inclusive o cliente. Não há regra de papel aqui.
if (url.pathname === '/perfil') return responder(res, 200, user)

// ---------- 8.5 ADMIN (autenticação + autorização) ----------
// Este é o bloco central da aula.
// O 401 já passou no 8.2 (sei quem você é).
// Agora a pergunta é outra: você PODE?
// Se o papel não for admin, devolve 403.
if (url.pathname === '/admin') {
if (user.role !== 'admin') return responder(res, 403, { erro: 'você não pode' })
return responder(res, 200, usuarios)
}

// ---------- 8.6 PEDIDOS (autenticação + escopo de dados) ----------
// Não filtra por papel, filtra por DONO.
// Cada um recebe apenas os pedidos em que dono === seu id.
// Admin também é filtrado aqui — se quiser que admin veja tudo,
// é uma decisão de projeto que precisa ser escrita no código.
if (url.pathname === '/pedidos') {
return responder(res, 200, pedidos.filter(p => p.dono === user.id))
}

// ---------- 8.7 FALLBACK ----------
// Qualquer rota não tratada acima devolve 404.
responder(res, 404, { erro: 'rota não encontrada' })
}).listen(3001, () => console.log('SEGURO -> http://localhost:3001'))









