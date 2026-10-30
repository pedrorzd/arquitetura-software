//importa o framework express
const express = require('express');
//cria uma constante que recebe a função express
const API = express();
//define a porta que o servidor vai escutar
const PORT = 3000;

//configura o express para receber requisições no formato JSON
API.use(express.json());

let usuarios = require('./db.json').usuarios;

API.get('/usuarios', (req, res) => {
    const {limite, cidade, ativo} = req.query;
    let result = usuarios;
    
    if(cidade){
        result = result.filter(usuarios => usuarios.cidade === cidade.toUpperCase());
    }
    if(ativo !== undefined){
        result = result.filter(usuarios => String(usuarios.ativo) === ativo);
    }
    if(result.length === 0){
        return res.status(404).json({
            erro: 'Nenhum usuário encontrado'
        }); 
    }
    if (limite){
        const qtd = parseInt(limite, 10);
        result = result.slice(0, qtd);
    }
    res.json(result);
});

API.post('/usuarios', (req, res) => {
    const {nome, cidade} = req.query
    if (!nome){
        return res.status(400).json({
            erro: 'O nome é obrigatório'
        })
    }
    const novoUser = {
        id: usuarios.length + 1,
        nome: nome,
        cidade: cidade || 'nao informado',
        concluida: false
    }
    usuarios.push(novoUser);
    res.status(201).json(novoUser)
})

API.put('/usuarios/:id', (req,res)=> {
    //pega o id e passa pra numero
    const id = parseInt(req.params.id, 10)
    //busca o id no array
    const usuario = usuarios.find(u => u.id === id)
    if (!usuario){
        return res.status(404).json({
            mensagem: 'Usuario nao encontrado'
        })
    }
    //extrai novos dados enviados na requisicao
    const {nome, cidade, ativo } = req.body;
    //atualiza os campos enviados
    if (nome !== undefined) usuario.nome = nome;
    if (cidade !== undefined) usuario.cidade = cidade;
    if (ativo !== undefined) usuario.ativo = ativo;

    res.status(200).json(usuario)
})

//iniciando o servidor
API.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT} \nChama papai\nhttp://localhost:${PORT}/usuarios`);
})