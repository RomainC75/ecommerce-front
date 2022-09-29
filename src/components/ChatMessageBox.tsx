import React, {useEffect} from "react";
import { MessageInterface } from "../@types/chat.type";

import './style/chatMessageBox.css'

interface ChatSingleMessageInterface {
  messages: MessageInterface[];
}

const getHours = (fullDate: string) => {
  const str = fullDate.match(/T(\d*:\d*)/);
  return str && Array.isArray(str) ? str[1] : "xxx";
};

export const ChatMessageBox = (props: ChatSingleMessageInterface) => {
  const { messages } = props;

  useEffect(()=>{
    const box = document.querySelector("ul.messages");
      if (box) {
        box.scrollTop = box.scrollHeight;
        console.log("BOX HEIGHT : ", box.scrollHeight);
      }
  },[])

  return (
    <ul className="messages">
      {messages.map((messageObj) => (
        <li
          key={`${messageObj.room}-${messageObj.createdAt}`}
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
  );
};
