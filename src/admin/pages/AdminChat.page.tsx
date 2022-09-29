import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
// import * as io from "socket.io-client"
import axios from "axios";
import { AdminAuthContext } from "../../context/adminAuth.context";
import { AdminAuthContextInterface } from "../../@types/adminAuthContext.type";
import { ChatDiscussion } from "../components/ChatDiscussion";
import { MessageInterface, ChatRoomInterface } from "../../@types/chat.type";
import { MdToday } from "react-icons/md";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "ws://localhost:5006";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";
const socket = io(SOCKET_URL);

const updateChatRooms = (
  allChatRooms: ChatRoomInterface[],
  newChatRoom: ChatRoomInterface,
): ChatRoomInterface[] => {
  console.log('===> inside : ',allChatRooms, newChatRoom)
  const chatBuff: ChatRoomInterface[] = allChatRooms.filter(chatRoom=>chatRoom.room!==newChatRoom.room)
      chatBuff.unshift(newChatRoom)
      console.log('charBuff to export !', chatBuff)
  return chatBuff
};

export const AdminChatPage = () => {
  const { admin } = useContext(
    AdminAuthContext
  ) as AdminAuthContextInterface;

  const [messageState, setMessageState] = useState<string>("");
  const [adminId, setAdminId] = useState<string | null>(null);
  const [allChatRooms, setAllChatRooms] = useState<ChatRoomInterface[]>([]);
  const token = localStorage.getItem("adminAuthToken");
  const [userRoom, setUserRoom] = useState<string | null>(null);

  const sendMessage = () => {
    socket.emit("admin_to_user", {
      userId: admin && "_id" in admin ? admin._id : "",
      isadmin: true,
      token,
      message: messageState,
      room:userRoom
    });
  };

  useEffect(() => {
    console.log("admin : ", admin);
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
      room: room,
      isadmin: true,
    });
  }, []);

  useEffect(() => {
    console.log('allChatRoom : CHANGE ! ', allChatRooms)
  }, [allChatRooms])
  

  useEffect(() => {
    //get the room of the new message
    socket.on("receive_message", (data) => {
      console.log("received message : ", data);
      //get the messages of the room
      axios
        .get(`${API_URL}/message/${data.room}`, {
          headers: {
            isAdmin: "true",
            Authorization: `BEARER ${token}`,
          },
        })
        .then(async (ans) => {
          console.log("message received  ! room : ", ans.data);
          console.log('old chatRooms : ',allChatRooms)
          const newChatRoom:ChatRoomInterface={
            room:data.room,
            chat:ans.data
          }
          const newChatRooms:ChatRoomInterface[] = await updateChatRooms(allChatRooms, newChatRoom)
          console.log('newChatRooms : ',newChatRooms)
          setAllChatRooms(newChatRooms);
        });
    });
  }, [socket]);

  return (
    <div className="Chat">
      <h3>Chat </h3>
      <h4>Selected room : {userRoom}</h4>
      <div>
        <input
          placeholder="enter message..."
          onChange={(e) => setMessageState(e.target.value)}
          value={messageState}
        />
        <button onClick={sendMessage}>Send message</button>
      </div>
      <ul>
      {admin && allChatRooms.map((chatRoom,i) => (
        <ChatDiscussion chatRoom={chatRoom} key={`${chatRoom.room}-${i}`} admin={admin}/>
      ))}
      </ul>
    </div>
  );
};
