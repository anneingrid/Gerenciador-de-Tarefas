import './App.css';
import axios from 'axios';
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';

export default function App() {
  const [nome, setTarefa] = useState('');
  const [tarefas, setTarefas] = useState([]);

  function aoAlterar(evento) {
    setTarefa(evento.target.value);
  }

  function salvarTarefa() {
    const carga = {
      nome: nome,
      concluida: 0
    };
    axios.post(`http://localhost:3030/api/tarefas`, carga)
      .then((resposta) => {
        console.log(resposta);
        listarTarefas();
      })
      .catch(function (error) {
        console.log('Erro');
      });

  }

  function deletarTarefa(id) {
    axios.delete(`http://localhost:3030/api/tarefas/${id}`)
      .then((resposta) => {
        console.log(resposta);
        listarTarefas();
      })
      .catch(function (error) {
        console.log('Erro');
      });

  }

  function alterarTarefa(id, concluida) {
    const carga = {
      concluida: concluida
    }

    axios.patch(`http://localhost:3030/api/tarefas/${id}`, carga)
      .then((resposta) => {
        console.log(resposta);
        listarTarefas();
      })
      .catch(function (error) {
        console.log('Erro');
      });

  }

  useEffect(() => {
    listarTarefas();
  }, []);

  function listarTarefas() {
    axios.get(`http://localhost:3030/api/tarefas`)
      .then((resposta) => {
        setTarefas(resposta.data);
      })
  }


  return (
    <>
      <h1 style={{margin:"10px"}}>Tarefas</h1>
      <form>
        <label style={{margin:"10px"}}>Titulo tarefa</label><br />
        <input type="text" id="lname" name="nome" onChange={aoAlterar} style={{margin:"10px"}}/>
        <button type="button" onClick={salvarTarefa} className="btn btn-primary btn-sm">Adicionar</button>
        <hr></hr>
        <div>
          {tarefas.map((tarefa) => {
            return (

              <div className="row">
                <li key={tarefa.id} style={{listStyleType: "none", margin:"10px"}}>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                      <input type="checkbox" onClick={() => alterarTarefa(tarefa.id, tarefa.concluida === 1 ? 0 : 1)}
                        checked={tarefa.concluida === 1} />
                    </div>
                  </div>
                  <p style={{margin:"10px"}}>{tarefa.nome}   </p>
                  <button type="button"
                    onClick={() => deletarTarefa(tarefa.id)} className="btn btn-danger" >Excluir</button>
                </div>
                </li>
              </div>
            )
          })}
        </div>
      </form>
    </>
  );
};
