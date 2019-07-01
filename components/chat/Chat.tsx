import * as React from 'react';
import * as io from 'socket.io-client';

import { ChatBar } from './ChatBar';
import { ChatLog } from './ChatLog';
import { ChatSidebar } from './ChatSidebar';

interface Props {
  chatroomId: string;
}
interface State {
  connected: boolean;
  msgs: string[];
}

export class Chat extends React.Component<Props, State> {

  private socket: SocketIOClient.Socket;

  constructor(props: Props) {
    super(props);
    this.socket = io(`/${props.chatroomId}`);
    this.state = {
      msgs: [],
      connected: false
    };
  }

  componentDidMount() {
    this.socket.on('connect', () => {
      this.setState({
        connected: true
      });
      console.log('connected on client');
    });
    this.socket.on('message', (msg: string) => {
      console.log(`msg received on client: ${msg}`);
      this.setState({
        msgs: [...this.state.msgs, msg]
      });
    });
    this.socket.on('messages', (msgs: any) => {
      this.setState({
        msgs: msgs.chatEntries
      });
    });
    this.socket.on('disconnect', () => {
      console.log('socket disconnected');
      this.setState({
        connected: false
      });
    });
  }

  render() {
    const { connected } = this.state;
    return (
      <React.Fragment>
        {connected ?
        (
          <div>
            <ChatLog msgs={this.state.msgs} />
            <ChatSidebar />
            <ChatBar socket={this.socket} />
          </div>
          ) : (<div>Not Connected to Socket</div>)
        }
      </React.Fragment>
    );
  }
}