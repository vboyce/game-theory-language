import Empirica from "meteor/empirica:core";

import "./callbacks.js";
import { payoffs, targets } from "./constants";
import _ from "lodash";

function createRoles(players) {
  const l = _.shuffle(players);
  const roles = _.zipObject(l, ["p1", "p2"]);
  console.log(roles);
  return roles;
}

function compareNumbers(a, b) {
  //deal with the fact that js defaults to lexicographic sorting....
  return a - b;
}

function chooseTargets(targets) {
  //takes a list of flower objects, a list of utilties and a number to select
  //returns the context
  // if blinded, then each flower is labelled with which player won't its utils
  const f = _.slice(_.shuffle(targets), 0, 2);
  const labs = ["A", "B"];
  const values = _.zipWith(f, labs, (a, b) => _.assign({ image: a, label: b }));
  return values;
}

function createPDRewards() {
  //sucker payoff fixed at 0
  // other rewards on 1-9, but have to respect ordering win > coop > defect
  var a = _.slice(_.shuffle(_.range(1, 10)), 0, 3).sort();
  var coop = a[1];
  var defect = a[0];
  var win = a[2];
  var payoffs = {
    AA: { p1: coop, p2: coop },
    AB: { p1: 0, p2: win },
    BA: { p1: win, p2: 0 },
    BB: { p1: defect, p2: defect },
  };
  return payoffs;
}
function createEasyPDRewards() {
  //sucker payoff fixed at 0
  // other rewards on 1-12, but have to respect ordering win > coop > defect
  // we redraw until we have a set where 2*coop \ge win
  var a = _.slice(_.shuffle(_.range(1, 13)), 0, 3).sort(compareNumbers);
  while (2 * a[1] < a[2]) {
    a = _.slice(_.shuffle(_.range(1, 13)), 0, 3).sort(compareNumbers);
  }
  var coop = a[1];
  var defect = a[0];
  var win = a[2];
  var payoffs = {
    AA: { p1: coop, p2: coop },
    AB: { p1: 0, p2: win },
    BA: { p1: win, p2: 0 },
    BB: { p1: defect, p2: defect },
  };
  return payoffs;
}
function createHardPDRewards() {
  //sucker payoff fixed at 0
  // other rewards on 1-12, but have to respect ordering win > coop > defect
  // we redraw until we have a set where 2*coop < win
  var a = _.slice(_.shuffle(_.range(1, 13)), 0, 3).sort(compareNumbers);
  while (2 * a[1] >= a[2]) {
    a = _.slice(_.shuffle(_.range(1, 13)), 0, 3).sort(compareNumbers);
  }
  var coop = a[1];
  var defect = a[0];
  var win = a[2];
  var payoffs = {
    AA: { p1: coop, p2: coop },
    AB: { p1: 0, p2: win },
    BA: { p1: win, p2: 0 },
    BB: { p1: defect, p2: defect },
  };
  return payoffs;
}

function createBoSRewards() {
  //off diagonal fixed at 0
  // other rewards on 2-9 symmetric
  var a = _.slice(_.shuffle(_.range(2, 10)), 0, 2).sort();
  var best = a[1];
  var okay = a[0];
  var miss = 0;
  var payoffs = {
    AA: { p1: best, p2: okay },
    AB: { p1: miss, p2: miss },
    BA: { p1: miss, p2: miss },
    BB: { p1: okay, p2: best },
  };
  return payoffs;
}

function createSpikeBoSRewards() {
  //off diagonal fixed at 0
  // other rewards have one from 25-30 and one from 3-7
  var best = _.shuffle(_.range(25, 31))[0];
  var okay = _.shuffle(_.range(3, 8))[0];
  var miss = 0;
  var payoffs = {
    AA: { p1: best, p2: okay },
    AB: { p1: miss, p2: miss },
    BA: { p1: miss, p2: miss },
    BB: { p1: okay, p2: best },
  };
  return payoffs;
}

function createRewards(type) {
  //wrapper
  if (type == "PD") return createPDRewards();
  if (type == "BoS") return createBoSRewards();
  if (type == "spikeBoS") return createSpikeBoSRewards();
  if (type == "easyPD") return createEasyPDRewards();
  if (type == "hardPD") return createHardPDRewards();
}

function getType(game, repNum) {
  //wrapper
  if (game == "PD") return "PD";
  if (game == "BoS") return "BoS";
  if (game == "mixPDBoS") {
    if (Math.random() > 0.5) return "PD";
    else return "BoS";
  }
  if (game == "spikeMix") {
    const spiked = [6, 15, 22, 31]; // hard code with 0-indexed rounds get spiked-BoS distribution
    if (spiked.includes(repNum)) return "spikeBoS";
    else {
      r = Math.random();
      if (r < 0.44)
        return "BoS"; // distribution is (counting spikes), .5 BoS, .25 each PD variety
      else if (r < 0.72) return "easyPD";
      else return "hardPD";
    }
  }
  if (game == "easyPDBoSMix") {
    // new version (2024) where it's half easy PD half BoS
    if (Math.random() > 0.5) return "easyPD";
    else return "BoS";
  }
}

// gameInit is where the structure of a game is defined.  Just before
// every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.  You
// must then add rounds and stages to the game, depending on the
// treatment and the players. You can also get/set initial values on
// your game, players, rounds and stages (with get/set methods), that
// will be able to use later in the game.
Empirica.gameInit((game, treatment) => {
  console.log(
    "Game with a treatment: ",
    treatment,
    " will start, with workers",
    _.map(game.players, "id")
  );

  // Sample whether to use tangram set A or set B
  //game.set("targetSet", 'setA');
  //game.set('context', targetSets['setA']);
  //const targets = game.get('context');
  const reps = treatment.rounds;
  //const numTargets = targets.length;
  // const info = {
  //   numTrialsPerBlock : numTargets,
  //   numBlocks : reps,
  //   numTotalTrials: reps * numTargets,
  //   numPlayers: game.players.length,
  //   rotate: treatment.rotateSpeaker,// change this!!!
  // };

  // I use this to play the sound on the UI when the game starts
  game.set("justStarted", true);

  // Make role list
  game.set("roleList", createRoles(_.map(game.players, "_id")));

  const round = game.addRound();
  round.addStage({
    name: "turing",
    displayName: "Chat",
    durationInSeconds: treatment.turingDuration,
  });
  // Loop through repetition blocks
  _.times(reps, (repNum) => {
    //mixed_targets=_.shuffle(targets)
    // Loop through targets in block
    const round = game.addRound();
    round.set("type", getType(treatment.gameType, repNum));
    round.set("targets", chooseTargets(targets));
    round.set("payoffs", createRewards(round.get("type")));
    console.log(repNum);
    console.log(round.get("type"));
    console.log(round.get("payoffs"));
    round.set("repNum", repNum);
    round.addStage({
      name: "selection",
      displayName: "Selection",
      durationInSeconds: treatment.selectionDuration,
    });
    round.addStage({
      name: "feedback",
      displayName: "Feedback",
      durationInSeconds: treatment.feedbackDuration,
    });
  });
});
