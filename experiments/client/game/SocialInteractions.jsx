import React from "react";
import EventLog from "./EventLog";
import ChatLog from "./ChatLog";
import Timer from "./Timer";

export default class SocialInteractions extends React.Component {
  renderPlayer(player, self = false) {
    return (
      <div className="player" key={player._id}>
        <span className="image"></span>
        <img src={player.get("avatar")} />
        <span className="name" style={{ color: player.get("nameColor") }}>
          {player.get("name")}
          {self ? " (You)" : " (Partner)"}
        </span>
        <span
          className="name"
          style={{ color: player.get("nameColor") }}
        ></span>
      </div>
    );
  }

  render() {
    const { game, round, stage, player } = this.props;

    const otherPlayers = _.reject(game.players, (p) => p._id === player._id);
    const messages = round.get("chat").map(({ text, playerId, type }) => ({
      text,
      subject: game.players.find((p) => p._id === playerId),
      type: type,
    }));
    const events = stage.get("log").map(({ subjectId, ...rest }) => ({
      subject: subjectId && game.players.find((p) => p._id === subjectId),
      ...rest,
    }));

    return (
      <div className="social-interactions">
        <div className="status">
          <div className="players bp3-card">
            {this.renderPlayer(player, true)}
            {otherPlayers.map((p) => this.renderPlayer(p))}
          </div>
        </div>
        <div className="status">
          <Timer stage={stage} />
        </div>

        <ChatLog
          messages={messages}
          round={round}
          stage={stage}
          player={player}
          game={game}
        />
      </div>
    );
  }
}
