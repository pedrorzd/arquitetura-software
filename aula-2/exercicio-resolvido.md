# Arquitetura de Microserviços para a EduFlex

---

## 1- Intentificação de domínios :
- Nome
- Responsabilidades
- Dados sob administração
- Principais operações
- Serviços com quais precisa se comunicar

### Service Usuário

#### Responsabilidade:
- Criar, gerênciar e realizar todas as operações referentes a usuários.

#### Dados admninistrados:
- Usuários e dados pessoais
- Permissões
- Credenciais
- Status

#### Principais operações:
- Cadastrar alunos
- Cadastrar professores
- Cadastrar admnistradores
- Administrar permissões
- Administrar senhas
- Administrar usuários
- Atualizar dados
- Atualizar progresso de curso
- Listagem de usuários

#### Comunicação com outros serviços:
- Service Matricula - Incluir o curso na matricula do usuário
- Service Pagamento - Executar solicitação de pagamento realizada pelo usuário
- Service Autenticação - Validar permissões do usuário para realizar operações
---

### Service Cursos

#### Responsabilidade:
- Criar, gerênciar e realizar todas as operações referentes a cursos.

#### Dados admninistrados:
- Cursos e suas propriedades
- Avaliações e suas propriedades
- Valores de hora/aula
- Disponibilidade
- Status

#### Principais operações:
- Cadastrar cursos
- Adicionar conteúdo do curso
- Atualizar dados de cursos
- Listagem de cursos
- Validação de disponibilidade

#### Comunicação com outros serviços:
- Service Usuário - Para validar quem está realizando as operações e qual aluno vai ser atribuido o custo.
- Service Matricula - Para atribuir os cursos desejados aos alunos
- Service Autenticação - Para validar se a operação pode ser realizada pelo usuário.
--- 

### Service Matricula

#### Responsabilidade:
- Criar, gerênciar e realizar todas as operações referentes a matricula.

#### Dados admninistrados:
- Matricula
- Certificados
- Avaliações
- Validade
- Tipo de matricula
- Status
- Inscrição em curso

#### Principais operações:
- Registrar certificados
- Registrar resultados de avaliações
- Atualizar progresso 
- Listagem de cursos vinculados a matricula

#### Comunicação com outros serviços:
- Service Usuário - Para vincular o ID do usuário à mensalidade gerada
- Service Curso - Para atrelar o valor do curso à mensalidade do usuário 
- Service Autenticação - Para validar se a operação pode ser realizada pelo usuário.
--- 

### Service Pagamento

#### Responsabilidade:
- Gerênciar e validar todas as operações referentes a pagamento.

#### Dados admninistrados:
- Valor
- Matricula
- Bolsa
- Forma de pagamento
- Status

#### Principais operações:
- Cadastrar pagamentos
- Comunicar com WebHook de terceiros para pagamento
- Cadastrar cartão de crédito
- Listar cartão do usuário
- Atualizar status do cartão de crédito

#### Comunicação com outros serviços:
- Service Usuário - Para executar a operação de pagamento solicitada pelo Usuário
- Service Matricula - Para validar o pagamento da mensalidade e alterar o status de pagamento
- Service Autenticação - Para validar se a operação pode ser realizada pelo usuário.
--- 

### Service Autenticação

#### Responsabilidade:
- Gerênciar e validar todas as operações referentes a autenticação de usuários.

#### Dados admninistrados:
- Validação do usuário
- Validação de dados para cadastro de usuário

#### Principais operações:
- Validar status do usuário
- Validar permissão do usuário
- Alterar status do usuário


#### Comunicação com outros serviços:
- Service Usuário - Para validar o cadastro e alterar status de login.

--- 

### Service Notificação

#### Responsabilidade:
- Disparar notificações para os usuários.

#### Dados admninistrados:
- Notificações push
- Tipos de mensagens

#### Principais operações:
- Enviar notificações do tipo Pagamento
- Enviar notificações do tipo Avisos
- Enviar notificações do tipo Usuário

#### Comunicação com outros serviços:
- Service Usuário - Para disparar notificações Push.
- Service Autenticação - Para validar se a operação pode ser realizada pelo usuário.

---

## 2- Definição das APIs :
- Metodo
- Endpoint
- Descrição

### Service Usuário

| Método | Endpoint                   | Descrição                   |
| :--- |:---------------------------|:----------------------------|
| POST | `/usuario/usuarios/alunos` | Criar usuário do tipo aluno |

### Service Curso

| Método | Endpoint        | Descrição   |
| :--- |:----------------|:------------|
| POST | `/curso/cursos` | Criar curso |

### Service Matricula

| Método | Endpoint          | Descrição                            |
| :--- |:------------------|:-------------------------------------|
| POST | `/matricula/{id}` | Criar matricula vinculada ao usuário |

### Service Pagamento

| Método | Endpoint                 | Descrição                           |
|:-------|:-------------------------|:------------------------------------|
| POST   | `/pagamento/{matricula}` | Executar pagamento para a matricula |

### Service Autenticação

| Método | Endpoint     | Descrição                          |
| :--- |:-------------|:-----------------------------------|
| POST | `/auth/{id}` | Autenticar usuário com o devido id |

### Service Notificação

| Método | Endpoint                             | Descrição                                            |
| :--- |:-------------------------------------|:-----------------------------------------------------|
| POST | `/notificacoes/{tipo}/{id-mensagem}` | Enviar mensagem do id informado e do tipo informado. |