# Arquitetura de Microserviços para a EduFlex

---

## 1- Intentificação de domínios:
- Nome
- Responsabilidades
- Dados sob administração
- Principais operações
- Serviços com quais precisa se comunicar

### Service Usuário

#### Responsabilidade:
- Criar, gerenciar e realizar todas as operações referentes a usuários.

#### Dados admnistrados:
- Usuários e dados pessoais
- Permissões
- Credenciais
- Status

#### Principais operações:
- Cadastrar alunos
- Cadastrar professores
- Cadastrar administradores
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
- Criar, gerenciar e realizar todas as operações referentes aos cursos.

#### Dados administrados:
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
- Inscrição em um curso

#### Comunicação com outros serviços:
- Service Usuário - Para validar quem está realizando as operações e qual aluno vai ser atribuido o custo.
- Service Matricula - Para atribuir os cursos desejados aos alunos
- Service Autenticação - Para validar se a operação pode ser realizada pelo usuário.
--- 

### Service Matrícula

#### Responsabilidade:
- Criar, gerenciar e realizar todas as operações referentes a matrícula.

#### Dados admininistrados:
- Matrícula
- Certificados
- Validade
- Tipo de matricula
- Status

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
- Gerenciar e validar todas as operações referentes a pagamento.

#### Dados administrados:
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
- Gerenciar e validar todas as operações referentes a autenticação de usuários.

#### Dados administrados:
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

#### Dados administrados:
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
### Service Progresso do estudante

#### Responsabilidade:
- Coordenar a progressão de um estudante durante o curso.

#### Dados administrados:
- Aulas
- Presenças
- Notas

#### Principais operações:
- Registro de aulas concluídas
- Consulta das aulas concluídas
- Cálculo do percentual de progresso
- Possibilidade de marcar aulas concluídas apenas por estudantes matriculados. 

#### Comunicação com outros serviços:
- Service Usuário - Para visualizar informações do usuário.
- Service Matrícula - Para visualizar informações da matrícula do usuário.
- Service Curso - Para visualizar informações do curso do usuário matriculado.

---

## 2- Definição das APIs:
- Método
- Endpoint
- Descrição

### Service Usuário

| Método | Endpoint                   | Descrição                   |
| :--- |:---------------------------|:----------------------------|
| POST | `/usuarios/` | Criar usuário |
| DELETE | `/usuarios/{usuario-id}` | Deletar usuário |
| PUT | `/usuarios/{usuario-id}` | Atulizar usuário |
| GET | `/usuarios/{usuario-id}` | Visualizar usuário |
| GET | `/usuarios/` | Visualizar todos os usuários |
| POST | `/usuarios/{usuario-id}/permissoes` | Criar permissões de usuários |
| POST | `/usuarios/{usuario-id}/senha` | Atualizar senha |

### Service Curso

| Método | Endpoint        | Descrição   |
| :--- |:----------------|:------------|
| POST | `/cursos/` | Criar curso |
| DELETE | `/cursos/{curso-id}` | Deletar curso |
| PUT | `/cursos/{curso-id}` | Atualizar curso |
| GET | `/cursos/` | Visualizar todos os cursos |
| GET | `/cursos/{curso-id}` | Visualizar informações do curso |
| POST | `/cursos/{curso-id}/inscrever-usuario/{usuario-id}` | Inscrição em um curso |

### Service Matrícula

| Método | Endpoint          | Descrição                            |
| :--- |:------------------|:-------------------------------------|
| POST | `/matricula/{usuario-id}` | Criar matrícula vinculada ao usuário |
| GET | `/matricula/{curso-id}/disponibilidade` | Validar disponibilidade do curso |
| GET | `/matricula/{usuario-id}` | Visualizar matrícula do usuário |

### Service Pagamento

| Método | Endpoint                 | Descrição                           |
|:-------|:-------------------------|:------------------------------------|
| POST   | `/pagamento/{id-matricula}` | Executar pagamento para a matrícula |
| GET   | `/pagamento/{id-matricula}` | Visualizar pagamentos efetuados pela matrícula |

### Service Autenticação

| Método | Endpoint     | Descrição                          |
| :--- |:-------------|:-----------------------------------|
| POST | `/auth/{id}` | Autenticar usuário com o devido id |
| POST | `/auth/login` | Autenticar usuário |
| POST | `/auth/refresh` | Gerar novo token de usuário |
| POST | `/auth/logout` | Invalidar o token da sessão atual |

### Service Notificação

| Método | Endpoint                             | Descrição                                            |
| :--- |:-------------------------------------|:-----------------------------------------------------|
| POST | `/notificacoes/{tipo}/{id-mensagem}` | Enviar mensagem do id informado e do tipo informado. |

### Service Progresso do estudante

| Método | Endpoint                             | Descrição                                            |
| :--- |:-------------------------------------|:-----------------------------------------------------|
| POST | `/progresso/{id-matricula}/registro-presenca` | Registrar presença do aluno matriculado no curso em uma aula específica. |
| GET | `/progresso/{id-matricula}/` | Consultar presenças do aluno matriculado no curso nas aulas. |
| GET | `/progresso/{id-matricula}/percentual` | Consultar o percentual de presenças do aluno matriculado no curso nas aulas. |