import * as React from 'react';

import { ChatBar } from './ChatBar';
import { ChatLog } from './ChatLog';

interface Props { }
interface State { }

export class Chat extends React.Component<Props, State> {
  render() {
    return (
      <div>
        <ChatLog />
        <ChatBar />
      </div>
    );
  }
}