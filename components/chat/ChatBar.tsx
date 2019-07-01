import * as React from 'react';
import io from 'socket.io-client';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

interface Props {
  socket: SocketIOClient.Socket;
}
interface State {
  chatValue: string;
}

export class ChatBar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      chatValue: ''
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick() {
    console.log(`handleClick: ${this.state.chatValue}`);
    this.props.socket.emit('message', this.state.chatValue);
  }

  handleChange(event:any) {
    this.setState({
      chatValue: event.target.value
    });
  }

  render() {
    return (
      <div>
        <TextField value={this.state.chatValue} onChange={this.handleChange} />
        <Button onClick={this.handleClick}>Submit</Button>
      </div>
    );
  }
}