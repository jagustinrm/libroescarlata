import React, { useState } from 'react';
import axios from 'axios';

interface Message {
  sender: string;
  text: string;
}

const Chat: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const API_KEY = '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'; // Reemplaza con tu API Key de Hugging Face

  const sendMessage = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/gpt2', // O el modelo que estés usando
        {
          inputs: userInput,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      );

      const npcResponse = response.data[0].generated_text;
      setMessages([
        ...messages,
        { sender: 'User', text: userInput },
        { sender: 'NPC', text: npcResponse },
      ]);
      setUserInput('');
    } catch (error) {
      console.error('Error al enviar el mensaje', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Chat con NPC</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Escribe tu mensaje..."
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'Cargando...' : 'Enviar'}
      </button>
    </div>
  );
};

export default Chat;
