import React, { useEffect, useState } from "react";
import io from "socket.io-client";
// import * as io from "socket.io-client"

interface ChatInterface {
  isAdmin: boolean;
  userId: string;
}

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "ws://localhost:5006";

const socket = io(SOCKET_URL);

export const Chat = (props: ChatInterface) => {
  const room = props.isAdmin ? "adminRoom" : props.userId;
  const [messageState, setMessageState] = useState<string>("");
  const [messageReceived, setMessageReceived] = useState<string>("");

  const sendMessage = () => {
    socket.emit("send_message", {
      message: messageState,
      room
    });
  };

  useEffect(() => {
    socket.emit("join_room", room);
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
        console.log("receive_message : ",data)
      setMessageReceived(data.message);
    });
  }, [socket]);

  return (
    <div className="Chat">
      <h3>Chat</h3>

      <div>
        <input
          placeholder="enter message..."
          onChange={(e) => setMessageState(e.target.value)}
          value={messageState}
        />
        <button onClick={sendMessage}>Send message</button>
      </div>
      <p>{messageReceived}</p>
    </div>
  );
};
