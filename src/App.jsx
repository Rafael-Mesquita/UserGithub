import { useState } from 'react'
import estilo from './app.module.css'
import axios from 'axios'

function App() {
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null)
  const [erro, setErro] = useState()
  const [usuarios, setUsuarios] = useState([])
  const [repositorios, setRepositorios] = useState([])
  const [seguidores, setSeguidores] = useState([])


  axios.get("https://api.github.com/users")
    .then((res) => {
      setUsuarios(res.data)
    })

  function mudaUsuario(usuarioBuscado){
    const usuarioFiltrado = usuarios.filter(usuario => usuario.login == usuarioBuscado)
    if(usuarioFiltrado.length == 0){
      setErro(`Usuário '${usuarioBuscado}' não encontrado`)
    }else{
      setErro(null)
      setUsuarioSelecionado(usuarioFiltrado[0])
    }
  }

  function voltar(){
    setUsuarioSelecionado(null)
    setRepositorios([])
    setSeguidores([])
  }


  function repos(event){
    event.preventDefault()

    if(repositorios.length > 0){
      setRepositorios([])
    }else if(event.target.href){
      axios.get(event.target.href)
        .then((res) => {
          setRepositorios(res.data)
        })
    }
  }
  function followers(event){
    event.preventDefault()

    if(seguidores.length > 0){
      setSeguidores([])
    }else if(event.target.href){
      axios.get(event.target.href)
        .then((res) => {
          setSeguidores(res.data)
        })
    }
  }

  return (
    <div className='container mt-4'>
      {
        erro && (
          <p className='alert alert-danger'>{erro}</p>
        )
      }
      {
    
        !usuarioSelecionado && (
          <ul className='list-group'>
      
            {
              usuarios.map(usuario => {
                return (
                  <li key={usuario.login} onClick={() => mudaUsuario(usuario.login)} className={'list-group-item ' + estilo.cursor}>
                    {usuario.login}
                  </li>
                )
              })
            }
          </ul>
        )
      }

      {
        usuarioSelecionado && (
          <>
            <h2>
              <img src={usuarioSelecionado.avatar_url} className={'img-fluid rounded-pill ' + estilo.avatar} />
              { usuarioSelecionado.login } 
              <span onClick={voltar} className={'mx-3 fs-6 btn btn-secondary btn-sm'}>Voltar</span>
            </h2>
            <p><strong>URLs:</strong></p>
            <ul>
              <li>
                <a target='_blank' href={usuarioSelecionado.html_url}>Perfil</a>
              </li>
              <li>
                <a onClick={repos} target="_blank" href={usuarioSelecionado.repos_url}>Repositórios</a>
              </li>
              <li>
                <a onClick={followers} target="_blank" href={usuarioSelecionado.followers_url}>Seguidores</a>
              </li>

            </ul>

            {
              repositorios.length > 0 && (
                repositorios.map(repo => {
                  return (
                    <ul>
                      <li>
                        <p key={repo.name}>{repo.name}</p>
                        <a target="_blank" href={repo.html_url}>{repo.html_url} </a>
                        </li>
                    </ul>
                    
                  )
                })
              )
            }
            {
              seguidores.length > 0 && (
                seguidores.map(seguidor=> {
                  return (
                    <ul>
                      <li>
                        <p key={seguidor.login}>{seguidor.login}</p>
                        <a target="_blank" href={seguidor.html_url}>{seguidor.html_url} </a>
                        </li>
                    </ul>
                    
                  )
                })
              )
            }
          </>
        )
      }
      
    </div>
  )
}

export default App
