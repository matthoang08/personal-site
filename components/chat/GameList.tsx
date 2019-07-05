import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';

import { getListOfRooms, addRoom, deleteRoom } from '../../services/ChatService';

interface Props { }
interface State {
  chatList: string[];
  modalOpen: boolean;
  modalInput: string;
}

export class GameList extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      chatList: [],
      modalOpen: false,
      modalInput: ''
    };

    this.refreshList = this.refreshList.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddNewRoom = this.handleAddNewRoom.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    await this.refreshList();
  }

  async refreshList() {
    const chatroomList = await getListOfRooms();
    this.setState({
      chatList: chatroomList
    });
  }

  handleModalOpen() {
    this.setState({
      modalOpen: true
    });
  }

  handleModalClose() {
    this.setState({
      modalOpen: false
    });
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      modalInput: event.target.value
    });
  }

  async handleDelete(id: string) {
    console.log(`handleDelete: ${id}`);
    try {
      await deleteRoom(id);
    } catch (err) {
      console.log(err);
    }
    this.refreshList();
  }

  async handleAddNewRoom() {
    try {
      await addRoom(this.state.modalInput);
    } catch (err) {
      console.log(err);
    }
    this.setState({
      modalOpen: false,
      modalInput: ''
    });
    this.refreshList();
  }

  render() {
    return (
      <React.Fragment>
        <div className="game-list">
          <List>
            {this.state.chatList.map((x) => {
              return (
                <ListItem key={x} button href={`/game?id=${x}`} component="a">
                  <ListItemText primary={x} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="Delete" onClick={() => this.handleDelete(x)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
          <Button onClick={this.refreshList}>Refresh</Button>
          <Button onClick={this.handleModalOpen}>Add New Game</Button>
        </div>
        <Dialog open={this.state.modalOpen} onClose={this.handleModalClose}>
          <DialogTitle>Enter new chatroom</DialogTitle>
          <TextField
            id="standard-name"
            label="Name"
            value={this.state.modalInput}
            onChange={this.handleChange}
            margin="normal"
          />
          <Button onClick={this.handleAddNewRoom}>Submit</Button>
        </Dialog>
      </React.Fragment>
    );
  }
}