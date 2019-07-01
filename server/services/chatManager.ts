import io from 'socket.io';
import express from 'express';

export class ChatManager {

  private ioServer: io.Server;
  private expressServer: express.Express;
  private chatroomList: Chatroom[];

  constructor(ioServer: io.Server, expressServer: express.Express) {
    this.ioServer = ioServer;
    this.expressServer = expressServer;
    this.chatroomList = [];
    this.registerApis();
  }

  registerApis(): void {
    this.expressServer.post('/chatrooms/:id', (req, resp) => {
      const chatroomId: string = req.params.id;

      const chatroom = this.chatroomList.find((chatroom) => {
        return chatroom.chatroomId === chatroomId;
      });

      if (chatroom) {
        console.log(`chat ${chatroomId} already exists`);
        resp.status(400).json({ message: `chat: ${chatroomId} already exists` });
      } else {
        this.chatroomList.push(new Chatroom(chatroomId, this.ioServer));
        resp.status(200).json({ message: `created ${chatroomId} successfully!` });
      }
    });
    this.expressServer.get('/chatrooms/:id', (req, resp) => {
      const chatroomId = req.params.id;
      const chatroom = this.chatroomList.find((chatroom) => {
        return chatroom.chatroomId === chatroomId;
      });
      if (chatroom) {
        resp.status(200).json({
          message: 'successful',
          chatroomId: chatroom.chatroomId,
          chatEntries: chatroom.chatEntries
        });
      } else {
        resp.status(404).json({ message: `chatId ${chatroomId} not found` });
      }
    });
    this.expressServer.delete('/chatrooms/:id', (req, resp) => {
      const chatroomId = req.params.id;
      const chatroom = this.chatroomList.find(chatroom => chatroom.chatroomId === chatroomId);
      if (chatroom) {
        chatroom.disconnectRoom();
        delete this.ioServer.nsps[`/${chatroomId}`];
        this.chatroomList = this.chatroomList
          .filter(chatroom => chatroom.chatroomId !== chatroomId);
        resp.status(200).json({ message: `chat: ${chatroomId} deleted successfully` });
      } else {
        resp.status(404).json({ message: `chat: ${chatroomId} not found` });
      }
    });
    this.expressServer.get('/chatrooms', (req, resp) => {
      resp.status(200).json({
        chatroomList: this.chatroomList.map(x => x.chatroomId)
      });
    });
  }
}

class Chatroom {

  public chatroomId: string;
  public chatEntries: string[];
  public ioNamespace: io.Namespace;

  constructor(chatroomId: string, ioServer: io.Server) {
    this.chatroomId = chatroomId;
    this.chatEntries = [];
    this.ioNamespace = ioServer.of(chatroomId);
    this.setUpConnections();
  }

  setUpConnections(): void {
    this.ioNamespace.on('connect', (socket) => {
      console.log(`user connect to ${this.chatroomId}`);
      socket.emit('messages', { chatEntries: this.chatEntries });
      socket.on('message', (msg: string) => {
        console.log(`${this.chatroomId} msg received: ${msg}`);
        this.chatEntries.push(msg);
        this.ioNamespace.emit('message', msg);
      });
    });
  }

  disconnectRoom(): void {
    const connectedNameSpaceSockets = Object.keys(this.ioNamespace.connected);
    connectedNameSpaceSockets.forEach((socketId) => {
      this.ioNamespace.connected[socketId].disconnect();
    });
    this.ioNamespace.removeAllListeners();
  }
}