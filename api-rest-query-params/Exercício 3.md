# Exercício 3:

### Alunos:
#### Pedro Rodrigues - 202251070131
#### Danielle Evangelista - 202451069128

## GET

### 1.Filtrando Apenas por Status - A equipe de auditoria precisa consultar todos os usuários inativos do sistema, independente da cidade em que residem.

http://localhost:3000/usuarios?ativos=false

[
{
"id": 1,
"nome": "Lucas Silva",
"cidade": "SP",
"ativo": true,
"cargo": "Dev Frontend"
},
{
"id": 2,
"nome": "Mariana Costa",
"cidade": "RJ",
"ativo": false,
"cargo": "Designer UI/UX"
},
{
"id": 3,
"nome": "Rodrigo Lima",
"cidade": "SP",
"ativo": true,
"cargo": "Dev Backend"
},
{
"id": 4,
"nome": "Aline Souza",
"cidade": "BH",
"ativo": true,
"cargo": "Product Manager"
},
{
"id": 5,
"nome": "Felipe Ramos",
"cidade": "SP",
"ativo": false,
"cargo": "QA Engineer"
},
{
"id": 6,
"nome": "Camila Duarte",
"cidade": "CURITIBA",
"ativo": true,
"cargo": "DevOps"
},
{
"id": 7,
"nome": "Bruno Martins",
"cidade": "RJ",
"ativo": true,
"cargo": "Tech Lead"
},
{
"id": 8,
"nome": "Patrícia Rocha",
"cidade": "BH",
"ativo": false,
"cargo": "Analista de Dados"
},
{
"id": 9,
"nome": "Gustavo Neves",
"cidade": "SP",
"ativo": true,
"cargo": "Estagiário"
},
{
"id": 10,
"nome": "Letícia Pires",
"cidade": "SP",
"ativo": false,
"cargo": "Scrum Master"
}
]

### 2.O gestor de projetos precisa localizar os colaboradores que moram no Rio de Janeiro (RJ) e que estejam ativos para alocar em um novo projeto presencial.

http://localhost:3000/usuarios?ativos=ativo&cidade=RJ

[
{
"id": 2,
"nome": "Mariana Costa",
"cidade": "RJ",
"ativo": false,
"cargo": "Designer UI/UX"
},
{
"id": 7,
"nome": "Bruno Martins",
"cidade": "RJ",
"ativo": true,
"cargo": "Tech Lead"
}
]

### 3.O painel administrativo do sistema precisa exibir apenas os 2 primeiros usuários ativos da cidade de São Paulo

http://localhost:3000/usuarios?cidade=SP&limite=2

[
{
"id": 1,
"nome": "Lucas Silva",
"cidade": "SP",
"ativo": true,
"cargo": "Dev Frontend"
},
{
"id": 3,
"nome": "Rodrigo Lima",
"cidade": "SP",
"ativo": true,
"cargo": "Dev Backend"
}
]

### 4.Monte uma requisição de busca combinada com os seguintes critério - Usuários da cidade de Curitiba que estejam inativos (ativo: false).

http://localhost:3000/usuarios?ativos=false&cidade=Curitiba

[
{
"id": 6,
"nome": "Camila Duarte",
"cidade": "CURITIBA",
"ativo": true,
"cargo": "DevOps"
}
]

### 5.Monte uma requisição de busca combinada com os seguintes critérios: Usuários com conta inativa (ativo: false); Localizados na cidade de São Paulo (SP); Limitando a listagem aos 2 primeiros registros.

http://localhost:3000/usuarios?ativos=false&cidade=SP&limite=2
[
{
"id": 1,
"nome": "Lucas Silva",
"cidade": "SP",
"ativo": true,
"cargo": "Dev Frontend"
},
{
"id": 3,
"nome": "Rodrigo Lima",
"cidade": "SP",
"ativo": true,
"cargo": "Dev Backend"
}
]

### 6.Monte uma requisição de busca combinada com os seguintes critérios: Usuários cadastrados na cidade de Belo Horizonte (BH); Que estejam atualmente com a conta inativa (ativo: false); Sem restrição de limite

http://localhost:3000/usuarios?ativos=false&cidade=BH

[
{
"id": 4,
"nome": "Aline Souza",
"cidade": "BH",
"ativo": true,
"cargo": "Product Manager"
},
{
"id": 8,
"nome": "Patrícia Rocha",
"cidade": "BH",
"ativo": false,
"cargo": "Analista de Dados"
}
]

## POST

### 1.Monte a requisição no Thunder Client para cadastrar uma nova colaboradoracom o nome "Fernanda Lima", residente em "Belo Horizonte".

http://localhost:3000/usuarios?nome=Ferndanda Silva&cidade=bh

{
"id": 11,
"nome": "Ferndanda Silva",
"cidade": "bh",
"concluida": false
}

### 2.Monte uma requisição de cadastro para o usuário "Roberto Justus", sem informar a cidade em que ele mora.

http://localhost:3000/usuarios?nome=Roberto Justus

{
"id": 12,
"nome": "Roberto Justus",
"cidade": "nao informado",
"concluida": false
}

### 3.Monte uma requisição para testar a validação de campos obrigatórios, enviando apenas a cidade: Cidade: "Salvador" O campo nome não deve ser informado.

http://localhost:3000/usuarios?cidade=BH

{
"erro": "O nome é obrigatório"
}

## PUT

### 1.A usuária com ID 2 casou-se e solicitou a alteração do seu nome para "MARIA SILVA", mantendo sua cidade e status inalterados.

http://localhost:3000/usuarios/2

{
"id": 2,
"nome": "MARIA SILVA",
"cidade": "RJ",
"ativo": false,
"cargo": "Designer UI/UX"
}

### 2.O colaborador ID 1 foi transferido para a filial do Rio de Janeiro e precisará ter o seu acesso suspenso temporariamente (ativo: false).

http://localhost:3000/usuarios/1

{
"id": 1,
"nome": "Lucas Silva",
"cidade": "RJ",
"ativo": false,
"cargo": "Dev Frontend"
}

### 3.Monte uma requisição de alteração com os seguintes critérios: Tentar alterar o nome para "CARLOS EDUARDO" de um usuário com ID 50.

http://localhost:3000/usuarios/50

{
"mensagem": "Usuario nao encontrado"
}
