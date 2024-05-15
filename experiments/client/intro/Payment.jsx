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
          <h1 className={"bp3-heading"}> Important Payment Information </h1>

          <p>
            {" "}
            You will play a game with one other person. The game will last
            roughly 15 minutes.{" "}
            <b>
              {" "}
              In addition to the base pay of $2.50, you can earn up to $4 in
              bonuses.{" "}
            </b>{" "}
          </p>

          <p>
            <b>
              Please only do this study if you will be available for the given
              amount of time, otherwise please return it.
            </b>{" "}
            In this study, you will be interacting with other participants via a
            chat box. If you have concerns about the behavior of other
            participants or any other issues, please contact us via Prolific.{" "}
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
