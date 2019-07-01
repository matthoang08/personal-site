import * as React from 'react';

import { Layout } from '../components/layout';
import { GameList } from '../components/chat/GameList';

interface Props {}

export default class Game extends React.Component<Props> {
  render() {
    return (
      <Layout>
        <div>Game</div>
        <GameList />
      </Layout>
    );
  }
}