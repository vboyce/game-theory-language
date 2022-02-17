import Empirica from "meteor/empirica:core";

import "./callbacks.js";
import { payoffs, targets} from "./constants";
import _ from "lodash";


function createRoles(players) {
  const l = _.shuffle(players);
  const roles=_.zipObject(l,["p1","p2"]);
  console.log(roles);
  return roles;
}

function chooseTargets(targets){
  //takes a list of flower objects, a list of utilties and a number to select
  //returns the context
  // if blinded, then each flower is labelled with which player won't its utils
  const f=_.slice(_.shuffle(targets),0,2)
  const labs=["A","B"]
  const values=_.zipWith(f,labs, (a,b)=>_.assign({"image":a,"label":b}))
  return values
}

function createPDRewards(){
  //sucker payoff fixed at 0
  // other rewards on 1-9, but have to respect ordering win > coop > defect 
  var a=_.slice(_.shuffle(_.range(1,10)),0,3).sort()
  var coop=a[1]
  var defect=a[0]
  var win=a[2]
  var payoffs={
   "AA":{p1:coop,p2:coop},
   "AB":{p1:0,p2:win},
   "BA":{p1:win,p2:0},
   "BB":{p1:defect,p2:defect}
  }
  return payoffs
}

function createBoSRewards(){
  //off diagonal fixed at 0
  // other rewards on 2-9 symmetric
  var a=_.slice(_.shuffle(_.range(2,10)),0,2).sort()
  var best=a[1]
  var okay=a[0]
  var miss=0
  var payoffs={
   "AA":{p1:best,p2:okay},
   "AB":{p1:miss,p2:miss},
   "BA":{p1:miss,p2:miss},
   "BB":{p1:okay,p2:best}
  }
  return payoffs
}

function createRewards(game){
  //wrapper
  if (game=="PD") return createPDRewards()
  if (game=="BoS") return createBoSRewards()
  if (game=="mixPDBoS") {
    if(Math.random()>.5) return createPDRewards()
    else return createBoSRewards()
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
    game.set('roleList', createRoles(_.map(game.players, '_id')));

    const round=game.addRound()
    round.addStage({ name: "turing",
    displayName: "Chat",
    durationInSeconds: treatment.turingDuration
  })
    // Loop through repetition blocks
    _.times(reps, repNum => {
        //mixed_targets=_.shuffle(targets)
      // Loop through targets in block   
        const round = game.addRound();
        round.set('targets', chooseTargets(targets));
        round.set('payoffs', createRewards(treatment.gameType));
        round.set('repNum', repNum)        
        round.addStage({
          name: "selection",
          displayName: "Selection",
          durationInSeconds: treatment.selectionDuration
        });
        round.addStage({
          name: "feedback",
          displayName: "Feedback",
          durationInSeconds: treatment.feedbackDuration
        });
    });
});

