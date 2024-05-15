import React from "react";

import { Centered } from "meteor/empirica:core";
import { Button } from "@blueprintjs/core";

export default class Overview extends React.Component {
  render() {
    const { hasPrev, hasNext, onNext, onPrev, treatment } = this.props;
    const social = treatment.playerCount > 1;
    return (
      <Centered>
        <div className="instructions">
          <h1 className={"bp3-heading"}> Game Overview </h1>

          <p>
            <b> Please read these instructions carefully!</b>
          </p>

          <p>
            <b>
              We are going to pair you up with another participant recruited
              from Prolific just like you. The two of you will play a treasure
              hunt game together.{" "}
            </b>
            You will see a series of choices between two boxes like this:
          </p>

          <div className="image">
            <center>
              <img src="/experiment/overview.png" />
            </center>
          </div>

          <p>
            You will <b> chooose a box by clicking on it.</b> Once you choose a
            box, you can't switch.{" "}
          </p>

          <p>
            {" "}
            The <b>reward</b> you get from the box depends on{" "}
            <b>which box you choose AND which box your partner chooses!</b>
          </p>

          <p>
            {" "}
            To help you decide,{" "}
            <b>the rewards are shown in the table at the top</b>. Depending on
            what you choose (the row) and what your partner chooses (the column)
            you and your partner will get the rewards shown in that square.{" "}
            <b>The reward you will get is shown first in your color. </b>
          </p>

          <p>
            In the above example, if{" "}
            <b>
              you choose the yellow box and your partner also chooses the yellow
              box
            </b>
            , you each get <b>4 points</b>. If{" "}
            <b>
              you choose the green box and your partner chooses the yellow box
            </b>
            , you get <b>6 points</b> and your partner gets 0 points.{" "}
          </p>

          <p>
            {" "}
            <b>
              {treatment.chatEnabled
                ? "You can use the chat box on the left to communicate with your partner."
                : ""}{" "}
            </b>
          </p>

          <Button
            type="button"
            className="bp3-button bp3-intent-nope"
            onClick={onPrev}
            disabled={!hasPrev}
            text="Previous"
            icon="double-chevron-left"
          />
          <Button
            type="button"
            className="bp3-button bp3-intent-primary"
            onClick={onNext}
            disabled={!hasNext}
            text="Next"
            rightIcon="double-chevron-right"
          />
        </div>
      </Centered>
    );
  }
}
