const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const porta = 3030;

const db = new sqlite3.Database('./banco.db');

db.run(`
  CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY, 
    nome TEXT, 
    concluida INTEGER
  )
`);

app.use(express.json());
app.use(cors());

app.get('/api/tarefas', (req, res) => {
  db.all('SELECT * FROM tarefas', (erro, registros) => {
    if (erro) {
      return res.status(500).json({ erro: erro.message });
    }
    res.json(registros);
  });
});

app.post('/api/tarefas', (req, res) => {
  const { nome } = req.body;
  const concluida = 0;

  db.run('INSERT INTO tarefas (nome, concluida) VALUES (?, ?)', [nome, concluida], function (erro) {
    if (erro) {
      return res.status(500).json({ erro: erro.message });
    }
    res.status(201).json({ mensagem: 'Tarefa adicionada com sucesso', id: this.lastID });
  });
});

app.patch('/api/tarefas/:id', (req, res) => {
  const { id } = req.params;
  const { concluida } = req.body;

  db.run('UPDATE tarefas SET concluida = ? WHERE id = ?', concluida, id, function (erro) {
    if (erro) {
      return res.status(500).json({ erro: erro.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
    }
    res.json({ mensagem: 'Tarefa marcada como concluída' });
  });
});

app.delete('/api/tarefas/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tarefas WHERE id = ?', id, function (erro) {
    if (erro) {
      return res.status(500).json({ erro: erro.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
    }
    res.json({ mensagem: 'Tarefa excluída com sucesso' });
  });
});

app.listen(porta, () => {
  console.log(`Servidor rodando em localhost:${porta}`);
});
