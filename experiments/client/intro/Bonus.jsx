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
            {" "}
            You and your partner will complete <b>40 trials</b>. At the end of
            the game, <b>4 of these trials will be randomly chosen</b>, and{" "}
            <b>
              your bonus will be based on the rewards you earned on those 4
              trials (each point you earn on those trials is 10 cents)
            </b>
            .{" "}
          </p>
          <br></br>
          <p>
            <b>
              {" "}
              You may have seen similar games where you play with a bot like
              ChatGPT. THIS IS NOT ONE OF THOSE.
            </b>
            <p>
              {" "}
              In fact, our university ethics approval (IRB) doesn't allow us to
              deceive participants, so we have to tell you the truth about this.{" "}
            </p>
            Click "continue" and{" "}
            <b>
              we will pair you with another participant who was also recruited
              from Prolific{" "}
            </b>{" "}
            via the same task you were.
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
            text="Continue"
            rightIcon="double-chevron-right"
          />
        </div>
      </Centered>
    );
  }
}
