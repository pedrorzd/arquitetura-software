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
})

//iniciando o servidor
API.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT} \nChama papai`)
})