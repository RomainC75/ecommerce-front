import { useEffect, useState } from "react";
import io from "socket.io-client";
// import * as io from "socket.io-client"
import axios from "axios";
import { TextField, Button } from "@mui/material";
import { MessageInterface } from "../@types/chat.type";
import { MdOutlineDoubleArrow } from "react-icons/md";
// MdOutlineDoubleArrow

import "./style/userChat.css";

interface ChatInterface {
  userId: string;
}

const getHours = (fullDate: string) => {
  const str = fullDate.match(/T(\d*:\d*)/);
  return str && Array.isArray(str) ? str[1] : "xxx";
};

const updateMessages = (
  room: string,
  token: string | null,
  setMessagesReceived: (state: MessageInterface[]) => void
) => {
  axios
    .get(`${API_URL}/message/${room}`, {
      headers: {
        isadmin: false,
        Authorization: `BEARER ${token}`,
      },
    })
    .then((ans) => {
      console.log("message received  ! room : ", ans.data);
      setMessagesReceived(ans.data);
      const box = document.querySelector("ul.messages");
      if (box) {
        box.scrollTop = box.scrollHeight;
        console.log("BOX HEIGHT : ", box.scrollHeight);
      }
    });
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
  const [openChat, setOpenChat] = useState<boolean>(false);

  const sendMessage = () => {
    console.log("sending_message in namespace : send_message");
    socket.emit("send_message", {
      userId: props.userId,
      isAdmin: false,
      token,
      message: messageState,
      room,
    });
    setMessageState("");
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
        updateMessages(ans.data.room, token, setMessagesReceived);
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
      updateMessages(data.room, token, setMessagesReceived);
      setOpenChat(true);
    });
  }, [socket]);

  const toggleChatWindow = () => {
    setOpenChat(!openChat);
  };

  return (
    <div className={`ChatContainer ${openChat ? "open" : "closed"}`}>
      <div className="arrow">
        <MdOutlineDoubleArrow
          className={`arrow__svg ${openChat ? "open" : "closed"}`}
          onClick={() => toggleChatWindow()}
        />
      </div>
      <div className="UserChat">
        <h3>You got a question ?</h3>
        <ul className="messages">
          {messagesReceived.map((messageObj, i) => (
            <li
              key={`${messageObj._id}`}
              className={messageObj.senderType === "Admin" ? "admin" : "user"}
            >
              <div>
                <p className="time">{getHours(messageObj.createdAt)}</p>
              </div>
              <div>
                <p className="messageContent">{messageObj.message}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="newMessage">
          <TextField
            id="filled-basic"
            label="new message"
            variant="filled"
            onChange={(e) => setMessageState(e.target.value)}
            value={messageState}
          />
          <Button onClick={sendMessage} variant="contained">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
