import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
// import * as io from "socket.io-client"
import axios from "axios";
import { AdminAuthContext } from "../../context/adminAuth.context";
import { AdminAuthContextInterface } from "../../@types/adminAuthContext.type";
import { ChatDiscussion } from "../components/ChatDiscussion";
import { MessageInterface, ChatRoomInterface } from "../../@types/chat.type";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "ws://localhost:5006";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

const socket = io(SOCKET_URL);

const updateChatRooms = (
  roomId: string,
  chatRooms: ChatRoomInterface[],
  token: string
): Promise<ChatRoomInterface[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newChatRaw = await axios.get(`${API_URL}/message/${roomId}`, {
        headers: {
          isAdmin: "true",
          Authorization: `BEARER ${token}`,
        },
      });
      const newChat: MessageInterface[] = newChatRaw.data;
      console.log("newChat : ", newChat);

      let chatBuff: ChatRoomInterface[] = chatRooms.filter(chatRoom=>chatRoom.room!==roomId);
      chatBuff.unshift({room:roomId,chat:newChat})
      resolve(chatBuff);
    } catch (error) {
      reject(error);
    }
  });
};

export const AdminChatPage = () => {
  const { authenticateAdmin, isAdminLoggedIn, admin, logOutAdmin } = useContext(
    AdminAuthContext
  ) as AdminAuthContextInterface;

  const [messageState, setMessageState] = useState<string>("");
  const [messageReceived, setMessageReceived] = useState<string>("");
  const [adminId, setAdminId] = useState<string | null>(null);
  const [allChatRooms, setAllChatRooms] = useState<ChatRoomInterface[]>([]);
  const token = localStorage.getItem("adminAuthToken");
  const [userRoom, setUserRoom] = useState<string | null>(null)

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
    socket.on("receive_message", (data) => {
      console.log("received message : ", data);
      axios
        .get(`${API_URL}/message/${data.room}`, {
          headers: {
            isAdmin: "true",
            Authorization: `BEARER ${token}`,
          },
        })
        .then(async (ans) => {
          console.log("message received  ! room : ", ans.data);
          setAllChatRooms(
            await updateChatRooms(data.room, ans.data, token ? token : "")
          );
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
