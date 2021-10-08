import React from "react";

import Tangram from "./Tangram.jsx";
import Timer from "./Timer.jsx";
import { HTMLTable } from "@blueprintjs/core";
import { StageTimeWrapper } from "meteor/empirica:core";

export default class Task extends React.Component {
  constructor(props) {
    super(props);

    // We want each participant to see tangrams in a random but stable order
    // so we shuffle at the beginning and save in state
    this.state = {
      activeButton: false
    };
  }
  renderPlayer(player, self = false) {
    return (
      <div className="player" key={player._id}>
        <span className="name" style={{ color: player.get("nameColor") }}>
          {self ? "Your choice" :  ""+player.get("name")+"'s choice "}
        </span>
      </div>
    );
  }
  render() {
    const { game, round, stage, player } = this.props;
    const targets = player.get("targets");
    let tangramsToRender;
    if (targets) {
      tangramsToRender = targets.map((tangram, i) => (
        <Tangram
          key={tangram.image}
          image={tangram.image}
          tangram={tangram.label}
          tangram_num={i}
          round={round}
          stage={stage}
          game={game}
          player={player}
          />
      ));

    }
    const otherPlayer = _.reject(game.players, p => p._id === player._id)[0]
    const t1=targets[0]
    const t2=targets[1]
    let selfrole=player.get("role")
    const payoffs=round.get("payoff")
    const r11=payoffs[t1.label+t1.label][selfrole]
    const r12=payoffs[t1.label+t2.label][selfrole]
    const r21=payoffs[t2.label+t1.label][selfrole]
    const r22=payoffs[t2.label+t2.label][selfrole]
    const instr1 = stage.name=="selection" ? "Click on the treasure chest you want to open.":
      "You got "+player.get("scoreIncrement")+ " points!"
    return (
      <div className="task">
        <div className="board">
<table className="payoffTable">
<tbody>
<tr>
<td className="empty"></td>
    <td className="empty"></td>
    <td  className="player" colSpan="2">{this.renderPlayer(otherPlayer)}</td>
  </tr>
  <tr>
    <td className="empty"></td>
    <td className="empty"></td>
    <td className="target"><img src={t1.image} /></td>
    <td className="target"><img src={t2.image} /></td>
  </tr>
  <tr>
    <td className="player" rowSpan="2">{this.renderPlayer(player,true)}</td>
    <td className="target"><img src={t1.image} /></td>
    <td className="reward">{r11}</td>
    <td className="reward">{r12}</td>
  </tr>
  <tr>
    <td className="target"><img src={t2.image} /></td>
    <td className="reward">{r21}</td>
    <td className="reward">{r22}</td>
  </tr>
</tbody>
</table>
<h1 className="roleIndicator"> {instr1} </h1>
          <div className="all-tangrams">
            <div className="tangrams">
              {tangramsToRender}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
