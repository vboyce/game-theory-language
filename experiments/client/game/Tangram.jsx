import { relativeTimeRounding } from "moment";
import React from "react";
import _ from "lodash";


export default class Tangram extends React.Component {
    
  handleClick = e => {
    const { game, tangram, tangram_num, stage, player, round } = this.props;
    const speakerMsgs = _.filter(round.get("chat"), msg => {
      return msg.role == 'speaker'    })
    const speaker = _.find(game.players, p => p.get('role') === "speaker");
    // only register click for listener and only after the speaker has sent a message
    if (stage.name == 'selection' &
        player.get('clicked') === false) {
      player.set("clicked", tangram)
      player.set("timeClick", Date.now()-stage.startTimeAt)
      if (!round.get('submitted')){
        round.set('submitted', true)
      }
      player.stage.submit()

    }
  };

  render() {
    const { game, tangram, tangram_num, image, round, stage, player, ...rest } = this.props;
    const players = game.players
    const row = 1
    const column = 1 + tangram_num % 2
    const mystyle = {
      "background" : "url(" + image + ")",
      "backgroundSize": "cover",
      "gridRow": row,
      "gridColumn": column
    };

    // Highlight target object for speaker 
    

    // Show listeners what they've clicked 
    if(stage.name=="selection" & tangram == player.get('clicked')) {
      _.extend(mystyle, {
        "outline" :  `10px solid #A9A9A9`,
        "zIndex" : "9"
      })
    }


    // Highlight clicked object in green if correct; red if incorrect
   
    
    let feedback = []
    if (stage.name=="feedback"){
      players.forEach(player => {
        if (player.get('clicked')==tangram){
          feedback.push(<img src={player.get("avatar")} key="player" />)
        }
      })
    }
    
    return (
      <div
        className="tangram"
        onClick={this.handleClick}
        style={mystyle}
        >
          <div className="feedback"> {feedback}</div>
      </div>
    );
  }
}
