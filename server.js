//importa o framework express
const express = require('express');
//cria uma constante que recebe a função express
const API = express();
//define a porta que o servidor vai escutar
const PORT = 3000;

//configura o express para receber requisições no formato JSON
API.use(express.json());

let tarefas = require('./db.json').tarefas;

//rota para listar todas as tarefas
API.get('/tarefas', (req, res) => {
    res.json(tarefas);
});

//rota para listar uma tarefa específica pelo id
API.get('/tarefas/:id', (req, res) => {
    //converte o id recebido na requisição para número
    const id = Number(req.params.id);
    //procura a tarefa com o id correspondente no array de tarefas
    const tarefa = tarefas.find(tarefas => tarefas.id === id);
    if (tarefa) {
        res.json(tarefa);
        return;
    } else {
        res.status(404).json({ 
            httpStatus: 404,
            erro: 'Tarefa não encontrada' 
        });
    }
});

//rota para criar uma nova tarefa
API.post('/tarefas', (req, res) => {
    //recebe os dados da nova tarefa no corpo da requisição
    const { titulo, descricao } = req.body;
    if (!titulo){
        res.status(400).json({ 
            httpStatus: 400,
            erro: 'Dado ´titulo´ é obrigatório para criação da tarefa'
        });
        return;
    }
    else if (!descricao){
        res.status(400).json({
            httpStatus: 400,
            erro: 'Dado ´descricao´ é obrigatório para criação da tarefa'
        });
        return;
    }
    //cria um novo objeto de tarefa
    const novaTarefa = {
        id: tarefas.length ++,
        titulo,
        descricao,
        concluida: false
    };
    //adiciona a nova tarefa ao FINAL da array de tarefas
    tarefas.push(novaTarefa);
    //retorna a nova tarefa com status 201 (Created)
    res.status(201).json(novaTarefa);
});

//rota para alterar uma tarefa já existente
API.patch('/tarefas/:id', (req, res) => {
    //transformando id passado na requisicao em numero
    const id = Number(req.params.id);
    const tarefa = tarefas.find(tarefas => tarefas.id === id);
    //erro caso a tarefa nao seja encontrada
    if (!tarefa) {
        res.status(404).json({ 
            httpStatus: 404,
            erro: 'Tarefa não encontrada' 
        });
        return;
    }
    //recebe os dados da nova tarefa no corpo da requisição
    const { titulo, descricao, concluida } = req.body;
    if (req.body.titulo === undefined){
        res.status(400).json({ 
            httpStatus: 400,
            erro: 'Dado ´titulo´ é obrigatório para alterar a tarefa'
        });
        return;
    }
    else if (req.body.descricao === undefined){
        res.status(400).json({
            httpStatus: 400,
            erro: 'Dado ´descricao´ é obrigatório para alterar a tarefa'
        });
        return;
    }
    //altera a tarefa
    else{
        tarefa.titulo = titulo;
        tarefa.descricao = descricao;
        tarefa.concluida = concluida;
    }
    //retorna a nova tarefa com status 201 (Created)
    res.status(201).json(novaTarefa);
});
//rota para deletar UMA tarefa
API.delete('/tarefas/:id', (req, res) =>{
    const id = Number(req.params.id);
    const quantidadeTarefasAntes = tarefas.length;
    //criando um novo array de tarefas, sem a que foi deletada
    tarefas = tarefas.filter(tarefa => tarefa.id !== id);

    if(tarefas.length === quantidadeTarefasAntes){
        return res.status(404).json({
            httpStatus: 404,
            erro: 'Tarefa não encontrada'
        });
    }
    res.status(204).send('Tarefa deletada.');
} );

//iniciando o servidor
API.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT} \nChama papai`)
})