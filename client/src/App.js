import logo from './logo.svg';
import './App.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import React, {useEffect, useState} from 'react';

function App() {

  const history = useNavigate()
  const [user, setUser] = useState('')
  const [active, setActive] = useState(false)
  const [rooms, setRooms] = useState([{}])

  const createUser = (e) => {
    e.preventDefault()
    localStorage.setItem('user', user)
    setActive(false)
  }

  async function getFromServer() {
    const response = await fetch(`/api/rooms`)
    const data = await response.json()
    setRooms(data)
  }

  async function joinRoom(id) {
    if (localStorage.getItem('user') === null) {
      alert('Vous devez être connecté pour rejoindre une room')
      return
    }
    const response = await fetch(`/api/join/room/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user: localStorage.getItem('user')})
    })
    if(response.ok) {
      history(`/room/${id}`)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('user') === null) {
      setActive(true)
    }
    getFromServer()
  }, [])

  return (
    <div className="App">
      <h1>React App</h1>
      
      {active ? (
        <form onSubmit={(e) => createUser(e)}>
          <input type="text" name="user" id="user" onChange={(e) => setUser(e.target.value)} placeholder='User' value={user}/>
          <button type="submit">Envoyer</button>
        </form>
      ) : (
        <h2>Bonjour {localStorage.getItem('user')}</h2>
      )}
      

      {localStorage.getItem('user') && (
          <>
            {rooms && rooms.map((room, index) => 
              (
                <div key={index}>
                  <h3>{room.name}</h3>
                  <p onClick={(event) => joinRoom(room._id)}>Rejoindre</p>
                </div>
              )
            )}
          </>
        )
      }

      <Outlet />
    </div>
  );
}

export default App;
