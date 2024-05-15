import React from "react";

import { Centered } from "meteor/empirica:core";

export default class Thanks extends React.Component {
  static stepName = "Thanks";

  componentWillMount() {}

  exitMessage = (player, game) => {
    const otherPlayers = _.reject(game.players, (p) => p._id === player._id);
    const otherPlayer = otherPlayers[0];

    let table = `<table className="payoffTable">
        <tbody>
          <tr>
            <td className="empty"></td>
            <td className="name" style={{ color: player.get("nameColor") }}>
                  {player.get("name")} " (You)" </td>
            <td className="name" style={{ color: otherPlayer.get("nameColor") }}>
                  {otherPlayer.get("name")} " (Partner)" </td>  </tr>`;
    player.get("bonus_log").map((p) => {
      let row =
        `<tr>
          <td className="target"> Trial ` +
        p.rep +
        ` </td>
          <td className="reward" style={{ color: player.get("nameColor")}}>` +
        p.own +
        `points </td>
          <td className="reward" style={{ color: otherPlayer.get("nameColor") }}>` +
        p.partner +
        ` points </td>
        </tr>`;
      table = table + row;
    });
    table =
      table +
      `</tbody>
        </table>`;

    console.log(table);

    return (
      <div>
        {" "}
        <h1> Experiment Completed </h1>
        <br />
        <h3>
          Please submit the following code to receive your bonus:{" "}
          <em>{game.treatment.submitCode}</em>.
        </h3>
        <p> The following were the randomly selected 4 trials:</p>
        <table class="exit">
          <tbody>
            <tr>
              <td className="empty"></td>
              <td className="name" style={{ color: player.get("nameColor") }}>
                <b>
                  {"  "}
                  {player.get("name")} (You) {"  "}
                </b>
              </td>
              <td
                className="name"
                style={{ color: otherPlayer.get("nameColor") }}
              >
                <b>{otherPlayer.get("name")} (Partner)</b>
              </td>{" "}
            </tr>
            {player.get("bonus_log").map((p) => {
              return (
                <tr>
                  <td className="target">
                    {" "}
                    Trial {p.rep + 1}
                    {"  "}
                  </td>
                  <td
                    className="reward"
                    style={{ color: player.get("nameColor") }}
                  >
                    {p.own} points{" "}
                  </td>
                  <td
                    className="reward"
                    style={{ color: otherPlayer.get("nameColor") }}
                  >
                    {p.partner} points{" "}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <br></br>
        <p>
          Your final{" "}
          <strong>
            <em>
              performance bonus is ${(player.get("bonus") || 0).toFixed(2)}.
            </em>
          </strong>{" "}
        </p>
        <p>
          Thank you again for participating! If you were curious, you were
          always interacting in real time with real human partners. The aim of
          our study was to understand when people use language to coordinate or
          negotiate and what sort of language is used. Please email us at{" "}
          <a href="mailto://languagecoglab@gmail.com.">
            {" "}
            languagecoglab@gmail.com
          </a>{" "}
          if you have any questions or concerns.
        </p>
      </div>
    );
  };

  render() {
    const { player, game } = this.props;
    if (!game) {
      return <h1> Error generating code! Please contact requester. </h1>;
    }
    return (
      <Centered>
        <div className="game finished">
          {this.exitMessage(player, game)}
          <hr />
          <div className="pt-non-ideal-state-description"></div>
        </div>
      </Centered>
    );
  }
}
