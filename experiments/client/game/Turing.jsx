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
      activeButton: false
    };
  }
  renderPlayer(player, text, self = false) {
    return (
        <span className="name" style={{ color: player.get("nameColor") }}>
         <b>{self ? "Your "+text :  player.get("name")+"'s "+text}</b>
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
    const otherPlayer = _.reject(game.players, p => p._id === player._id)[0]


    return (
      <div className="task">
        <div className="board">
        <h1 className="turing"> <p>Before we start the game, take a few minutes to chat with your partner, {this.renderPlayerName(otherPlayer)}. </p>
        <p>After this timer elapses, the game will start automatically. </p>

        <div className="list">
        <p>You may have seen similar games where your parter is really a bot. This isn't one of those; you have been paired with another human participant. 
        To convince you of this, you have a few minutes to chat with them. 
        </p>
            <p>Not sure what to talk about? Here are some options to get you started</p>
            <ul text-align="left">
  <li margin="auto">What the weather's like where you are</li>
  <li>Your favorite flavor of pie</li>
  <li>An animal you think looks silly</li>
</ul> </div> </h1></div>
    

          
        </div>
    );
  }
}

