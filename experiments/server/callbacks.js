import Empirica from "meteor/empirica:core";
import {
  names,
  avatarNames,
  nameColors,
  targets,
  payoffs,
} from "./constants.js";
import _, { pick } from "lodash";

// //// Avatar stuff //////

// onGameStart is triggered opnce per game before the game starts, and before
// the first onRoundStart. It receives the game and list of all the players in
// the game.
Empirica.onGameStart((game) => {
  const players = game.players;
  console.debug("game ", game._id, " started");

  const roleList = game.get("roleList");
  //const targets = game.get('context');

  players.forEach((player, i) => {
    player.set("bonus_log", []);
    player.set("role", roleList[player._id]);
    player.set("name", names[i]);
    player.set("avatar", `/avatars/jdenticon/${avatarNames[i]}`);
    player.set("nameColor", nameColors[i]);
    player.set("bonus", 0);
  });
});

// onRoundStart is triggered before each round starts, and before onStageStart.
// It receives the same options as onGameStart, and the round that is starting.
Empirica.onRoundStart((game, round) => {
  const players = game.players;
  round.set("chat", []);
  //round.set("countCorrect",0);
  //round.set('speaker', "")
  round.set("submitted", false);
  players.forEach((player) => {
    //player.set('role', player.get('roleList')[round.index])
    // if (player.get('role')=="speaker"){
    //   round.set('speaker', player._id)
    // }
    player.set("targets", _.shuffle(round.get("targets")));

    player.set("clicked", false);
    player.set("scoreIncrement", 0);
  });
  //console.log(round)
  //console.log(players)
});

// onRoundStart is triggered before each stage starts.
// It receives the same options as onRoundStart, and the stage that is starting.
Empirica.onStageStart((game, round, stage) => {
  const players = game.players;
  console.debug("Round ", stage.name, "game", game._id, " started");
  stage.set("log", [
    {
      verb: stage.name + "Started",
      roundId: stage.name,
      at: new Date(),
    },
  ]);
});

// onStageEnd is triggered after each stage.
// It receives the same options as onRoundEnd, and the stage that just ended.
Empirica.onStageEnd((game, round, stage) => {
  if (stage.name == "selection") {
    const scale = game.treatment.scale;
    const players = game.players;
    const p1 = _.find(game.players, (p) => p.get("role") === "p1");
    const p2 = _.find(game.players, (p) => p.get("role") === "p2");
    //TODO what happens if someone doesn't click!!!!
    if (p1.get("clicked") && p2.get("clicked")) {
      const outcome = p1.get("clicked") + p2.get("clicked");
      console.log(outcome);
      const payout = round.get("payoffs")[outcome];
      console.log(payout);
      p1.set("scoreIncrement", payout.p1);
      p2.set("scoreIncrement", payout.p2);
      //Save outcomes as property of round for later export/analysis
      players.forEach((player) => {
        const currScore = player.get("bonus");
        const scoreIncrement = player.get("scoreIncrement");
        player.set("bonus", scoreIncrement * 0.01 * scale + currScore);
        round.set("player_" + player._id + "_response", player.get("clicked"));
        round.set(
          "player_" + player._id + "_time",
          player.stage.submittedAt - stage.startTimeAt
        );
        round.set(
          "player_" + player._id + "_payoff",
          player.get("scoreIncrement")
        );
        round.set("player_" + player._id + "_role", player.get("role"));
      });
    }
  }
});

// onRoundEnd is triggered after each round.
Empirica.onRoundEnd((game, round) => {});

// onRoundEnd is triggered when the game ends.
// It receives the same options as onGameStart.
Empirica.onGameEnd((game) => {
  console.debug("The game", game._id, "has ended");
});

// ===========================================================================
// => onSet, onAppend and onChanged ==========================================
// ===========================================================================

// onSet, onAppend and onChanged are called on every single update made by all
// players in each game, so they can rapidly become quite expensive and have
// the potential to slow down the app. Use wisely.
//
// It is very useful to be able to react to each update a user makes. Try
// nontheless to limit the amount of computations and database saves (.set)
// done in these callbacks. You can also try to limit the amount of calls to
// set() and append() you make (avoid calling them on a continuous drag of a
// slider for example) and inside these callbacks use the `key` argument at the
// very beginning of the callback to filter out which keys your need to run
// logic against.
//
// If you are not using these callbacks, comment them out so the system does
// not call them for nothing.

// // onSet is called when the experiment code call the .set() method
// // on games, rounds, stages, players, playerRounds or playerStages.
Empirica.onSet(
  (
    game,
    round,
    stage,
    player, // Player who made the change
    target, // Object on which the change was made (eg. player.set() => player)
    targetType, // Type of object on which the change was made (eg. player.set() => "player")
    key, // Key of changed value (e.g. player.set("score", 1) => "score")
    value, // New value
    prevValue // Previous value
  ) => {
    // Compute score after player clicks
    if (key === "clicked") {
    }
  }
);

// // onSet is called when the experiment code call the `.append()` method
// // on games, rounds, stages, players, playerRounds or playerStages.
// Empirica.onAppend((
//   game,
//   round,
//   stage,
//   players,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue // Previous value
// ) => {
//   // Note: `value` is the single last value (e.g 0.2), while `prevValue` will
//   //       be an array of the previsous valued (e.g. [0.3, 0.4, 0.65]).
// });

// // onChange is called when the experiment code call the `.set()` or the
// // `.append()` method on games, rounds, stages, players, playerRounds or
// // playerStages.
// Empirica.onChange((
//   game,
//   round,
//   stage,
//   players,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue, // Previous value
//   isAppend // True if the change was an append, false if it was a set
// ) => {
//   // `onChange` is useful to run server-side logic for any user interaction.
//   // Note the extra isAppend boolean that will allow to differenciate sets and
//   // appends.
// });
