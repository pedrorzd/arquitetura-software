# Arquitetura de Microserviços para a EduFlex

## 1- Identificação de domínios

- Nome
- Responsabilidades
- Dados sob administração
- Principais operações
- Serviços com quais precisa se comunicar

---

## Service Usuário

### Responsabilidade:
- Criar, gerenciar e realizar todas as operações referentes a usuários.

### Dados administrados:
- Usuários e dados pessoais
- Permissões
- Credenciais
- Status

### Principais operações:
- Cadastrar alunos
- Cadastrar professores
- Cadastrar administradores
- Administrar permissões
- Administrar senhas
- Administrar usuários
- Atualizar dados
- Atualizar progresso de curso
- Listagem de usuários

### Comunicação com outros serviços:
- Service Matrícula: Incluir o curso na matrícula do usuário.
- Service Pagamento: Executar solicitação de pagamento realizada pelo usuário.
- Service Autenticação: Validar permissões do usuário para realizar operações.
- Service Avaliações: Fornecer dados para validação de acesso às avaliações.
- Service Certificados: Fornecer dados de identificação do usuário certificado.

---

## Service Cursos

### Responsabilidade:
- Criar, gerenciar e realizar todas as operações referentes aos cursos.

### Dados administrados:
- Cursos e suas propriedades
- Avaliações e suas propriedades
- Valores de hora/aula
- Disponibilidade
- Status

### Principais operações:
- Cadastrar cursos
- Adicionar conteúdo do curso
- Atualizar dados de cursos
- Listagem de cursos
- Validação de disponibilidade
- Inscrição em um curso

### Comunicação com outros serviços:
- Service Usuário: Validar quem está realizando as operações.
- Service Matrícula: Atribuir cursos aos alunos.
- Service Autenticação: Validar permissões.
- Service Avaliações: Disponibilizar estrutura de módulos e conteúdos.

---

## Service Matrícula

### Responsabilidade:
- Criar, gerenciar e realizar todas as operações referentes à matrícula.

### Dados administrados:
- Matrícula
- Certificados
- Validade
- Tipo de matrícula
- Status

### Principais operações:
- Registrar certificados
- Registrar resultados de avaliações
- Atualizar progresso
- Listagem de cursos vinculados à matrícula

### Comunicação com outros serviços:
- Service Usuário: Vincular usuário à matrícula.
- Service Curso: Associar valor do curso à matrícula.
- Service Autenticação: Validar permissões.
- Service Certificados: Confirmar regularidade da matrícula.
- Service Avaliações: Confirmar matrícula ativa para realização de avaliações.

---

## Service Pagamento

### Responsabilidade:
- Gerenciar e validar todas as operações referentes a pagamentos.

### Dados administrados:
- Valor
- Matrícula
- Bolsa
- Forma de pagamento
- Status

### Principais operações:
- Cadastrar pagamentos
- Comunicar com WebHook de terceiros
- Cadastrar cartão de crédito
- Listar cartões do usuário
- Atualizar status do cartão

### Comunicação com outros serviços:
- Service Usuário: Executar pagamentos solicitados.
- Service Matrícula: Validar pagamentos.
- Service Autenticação: Validar permissões.
- Service Certificados: Confirmar situação financeira antes da emissão.

---

## Service Autenticação

### Responsabilidade:
- Gerenciar e validar todas as operações referentes à autenticação de usuários.

### Dados administrados:
- Validação do usuário
- Validação de dados para cadastro

### Principais operações:
- Validar status do usuário
- Validar permissão do usuário
- Alterar status do usuário

### Comunicação com outros serviços:
- Service Usuário: Validar cadastro e login.

---

## Service Notificação

### Responsabilidade:
- Disparar notificações para os usuários.

### Dados administrados:
- Notificações push
- Tipos de mensagens

### Principais operações:
- Enviar notificações de pagamento
- Enviar notificações de avisos
- Enviar notificações de usuário

### Comunicação com outros serviços:
- Service Usuário: Disparo de notificações.
- Service Autenticação: Validar permissões.
- Service Certificados: Alertar emissão de certificados.
- Service Avaliações: Alertar notas e resultados.

---

## Service Progresso do Estudante

### Responsabilidade:
- Coordenar a progressão do estudante durante o curso.

### Dados administrados:
- Aulas
- Presenças
- Notas

### Principais operações:
- Registrar aulas concluídas
- Consultar aulas concluídas
- Calcular percentual de progresso
- Permitir marcação somente para alunos matriculados

### Comunicação com outros serviços:
- Service Usuário
- Service Matrícula
- Service Curso
- Service Avaliações
- Service Certificados

---

## Service Certificados

### Responsabilidade:
- Gerenciar a emissão, validação e registro de certificados de conclusão de curso.

### Dados administrados:
- Dados do certificado
- Vínculo com usuário
- Vínculo com curso
- Status do certificado

### Principais operações:
- Emitir certificado
- Validar autenticidade
- Listar certificados
- Consultar certificado

### Comunicação com outros serviços:
- Service Progresso do Estudante
- Service Matrícula
- Service Notificação
- Service Autenticação

---

## Service Avaliações

### Responsabilidade:
- Gerenciar criação, aplicação, correção e armazenamento de avaliações.

### Dados administrados:
- Provas e questionários
- Questões e alternativas
- Respostas dos usuários
- Notas
- Histórico de pontuações
- Status da avaliação

### Principais operações:
- Cadastrar avaliações
- Submeter respostas
- Registrar notas
- Consultar histórico

