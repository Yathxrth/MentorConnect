import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X, MessageSquare } from 'lucide-react';
import io from 'socket.io-client';

function TaskChat({ taskId, userData }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Chat open/close state
  const messagesEndRef = useRef(null);

  // Socket.io connection
  useEffect(() => {
    const socketInstance = io('http://localhost:3000', { withCredentials: true });
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to chat server');
      setIsConnected(true);
      socketInstance.emit('user-online', userData.id);
      socketInstance.emit('join-task-room', taskId);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from chat server');
      setIsConnected(false);
    });

    socketInstance.on('new-task-message', (messageData) => {
      setMessages(prev => [...prev, messageData]);
    });

    return () => socketInstance.disconnect();
  }, [taskId, userData.id]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('task-message', {
      taskId,
      userId: userData.id,
      userName: userData.name,
      message: newMessage.trim(),
    });

    setNewMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 z-50 flex flex-col items-end">
      
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700"
        >
          <MessageSquare size={20} />
          Chat
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <span className="font-semibold">Task Chat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <button onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="mx-auto mb-2" size={32} />
                <p className="text-sm">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.userId === userData.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.userId === userData.id ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1">
                      {msg.userId === userData.id ? 'You' : msg.userName}
                    </p>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="flex px-4 py-2 gap-2 border-t border-gray-200">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
              disabled={!isConnected}
            />
            <button
              type="submit"
              className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isConnected || !newMessage.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default TaskChat;