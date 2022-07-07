import React, { useState, useEffect } from 'react'; // Add useEffect
import { HubConnectionBuilder } from '@microsoft/signalr';

const App = () => {
  
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [chat, setChat] = useState(['test message 1', 'test message 2']);

  // Add: Our SignalR Hub
  const [hubCx, setHubCx] = useState(null);

  // When our component loads... let's set up our signalR connection
  useEffect(() => {
    (async () => {
      const newConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5160/hubs/test') // Ensure same as BE
            .withAutomaticReconnect()
            .build();
      await newConnection.start(); 

      // Let's also setup our receiving method...
      newConnection.on('messageReceived', (user, mess) => {
        setChat(c => [`${user} - ${mess}`, ...c]);
      });
      setHubCx(newConnection);
    })(); // Just a way to run an async func in useEffect...
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    // Remove:
    // setChat(m => [`${name}: ${message}`, ...m]);
    // Add:
    hubCx.invoke('NewMessage', name, message);
    setMessage('');
  }

  const renderMessages = () =>
  {
    let i = 0;
    return chat.map(m => <div key={`${i++}`}>{m}</div>);
  }

  return (
    <div>
      <h1>Demo App</h1>
      <div>
        <h2>
        Send Message 
        </h2>

        <form onSubmit={handleSubmit}>
          
        <input
            type='text'
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Message"
          />
          <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
          />
          &nbsp;
          <input type="submit" value="Submit" />
        </form>

      </div>
      <hr />
      <h2>Mensajes Log</h2>
      <div>
        {renderMessages()}
      </div>
    </div>
 );
}

export default App;