### Comunicação com outros serviços:
- Service Curso
- Service Progresso do Estudante
- Service Matrícula
- Service Autenticação

---

# 2- Definição das APIs e adicionar Query Params

## Service Usuário

| Método | Endpoint | Query Params | Descrição                                         |
|----------|----------|-------------|---------------------------------------------------|
| POST | /usuarios | Não se aplica | Criar usuário                                     |
| DELETE | /usuarios/{usuario-id} | Não se aplica | Deletar usuário                                   |
| PUT | /usuarios/{usuario-id} | Não se aplica | Atualizar usuário                                 |
| GET | /usuarios | ?ativo=true | Visualizar usuário ativo                          |
| GET | /usuarios | ?q=admin    | Visualizar usuários que tenham o cadastro `Admin` |
| GET | /usuarios | ?page=2     | Visualizar usuários da segunda página de busca    |
| GET | /usuarios | ?limit=10   | Limitar o retorno de usuários em 10 objetos       |
| POST | /usuarios/{usuario-id}/permissoes | Não se aplica | Criar permissões                                  |
| POST | /usuarios/{usuario-id}/senha | Não se aplica | Atualizar senha                                   |

---

## Service Curso

| Método | Endpoint                                          | Query Params                         | Descrição                                                                                    |
|------|---------------------------------------------------|--------------------------------------|----------------------------------------------------------------------------------------------|
| POST | /cursos                                           | Não se aplica                        | Criar curso                                                                                  |
| DELETE | /cursos/{curso-id}                                | Não se aplica                        | Deletar curso                                                                                |
| PUT  | /cursos/{curso-id}                                | Não se aplica                        | Atualizar curso                                                                              |
| GET  | /cursos                                           | ?status=ativo&categoria=programacao  | Visualizar cursos ativos e que sejam de programação                                          |
| GET  | /cursos                                           | ?q=java                              | Visualizar cursos que tenham o termo `java`                                                  |
| GET  | /cursos                                           | ?status=ativo&q=java&page=1&limit=15 | Cursos ativos e que tenham o termo `java` e que estejam na página 1, limitando em 15 objetos |
| POST | /cursos/{curso-id}/inscrever-usuario/{usuario-id} | Não se aplica                        | Inscrever usuário                                                                            |
| GET  | /cursos/{curso-id}/estrutura                      | ?modulo=2                            | Curso por id em que a estrutura esetja no módulo 2                                           |
| GET  | /cursos/{curso-id}/estrutura                      | ?tipo=video                          | Curso por id em que a estrutura seja do tipo `video`                                         |

---

## Service Matrícula

| Método | Endpoint | Query Params                        | Descrição                                                                           |
|----------|----------|-------------------------------------|-------------------------------------------------------------------------------------|
| POST | /matricula/{usuario-id} | Não se aplica | Criar matrícula         |
| GET | /matricula/{curso-id}/disponibilidade | ?semestre=2026-2&turno=noturno   | Validar disponibilidade para o semestre `2026-2` e turno `noturno` |
| GET | /matricula/{usuario-id} | ?status=ativa&ano=2026&page=1&limit=5 | Consultar matrícula `ativa` no ano de `2026` retornada na pagina 1 e limitando em 5 objetos |
| GET | /matriculas/usuario/{usuario-id}/curso/{curso-id} | ?turno=noturno  | Consultar o `turno` do curso em que o usuário está matriculado |
| GET | /matriculas/usuario/{usuario-id}/curso/{curso-id}/status | ?concluido=true | Consultar `cursos` que o aluno está matriculado e foram conlcuídos |

---

## Service Pagamento

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /pagamento/{id-matricula} | Executar pagamento |
| GET | /pagamento/{id-matricula} | Consultar pagamentos |
| GET | /pagamentos/usuario/{usuario-id}/curso/{curso-id}/status | Validar quitação |

---

## Service Autenticação

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /auth/{id} | Autenticar usuário |
| POST | /auth/login | Login |
| POST | /auth/refresh | Renovar token |
| POST | /auth/logout | Invalidar token |
| POST | /auth/permissao | Validar permissões |

---

## Service Notificação

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /notificacoes/{tipo}/{id-mensagem} | Enviar notificação |
| POST | /notificacoes/certificado | Notificar certificado emitido |
| POST | /notificacoes/avaliacao | Notificar resultado de avaliação |

---

## Service Progresso do Estudante

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /progresso/{id-matricula}/registro-presenca | Registrar presença |
| GET | /progresso/{id-matricula} | Consultar presenças |
| GET | /progresso/{id-matricula}/percentual | Consultar percentual |
| GET | /progresso/usuario/{usuario-id}/curso/{curso-id} | Consultar progresso |
| GET | /progresso/conclusao | Verificar conclusão para certificação |

---

## Service Certificados

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /certificados | Emitir certificado |
| POST | /certificados/validacao/{codigo} | Validar certificado |
| GET | /certificados/usuario/{usuario-id} | Listar certificados |
| GET | /certificados/{certificado-id} | Consultar certificado |

---

## Service Avaliações

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /avaliacoes | Criar avaliação |
| GET | /cursos/{curso-id}/avaliacoes | Listar avaliações do curso |
| POST | /avaliacoes/{avaliacao-id}/envio | Enviar avaliação |
| GET | /avaliacoes/{avaliacao-id}/usuario/{usuario-id} | Consultar resultado da avaliação |