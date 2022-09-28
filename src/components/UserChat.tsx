import { useEffect, useState } from "react";
import io from "socket.io-client";
// import * as io from "socket.io-client"
import axios from "axios";

import "./style/userChat.css";
import { MessageInterface } from "../@types/chat.type";

interface ChatInterface {
  userId: string;
}

const getHours = (fullDate: string) => {
  const str = fullDate.match(/T(\d*:\d*)/);
  return str && Array.isArray(str) ? str[1] : "xxx";
};

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "ws://localhost:5006";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

const socket = io(SOCKET_URL);

export const UserChat = (props: ChatInterface) => {
  const [room, setRoom] = useState<string>("");
  const [messageState, setMessageState] = useState<string>("");
  const [messagesReceived, setMessagesReceived] = useState<MessageInterface[]>(
    []
  );
  const token = localStorage.getItem("authToken");

  const sendMessage = () => {
    console.log("sending_message in namespace : send_message");
    socket.emit("send_message", {
      userId: props.userId,
      isAdmin: false,
      token,
      message: messageState,
      room,
    });
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/room`, {
        headers: {
          Authorization: `BEARER ${token}`,
          isadmin: "false",
        },
      })
      .then((ans) => {
        console.log("connecting to room :  ", ans.data.room);
        setRoom(ans.data.room);
        socket.emit("join_room", {
          userId: props.userId,
          token,
          room: ans.data.room,
          isadmin: false,
        });
      })
      .catch((err) => console.log("ROOM ERROR ! ", err));
  }, []);

  useEffect(() => {
    socket.on("admin_to_user", (data) => {
      console.log("admin_to_user : receive_message !!", data);
      axios
        .get(`${API_URL}/message/${data.room}`, {
          headers: {
            isadmin: false,
            Authorization: `BEARER ${token}`,
          },
        })
        .then((ans) => {
          console.log("message received  ! room : ", ans.data);
          setMessagesReceived(ans.data);
        });
    });
  }, [socket]);

  return (
    <div className="UserChat">
      <h3>Chat {room}</h3>
      <ul className="messages">
        {messagesReceived.map((messageObj, i) => (
          <li
            key={`${messageObj._id}`}
            className={messageObj.senderType === "Admin" ? "admin" : "user"}
          >
            <p className="time">{getHours(messageObj.createdAt)}</p>
            <p className="messageContent">{messageObj.message}</p>
          </li>
        ))}
      </ul>
      <div>
        <input
          placeholder="enter message..."
          onChange={(e) => setMessageState(e.target.value)}
          value={messageState}
        />
        <button onClick={sendMessage}>Send message</button>
      </div>
    </div>
  );
};
