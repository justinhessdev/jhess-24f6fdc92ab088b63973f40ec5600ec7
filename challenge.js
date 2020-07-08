"use strict";

/* globals _, engine */
window.initGame = function () {
  console.log("initgame");
  // you're really better off leaving this line alone, i promise.
  const command =
    "5 3 \n 1 1 s\n ffffff\n 2 1 w \n flfffffrrfffffff\n 0 3 w\n LLFFFLFLFL";

  let bounds = [];
  const outOfBoundsLocations = [];

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

    bounds = establishBounds(input);
    const robos = createRobos(input);
    const parsed = {
      bounds,
      robos,
    };

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
      o: positionValues[2].toUpperCase(),
      command: instructionValues,
    };

    return robo;
  };

  const cardinals = {
    N: {
      L: "W",
      R: "E",
      forward: (x, y) => {
        return { x: x, y: y - 1 };
      },
    },
    E: {
      L: "N",
      R: "S",
      forward: (x, y) => {
        return { x: x + 1, y: y };
      },
    },
    S: {
      L: "E",
      R: "W",
      forward: (x, y) => {
        return { x: x, y: y + 1 };
      },
    },
    W: {
      L: "S",
      R: "N",
      forward: (x, y) => {
        return { x: x - 1, y: y };
      },
    },
  };

  const checkBounds = (movedRobo, bounds) => {
    if (
      movedRobo.x > bounds[0] ||
      movedRobo.x < 0 ||
      movedRobo.y > bounds[1] ||
      movedRobo.y < 0
    ) {
      return true;
    }
    return false;
  };

  function isRoboAtEdge(robo, locations) {
    if (!robo || !locations || !locations.length) {
      return false;
    }

    for (let location of locations) {
      if (
        robo.x === location.x &&
        robo.y === location.y &&
        robo.o === location.o
      ) {
        return true;
      }
    }

    return false;
  }

  function addOutofBoundsLocation(location) {
    if (location.x > bounds[0]) {
      location.x = bounds[0];
    } else if (location.y > bounds[1]) {
      location.y = bounds[1];
    } else if (location.x < 0) {
      location.x = 0;
    } else if (location.y < 0) {
      location.y = 0;
    }

    delete location.command; // using delete this way can remove keys/properties from an object
    outOfBoundsLocations.push(location);
  }

  // this function replaces the robos after they complete one instruction
  // from their commandset
  const tickRobos = (robos) => {
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

    for (let i = 0; i < robos.length; i++) {
      let firstInstruction = "";
      if (robos[i].command) {
        firstInstruction = robos[i].command[0].toUpperCase();
        const orientation = robos[i].o.toUpperCase();
        if (firstInstruction === "F") {
          // do a quick test if robo is at edge. if so we don't move forward
          if (!isRoboAtEdge(robos[i], outOfBoundsLocations)) {
            const newCoordinates = cardinals[orientation]["forward"](
              robos[i].x,
              robos[i].y
            );
            robos[i] = {
              ...robos[i],
              ...newCoordinates,
            };
          }
        }

        if (firstInstruction === "L" || firstInstruction === "R") {
          robos[i].o = cardinals[orientation][firstInstruction];
        }

        robos[i].command = robos[i].command.substring(1);
      }

      // Did a robot go out of bounds?
      // If so add that location to our outOfBoundsLocation arr to leave the 'scent' for other robos
      const isRoboOutOfBounds = checkBounds(robos[i], bounds);
      if (isRoboOutOfBounds) {
        const roboLocation = robos.splice(i, 1)[0]; // splice returns an array so i add zero to get the item that was deleted
        addOutofBoundsLocation(roboLocation);
      }
    }

    // return the mutated robos object from the input to match the new state
    return robos;
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
