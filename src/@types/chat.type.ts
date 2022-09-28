export interface MessageInterface {
    _id: string;
    room: string;
    senderId: string;
    receiverId: string;
    message: String;
    senderType: "User" | "Admin";
    receiverType: "User" | "Admin";
    newMessage: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
export interface ChatRoomInterface {
    room: string;
    chat: MessageInterface[];
  }