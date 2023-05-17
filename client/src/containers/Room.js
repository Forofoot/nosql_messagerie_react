import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'

export default function Room() {
    
  const [room, setRoom] = useState('')
  const [messages, setMessages] = useState('')
  const [message, setMessage] = useState('')
  const slug = useParams()
  
  async function getFromServer() {
    const response = await fetch(`/api/room/${slug.id}`)
    const data = await response.json()
    setRoom(data)
  }

  async function getMessages() {
    const response = await fetch(`/api/room/messages/${slug.id}`)
    const data = await response.json()
    setMessages(data)
}

  async function postToServer(e) {
    e.preventDefault()
    if (localStorage.getItem('user') === null) {
        alert('Vous devez être connecté pour envoyer un message')
        return
    }
    const response = await fetch(`/api/message/${slug.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({message: message, user: localStorage.getItem('user')})
    })
    setMessage('')
    const data = await response.json()
    console.log(data)
}


  useEffect(() => {
    getFromServer()
    setInterval(() => {
        getMessages()
    }, 1000)
  }, [])

  return (
    <div>
        <h1>{room?.name}</h1>

        {messages && messages.map((message, index) => {
            return <p key={index}><strong>{message?.user}</strong> : {message.message}</p>
        })}

        <form onSubmit={(e) => postToServer(e)}>
            <input type="text" name="message" id="message" onChange={(e) => setMessage(e.target.value)} placeholder='Message' value={message}/>

            <button type="submit">Envoyer</button>
        </form>
    </div>
    )
}
