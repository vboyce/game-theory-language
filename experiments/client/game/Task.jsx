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
  renderReward(payoff, self, other){
    return (
    <div><b><span className="name" style={{ color: self.get("nameColor") }}>
      {payoff[self.get("role")]  }
      </span>
      &nbsp;&nbsp;<span className="name" style={{ color: other.get("nameColor") }}>
      {  payoff[other.get("role")]}
      </span> </b></div>)
  }
  renderFeedback(self, other){
    return(
      <div>
       <span className="name" style={{ color: self.get("nameColor") }}> You </span> got 
       <span className="name" style={{ color: self.get("nameColor") }}> { self.get("scoreIncrement") } </span> point{self.get("scoreIncrement")==1?"":"s"}! 
       <span className="name" style={{ color: other.get("nameColor") }}> { this.renderPlayerName(other)} </span> got 
       <span className="name" style={{ color: other.get("nameColor") }}> { other.get("scoreIncrement") } </span> point{other.get("scoreIncrement")==1?"":"s"}.
      </div>
    )
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
    let otherrole=otherPlayer.get("role")
    const payoffs=round.get("payoffs")
    const r11=this.renderReward(payoffs[t1.label+t1.label], player, otherPlayer)
    // if player2, need to transpose the table!
    const r12=selfrole=="p1"?this.renderReward(payoffs[t1.label+t2.label], player, otherPlayer):this.renderReward(payoffs[t2.label+t1.label], player, otherPlayer)
    const r21=selfrole=="p1"?this.renderReward(payoffs[t2.label+t1.label], player, otherPlayer):this.renderReward(payoffs[t1.label+t2.label], player, otherPlayer)
    const r22=this.renderReward(payoffs[t2.label+t2.label], player, otherPlayer)
    const instr2 = stage.name=="selection" ? "Click on the box you want to open.":
      "You got "+player.get("scoreIncrement")+ " points!"
    return (
      <div className="task">
        <div className="board">
        <h1 className="roleIndicator"> <p>The rewards depend on what boxes {this.renderPlayerName(player, true)}  and {this.renderPlayerName(otherPlayer)}
        each choose, as shown in the table below.</p>
        <p>{this.renderPlayer(player, "reward", true)} is shown first and then {this.renderPlayer(otherPlayer, "reward")}.</p></h1>
    
<table className="payoffTable">
<tbody>
<tr>
<td className="empty"></td>
    <td className="empty"></td>
    <td  className="player" colSpan="2">{this.renderPlayer(otherPlayer, "choice")}</td>
  </tr>
  <tr>
    <td className="empty"></td>
    <td className="empty"></td>
    <td className="target"><img src={t1.image} /></td>
    <td className="target"><img src={t2.image} /></td>
  </tr>
  <tr>
    <td className="player" rowSpan="2">{this.renderPlayer(player, "choice", true)}</td>
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
<h1 className="roleIndicator"> {stage.name=="selection" ?  "Click on the box you want to open." : this.renderFeedback(player, otherPlayer)}</h1>
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
