"use strict";
/* globals _, engine */
window.initGame = function () {
  console.log("initgame");
  // you're really better off leaving this line alone, i promise.
  const command =
    "5 3 \n 1 1 s\n ffffff\n 2 1 w \n flfffffrrfffffff\n 0 3 w\n LLFFFLFLFL";

  // this function parses the input string so that we have useful names/parameters
  // to define the playfield and robots for subsequent steps
  const parseInput = (input) => {
    //
    // task #1
    //
    // replace the 'parsed' variable below to be the string 'command' parsed into an object we can pass to genworld();
    // genworld expects an input object in the form { 'bounds': [3, 8], 'robos': [{x: 2, y: 1, o: 'W', command: 'rlrlff'}]}
    // where bounds represents the southeast corner of the plane and each robos object represents the
    // x,y coordinates of a robot and o is a string representing their orientation. a sample object is provided below
    //

    // replace this with a correct object

    const bounds = establishBounds(input);
    const robos = createRobos(input);
    const parsed = {
      bounds,
      robos,
    };

    console.warn("logging parsed", JSON.stringify(parsed, null, 2));
    return parsed;
  };

  //Parsing and printing functions
  const establishBounds = (input) => {
    const bounds = input
      .split("\n")[0]
      .split(" ")
      .filter(Boolean) // filter Boolean gets rid of empty items in array
      .map((val) => parseInt(val)); // turn type string into type number
    return bounds;
  };

  const createRobos = (input) => {
    const robos = [];
    const roboInput = input.split("\n");
    for (let i = 1; i < roboInput.length; i = i + 2) {
      robos.push(createRobo(roboInput[i], roboInput[i + 1])); // 1st arg position, 2nd arg instruction
    }
    return robos;
  };

  const createRobo = (position, instruction) => {
    const positionValues = position.split(" ").filter(Boolean); // filter Boolean gets rid of empty items in array
    const instructionValues = instruction.split(" ").filter(Boolean).toString();
    const robo = {
      x: parseInt(positionValues[0]),
      y: parseInt(positionValues[1]),
      o: positionValues[2],
      command: instructionValues,
    };

    return robo;
  };

  // this function replaces the robos after they complete one instruction
  // from their commandset
  const tickRobos = (robos) => {
    console.log("tickrobos");
    //
    // task #2
    //
    // in this function, write business logic to move robots around the playfield
    // the 'robos' input is an array of objects; each object has 4 parameters.
    // This function needs to edit each robot in the array so that its x/y coordinates
    // and orientation parameters match the robot state after 1 command has been completed.
    // Also, you need to remove the command the robot just completed from the command list.
    // example input:
    //
    // robos[0] = {x: 2, y: 2, o: 'N', command: 'frlrlrl'}
    //
    //                   - becomes -
    //
    // robos[0] = {x: 2, y: 1, o: 'N', command: 'rlrlrl'}
    //
    // if a robot leaves the bounds of the playfield, it should be removed from the robos
    // array. It should leave a 'scent' in it's place. If another robot–for the duration
    // of its commandset–encounters this 'scent', it should refuse any commands that would
    // cause it to leave the playfield.

    // write robot logic here

    // return the mutated robos object from the input to match the new state
    // return ???;
  };
  // mission summary function
  const missionSummary = (robos) => {
    //
    // task #3
    //
    // summarize the mission and inject the results into the DOM elements referenced in readme.md
    //
    return;
  };

  // leave this alone please
  return {
    parse: parseInput,
    tick: tickRobos,
    summary: missionSummary,
    command: command,
  };
};
