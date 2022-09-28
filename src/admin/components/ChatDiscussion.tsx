import React, {useEffect, useState} from "react";
import { ChatRoomInterface } from "../../@types/chat.type";
import io from "socket.io-client";
// import * as io from "socket.io-client"
import axios from "axios";
import { AdminInterface } from "../../@types/adminAuthContext.type";

interface ChatDiscussionInterface {
  chatRoom: ChatRoomInterface;
  admin:AdminInterface;
}

const getHours = (fullDate:string) =>{
  const str = fullDate.match(/T(\d*:\d*)/)
  return str && Array.isArray(str) ? str[1] : 'xxx'
}

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "ws://localhost:5006";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

const socket = io(SOCKET_URL);

export const ChatDiscussion = (props: ChatDiscussionInterface) => {
  const { chatRoom, admin } = props;
  console.log("cHAT Discussion", chatRoom.room, chatRoom.chat);
  const [adminId, setAdminId] = useState<string | null>(null)
  const token = localStorage.getItem("adminAuthToken");
  const [message, setMessage] = useState<string>('')

  const connectToTheRoom = () =>{
    console.log("admin : ", admin);
    console.log("connection to room : ", chatRoom.room)
    setAdminId(admin && "_id" in admin ? admin._id : "");
    console.log(
      "useEffect / adminId",
      admin && "_id" in admin ? admin._id : ""
    );
    const room = "adminRoom";
    console.log("connecting to room : ", room);
    socket.emit("join_room", {
      userId: admin && "_id" in admin ? admin._id : "",
      token,
      room: chatRoom.room,
      isadmin: true,
      option : "====> join Admin Chat Discussion to "+chatRoom.room+"<========="
    });
  }

  useEffect(() => {
    connectToTheRoom()
  }, []);

  const handleMessage  = (e:any)=>{
    console.log('handleMessage')
    setMessage(e.target.value)
  }

  // useEffect(() => {
  //   socket.on("send_message", (data) => {
  //     console.log('receive_message !!',data)
  //     axios
  //       .get(`${API_URL}/message/${data.room}`, {
  //         headers: {
  //           isadmin: false,
  //           Authorization: `BEARER ${token}`,
  //         },
  //       })
  //       .then((ans) => {
  //         console.log("message received  ! room : ", ans.data);
  //       });
  //     console.log("receive_message : ", data);
  //     // setMessageReceived(data.message);
  //   });
  // }, [socket]);

  const sendMessage = () => {
    console.log("sending message to namespace : admin_to_user")
    console.log('admin_to_user in room : ',chatRoom.room)
    socket.emit("admin_to_user", {
      userId: admin._id,
      isadmin: true,
      token,
      message: message,
      room: chatRoom.room,
      from:"chatDiscussion / sendMessage function"
    });
  };


  return (
    <li className="ChatDiscussion">
      <h3 onClick={()=>connectToTheRoom()}>{chatRoom.room}</h3>
      <ul>
        {chatRoom.chat.map((messageRaw) => (
          <li key={`${messageRaw.room}-${messageRaw.createdAt}`}>
            {getHours(messageRaw.createdAt)} {messageRaw.message}
          </li>
        ))}
      </ul>
      <input value={message} onChange={handleMessage}/>
      <button onClick={()=>sendMessage()}>SEND !</button>
    </li>
  );
};
