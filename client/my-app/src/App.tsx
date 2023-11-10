import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

interface Message {
  type: string;
  nickName: string;
  senderId: string;
  message: string;
  roomId: string;
}

interface Room {
  id: string;
  users: string[];
}

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [room, setRoom] = useState<Room | null>(null);
  const stompClient = useRef<Client | null>(null);

  const connectToChat = () => {
    stompClient.current = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws/chat"),
      debug: (msg) => console.log(msg),
    });

    stompClient.current.onConnect = () => {
      stompClient.current?.subscribe(`/topic/chat/room/${room?.id}`, onMessageReceived);
    };

    stompClient.current.activate();
  };

  const createRoom = () => {
    const roomId = prompt("Enter room ID:");
    if (roomId) {
      setRoom({ id: roomId, users: [] });
    }
  };

  const joinRoom = () => {
    const roomId = prompt("Enter room ID to join:");
    if (roomId) {
      setRoom({ id: roomId, users: [] });
    }
  };

  const onMessageReceived = (message: IMessage) => {
    const newMessage: Message = JSON.parse(message.body);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const sendMessage = () => {
    console.log("[roomId] : ", room?.id)
    // Check if STOMP client is connected before publishing
    if (stompClient.current?.connected && room) {
      const newMessage: Message = {
        type: "TALK",
        nickName: "SSH",
        senderId: "SSH",
        message: messageInput,
        roomId: room.id
      };

      console.log("[SEND] ", newMessage)

      stompClient.current.publish({
        destination: `/app/chat/message`,
        body: JSON.stringify(newMessage),
      });
      setMessageInput("");
    } else {
      console.error("STOMP client is not connected or room is not selected. Cannot send message.");
      // You might want to implement a reconnection logic here or handle it in another way
    }
  };

  useEffect(() => {
    connectToChat();
    return () => {
      // Cleanup: Disconnect from the WebSocket when the component is unmounted
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  return (
    <div>
      <h1>Chat Room</h1>
      {room ? (
        <div>
          <h2>Room: {room.id}</h2>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              minHeight: "200px",
              marginBottom: "10px",
            }}
          >
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.senderId}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <div>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <div>
          <button onClick={createRoom}>Create Room</button>
          <button onClick={joinRoom}>Join Room</button>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
