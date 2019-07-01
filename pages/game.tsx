import React from 'react';
import { Layout } from '../components/layout';
import { withRouter } from 'next/router';

import { Chat } from '../components/chat/Chat';

interface Props {
  router: any;
}
interface State { }

class GameComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    const chatroomId: string = this.props.router.query.id;
    return(
      <Layout>
        <div>{this.props.router.query.id}</div>
        <Chat chatroomId={chatroomId} />
      </Layout>
    );
  }
}

export default withRouter(GameComponent);