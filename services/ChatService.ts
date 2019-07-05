export const getListOfRooms = async (): Promise<string[]> => {
  try {
    const resp = await fetch('/chatrooms');
    if (resp.ok) {
      const json = await resp.json();
      return json.chatroomList;
    }
    throw new Error('Error calling /chatrooms');
  } catch (err) {
    throw err;
  }
};

export const addRoom = async (chatroomId: string) => {
  try {
    const resp = await fetch(`/chatrooms/${chatroomId}`, { method: 'POST' });
    if (resp.ok) {
      console.log('add room successful');
      return;
    }
    throw new Error(`Error adding new chat room ${chatroomId}`);
  } catch (err) {
    throw err;
  }
};

export const getRoom = async (chatroomId: string) => {
  try {
    const resp = await fetch(`/chatrooms/${chatroomId}`);
    if (resp.ok) {
      console.log('get room successful');
      return resp.json();
    }
    throw new Error(`Error calling getroom ${chatroomId}`);
  } catch (err) {
    throw err;
  }
};

export const deleteRoom = async (chatroomId: string) => {
  try {
    const resp = await fetch(`/chatrooms/${chatroomId}`, { method: 'DELETE' });
    if (resp.ok) {
      console.log('delete successful');
      return;
    }
    throw new Error(`Error deleting room: ${chatroomId}`);
  } catch (err) {
    throw err;
  }
};