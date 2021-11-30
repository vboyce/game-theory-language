import React from "react";
import { Breadcrumb as Crumb, Classes } from "@blueprintjs/core";

export default class customBreadcrumb extends React.Component {
  render() {
    const { game, round, stage } = this.props;
    if (stage.name=="turing")
    {return ( <nav className="round-nav">
    <ul className={Classes.BREADCRUMBS}>
      <li key={round.index}>
        
      </li>
      <li>
      </li>
    </ul>
  </nav>)}
    return (
      <nav className="round-nav">
        <ul className={Classes.BREADCRUMBS}>
          <li key={round.index}>
            <Crumb
              text={"Round  " + (1 + round.get('repNum')) +
                    " / " + game.treatment.rounds}
              className={Classes.BREADCRUMB_CURRENT}
            />
          </li>
          <li>
          </li>
        </ul>
      </nav>
    );
  }
}
