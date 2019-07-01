import * as React from 'react';

interface Props {
  msgs: string[];
}

export class ChatLog extends React.Component<Props> {
  render() {
    return (
      <ul>
        {this.props.msgs.map((entry) => {
          return (<ChatEntry key={entry} entry={entry} />);
        })}
      </ul>
    );
  }
}

interface ChatEntryProps {
  entry: string;
}

class ChatEntry extends React.Component<ChatEntryProps> {
  render() {
    return (
      <li className="chat-entry">
        {this.props.entry}
      </li>
    );
  }
}