import * as React from 'react';

import { Layout } from '../components/layout';
import { Chat } from '../components/chat/Chat';

export default class Game extends React.Component {
  render() {
    return (
      <Layout>
        <div>Game</div>
        <Chat />
      </Layout>
    );
  }
}