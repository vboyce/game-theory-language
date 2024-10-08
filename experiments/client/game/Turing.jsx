import React from "react";

import Timer from "./Timer.jsx";
import { HTMLTable } from "@blueprintjs/core";
import { StageTimeWrapper } from "meteor/empirica:core";

export default class Turing extends React.Component {
  constructor(props) {
    super(props);

    // We want each participant to see tangrams in a random but stable order
    // so we shuffle at the beginning and save in state
    this.state = {
      activeButton: false,
    };
  }
  renderPlayer(player, text, self = false) {
    return (
      <span className="name" style={{ color: player.get("nameColor") }}>
        <b>{self ? "Your " + text : player.get("name") + "'s " + text}</b>
      </span>
    );
  }

  renderPlayerName(player, self = false) {
    return (
      <span style={{ color: player.get("nameColor") }}>
        <b> {self ? "you" : player.get("name")} </b>
      </span>
    );
  }

  render() {
    const { game, round, stage, player } = this.props;
    const otherPlayer = _.reject(game.players, (p) => p._id === player._id)[0];

    return (
      <div className="task">
        <div className="board">
          <h1 className="turing">
            {" "}
            <p>
              Take a few minutes to chat with your partner,{" "}
              {this.renderPlayerName(otherPlayer)}.{" "}
            </p>
            <p>
              {" "}
              This is just a chance for you to get to know one another because
              you will be playing together for the remainder of the game.
            </p>
            <div className="list">
              <p>
                We are aware that there are similar games where your partner is
                a bot (or ChatGPT). <b> THIS IS NOT ONE OF THOSE.</b>
                <p>
                  {" "}
                  We are cognitive scientists at a university, and our ethics
                  approval (IRB) doesn't allow us to deceive participants.{" "}
                </p>
                You have been paired with another participant who was also
                recruited from Prolific via the same task you were.
              </p>
              <h3>
                Not sure what to talk about? Here are some options to get you
                started.
              </h3>
              <ul>
                <li>What the weather's like where you are</li>
                <li>Your favorite flavor of pie</li>
                <li>An animal you think looks silly</li>
              </ul>{" "}
            </div>{" "}
          </h1>
        </div>
      </div>
    );
  }
}
